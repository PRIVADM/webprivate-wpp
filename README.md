<div align="center">

<img src="assets/icon.png" alt="WebPrivate WPP" width="120"/>

# WebPrivate WPP

**Navegador privado para Wallapop con sesiones independientes y anti-fingerprinting**

[![Version](https://img.shields.io/badge/versión-2.0.0-7C5CFC?style=for-the-badge)](https://github.com/Maestrokey/webprivate-wpp/releases/latest)
[![Android](https://img.shields.io/badge/Android-8.0%2B-3DDC84?style=for-the-badge&logo=android)](https://github.com/Maestrokey/webprivate-wpp/releases/latest)
[![Licencia](https://img.shields.io/badge/licencia-privada-red?style=for-the-badge)](#licencias)

[⬇️ Descargar APK](#instalación) · [✨ Funciones](#funcionalidades) · [📖 Manual](#uso) · [💬 Soporte](#soporte)

---

</div>

## ¿Qué es WebPrivate WPP?

**WebPrivate WPP** es una aplicación Android que actúa como navegador privado optimizado para Wallapop. Permite gestionar **múltiples cuentas simultáneamente** con aislamiento total entre sesiones: cada pestaña tiene sus propias cookies, identidad de dispositivo, y puede usar un proxy diferente.

> Desarrollada para usuarios que necesitan privacidad, aislamiento de sesiones y control total sobre su huella digital en Wallapop.

---

## Funcionalidades

### 🗂️ Sesiones independientes (hasta 8 pestañas)
- Cada sesión tiene **cookies propias**, **historial separado** y **localStorage aislado**
- Al cambiar de pestaña, la sesión anterior queda completamente congelada
- Botón **`+`** para añadir nuevas sesiones · pulsación larga para gestionar cada una
- Desliza horizontalmente para cambiar entre sesiones (swipe)

### 🎭 Anti-fingerprinting por sesión
Cada sesión genera automáticamente una identidad de dispositivo única e independiente:

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

### 🌐 Proxy / VPN por sesión
- Configuración **independiente por pestaña**: cada sesión puede tener su propio proxy
- Soporta **HTTP, HTTPS y SOCKS5** con autenticación (usuario + contraseña)
- Se aplica automáticamente al cambiar de pestaña
- Indicador visual `🌐` en la pestaña cuando hay proxy activo
- El tráfico de notificaciones en background también usa el proxy configurado

### 🔐 Seguridad
- **PIN de 4 dígitos** con SHA-256 + bloqueo tras 5 intentos fallidos
- **Animación shake** en PIN incorrecto
- Los datos de sesión nunca se envían a servidores externos

### 📥 Gestión de sesiones
- **Exportar** sesión activa a JSON
- **Importar** sesión desde JSON (compatible con la extensión Chrome)
- **Perfiles guardados** — guarda y restaura hasta 10 sesiones nombradas
- **Reset selectivo** — borra solo la sesión activa, las demás intactas

### 🔔 Notificaciones de mensajes
- Polling automático cada 15 minutos en background (WorkManager)
- Notificación cuando hay mensajes nuevos sin leer
- No requiere mantener la app abierta

### 📤 Descarga de archivos
- Descarga automática al gestor de descargas de Android
- Conserva las cookies de sesión para archivos autenticados

---

## Instalación

### Requisitos
- Android **8.0 (Oreo)** o superior
- Permitir instalación desde **fuentes desconocidas**

### Pasos

**1.** Descarga el APK desde la sección [**Releases**](https://github.com/Maestrokey/webprivate-wpp/releases/latest)

**2.** En tu Android, ve a:
`Ajustes → Seguridad → Instalar apps desconocidas`
y activa el permiso para tu gestor de archivos o navegador.

**3.** Abre el archivo `.apk` descargado y pulsa **Instalar**.

**4.** Al abrir la app tendrás **3 días de prueba gratuita**. Para uso continuo necesitas un código de activación (ver [Licencias](#licencias)).

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

### Gestos
| Gesto | Acción |
|-------|--------|
| Tap en pestaña | Cambiar a esa sesión |
| Pulsación larga en pestaña | Opciones: renombrar · resetear · proxy · cerrar |
| Deslizar izquierda/derecha | Cambiar sesión (swipe) |
| Botón `+` | Añadir nueva sesión |

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

### Configurar un proxy para una sesión

1. Pulsación larga sobre la pestaña → **"Configurar proxy"**
2. Activa el interruptor, selecciona **HTTP** o **SOCKS5**
3. Introduce `host:puerto` y credenciales si las tiene
4. Pulsa **Guardar** — la pestaña recargará por el proxy

La pestaña mostrará el icono 🌐 cuando tiene proxy activo.

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
Al caducar una licencia, la app muestra la pantalla de renovación. Introduce un nuevo código y sigue usando la app sin perder tus sesiones guardadas.

---

## Compatibilidad con la extensión Chrome

WebPrivate WPP es compatible con la **extensión Chrome Wallapop Manager**:

1. En Chrome (PC) con la extensión instalada → exporta tu sesión
2. Transfiere el archivo `.json` al móvil
3. En la app → Menú → ⬆️ Importar sesión
4. Las cookies se inyectan en la sesión activa

---

## Preguntas frecuentes

**¿Las sesiones se mezclan entre sí?**
No. Cada pestaña tiene su propio almacén de cookies y localStorage. Al cambiar de pestaña, la anterior se guarda y la nueva se restaura de forma completamente aislada.

**¿Mis datos se guardan en algún servidor?**
No. Todo se almacena localmente en el dispositivo. No hay telemetría ni comunicación con servidores externos propios.

**¿El proxy afecta a los datos guardados de la sesión?**
No. El proxy solo cambia el routing de red. Las cookies y datos de sesión se mantienen intactos independientemente del proxy.

**¿Puedo usar la app sin proxy?**
Sí. El proxy es opcional. La app funciona con conexión directa normalmente.

**¿Cuántas sesiones puedo tener?**
Hasta 8 sesiones simultáneas. Cada una completamente independiente.

**¿La app funciona en segundo plano?**
Sí. Las notificaciones de mensajes nuevos funcionan mediante WorkManager, que ejecuta el polling cada 15 minutos aunque la app esté cerrada.

---

## Versiones

| Versión | Cambios principales |
|---------|-------------------|
| **2.0.0** | Sistema de licencias con caducidad · Pestañas dinámicas (hasta 8) · Proxy independiente por sesión |
| **1.9.0** | Proxy/VPN por pestaña · Botón "+" para añadir sesiones · Barra de tabs scrollable |
| **1.8.0** | Proxy/VPN global integrado (HTTP, HTTPS, SOCKS5 con auth) |
| **1.7.0** | WebRTC leak prevention · Battery/Connection spoofing · Swipe entre tabs · Descarga de archivos |
| **1.6.0** | Anti-fingerprinting completo · 3 sesiones independientes · Notificaciones |

---

## Soporte

¿Tienes dudas o necesitas un código de activación?

[![WhatsApp](https://img.shields.io/badge/WhatsApp-Soporte-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/56978327863?text=Hola%2C+necesito+soporte+para+WebPrivate+WPP)

---

<div align="center">

**WebPrivate WPP** · Software privado · Todos los derechos reservados

*No se distribuye el código fuente. El APK está disponible exclusivamente para usuarios con licencia.*

</div>
