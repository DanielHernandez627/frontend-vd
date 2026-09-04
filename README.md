# 🎨 Frontend VD - Angular Web Platform

Aplicación Single Page Application (SPA) desarrollada en **Angular 22** y **Angular Material**, diseñada con una estética **Dark Glassmorphism** (colores tailored HSL, gradientes suaves, bordes traslúcidos con `backdrop-filter` y notificaciones modales integradas).

---

## 🛠 Tecnologías y Librerías

- **Framework**: Angular 22 (Standalone Components + Lazy Loading)
- **UI Components**: Angular Material 22 (`@angular/material`, `@angular/cdk`)
- **Estilos**: Vanilla SCSS (Design Tokens, Glassmorphism, Custom Scrollbars)
- **Iconografía & Tipografía**: Google Material Symbols / Icons + Font Roboto
- **Servidor Web Producción**: Nginx Alpine (`Dockerfile` multi-stage)

---

## 📁 Estructura del Proyecto

```text
frontend-vd/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── catalog/              # Vistas del Catálogo Multimedia (CatalogComponent)
│   │   │   ├── player/               # Reproductor de Video HTTP 206 + Skip Intro (PlayerComponent)
│   │   │   └── admin/                # Panel de Carga Masiva e Importación (AdminComponent)
│   │   ├── shared/
│   │   │   ├── components/custom-dialog/ # Componente Modal Dark Glassmorphic (CustomDialogComponent)
│   │   │   └── services/notification.service.ts # Servicio global de modales (showSuccess, showError...)
│   │   ├── services/
│   │   │   └── media.service.ts      # Cliente HTTP HttpClient para consumo de la API Backend
│   │   ├── utils/
│   │   │   └── time-converter.ts     # Conversión utilitaria MM:SS <-> Segundos
│   │   ├── app.html                  # Layout base con Navegación MatSidenav
│   │   ├── app.routes.ts              # Enrutamiento con Lazy Loading por vistas
│   │   └── app.scss                  # Estilos globales y barra lateral
│   ├── styles.scss                   # Tema global y estilos de overlays CDK
│   └── index.html                    # Entrada HTML principal
├── Dockerfile                        # Multi-stage build Node 22 + Nginx Alpine
├── nginx.conf                        # Configuración Nginx con soporte SPA y Partial Content
└── package.json                      # Descriptores de dependencias y scripts
```

---

## 🚀 Ejecución en Desarrollo

### Prerrequisitos
- Node.js v22 (LTS)
- npm v10+

### Comandos de Construcción y Ejecución

```bash
# Instalación de dependencias
npm install

# Iniciar servidor de desarrollo local (Puerto 4200)
npm start

# Compilación de producción (Genera artefactos en dist/frontend-vd/browser)
NG_CLI_ANALYTICS=false npm run build
```

---

## 🎨 Características Visuales Destacadas

1. **🔔 Modales Dark Glassmorphic (`NotificationService`)**:
   - Reemplaza los diálogos JavaScript nativos por cuadros flotantes oscuros con bordes resplandecientes e iconos dinámicos según el tipo de estado.
2. **📜 Scrollbar Suave de Episodios**:
   - Limitación a `220px` en tarjetas del catálogo con barra de desplazamiento personalizada azul cian.
3. **⏩ Botón Flotante de Skip Intro**:
   - Superposición animada sobre el elemento HTML5 `<video>` activa automáticamente durante el intervalo del opening (`0:38` al `2:11`).
