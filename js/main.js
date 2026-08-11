/* ==========================================================================
   🏛️ ESTOICAMENTE HABLANDO — JAVASCRIPT HALLMARK EDITORIAL v4.5
   Funcionalidades: Oráculo de Citas, Cambio de Tema OKLCH, Navegación Broadsheet
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initStoicOracle();
  initTimestamps();
  initFormHandler();
});

/* --------------------------------------------------------------------------
   1. CONMUTADOR DE TEMA VISUAL (HALLMARK OKLCH THEME TOGGLE)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-btn');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hallmark-theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. MENÚ MÓVIL EDITORIAL BROADSHEET
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navList = document.getElementById('nav-list');

  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    navList.classList.toggle('active');
  });

  document.querySelectorAll('.nav-item-link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   3. ORÁCULO ESTOICO DE REFLEXIONES (PULL-QUOTE ENGINE)
   -------------------------------------------------------------------------- */
function initStoicOracle() {
  const textEl = document.getElementById('oracle-text');
  const authorEl = document.getElementById('oracle-author');
  const btn = document.getElementById('oracle-btn');

  if (!textEl || !authorEl || !btn) return;

  const quotes = [
    { text: "Sufrimos más a menudo en la imaginación que en la realidad.", author: "— SÉNECA, CARTAS A LUCILIO" },
    { text: "No tienes poder sobre los eventos externos, pero sí sobre tu mente. Aprende esto y encontrarás tu fortaleza.", author: "— MARCO AURELIO, MEDITACIONES" },
    { text: "No son las cosas que nos pasan las que nos perturban, sino nuestra opinión sobre ellas.", author: "— EPICTETO, ENQUIRIDIÓN" },
    { text: "La felicidad de tu vida depende de la calidad de tus pensamientos.", author: "— MARCO AURELIO" },
    { text: "La riqueza no consiste en tener muchas posesiones, sino en tener pocas necesidades.", author: "— EPICTETO" },
    { text: "Si estás afligido por algo externo, el dolor no se debe a la cosa en sí, sino a tu estimación de ella.", author: "— MARCO AURELIO" },
    { text: "Cualquier persona capaz de hacerte enfadar se convierte en tu dueño.", author: "— EPICTETO" },
    { text: "Comienza cada mañana diciéndote: hoy me encontraré con personas entrometidas, desagradecidas e insolentes. Pero ninguna de ellas puede dañarme.", author: "— MARCO AURELIO" }
  ];

  let currentIndex = 0;

  btn.addEventListener('click', () => {
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(-6px)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      textEl.textContent = `"${quotes[currentIndex].text}"`;
      authorEl.textContent = quotes[currentIndex].author;

      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 250);
  });
}

/* --------------------------------------------------------------------------
   4. CAPÍTULOS DE VIDEO INTERACTIVOS
   -------------------------------------------------------------------------- */
function initTimestamps() {
  const rows = document.querySelectorAll('.chapter-row');
  const iframe = document.querySelector('.video-aspect-ratio iframe');

  if (!rows.length || !iframe) return;

  rows.forEach(row => {
    row.addEventListener('click', () => {
      const timeStr = row.querySelector('.chapter-time')?.textContent || '00:00';
      const parts = timeStr.split(':').map(Number);
      const seconds = parts[0] * 60 + parts[1];

      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
    });
  });
}

/* --------------------------------------------------------------------------
   5. FEEDBACK DE FORMULARIOS
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const form = document.getElementById('hero-lead-form');
  if (!form) return;

  form.addEventListener('submit', () => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '¡ENVIANDO A LA LEGIÓN! ⚡';
    }
  });
}
