# Portafolio de Servicios Profesionales – Simón Díaz

Sitio web responsivo y de alto impacto estético desarrollado como **Portafolio de Servicios Profesionales** en Marketing Digital, Producción Audiovisual, Consultoría en Tecnologías de la Información y Capacitaciones Tecnológicas.

## 🚀 Características del Proyecto

- **Interactividad 3D**: Integración de fondo de partículas fluido utilizando [Three.js](https://threejs.org/) y animaciones de rotación 3D en las tarjetas informativas.
- **Canal de YouTube Dinámico**: Consumo automático de videos a través de un endpoint API serverless (desplegado en Vercel) con fallback seguro a un archivo JSON local (`sources_youtube.json`).
- **Navegación e Indexación Académica**: Sistema dinámico para cargar artículos, navegar entre secciones relacionadas y paginar de manera fluida usando archivos de datos JSON (`academic-posts.json`).
- **Accesibilidad Integrada (A11y)**: Cumplimiento de estándares básicos de accesibilidad con manejo inteligente del foco del teclado y atributos ARIA dinámicos en el menú móvil.
- **Estructura Modular e Independiente**: Rutas de archivos y recursos dinámicas calculadas automáticamente según el nivel de anidación del path de URL del cliente, garantizando que el sitio funcione sin romperse en cualquier subnivel.
- **Estilos Limpios y Centralizados**: Código libre de estilos en línea en el HTML y JavaScript, centralizado en una hoja de estilos moderna basada en variables CSS (`styles.css`).

## 📁 Estructura del Sitio

```text
Inicio (index.html)
├── Sobre Mí (sobre-mi/index.html)
├── Servicios Profesionales (servicios/index.html)
│   ├── Estrategia de Marketing Digital
│   ├── Producción y edición de Contenido Audiovisual
│   ├── Gestión de Campañas Publicitarias en Meta Ads
│   └── Creación de contenido adaptativo
├── Proyectos (proyectos/index.html)
├── Videos (videos/index.html) (Integración de YouTube)
└── Contacto (contacto/index.html)
```

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3 (Vanilla)**: Maquetación semántica y diseño con CSS Grid, Flexbox y animaciones avanzadas.
- **JavaScript (ES6+)**: Interactividad del lado del cliente sin frameworks pesados.
- **Three.js**: Renderizado 3D de fondo.
- **Vercel**: Alojamiento del sitio estático y soporte para Serverless Functions (`/api`).

## 💻 Desarrollo Local

Para levantar el servidor de desarrollo local y previsualizar los cambios de forma automática, sigue estos pasos:

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. Abre la consola en la raíz del proyecto y ejecuta el servidor local integrado mediante:
   ```bash
   npm run dev
   ```
3. El proyecto se abrirá automáticamente en tu navegador predeterminado (usualmente en `http://localhost:3000`).

## 👤 Autor

**Simón Díaz**
*Consultor en Estrategias Digitales y Tecnologías de la Información (Posadas, Misiones).*
