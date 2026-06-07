# Guía de configuración en GitHub

## Estructura recomendada: 2 repositorios

```
GitHub (tu cuenta)
├── webprivate-wpp-source  [PRIVADO] ← código fuente, solo tú
└── webprivate-wpp         [PÚBLICO] ← README + APK releases, para usuarios
```

---

## Paso 1 — Repo PRIVADO (código fuente)

1. GitHub → **New repository**
2. Nombre: `webprivate-wpp-source`
3. Visibilidad: **Private** ✓
4. No añadir README (ya tienes el proyecto)
5. **Create repository**

Subir el código desde Git Bash:
```bash
cd "/c/Users/usuario/Desktop/SER/Wallapop/WallapopManager"
git init
git add .
git commit -m "WebPrivate WPP v2.0.0"
git remote add origin https://github.com/TU_USUARIO/webprivate-wpp-source.git
git push -u origin main
```

> Este repo solo lo ves tú. Nadie más puede acceder aunque tengan el enlace.

---

## Paso 2 — Repo PÚBLICO (distribución)

1. GitHub → **New repository**
2. Nombre: `webprivate-wpp`
3. Visibilidad: **Public** ✓
4. No añadir README
5. **Create repository**

Subir solo el README y assets:
```bash
cd "/c/Users/usuario/Desktop/SER/WebPrivate_WPP"
git init
git add README.md
git add assets/   # (si tienes capturas de pantalla)
git commit -m "README inicial WebPrivate WPP"
git remote add origin https://github.com/TU_USUARIO/webprivate-wpp.git
git push -u origin main
```

---

## Paso 3 — Publicar el APK como Release

1. Ve a tu repo público → **Releases** → **Draft a new release**
2. Tag: `v2.0.0`
3. Título: `WebPrivate WPP v2.0.0`
4. Descripción (copia esto):

```markdown
## WebPrivate WPP v2.0.0

### Novedades
- Sistema de licencias con caducidad por fecha
- Hasta 8 sesiones independientes (botón +)
- Proxy/VPN independiente por cada sesión
- WebRTC leak prevention
- Descarga de archivos integrada

### Instalación
1. Descarga `WebPrivateWPP-v2.0.0.apk`
2. Ajustes → Seguridad → Permitir fuentes desconocidas
3. Instala el APK
4. Introduce tu código de activación al abrir

### Requisitos
- Android 8.0 o superior
```

5. **Attach files** → sube `WebPrivateWPP.apk` (renómbralo a `WebPrivateWPP-v2.0.0.apk`)
6. **Publish release**

---

## Paso 4 — Actualizar el README con tu usuario real

Edita `README.md` y reemplaza `TU_USUARIO` por tu usuario de GitHub:

```bash
# En el README.md cambiar:
# TU_USUARIO → tu_usuario_real_de_github
```

---

## Enlace para compartir

Una vez publicado, el enlace que compartes es:
```
https://github.com/TU_USUARIO/webprivate-wpp
```

Los usuarios verán:
- ✅ El README con toda la documentación
- ✅ El APK descargable en Releases
- ❌ El código fuente (está en el repo privado)

---

## Para futuras actualizaciones

```bash
# 1. Compilar nueva versión
cd "/c/Users/usuario/Desktop/SER/Wallapop/WallapopManager"
./gradlew assembleDebug

# 2. Subir código fuente (repo privado)
git add .
git commit -m "v2.x.x — descripción de cambios"
git push

# 3. Publicar nuevo release (repo público)
# → GitHub → Releases → Draft new release → subir nuevo APK
```

---

## Añadir capturas de pantalla al README

Crea la carpeta `assets/` en el repo público y sube screenshots:
```
WebPrivate_WPP/
├── README.md
└── assets/
    ├── icon.png          ← icono de la app
    ├── screenshot_1.png  ← pantalla principal
    ├── screenshot_2.png  ← menú de opciones
    └── screenshot_3.png  ← configuración de proxy
```

En el README ya está preparado el bloque `<img src="assets/icon.png">`.

---

## Nota sobre privacidad del código

GitHub **garantiza** que los repos privados no son accesibles públicamente:
- Ni con el enlace directo
- Ni en búsquedas de Google
- Ni en la búsqueda de GitHub
- Solo tú (y colaboradores que invites explícitamente) pueden verlo
