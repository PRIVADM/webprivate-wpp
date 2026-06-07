"use strict";

// ── Constantes ───────────────────────────────────────────────────────────────

const WALLAPOP_DOMAINS = [
  "wallapop.com", ".wallapop.com", "es.wallapop.com",
  "clear.wallapop.com", "about.wallapop.com",
];

const WALLAPOP_ORIGINS = [
  "https://es.wallapop.com",
  "https://www.wallapop.com",
  "https://wallapop.com",
  "https://clear.wallapop.com",
  "https://about.wallapop.com",
];

const SESSION_COOKIE_NAMES = new Set([
  "wallapop_keep_session", "device_id", "trackingUserId",
  "ab.storage.deviceId", "ab.storage.sessionId", "ab.storage.userId",
  "temp_trackingUserId", "temp_mpid", "g_state",
  "thx_guid", "tmx_guid",
  // Tokens críticos de autenticación (NextAuth + Keycloak)
  "__Secure-next-auth.session-token",
  "__Host-next-auth.csrf-token",
  "__Secure-next-auth.callback-url",
  "accessToken", "app_session_id",
]);

const FINGERPRINT_COOKIE_NAMES = new Set([
  "thx_guid", "tmx_guid", "device_id",
  "trackingUserId", "temp_trackingUserId", "temp_mpid", "device_fgp",
]);

const TRACKING_DOMAINS = [
  "doubleclick.net", "googlesyndication.com", "adnxs.com",
  "criteo.com", "pubmatic.com", "rubiconproject.com",
  "adform.net", "bidswitch.net", "casalemedia.com",
  "openx.net", "smartadserver.com", "media.net",
  "adsrvr.org", "amazon-adsystem.com", "rfihub.com",
  "demdex.net", "quantserve.com", "yahoo.com",
  "turn.com", "sitescout.com", "dotomi.com",
  "sonobi.com", "adotmob.com", "adition.com",
  "3lift.com", "smartclip.net", "betweendigital.com",
  "contextweb.com", "connectad.io", "company-target.com",
  "bidr.io", "a-mo.net", "blismedia.com", "adgrx.com",
  "appier.net", "consentmanager.net", "360yield.com",
  "1rx.io", "acint.net", "bing.com",
];

const WIN_EPOCH_DELTA = 11_644_473_600;

// ── Helpers ──────────────────────────────────────────────────────────────────

function chromeTimeToUnix(t) { return t / 1_000_000 - WIN_EPOCH_DELTA; }
function unixToChromeTime(t) { return (t + WIN_EPOCH_DELTA) * 1_000_000; }

function isWallapopDomain(domain) {
  return WALLAPOP_DOMAINS.some(d => domain === d || domain.endsWith(d));
}

function isTrackingDomain(domain) {
  return TRACKING_DOMAINS.some(d => domain.includes(d));
}

function cookieUrl(cookie) {
  const host = cookie.domain.replace(/^\./, "");
  return `http${cookie.secure ? "s" : ""}://${host}${cookie.path || "/"}`;
}

/**
 * Normaliza dominios Wallapop → ".wallapop.com"
 * FIX: Android exportaba ".es.wallapop.com" que chrome.cookies.set() rechaza
 * porque no puede ser dominio raíz de un subdominio.
 */
function normalizeDomain(domain) {
  if (!domain) return ".wallapop.com";
  const d = domain.toLowerCase();
  if (d === "wallapop.com" || d === ".wallapop.com") return ".wallapop.com";
  if (d.endsWith(".wallapop.com") || d.endsWith("wallapop.com")) return ".wallapop.com";
  return domain;
}

function sameSiteStr(v) {
  if (v === 0 || v === "no_restriction") return "no_restriction";
  if (v === 1 || v === "lax")           return "lax";
  if (v === 2 || v === "strict")        return "strict";
  return "lax";
}

// Obtiene todas las cookies de Wallapop deduplicadas
async function getWallapopCookies() {
  const seen = new Map();
  for (const domain of WALLAPOP_DOMAINS) {
    const list = await chrome.cookies.getAll({ domain });
    for (const c of list) {
      const key = `${c.domain}|${c.name}|${c.path}`;
      if (!seen.has(key)) seen.set(key, c);
    }
  }
  return [...seen.values()];
}

// Serializa una cookie nativa de Chrome a objeto plano
function serializeCookie(c) {
  return {
    domain:   c.domain,
    name:     c.name,
    value:    c.value,
    path:     c.path,
    expires:  c.expirationDate ? unixToChromeTime(c.expirationDate) : 0,
    secure:   c.secure,
    httponly: c.httpOnly,
    samesite: c.sameSite,
  };
}

// ── UI helpers ───────────────────────────────────────────────────────────────

function showToast(msg, duration = 2200) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

function log(containerId, msg, type = "line") {
  const el = document.getElementById(containerId);
  el.style.display = "block";
  const line = document.createElement("div");
  line.className = `log-${type}`;
  line.textContent = msg;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

function clearLog(id) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  el.style.display = "none";
}

function setBtn(id, text, disabled = false) {
  const btn = document.getElementById(id);
  btn.innerHTML = text;
  btn.disabled  = disabled;
}

// ── Tab navigation ───────────────────────────────────────────────────────────

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .panel").forEach(el => el.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add("active");
    if (tab.dataset.tab === "status")  loadStatus();
    if (tab.dataset.tab === "clean")   scanTrackers();
    if (tab.dataset.tab === "export")  previewExport();
  });
});

// ── PANEL: STATUS ────────────────────────────────────────────────────────────

async function loadStatus() {
  const list = document.getElementById("cookie-list");
  list.innerHTML = '<div class="empty-state"><span class="spin">↻</span> Leyendo…</div>';

  const cookies = await getWallapopCookies();

  const sessionCount = cookies.filter(c => SESSION_COOKIE_NAMES.has(c.name)).length;
  const fpCount      = cookies.filter(c => FINGERPRINT_COOKIE_NAMES.has(c.name)).length;

  document.getElementById("stat-total").textContent   = cookies.length;
  document.getElementById("stat-session").textContent = sessionCount;
  document.getElementById("stat-fp").textContent      = fpCount;

  if (!cookies.length) {
    list.innerHTML = '<div class="empty-state">No hay cookies de Wallapop.<br>Visita wallapop.com primero.</div>';
    return;
  }

  list.innerHTML = "";
  // Ordenar: fingerprint primero, luego sesión, resto al final
  cookies.sort((a, b) => {
    const pa = FINGERPRINT_COOKIE_NAMES.has(a.name) ? 0 : SESSION_COOKIE_NAMES.has(a.name) ? 1 : 2;
    const pb = FINGERPRINT_COOKIE_NAMES.has(b.name) ? 0 : SESSION_COOKIE_NAMES.has(b.name) ? 1 : 2;
    return pa - pb || a.name.localeCompare(b.name);
  });

  for (const c of cookies) {
    const row = document.createElement("div");
    row.className = "cookie-row";

    const name  = document.createElement("span");
    name.className = "cookie-name";
    name.textContent = c.name;

    const val  = document.createElement("span");
    val.className = "cookie-val";
    val.title = c.value;
    val.textContent = c.value ? c.value.slice(0, 28) + (c.value.length > 28 ? "…" : "") : "(vacío)";

    row.appendChild(name);
    row.appendChild(val);

    if (FINGERPRINT_COOKIE_NAMES.has(c.name)) {
      const b = document.createElement("span");
      b.className = "badge badge-fp";
      b.textContent = "FINGERPRINT";
      row.appendChild(b);
    } else if (SESSION_COOKIE_NAMES.has(c.name)) {
      const b = document.createElement("span");
      b.className = "badge badge-session";
      b.textContent = "SESIÓN";
      row.appendChild(b);
    }
    if (c.httpOnly) {
      const b = document.createElement("span");
      b.className = "badge badge-httponly";
      b.textContent = "HttpOnly";
      row.appendChild(b);
    }
    list.appendChild(row);
  }
}

document.getElementById("btn-refresh").addEventListener("click", loadStatus);

// ── PANEL: EXPORT ────────────────────────────────────────────────────────────

async function previewExport() {
  const preview = document.getElementById("export-preview");
  preview.innerHTML = '<div class="empty-state"><span class="spin">↻</span> Leyendo…</div>';

  const cookies = await getWallapopCookies();
  const session = cookies.filter(c => SESSION_COOKIE_NAMES.has(c.name));

  if (!cookies.length) {
    preview.innerHTML = '<div class="empty-state">No hay cookies de Wallapop.</div>';
    return;
  }

  preview.innerHTML = "";
  for (const c of session) {
    const row = document.createElement("div");
    row.className = "cookie-row";
    row.innerHTML = `
      <span class="cookie-name">${c.name}</span>
      <span class="cookie-val" title="${c.value}">${c.value ? c.value.slice(0,30)+"…" : "(vacío)"}</span>
      ${FINGERPRINT_COOKIE_NAMES.has(c.name) ? '<span class="badge badge-fp">FP</span>' : ""}
      ${c.httpOnly ? '<span class="badge badge-httponly">HttpOnly</span>' : ""}
    `;
    preview.appendChild(row);
  }

  const info = document.createElement("div");
  info.style.cssText = "font-size:10px;color:var(--text2);text-align:center;padding:6px 0 0";
  info.textContent = `${cookies.length} cookies totales · ${session.length} de sesión`;
  preview.appendChild(info);
}

document.getElementById("btn-export").addEventListener("click", async () => {
  clearLog("export-log");
  setBtn("btn-export", '<span class="spin">↻</span> Exportando…', true);

  try {
    const cookies = await getWallapopCookies();
    if (!cookies.length) {
      log("export-log", "No hay cookies de Wallapop.", "warn");
      return;
    }

    const session = cookies.filter(c => SESSION_COOKIE_NAMES.has(c.name));
    const data = {
      version:         "1.5",
      exported_at:     new Date().toISOString(),
      origin:          "https://es.wallapop.com",
      note_httponly:   "Incluye cookies HttpOnly (thx_guid, tmx_guid). Usa inject para restaurarlas.",
      session_cookies: session.map(serializeCookie),
      all_js_cookies:  cookies.map(serializeCookie),
    };

    const blob    = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url     = URL.createObjectURL(blob);
    const filename = `wallapop_session_${new Date().toISOString().slice(0,10)}.json`;

    await chrome.downloads.download({ url, filename, saveAs: false });
    URL.revokeObjectURL(url);

    log("export-log", `✓ ${cookies.length} cookies exportadas (${session.length} de sesión)`, "ok");
    log("export-log", `✓ Archivo: ${filename}`, "ok");
    showToast(`✓ Exportadas ${cookies.length} cookies`);
  } catch (e) {
    log("export-log", `✗ Error: ${e.message}`, "err");
  } finally {
    setBtn("btn-export", "⬇ Exportar sesión a JSON", false);
  }
});

// ── PANEL: INJECT ────────────────────────────────────────────────────────────

let pendingCookies = null;

const fileDrop = document.getElementById("file-drop");
const fileInput = document.getElementById("fileInput");

fileDrop.addEventListener("click", () => fileInput.click());
fileDrop.addEventListener("dragover", e => { e.preventDefault(); fileDrop.classList.add("drag"); });
fileDrop.addEventListener("dragleave", () => fileDrop.classList.remove("drag"));
fileDrop.addEventListener("drop", e => {
  e.preventDefault();
  fileDrop.classList.remove("drag");
  if (e.dataTransfer.files[0]) readJsonFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) readJsonFile(fileInput.files[0]);
});

function readJsonFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      // FIX: fusionar session_cookies + all_js_cookies sin duplicados
      // (antes solo tomaba session_cookies, perdiendo __Secure-next-auth.session-token
      // y accessToken que están en all_js_cookies)
      const merged = new Map();
      const addArr = arr => arr?.forEach(c => { if (c.name && !merged.has(c.name)) merged.set(c.name, c); });
      addArr(data.session_cookies);
      addArr(data.all_js_cookies);
      addArr(data.cookies);
      pendingCookies = [...merged.values()];
      if (!pendingCookies.length) throw new Error("El archivo no contiene cookies.");
      document.getElementById("file-name").textContent =
        `${file.name}  (${pendingCookies.length} cookies)`;
      document.getElementById("btn-inject").disabled = false;
      clearLog("inject-log");
    } catch (err) {
      document.getElementById("file-name").textContent = "";
      document.getElementById("btn-inject").disabled = true;
      pendingCookies = null;
      showToast(`✗ JSON inválido: ${err.message}`);
    }
  };
  reader.readAsText(file);
}

document.getElementById("btn-inject").addEventListener("click", async () => {
  if (!pendingCookies?.length) return;
  clearLog("inject-log");
  setBtn("btn-inject", '<span class="spin">↻</span> Inyectando…', true);

  let ok = 0, skipped = 0, errList = [];

  for (const c of pendingCookies) {
    if (!c.name) continue;

    // Calcular expiración en Unix timestamp
    let expirationDate;
    if (c.expires && c.expires > 0) {
      expirationDate = c.expires > 1e13 ? chromeTimeToUnix(c.expires) : c.expires;
    }

    const isHostPrefixed   = c.name.startsWith("__Host-");
    const isSecurePrefixed = c.name.startsWith("__Secure-");
    // FIX: normalizar dominio — ".es.wallapop.com" → ".wallapop.com"
    const domain = normalizeDomain(c.domain || ".wallapop.com");

    // Para __Host- cookies: URL debe ser el origen exacto SIN domain en el objeto
    // Chrome rechaza silenciosamente las __Host- cookies con domain attribute
    const injectUrl = isHostPrefixed
      ? "https://es.wallapop.com/"
      : `https://${domain.replace(/^\./, "")}${c.path || "/"}`;

    const cookieObj = {
      url:      injectUrl,
      name:     c.name,
      value:    c.value || "",
      path:     c.path || "/",
      secure:   true,  // siempre true para wallapop
      httpOnly: c.httponly || isHostPrefixed || isSecurePrefixed,
      sameSite: sameSiteStr(c.samesite ?? "lax"),
    };
    if (expirationDate) cookieObj.expirationDate = expirationDate;
    // FIX: __Host- cookies NO pueden llevar domain (estándar RFC 6265bis)
    if (!isHostPrefixed) cookieObj.domain = domain;

    try {
      await chrome.cookies.set(cookieObj);
      ok++;
    } catch (e) {
      // Segundo intento sin domain (fallback para cookies que fallan con domain)
      try {
        const fallback = { ...cookieObj };
        delete fallback.domain;
        await chrome.cookies.set(fallback);
        ok++;
      } catch (e2) {
        errList.push(`${c.name}: ${e2.message}`);
      }
    }
  }

  log("inject-log", `✓ ${ok} cookies inyectadas de ${pendingCookies.length}`, "ok");
  if (errList.length) {
    log("inject-log", `⚠ ${errList.length} no inyectadas:`, "warn");
    errList.forEach(e => log("inject-log", `  ${e}`, "warn"));
  }
  log("inject-log", "↻ Recarga wallapop.com para aplicar la sesión.", "line");

  setBtn("btn-inject", "⚡ Inyectar cookies", false);
  showToast(`✓ ${ok} cookies inyectadas`);
});

// ── PANEL: CLEAN ─────────────────────────────────────────────────────────────

let trackingCookiesFound = [];

async function scanTrackers() {
  setBtn("btn-clean", "🧹 Eliminar trackers", true);
  document.getElementById("stat-tracking").textContent = "…";
  document.getElementById("stat-keep").textContent     = "…";

  const all      = await chrome.cookies.getAll({});
  const tracking = all.filter(c => isTrackingDomain(c.domain));
  const wallapop = all.filter(c => isWallapopDomain(c.domain));

  trackingCookiesFound = tracking;

  document.getElementById("stat-tracking").textContent = tracking.length;
  document.getElementById("stat-keep").textContent     = wallapop.length;

  if (tracking.length > 0) {
    document.getElementById("btn-clean").disabled = false;
  }
}

document.getElementById("btn-scan").addEventListener("click", scanTrackers);

document.getElementById("btn-clean").addEventListener("click", async () => {
  if (!trackingCookiesFound.length) return;
  clearLog("clean-log");
  setBtn("btn-clean", '<span class="spin">↻</span> Limpiando…', true);

  let deleted = 0;
  for (const c of trackingCookiesFound) {
    try {
      await chrome.cookies.remove({ url: cookieUrl(c), name: c.name });
      deleted++;
    } catch (_) {}
  }

  log("clean-log", `✓ ${deleted} cookies de tracking eliminadas`, "ok");
  log("clean-log", "✓ Tu sesión de Wallapop se conservó intacta", "ok");

  trackingCookiesFound = [];
  await scanTrackers();
  showToast(`✓ ${deleted} trackers eliminados`);
});

// ── PANEL: RESET ─────────────────────────────────────────────────────────────

document.getElementById("btn-reset").addEventListener("click", async () => {
  const confirmed = confirm(
    "⚠ RESET COMPLETO DE IDENTIDAD WALLAPOP\n\n" +
    "Se borrarán:\n" +
    "• Todas las cookies de Wallapop (thx_guid, tmx_guid, device_id…)\n" +
    "• localStorage e IndexedDB de wallapop.com\n" +
    "• Service Worker cache\n" +
    "• Historial de URLs de Wallapop\n\n" +
    "Tu sesión actual se perderá. ¿Continuar?"
  );
  if (!confirmed) return;

  clearLog("reset-log");
  setBtn("btn-reset", '<span class="spin">↻</span> Reseteando…', true);

  const results = [];

  // ── 1. Cookies de Wallapop ──────────────────────────────────────────────
  try {
    const wallapopCookies = await getWallapopCookies();
    let deletedCookies = 0;
    for (const c of wallapopCookies) {
      try {
        await chrome.cookies.remove({ url: cookieUrl(c), name: c.name });
        deletedCookies++;
      } catch (_) {}
    }
    results.push({ ok: true, msg: `${deletedCookies} cookies eliminadas` });
    log("reset-log", `✓ Cookies: ${deletedCookies} eliminadas`, "ok");
  } catch (e) {
    results.push({ ok: false, msg: `Cookies: ${e.message}` });
    log("reset-log", `✗ Cookies: ${e.message}`, "err");
  }

  // ── 2. browsingData: localStorage, IndexedDB, SW cache ─────────────────
  try {
    await chrome.browsingData.remove(
      { origins: WALLAPOP_ORIGINS },
      {
        localStorage:   true,
        indexedDB:      true,
        serviceWorkers: true,
        cacheStorage:   true,
        cookies:        true,   // por si quedaron algunas
      }
    );
    log("reset-log", "✓ localStorage / IndexedDB / SW cache eliminados", "ok");
  } catch (e) {
    log("reset-log", `⚠ browsingData: ${e.message}`, "warn");
  }

  // ── 3. Historial de Wallapop ────────────────────────────────────────────
  try {
    const items = await chrome.history.search({ text: "wallapop", maxResults: 2000 });
    let deletedHistory = 0;
    for (const item of items) {
      if (item.url.includes("wallapop")) {
        await chrome.history.deleteUrl({ url: item.url });
        deletedHistory++;
      }
    }
    log("reset-log", `✓ Historial: ${deletedHistory} URLs eliminadas`, "ok");
  } catch (e) {
    log("reset-log", `⚠ Historial: ${e.message}`, "warn");
  }

  log("reset-log", "── Reset completado ──", "line");
  log("reset-log", "Ahora puedes abrir Wallapop y crear una cuenta nueva.", "ok");

  setBtn("btn-reset", "💣 Resetear identidad Wallapop", false);
  showToast("✓ Identidad Wallapop reseteada");
});

// ── Botón Solicitar licencia ──────────────────────────────────────────────────

document.getElementById("btn-license-status")?.addEventListener("click", () => {
  const msg = encodeURIComponent("Hola, quiero solicitar una licencia para WebPrivate WPP");
  window.open(`https://wa.me/56978327863?text=${msg}`, "_blank");
});

// ── Init ──────────────────────────────────────────────────────────────────────

loadStatus();
