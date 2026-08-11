/* ==========================================================================
   🏛️ ESTOICAMENTE HABLANDO — JAVASCRIPT EDITORIAL LUXURY v9.0
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initStoicOracle();
  initVideoChapters();
  initFormHandler();
  initCookieBanner();
});

/* 1. TOGGLE DE TEMA (v9-theme) */
function initThemeToggle() {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('v9-theme', next);
  });
}

/* 2. MENÚ MÓVIL LUXURY */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navList = document.getElementById('nav-list');

  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('active');
  });

  document.querySelectorAll('.luxury-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navList.classList.remove('active');
    });
  });
}

/* 3. ORÁCULO DE REFLEXIONES */
function initStoicOracle() {
  const textEl = document.getElementById('oracle-text');
  const authorEl = document.getElementById('oracle-author');
  const btn = document.getElementById('oracle-btn');

  if (!textEl || !authorEl || !btn) return;

  const quotes = [
    { text: "Sufrimos más a menudo en la imaginación que en la realidad.", author: "— SÉNECA, CARTAS A LUCILIO" },
    { text: "No tienes poder sobre los eventos externos, pero sí sobre tu mente. Aprende esto y encontrarás fortaleza.", author: "— MARCO AURELIO, MEDITACIONES" },
    { text: "No son las cosas que nos pasan las que nos perturban, sino nuestra opinión sobre ellas.", author: "— EPICTETO, ENQUIRIDIÓN" },
    { text: "La felicidad de tu vida depende de la calidad de tus pensamientos.", author: "— MARCO AURELIO" },
    { text: "La riqueza no consiste en tener muchas posesiones, sino en tener pocas necesidades.", author: "— EPICTETO" },
    { text: "Si estás afligido por algo externo, el dolor no se debe a la cosa en sí, sino a tu estimación de ella.", author: "— MARCO AURELIO" },
    { text: "Cualquier persona capaz de hacerte enfadar se convierte en tu dueño.", author: "— EPICTETO" }
  ];

  let index = 0;

  btn.addEventListener('click', () => {
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(-6px)';

    setTimeout(() => {
      index = (index + 1) % quotes.length;
      textEl.textContent = `"${quotes[index].text}"`;
      authorEl.textContent = quotes[index].author;

      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 250);
  });
}

/* 4. CAPÍTULOS DE VIDEO INTERACTIVOS */
function initVideoChapters() {
  const btns = document.querySelectorAll('.chapter-link-row');
  const iframe = document.querySelector('.video-frame-luxury iframe');

  if (!btns.length || !iframe) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const seconds = Number(btn.getAttribute('data-time') || 0);
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
    });
  });
}

/* 5. MANEJO DE FORMULARIO CON FEEDBACK */
function initFormHandler() {
  const form = document.getElementById('hero-lead-form');
  if (!form) return;

  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>¡Enviando a La Legión! ⚡</span>';
    }
  });
}

/* 6. BANNER DE CONSENTIMIENTO DE COOKIES (GDPR / AEPD) */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner || !acceptBtn || !rejectBtn) return;

  const consent = localStorage.getItem('cookie-consent');

  if (!consent) {
    setTimeout(() => {
      banner.style.display = 'block';
      setTimeout(() => banner.classList.add('show'), 50);
    }, 600);
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    closeBanner();
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'rejected');
    closeBanner();
  });

  function closeBanner() {
    banner.classList.remove('show');
    setTimeout(() => {
      banner.style.display = 'none';
    }, 300);
  }
}
