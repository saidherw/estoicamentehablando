/* ==========================================================================
   🏛️ ESTOICAMENTE HABLANDO — JAVASCRIPT PRINCIPAL v3.0
   Funcionalidades: Theme Toggle, Partículas Doradas, Menú Móvil, Timestamps
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initGoldParticles();
  initTimestamps();
  initFormHandler();
});

/* --------------------------------------------------------------------------
   1. COMMUTADOR DE TEMA VISUAL (LIGHT / DARK MODE)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme-preference', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. MENÚ NAVEGACIÓN MÓVIL (HAMBURGER)
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('mobile-active');
  });
}

/* --------------------------------------------------------------------------
   3. PARTÍCULAS DORADAS FLOTANTES (CANVAS LIGERO 60FPS)
   -------------------------------------------------------------------------- */
function initGoldParticles() {
  const container = document.getElementById('particles-js');
  if (!container) return;

  // Respetar preferencia de movimiento reducido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 20 : 45; // Límite móvil para performance

  function resize() {
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height + height;
      this.size = Math.random() * 2 + 0.8;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   4. TIMESTAMPS INTERACTIVOS PARA EL VIDEO
   -------------------------------------------------------------------------- */
function initTimestamps() {
  const items = document.querySelectorAll('.timestamp-item');
  const iframe = document.querySelector('.video-embed-box iframe');

  if (!items.length || !iframe) return;

  items.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const timeStr = item.querySelector('.timestamp-time')?.textContent || '00:00';
      const parts = timeStr.split(':').map(Number);
      const seconds = parts[0] * 60 + parts[1];

      // Enviar comando postMessage a YouTube IFrame API
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
    });
  });
}

/* --------------------------------------------------------------------------
   5. MANEJO DE FORMULARIOS Y FEEDBACK
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const form = document.getElementById('hero-lead-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Cargando...</span>';
    }
  });
}
