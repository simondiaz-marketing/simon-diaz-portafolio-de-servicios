document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("[data-cms]");
  if (elements.length === 0) return;

  const path = window.location.pathname;
  let sourceFile = "";

  if (path.includes("sobre-mi")) {
    sourceFile = "about.json";
  } else if (path.includes("servicios")) {
    sourceFile = "faqs.json";
  } else if (path === "/" || path.includes("index.html") || path.endsWith("Simón Diaz - Portafolio de Servicios")) {
    sourceFile = "homepage.json";
  }

  if (!sourceFile) return;

  // Carga robusta considerando las rutas relativas
  let prefix = "";
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const isFile = segments[segments.length - 1].includes('.');
    const folderCount = isFile ? segments.length - 1 : segments.length;
    // Si estamos en un subdirectorio como /servicios/, subir niveles
    if (folderCount > 0 && !path.includes("index.html") && segments[0] !== "index.html") {
      prefix = "../".repeat(folderCount);
    }
  }

  fetch(`${window.location.origin}/data/${sourceFile}`)
    .then(response => {
      if (!response.ok) throw new Error("File fetch error");
      return response.json();
    })
    .catch(() => {
      // Fallback a ruta relativa si origin falla (por ejemplo en local file system)
      return fetch(`${prefix}data/${sourceFile}`).then(r => r.json());
    })
    .then(data => {
      // Renderizar FAQs dinámicamente si estamos en servicios y el JSON contiene faqs
      if (sourceFile === "faqs.json" && data.faqs) {
        renderDynamicFAQs(data.faqs);
      }

      elements.forEach(el => {
        const key = el.getAttribute("data-cms");
        if (data[key] !== undefined) {
          el.innerHTML = data[key];
        }
      });
    })
    .catch(err => console.warn("Error cargando textos del CMS:", err));
});

function renderDynamicFAQs(faqs) {
  const accordionContainer = document.querySelector(".faq-accordion");
  if (!accordionContainer) return;

  // Limpiar las FAQs estáticas y renderizar las del JSON
  accordionContainer.innerHTML = "";

  faqs.forEach((faq, index) => {
    const faqItem = document.createElement("div");
    faqItem.className = "faq-item";
    faqItem.innerHTML = `
      <button class="faq-question">
        <span>${faq.question}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    `;
    accordionContainer.appendChild(faqItem);
  });

  // Re-inicializar eventos de acordeón si existen en la web
  initAccordionEvents();
}

function initAccordionEvents() {
  const questions = document.querySelectorAll(".faq-question");
  questions.forEach(q => {
    // Remover eventos previos para evitar duplicados
    const newQ = q.cloneNode(true);
    q.parentNode.replaceChild(newQ, q);

    newQ.addEventListener("click", () => {
      const activeFaq = document.querySelector(".faq-item.active");
      const currentItem = newQ.closest(".faq-item");
      
      if (activeFaq && activeFaq !== currentItem) {
        activeFaq.classList.remove("active");
      }
      currentItem.classList.toggle("active");
    });
  });
}
