# Guía de Edición, Desarrollo y Despliegue 🚀
Este documento sirve como referencia rápida para gestionar y actualizar tu Portafolio de Servicios. Aquí encontrarás qué archivos modificar según lo que quieras cambiar, cómo desplegar con éxito y cómo estructurar tus instrucciones para la IA.

---

## 📂 Estructura de Contenido Dinámico (CMS) vs. Código Estático

El portafolio utiliza un sistema híbrido: carga datos dinámicamente desde archivos JSON utilizando el script `assets/js/cms-loader.js`. Los elementos controlados por el JSON tienen el atributo `data-cms="nombre_clave"`.

### 📌 Tabla de Decisiones: ¿Qué debo modificar?

| ¿Qué quiero cambiar? | ¿Qué archivo modifico? | ¿Cómo se hace? |
| :--- | :--- | :--- |
| **Título principal (Hero Eyebrow)** | `data/homepage.json` | Cambia el valor de `"hero_title"`. |
| **Descripción del Hero** | `data/homepage.json` | Cambia el valor de `"hero_subtitle"`. |
| **Texto de botón "Ver servicios"** | `data/homepage.json` | Cambia el valor de `"hero_cta_text"`. |
| **Botón secundario "Contactar"** | `index.html` (Línea ~71) | Modifica el texto directamente en el HTML. |
| **Información de "Sobre Mí"** | `data/about.json` | Edita la descripción e información biográfica. |
| **Lista de Servicios (Texto y badges)** | `data/services.json` | Edita los campos `title`, `badge` y `shortDescription`. |
| **Preguntas Frecuentes (FAQs)** | `data/faqs.json` | Añade, edita o quita preguntas y respuestas dentro del array. |
| **Videos de YouTube** | `data/sources_youtube.json` | Modifica las URLs, títulos y descripciones de los videos. |
| **Menú de navegación o Footer** | Archivos `.html` individuales | Modifica los tags `<nav>` o `<footer>` en el archivo de la página. |
| **SEO y Metadatos (Títulos de pestaña)**| Archivos `.html` individuales | Modifica los tags `<title>` y `<meta>` en el `<head>`. |
| **Estilos, colores y animaciones** | `assets/css/styles.css` | Edita las variables CSS y clases de estilo. |

---

## 🛠️ Cómo Desplegar los Cambios a Producción

Para que tus cambios locales se publiquen en tu sitio web en Vercel, debes usar el script de despliegue. Debido a las políticas de ejecución de Windows, la forma recomendada de correrlo en tu terminal es:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\deploy.ps1
```

**¿Qué hace este script internamente?**
1. Comprueba si hay cambios en tus archivos locales.
2. Agrega y crea un commit automáticamente con la fecha y un resumen del cambio.
3. Ejecuta un análisis de seguridad con Gitleaks para asegurarse de que no subas contraseñas o claves privadas por error.
4. Sube los cambios a tu rama principal de GitHub (`origin/main`), gatillando el despliegue automático en Vercel.

---

## 🤖 Guía de Prompts e Instrucciones para la IA

Cuando trabajes con un agente de IA (como Antigravity), puedes optimizar su rendimiento y evitar errores dándole instrucciones estructuradas. Aquí tienes plantillas listas para usar en situaciones comunes:

### 📝 Situación 1: Añadir o modificar un Servicio
> **Prompt para la IA:**
> *"Quiero añadir un nuevo servicio al portafolio. Por favor, realiza lo siguiente:*
> 1. *Edita `data/services.json` y añade un nuevo objeto de servicio con las siguientes propiedades: [especifica título, badge, descripción y características].*
> 2. *Si es necesario, enlaza el servicio en el archivo HTML correspondiente de la carpeta `servicios/`.*
> 3. *Una vez hecho, ayúdame a correr el script `deploy.ps1` para publicarlo."*

### 🎨 Situación 2: Modificar estilos visuales (CSS)
> **Prompt para la IA:**
> *"Quiero cambiar el diseño visual de la sección [especifica sección, ej: los botones del Hero]. Por favor, modifica únicamente el archivo `assets/css/styles.css` utilizando las variables CSS globales ya existentes (como `--color-lime` o `--color-stone`) para mantener la armonía. No añadas estilos en línea (inline style) en el HTML. Muestra los cambios antes de desplegar."*

### ⚙️ Situación 3: Corregir un error o discrepancia visual
> **Prompt para la IA:**
> *"He notado una discrepancia entre lo que veo en local y lo que se renderiza en producción en la sección [especifica sección]. Por favor:*
> 1. *Revisa si el elemento HTML tiene un atributo `data-cms`.*
> 2. *Si lo tiene, busca el archivo JSON correspondiente en la carpeta `data/` y actualízalo.*
> 3. *Si no lo tiene, modifica el archivo HTML directamente.*
> 4. *Corre el script de despliegue una vez completado."*

### 🏷️ Situación 4: Cambiar Metadatos o SEO
> **Prompt para la IA:**
> *"Necesito actualizar el SEO de la página [especifica página, ej: Sobre Mí]. Por favor, modifica el `<head>` del archivo [especifica archivo, ej: sobre-mi/index.html] actualizando las etiquetas `<title>`, `<meta name="description">` y las propiedades Open Graph (`og:title`, `og:description`). Asegúrate de que el resto del HTML permanezca intacto."*
