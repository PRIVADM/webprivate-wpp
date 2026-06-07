# 📋 GUÍA DE CONTINUACIÓN — WebPrivate WPP
## Para pegar al inicio de un nuevo chat con Claude

---

## MENSAJE DE INICIO PARA EL NUEVO CHAT

Copia y pega exactamente esto al abrir el nuevo chat:

---

```
Hola. Estoy continuando el desarrollo de una app Android llamada "WebPrivate WPP"
que empecé en otro chat. Necesito que leas el contexto completo antes de continuar.

PROYECTO: App Android (Kotlin) que actúa como navegador privado para Wallapop,
con aislamiento de sesiones, anti-fingerprinting, PIN de seguridad y sistema de licencias.

RUTA DEL PROYECTO: C:\Users\usuario\Desktop\SER\Wallapop\WallapopManager\

VERSIÓN ACTUAL: 2.0.0 (versionCode 10) — BUILD SUCCESSFUL — APK en Desktop\WebPrivateWPP.apk

════════════════════════════════════════════════════════════════
ARQUITECTURA COMPLETA DEL PROYECTO
════════════════════════════════════════════════════════════════

ARCHIVOS KOTLIN (app/src/main/java/com/wsm/app/):
├── LicenseActivity.kt   — Pantalla de inicio: trial 3 días / activación por código
├── LicenseManager.kt    — Lógica de licencias (SHA-256, códigos WPP-XXXX-CCCC)
├── PinActivity.kt       — Bloqueo PIN 4 dígitos (SHA-256 almacenado)
├── PinManager.kt        — Gestión y verificación de PIN
├── MainActivity.kt      — WebView principal con tabs, file chooser, notificaciones
├── TabManager.kt        — 3 sesiones independientes con cookies aisladas por tab
├── IdentityManager.kt   — Identidades de dispositivo únicas por sesión
├── FingerprintSpoofer.kt — JS anti-fingerprint: canvas, WebGL, geo Madrid, LiveRamp block
├── CookieHelper.kt      — Gestión de cookies incluyendo HttpOnly
└── NotificationHelper.kt — WorkManager polling inbox + notificaciones Android

ARCHIVOS RES:
├── layout/activity_main.xml      — WebView + barra tabs + FAB
├── layout/activity_pin.xml       — Numpad PIN
├── layout/activity_license.xml   — Pantalla trial/activación
├── layout/bottom_sheet_menu.xml  — Menú principal (8 opciones)
├── layout/bottom_sheet_status.xml
├── layout/bottom_sheet_profiles.xml
├── values/strings.xml            — Nombre: "WebPrivate WPP"
├── values/themes.xml             — Tema oscuro, estilos PIN/tab/menú
├── values/colors.xml             — Paleta oscura (#7C5CFC accent)
├── drawable/pin_dot.xml          — Selector dot PIN
├── drawable/tab_active_bg.xml    — Tab activa (violeta semitransparente)
├── drawable/tab_inactive_bg.xml  — Tab inactiva (transparente)
├── drawable/ic_launcher_foreground.png — Icono real (diablo cloud)
└── mipmap-*/ic_launcher.png      — Iconos en todas las densidades

BUILD CONFIG (app/build.gradle):
- compileSdk 34, minSdk 26, targetSdk 34
- AGP 8.7.0, Kotlin 2.0.21, Gradle 9.0.0
- Deps: core-ktx, appcompat, material, constraintlayout, webkit, activity-ktx, work-runtime-ktx
- JDK: C:\Program Files\Android\Android Studio\jbr (Java 21)

COMANDOS PARA COMPILAR E INSTALAR:
  export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
  export PATH="$JAVA_HOME/bin:$PATH"
  cd "/c/Users/usuario/Desktop/SER/WallapopManager"
  ./gradlew assembleDebug

INSTALAR EN SAMSUNG:
  ADB="/c/Users/usuario/AppData/Local/Android/Sdk/platform-tools/adb"
  "$ADB" install -r app/build/outputs/apk/debug/app-debug.apk

════════════════════════════════════════════════════════════════
FUNCIONALIDADES IMPLEMENTADAS
════════════════════════════════════════════════════════════════

1. FLUJO DE ARRANQUE:
   LicenseActivity → (si PIN activo) PinActivity → MainActivity

2. SISTEMA DE LICENCIAS:
   - Trial 3 días desde primera instalación
   - Códigos formato: WPP-XXXXXXXX-CCCC (SHA-256 con salt "webprivate_wpp_2026")
   - Generar códigos: python wallapop_session_manager.py gencode --n 5
   - Códigos disponibles generados:
     WPP-A3236E01-4333
     WPP-B162C5E7-0B4F
     WPP-9336F34D-E9B0
     WPP-ECCE5C7B-AA9E
     WPP-673FB93A-3C6D

3. 3 SESIONES INDEPENDIENTES (TABS):
   - Cada pestaña: cookies propias + device_id UUID único + UA diferente
   - Al cambiar tab: save cookies actuales → clear CookieManager → restore nueva tab
   - Pulsación larga en tab: renombrar / resetear / ver identidad

4. ANTI-FINGERPRINTING (FingerprintSpoofer.kt):
   - Canvas noise (semillas diferentes por sesión)
   - WebGL renderer (ANGLE genérico único por sesión)
   - Navigator: platform, hardwareConcurrency, deviceMemory, plugins vacíos
   - Screen dimensions (únicas por sesión)
   - Geolocalización: Madrid (40.4168, -3.7038 ± offset único)
   - Timezone: Europe/Madrid (UTC-1/-2)
   - Idioma: es-ES
   - device_id en localStorage interceptado por sesión
   - LiveRamp y Braze bloqueados vía fetch/XHR intercept

5. COOKIES (CookieHelper.kt):
   - Dominio siempre normalizado a .wallapop.com (FIX crítico v1.5)
   - Cookies __Host- tratadas sin Domain attribute
   - Import fusiona session_cookies + all_js_cookies

6. FILE CHOOSER (FOTOS/PUBLICACIONES) — FIX:
   - Usa ActivityResultLauncher correctamente
   - fileChooserCallback guardado y llamado con el resultado real

7. NOTIFICACIONES:
   - WorkManager polling cada 15 min
   - API: https://api.wallapop.com/api/v3/chat/summary
   - Header: Authorization: Bearer {accessToken cookie}

8. SEGURIDAD PIN:
   - SHA-256 con salt, nunca texto plano
   - 5 intentos → bloqueo 30s
   - Animación shake en PIN incorrecto

════════════════════════════════════════════════════════════════
OTROS ARCHIVOS DEL PROYECTO
════════════════════════════════════════════════════════════════

C:\Users\usuario\Desktop\SER\
├── wallapop_session_manager.py     — Script Python: status/export/inject/clean/reset/gencode
├── wallapop_manager_extension\     — Extensión Chrome v1.5 (inject fix, domain normalize)
├── wallapop_manager_tampermonkey.js — Script Tampermonkey
├── WALLAPOP_MANAGER_MANUAL.md      — Manual completo
├── wallapop_session_2026-06-06_FIXED.json — Sesión exportada con dominio correcto
├── Wallapop.apk                    — APK oficial analizado (48.3 MB)
│     Hallazgos: Firebase Messaging, Braze CRM, LiveRamp, sin ThreatMetrix nativo
└── ico.png                         — Icono de la app (diablo cloud negro/rojo)

APK ACTUAL: C:\Users\usuario\Desktop\WebPrivateWPP.apk (6.3 MB)

════════════════════════════════════════════════════════════════
PENDIENTE / PRÓXIMAS MEJORAS
════════════════════════════════════════════════════════════════

✅ Endpoint notificaciones: v3/chat/summary + fallback v3/inboxes/conversations
✅ Swipe entre pestañas (GestureDetector horizontal)
✅ Descarga de archivos (DownloadManager con cookies)
✅ Panel "Ver identidades" (Device ID + Geo + UA de las 3 sesiones)
✅ Asistente de registro 🤖 (menú → 🤖)
✅ WebRTC leak prevention
✅ Battery API + Connection API + Font enumeration spoofing
✅ Proxy/VPN integrado (ProxyManager.kt): HTTP, HTTPS, SOCKS5 con autenticación
   - ProxyController (webkit oficial) para WebView
   - java.net.Proxy para NotificationHelper background
✅ PROXY INDEPENDIENTE POR PESTAÑA: cada sesión tiene su propio proxy
   - Pulsación larga en pestaña → "Configurar proxy para esta sesión"
   - Al cambiar pestaña se aplica automáticamente el proxy de esa sesión
   - Indicador 🌐 visible en la pestaña y en la barra de identidad
✅ PESTAÑAS DINÁMICAS: botón "+" para añadir sesiones (hasta 8 máximo)
   - Barra scrollable horizontal con HorizontalScrollView
   - Cerrar pestaña: pulsación larga → "Cerrar sesión"
   - Cada pestaña: sesión independiente + identidad propia + proxy propio
✅ Datos de sesión intactos al usar proxy (cookies en TabState, no afectadas por routing)
□ Servidor de actualizaciones (JSON con última versión)
□ Favicon por pestaña en la barra de tabs
□ Release firmado (keystore) para distribución

════════════════════════════════════════════════════════════════
DISPOSITIVO Y ENTORNO
════════════════════════════════════════════════════════════════

- PC: Windows 10.0.26200
- Móvil: Samsung SM-S938B (Galaxy S24 Ultra)
- ADB: C:\Users\usuario\AppData\Local\Android\Sdk\platform-tools\adb.exe
- Android Studio: C:\Program Files\Android\Android Studio\
- JDK: C:\Program Files\Android\Android Studio\jbr (Java 21)
- Python: 3.14 instalado, tiene PIL (Pillow)
```

---

## CÓMO USAR ESTA GUÍA

1. Abre un **nuevo chat con Claude**
2. Copia TODO el bloque de texto entre las líneas ``` del apartado anterior
3. Pégalo como primer mensaje
4. Claude tendrá todo el contexto para continuar sin empezar desde cero

## COMANDOS RÁPIDOS DE REFERENCIA

### Compilar la app
```powershell
# En Git Bash o WSL:
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
export PATH="$JAVA_HOME/bin:$PATH"
cd "/c/Users/usuario/Desktop/SER/WallapopManager"
./gradlew assembleDebug
```

### Instalar en Samsung
```bash
ADB="/c/Users/usuario/AppData/Local/Android/Sdk/platform-tools/adb"
"$ADB" devices                              # verificar conexión
"$ADB" install -r path/al/app-debug.apk     # instalar
"$ADB" shell am start -n "com.wsm.app/.LicenseActivity"  # lanzar
```

### Generar códigos de activación
```bash
cd "C:\Users\usuario\Desktop\SER"
python wallapop_session_manager.py gencode --n 5
```

### Inyectar sesión exportada en Chrome (PC)
```bash
python wallapop_session_manager.py inject --session wallapop_session_2026-06-06_FIXED.json
```

## ESTRUCTURA DE CARPETAS RÁPIDA

```
C:\Users\usuario\Desktop\SER\
│
├── WallapopManager\                    ← Proyecto Android Studio
│   ├── app\src\main\
│   │   ├── java\com\wsm\app\           ← 10 archivos Kotlin
│   │   ├── res\layout\                 ← 6 layouts XML
│   │   └── AndroidManifest.xml
│   ├── build.gradle                    ← AGP 8.7.0
│   └── settings.gradle
│
├── wallapop_manager_extension\         ← Extensión Chrome v1.5
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── icon128.png
│
├── wallapop_session_manager.py         ← Script Python v1.5
├── ico.png                             ← Icono de la app
└── WebPrivateWPP.apk                   ← APK listo para instalar
    (también en Desktop\WebPrivateWPP.apk)
```
