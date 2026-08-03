# Guía de Edición de Contenido y Publicación con Git

Esta guía te explica de forma sencilla cómo editar el contenido de las páginas de tu portafolio y los comandos necesarios de Git para subir todos tus cambios a GitHub.

---

## 📝 1. Cómo Editar el Contenido de tu Portafolio

Todos los archivos HTML contienen etiquetas comentadas con el emoji **✏️** para ayudarte a identificar rápidamente dónde va la información que debés actualizar.

### A. Editar tus 6 Servicios
Abre el archivo [servicios/index.html](file:///c:/Users/Simón/Desktop/Simón%20Diaz%20-%20Portafolio%20de%20Servicios/servicios/index.html) y busca la sección `SECCIÓN 3 — 6 CARDS DE SERVICIOS` (a partir de la línea 103).
Cada tarjeta está estructurada así para que puedas modificarla:

```html
<!-- ✏️ CARD 5 — Completá con tu 5to servicio -->
<div class="service-card-premium" style="--card-theme: #e879f9; ...">
    <div>
        <div class="service-icon-box">🎓</div>
        <!-- ✏️ TÍTULO DEL SERVICIO 5 -->
        <h3>Aquí va el título del servicio 5</h3>
        <!-- ✏️ DESCRIPCIÓN DEL SERVICIO -->
        <p>Describí brevemente en qué consiste este servicio...</p>
    </div>
    <a href="#contacto-directo" onclick="preselectService('Asesoría 1 a 1')">
        Consultar servicio →
    </a>
</div>
```
* **Icono**: Puedes cambiar el emoji de la línea `<div class="service-icon-box">` (ej: 📊, 🤖, 🎥).
* **Color de Acento**: Cambia el valor de `--card-theme` en la tarjeta por tu código hexadecimal preferido para cambiar la luz de neón que genera al pasar el cursor (ej: `#8B5CF6` para púrpura).

### B. Editar las Dudas Frecuentes (FAQs)
En la sección `SECCIÓN 7 — PREGUNTAS FRECUENTES` del mismo archivo `servicios/index.html`, vas a encontrar los bloques de acordeón:

```html
<!-- ✏️ FAQ 1 — Reemplazá pregunta y respuesta -->
<div class="faq-item">
    <button class="faq-question">
        <!-- ✏️ PREGUNTA 1 -->
        <span>¿Tu pregunta aquí?</span>
    </button>
    <div class="faq-answer">
        <!-- ✏️ RESPUESTA 1 -->
        <p>Tu respuesta explicativa redactada acá...</p>
    </div>
</div>
```

### C. Configurar el Mensaje Personalizado de WhatsApp
En la parte inferior de `servicios/index.html`, la función de JavaScript se encarga de empaquetar el mensaje automático para tu celular:

```javascript
// WhatsApp message handler
function handleQuoteSubmit(e) {
    e.preventDefault();
    const service = document.getElementById('service-select').value;
    const message = document.getElementById('service-message').value;

    let text = `Hola Simón, quisiera consultar sobre el servicio de *${service}*.`;
    if (message && message.trim().length > 0) {
        text += `\n\nDetalles de mi consulta:\n${message.trim()}`;
    }

    const encoded = encodeURIComponent(text);
    // Cambiá el número si cambia: wa.me/TU_NUMERO
    window.open(`https://wa.me/5493764852766?text=${encoded}`, '_blank');
}
```
* Si necesitas cambiar el número de destino, solo edita el `5493764852766` por el nuevo número con código de área (sin el `+` ni espacios).

---

## 🚀 2. Guía paso a paso para publicar cambios en GitHub

Una vez que guardes los cambios en tus archivos locales de la computadora, sigue estos comandos en tu terminal (PowerShell o Git Bash) dentro de la carpeta del proyecto para subirlos a tu repositorio:

### Paso 1: Ver qué archivos modificaste
Antes de hacer nada, revisa el estado actual de tus archivos modificados:
```bash
git status
```

### Paso 2: Guardar / Preparar los cambios
Agrega todos los archivos nuevos y modificados al área de preparación (staging area):
```bash
git add .
```

### Paso 3: Confirmar los cambios (Commit)
Crea una confirmación con un mensaje descriptivo y profesional que resuma qué cambiaste:
```bash
git commit -m "Actualizacion de servicios y contenido de FAQs"
```

### Paso 4: Enviar a GitHub (Push)
Sube los cambios a la rama principal de tu repositorio remoto:
```bash
git push origin main
```
*(Nota: Si tu rama principal tiene otro nombre como `master`, usa `git push origin master`).*

Una vez completado el paso 4, la plataforma que uses para hostear la web (como Vercel, Cloudflare Pages o GitHub Pages) detectará el envío y actualizará tu sitio web en vivo en un par de minutos de forma automática.
