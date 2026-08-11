/* ==========================================================================
   🏛️ ESTOICAMENTE HABLANDO — JAVASCRIPT ANIMADO v4.0
   Funcionalidades: Oráculo Interactivo, 3D Tilt, Canvas 60fps, Scroll Reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initMobileMenu();
  initGoldParticles();
  initScrollReveal();
  init3DTilt();
  initStoicOracle();
  initVirtuesWidget();
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
   2. HEADER STICKY & SCROLL EFFECTS
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   3. MENÚ NAVEGACIÓN MÓVIL (HAMBURGER)
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = toggleBtn.classList.contains('active');
    toggleBtn.classList.toggle('active');
    mainNav.classList.toggle('mobile-active');
    toggleBtn.setAttribute('aria-expanded', !isActive);
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      mainNav.classList.remove('mobile-active');
    });
  });
}

/* --------------------------------------------------------------------------
   4. PARTÍCULAS DORADAS INTERACTIVAS (CANVAS 60FPS)
   -------------------------------------------------------------------------- */
function initGoldParticles() {
  const container = document.getElementById('particles-js');
  if (!container) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height + height;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      // Interacción sutil con el ratón
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }

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

  const count = window.innerWidth < 768 ? 20 : 45;
  for (let i = 0; i < count; i++) {
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
   5. ANIMACIONES AL SCROLL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. EFECTO 3D TILT EN LA ESTATUA HERO
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const card = document.getElementById('tilt-card');
  if (!card || window.innerWidth < 1024) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 15;
    const rotateY = (x / rect.width) * 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

/* --------------------------------------------------------------------------
   7. WIDGET INTERACTIVO: ORÁCULO ESTOICO DE REFLEXIONES
   -------------------------------------------------------------------------- */
function initStoicOracle() {
  const textEl = document.getElementById('oracle-text');
  const authorEl = document.getElementById('oracle-author');
  const btn = document.getElementById('oracle-btn');

  if (!textEl || !authorEl || !btn) return;

  const quotes = [
    { text: "Sufrimos más a menudo en la imaginación que en la realidad.", author: "— Séneca, Cartas a Lucilio" },
    { text: "No tienes poder sobre los eventos externos, pero sí sobre tu mente. Aprende esto y encontrarás tu fortaleza.", author: "— Marco Aurelio, Meditaciones" },
    { text: "No son las cosas que nos pasan las que nos perturban, sino nuestra opinión sobre ellas.", author: "— Epicteto, Enquiridión" },
    { text: "La felicidad de tu vida depende de la calidad de tus pensamientos.", author: "— Marco Aurelio" },
    { text: "La riqueza no consiste en tener muchas posesiones, sino en tener pocas necesidades.", author: "— Epicteto" },
    { text: "Si estás afligido por algo externo, el dolor no se debe a la cosa en sí, sino a tu estimación de ella.", author: "— Marco Aurelio" },
    { text: "Cualquier persona capaz de hacerte enfadar se convierte en tu dueño.", author: "— Epicteto" },
    { text: "Comienza cada mañana diciéndote: hoy me encontraré con personas entrometidas, desagradecidas e insolentes. Pero ninguna de ellas puede dañarme.", author: "— Marco Aurelio" }
  ];

  let currentIndex = 0;

  btn.addEventListener('click', () => {
    // Animación de salida
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      textEl.textContent = `"${quotes[currentIndex].text}"`;
      authorEl.textContent = quotes[currentIndex].author;

      // Animación de entrada
      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 300);
  });
}

/* --------------------------------------------------------------------------
   8. WIDGET INTERACTIVO: 4 VIRTUDES ESTOICAS
   -------------------------------------------------------------------------- */
function initVirtuesWidget() {
  const cards = document.querySelectorAll('.virtue-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   9. TIMESTAMPS INTERACTIVOS PARA EL VIDEO
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

      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
    });
  });
}

/* --------------------------------------------------------------------------
   10. MANEJO DE FORMULARIOS Y FEEDBACK
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const form = document.getElementById('hero-lead-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>¡Enviando a La Legión! ⚡</span>';
    }
  });
}
