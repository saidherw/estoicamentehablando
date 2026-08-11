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
  autoFetchYouTubeChapters();
  initDynamicBlog();
  initDynamicBlogPost();
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
  bindChapterButtons();
}

function bindChapterButtons() {
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

/* 5. PARSER AUTOMÁTICO DE CAPÍTULOS / MARCAS DE TIEMPO DE YOUTUBE */
async function autoFetchYouTubeChapters() {
  const channelId = 'UCs15qyAONmD3gwkpDAOhSYQ';
  const container = document.querySelector('.chapters-luxury-box');
  if (!container) return;

  const rssUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`;

  try {
    const res = await fetch(rssUrl);
    if (!res.ok) return;
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const latestEntry = xmlDoc.querySelector('entry');
    if (!latestEntry) return;

    const videoId = latestEntry.querySelector('videoId')?.textContent;
    const description = latestEntry.querySelector('description')?.textContent || '';

    const timeRegex = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*[-–—]?\s*(.+)/g;
    const chapters = [];
    let match;

    while ((match = timeRegex.exec(description)) !== null) {
      const hours = match[1] ? parseInt(match[1], 10) : 0;
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
      
      const formattedTime = `${match[1] ? match[1] + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const title = match[4].trim();

      chapters.push({ seconds: totalSeconds, formattedTime, title });
    }

    if (chapters.length > 0) {
      let html = `<h3 style="font-size: 1.1rem; margin-bottom: 1rem;">⏱️ Capítulos del Video</h3>`;
      chapters.forEach(ch => {
        html += `
          <div class="chapter-link-row" data-time="${ch.seconds}">
            <span class="timestamp-badge">${ch.formattedTime}</span>
            <span style="font-size: 0.9rem;">${ch.title}</span>
          </div>
        `;
      });
      html += `
        <div style="margin-top: 1.5rem;">
          <a href="https://www.youtube.com/@HablandoEstoicamente?sub_confirmation=1" target="_blank" rel="noopener" class="btn-luxury-gold" style="width: 100%; justify-content: center;">
            <span>🔔 Suscribirme en YouTube</span>
          </a>
        </div>
      `;

      container.innerHTML = html;
      bindChapterButtons();
    }
  } catch (err) {
    // Si falla, mantiene los estáticos
  }
}

/* 6. DINÁMICA DEL BLOG (CARGA Y PARSEO CLIENT-SIDE DE MARKDOWN DESDE GITHUB) */
async function initDynamicBlog() {
  const grid = document.getElementById('blog-posts-grid');
  if (!grid) return;

  const repo = 'saidherw/estoicamentehablando';
  const url = `https://api.github.com/repos/${repo}/contents/src/content/blog`;

  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const files = await res.ok ? await res.json() : [];
    
    // Filtrar solo archivos markdown
    const mdFiles = files.filter(f => f.name.endsWith('.md') || f.name.endsWith('.markdown'));
    if (mdFiles.length === 0) return;

    let html = '';
    
    for (const file of mdFiles) {
      const rawRes = await fetch(file.download_url);
      if (!rawRes.ok) continue;
      const text = await rawRes.text();
      
      const post = parseFrontmatter(text);
      const slug = file.name.replace(/\.[^/.]+$/, ""); // quitar extensión

      html += `
        <article class="virtue-card-luxury" style="text-align: left;">
          <span style="font-family: var(--font-display); font-size: 0.75rem; color: var(--color-gold); letter-spacing: 0.1em; text-transform: uppercase;">
            ${post.philosopher || 'ESTOICISMO'} // ${post.category || 'REFLEXIÓN'}
          </span>
          <h3 style="margin: 0.5rem 0 0.75rem 0;">${post.title}</h3>
          <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">${post.description}</p>
          <a href="./blog-post.html?post=${slug}" class="btn-luxury-gold" style="display: inline-flex;">
            <span>Leer Artículo Completo →</span>
          </a>
        </article>
      `;
    }

    if (html !== '') {
      grid.innerHTML = html;
    }
  } catch (err) {
    console.warn("Fallo al cargar posts dinámicos desde GitHub. Mostrando estáticos.");
  }
}

async function initDynamicBlogPost() {
  const wrapper = document.getElementById('blog-post-wrapper');
  if (!wrapper) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('post');
  if (!slug) return; // Si no hay query, muestra el post de prueba por defecto

  const repo = 'saidherw/estoicamentehablando';
  const rawUrl = `https://raw.githubusercontent.com/${repo}/main/src/content/blog/${slug}.md`;

  try {
    const res = await fetch(rawUrl);
    if (!res.ok) return;
    const text = await res.text();
    
    const post = parseFrontmatter(text);
    const htmlContent = parseSimpleMarkdown(post.body);

    wrapper.innerHTML = `
      <div class="container" style="max-width: 780px;">
        <span class="editorial-eyebrow">Publicado por ${post.author || 'El Rayo Romano'}</span>
        <h1 style="margin-bottom: 1.5rem;">${post.title}</h1>
        
        <div style="border-left: 2px solid var(--color-gold); padding-left: 1.25rem; font-family: var(--font-serif); font-style: italic; font-size: 1.2rem; margin-bottom: 3rem; color: var(--text-sub);">
          "${post.description}"
        </div>

        <div style="line-height: 1.8; font-size: 1.05rem; color: var(--text-main);">
          ${htmlContent}
        </div>

        <div class="editorial-optin-card" style="margin-top: 4rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">¿Quieres profundizar más?</h3>
          <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">Únete al Reto Estoico de 7 Días y recibe una lección práctica cada mañana en tu correo.</p>
          <a href="./reto.html" class="btn-luxury-gold">Unirme al Reto Gratis →</a>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error cargando el post dinámico:", err);
  }
}

/* 7. UTILERÍAS DE PARSEO FRONTMATTER & MARKDOWN */
function parseFrontmatter(text) {
  const result = { body: '' };
  const match = text.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (match) {
    const yaml = match[1];
    result.body = text.replace(match[0], '').trim();
    
    yaml.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
        result[key] = value;
      }
    });
  } else {
    result.body = text;
  }
  return result;
}

function parseSimpleMarkdown(markdown) {
  let html = markdown;

  // Reemplazar saltos de línea y párrafos
  html = html.replace(/\r?\n\r?\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Encabezados
  html = html.replace(/### (.*?)(?=\n|<\/p>)/g, '<h3>$1</h3>');
  html = html.replace(/## (.*?)(?=\n|<\/p>)/g, '<h2>$1</h2>');
  html = html.replace(/# (.*?)(?=\n|<\/p>)/g, '<h1>$1</h1>');

  // Negrita e itálica
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Citas (blockquotes)
  html = html.replace(/&gt;\s*(.*?)(?=\n|<\/p>)/g, '<blockquote>$1</blockquote>');
  html = html.replace(/>\s*(.*?)(?=\n|<\/p>)/g, '<blockquote>$1</blockquote>');

  // Limpiar etiquetas de párrafos vacías o redundantes
  html = html.replace(/<p><h([1-6])>/g, '<h$1>');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p><\/p>/g, '');

  return html;
}

/* 8. MANEJO DE FORMULARIO CON FEEDBACK */
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

/* 9. BANNER DE CONSENTIMIENTO DE COOKIES (GDPR / AEPD) */
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
