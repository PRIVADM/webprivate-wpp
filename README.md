<div align="center">

<img src="assets/icon.png" alt="WebPrivate WPP" width="120"/>

# WebPrivate WPP

**Navegador privado para Wallapop con sesiones independientes y anti-fingerprinting**

[![Version](https://img.shields.io/badge/versión-2.0.0-7C5CFC?style=for-the-badge)](https://github.com/PRIVADM/webprivate-wpp/releases/latest)
[![Android](https://img.shields.io/badge/Android-8.0%2B-3DDC84?style=for-the-badge&logo=android)](https://github.com/PRIVADM/webprivate-wpp/releases/latest)
[![Chrome](https://img.shields.io/badge/Chrome-Extensión-4285F4?style=for-the-badge&logo=googlechrome)](https://github.com/PRIVADM/webprivate-wpp/tree/main/browser-extension)
[![Licencia](https://img.shields.io/badge/licencia-privada-red?style=for-the-badge)](#licencias)

[⬇️ Descargar APK](#instalación) · [🧩 Extensión Chrome](#extensión-para-chrome) · [✨ Funciones](#funcionalidades) · [💳 Solicitar licencia](#licencias)

---

</div>

## ¿Qué es WebPrivate WPP?

**WebPrivate WPP** es un ecosistema de herramientas para Wallapop compuesto por:

- 📱 **App Android** — navegador privado con hasta 8 sesiones aisladas, anti-fingerprinting, proxy por sesión y sistema de licencias
- 🧩 **Extensión Chrome** — gestión de cookies y sesiones desde el navegador de escritorio, compatible con la app

> Diseñado para usuarios que necesitan privacidad total, aislamiento de sesiones y control de su huella digital en Wallapop.

---

## Funcionalidades

### 📱 App Android

#### 🗂️ Sesiones independientes (hasta 8 pestañas)
- Cada sesión tiene **cookies propias**, **historial separado** y **localStorage aislado**
- Al cambiar de pestaña, la sesión anterior queda completamente congelada
- Botón **`+`** para añadir nuevas sesiones · pulsación larga para gestionar cada una
- Desliza horizontalmente para cambiar entre sesiones (swipe)

#### 🎭 Anti-fingerprinting por sesión

| Parámetro | Descripción |
|-----------|-------------|
| **Canvas noise** | Ruido único por sesión en canvas 2D y WebGL |
| **User-Agent** | UA diferente por sesión (Pixel, Samsung, Xiaomi…) |
| **Device ID** | UUID exclusivo que Wallapop no puede cruzar entre sesiones |
| **Geolocalización** | Madrid ± desplazamiento único por sesión |
| **WebRTC** | Bloqueado para evitar filtración de IP real |
| **Battery / Connection API** | Valores únicos por sesión |
| **Screen & GPU** | Dimensiones y renderizador diferentes por sesión |
| **Timezone** | Europe/Madrid (CET/CEST) |

#### 🌐 Proxy / VPN por sesión
- Configuración **independiente por pestaña** — cada sesión puede usar su propio proxy
- Soporta **HTTP, HTTPS y SOCKS5** con autenticación (usuario + contraseña)
- Se aplica automáticamente al cambiar de pestaña
- Indicador visual `🌐` en la pestaña cuando hay proxy activo

#### 🔐 Seguridad
- **PIN de 4 dígitos** con SHA-256 + bloqueo tras 5 intentos fallidos
- Los datos de sesión nunca se envían a servidores externos

#### 🔔 Notificaciones de mensajes
- Polling automático cada 15 minutos en background (WorkManager)
- Notificación cuando hay mensajes nuevos sin leer

---

### 🧩 Extensión para Chrome

Compatible con **Chrome, Edge y cualquier navegador basado en Chromium**.

| Función | Descripción |
|---------|-------------|
| **Estado** | Ver todas las cookies activas de Wallapop con clasificación |
| **Exportar** | Descarga la sesión completa en JSON (incluye cookies HttpOnly) |
| **Inyectar** | Carga un JSON exportado y restaura la sesión |
| **Limpiar** | Elimina trackers de terceros conservando tu sesión |
| **Reset** | Borra toda la identidad Wallapop para crear cuenta nueva |

#### Instalar la extensión

**Opción A — Instalación manual (recomendada):**
1. Descarga la carpeta [`browser-extension/`](https://github.com/PRIVADM/webprivate-wpp/tree/main/browser-extension) completa (botón "Download ZIP" del repo)
2. En Chrome → `chrome://extensions/` → activa **Modo desarrollador** (esquina superior derecha)
3. Haz clic en **"Cargar descomprimida"** y selecciona la carpeta `browser-extension/`

**Opción B — Desde el código fuente:**
```
1. Abre chrome://extensions/
2. Activa "Modo desarrollador"
3. "Cargar descomprimida" → selecciona la carpeta browser-extension/
```

#### Compatibilidad entre app y extensión

```
PC (Chrome + extensión)              Móvil (App Android)
─────────────────────               ─────────────────────
Exportar sesión → JSON    ────────→  Importar sesión desde JSON
                          ←────────  Exportar sesión → JSON
```

---

## Instalación (App Android)

### Requisitos
- Android **8.0 (Oreo)** o superior
- Permitir instalación desde **fuentes desconocidas**

### Pasos

**1.** Descarga el APK desde la sección [**Releases**](https://github.com/PRIVADM/webprivate-wpp/releases/latest)

**2.** En tu Android: `Ajustes → Seguridad → Instalar apps desconocidas` → activa el permiso para tu gestor de archivos.

**3.** Abre el archivo `.apk` y pulsa **Instalar**.

**4.** Al abrir la app tendrás **3 días de prueba gratuita**. Para uso continuo necesitas un código de activación.

---

## Uso

### Pantalla principal

```
┌─────────────────────────────────┐
│  [Sesión 1] [Sesión 2] [+]      │  ← Barra de pestañas (deslizable)
├─────────────────────────────────┤
│                                 │
│         WebView Wallapop        │
│                                 │
├─────────────────────────────────┤
│  ◀  ▶   ID:a1b2c3… · S1   🔄  🔘│  ← Barra de navegación + FAB menú
└─────────────────────────────────┘
```

### Menú principal (botón 🔘)

| Opción | Función |
|--------|---------|
| 📊 Estado de cookies | Ver cookies de la sesión activa |
| 🔍 Ver identidades | Device ID, geo, UA y proxy de todas las sesiones |
| 🤖 Asistente de registro | Guía para crear cuenta en Wallapop |
| ⬇️ Exportar sesión | Guardar cookies en JSON |
| ⬆️ Importar sesión | Restaurar desde JSON |
| 🧹 Limpiar fingerprint | Borra thx_guid / tmx_guid (mantiene login) |
| 💣 Reset sesión | Borra todo y genera nueva identidad |
| 👤 Perfiles | Guardar y restaurar sesiones nombradas |
| 🌐 Proxy / VPN | Configurar proxy para la sesión activa |
| 🔐 Seguridad PIN | Activar / cambiar bloqueo de app |
| 💬 Soporte | WhatsApp · respuesta rápida |
| 💳 Solicitar licencia | Obtener código de activación por WhatsApp |

---

## Sistema de licencias

### Formato de los códigos
```
WPP-XXXXXXXX-MMYY-CCCC
│    │         │    │
│    │         │    └─ Checksum de verificación (4 chars)
│    │         └─────── Fecha de caducidad (mes+año, ej: 0726 = julio 2026)
│    └───────────────── Cuerpo único (8 chars hex)
└────────────────────── Prefijo fijo
```

### Activar la app
1. Abre la app → pantalla de licencia
2. Introduce tu código `WPP-XXXXXXXX-MMYY-CCCC`
3. Pulsa **Activar**
4. La app muestra la fecha de caducidad y te deja acceder

### Renovar licencia caducada
Al caducar, la app muestra la pantalla de renovación. Introduce un nuevo código y sigue usando la app sin perder tus sesiones guardadas.

### ¿Cómo obtener una licencia?

[![WhatsApp](https://img.shields.io/badge/WhatsApp-Solicitar_licencia-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/56978327863?text=Hola%2C+quiero+solicitar+una+licencia+para+WebPrivate+WPP)

O desde la app → Menú 🔘 → **💳 Solicitar licencia**

---

## Preguntas frecuentes

**¿Las sesiones se mezclan entre sí?**
No. Cada pestaña tiene su propio almacén de cookies y localStorage, completamente aislado.

**¿Mis datos se guardan en algún servidor?**
No. Todo se almacena localmente en el dispositivo. Sin telemetría ni servidores externos.

**¿El proxy afecta a los datos guardados de la sesión?**
No. El proxy solo cambia el routing de red. Las cookies y datos de sesión se mantienen intactos.

**¿Puedo usar la extensión sin la app?**
Sí. La extensión Chrome funciona de forma independiente. La integración es opcional.

**¿Cuántas sesiones puedo tener en la app?**
Hasta 8 sesiones simultáneas, cada una completamente independiente.

---

## Versiones

| Versión | Cambios principales |
|---------|-------------------|
| **2.0.0** | Botón "Solicitar licencia" · Sistema de licencias con caducidad · Extensión Chrome v1.6.0 |
| **1.9.0** | Proxy/VPN por pestaña · Pestañas dinámicas (hasta 8) · Barra de tabs scrollable |
| **1.8.0** | Proxy/VPN global integrado (HTTP, HTTPS, SOCKS5 con auth) |
| **1.7.0** | WebRTC leak prevention · Battery/Connection spoofing · Swipe entre tabs |
| **1.6.0** | Anti-fingerprinting completo · 3 sesiones independientes · Notificaciones |

---

<div align="center">

**WebPrivate WPP** · Software privado · Todos los derechos reservados

[![WhatsApp](https://img.shields.io/badge/WhatsApp-Soporte-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/56978327863?text=Hola%2C+necesito+soporte+para+WebPrivate+WPP)

*No se distribuye el código fuente. El APK está disponible exclusivamente para usuarios con licencia.*

</div>
