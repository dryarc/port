// dry — script.js

// ── Ano no footer ─────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Cursor ────────────────────────────────────────────
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cur.style.left  = e.clientX + 'px';
  cur.style.top   = e.clientY + 'px';
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
});

// ── Nav scroll ────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

// ── Menu mobile ───────────────────────────────────────
const burger = document.getElementById('burger');
const mob    = document.getElementById('mob-menu');
burger.addEventListener('click', () => {
  const open = mob.classList.toggle('open');
  const [s1, s2] = burger.querySelectorAll('span');
  s1.style.transform = open ? 'translateY(7.5px) rotate(45deg)' : '';
  s2.style.transform = open ? 'translateY(-7.5px) rotate(-45deg)' : '';
});
document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', () => {
  mob.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => s.style.transform = '');
}));

// ── Reveal on scroll ──────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const parent   = e.target.closest('.container,.hero-left,.hero-right,.about-text,.about-stats,.contact-simple') || document.body;
    const siblings = [...parent.querySelectorAll('.reveal')];
    e.target.style.transitionDelay = `${siblings.indexOf(e.target) * 80}ms`;
    e.target.classList.add('in');
    obs.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Contadores animados ───────────────────────────────
const cobs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const target = +e.target.dataset.target;
    let curr = 0;
    const id = setInterval(() => {
      curr = Math.min(curr + target / 60, target);
      e.target.textContent = Math.floor(curr);
      if (curr >= target) clearInterval(id);
    }, 16);
    cobs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n').forEach(el => cobs.observe(el));

// ── Hover tilt na foto ────────────────────────────────
const photoWrap = document.querySelector('.photo-wrap');
if (photoWrap) {
  photoWrap.addEventListener('mousemove', e => {
    const r  = photoWrap.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    photoWrap.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  photoWrap.addEventListener('mouseleave', () => {
    photoWrap.style.transition = 'transform 0.5s ease';
    photoWrap.style.transform  = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
    setTimeout(() => photoWrap.style.transition = '', 500);
  });
}

// ── Hover shimmer nos cards de skill ─────────────────
document.querySelectorAll('.sk-card, .proj-card, .contact-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = ((e.clientX - r.left) / r.width)  * 100;
    const y  = ((e.clientY - r.top)  / r.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

// ── Typed effect no hero-name ─────────────────────────
(function typedHero() {
  const el = document.querySelector('.hero-name');
  if (!el) return;
  const parts = ['dry', '.', 'ARC'];
  const spans = el.querySelectorAll('span');
  spans.forEach(s => { s.style.opacity = '0'; });
  let i = 0;
  const show = () => {
    if (i >= spans.length) return;
    spans[i].style.transition = 'opacity 0.4s ease';
    spans[i].style.opacity    = '1';
    i++;
    setTimeout(show, 180);
  };
  setTimeout(show, 400);
})();

// ── Scroll progress bar ───────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const pct = (scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  progressBar.style.width = pct + '%';
});

// ═══════════════════════════════════════════════════════
// LANG TOGGLE — solução robusta PT ↔ EN
// Armazena o HTML original de cada elemento traduzível
// e troca innerHTML completo, preservando tags filhas.
// ═══════════════════════════════════════════════════════
const langBtn = document.getElementById('lang-toggle');
let currentLang = 'pt';

// Mapa de traduções: seletor → { pt, en }
// Inclui elementos simples (data-pt/en já no HTML)
// e os parágrafos complexos com <strong> dentro.
const TRANSLATIONS = {
  // ── parágrafos complexos da seção Sobre ────────────
  '#sobre .about-text p:nth-of-type(1)': {
    pt: 'Com <strong>2 anos de carreira</strong>, já desenvolvi <strong>3 projetos</strong> completos, desde a ideia até a entrega. Gosto de resolver problemas reais com soluções e técnicas elegantes.',
    en: 'With <strong>2 years of career</strong>, I have developed <strong>3 projects</strong> from idea to delivery. I enjoy solving real problems with elegant technical solutions.'
  },
  '#sobre .about-text p:nth-of-type(2)': {
    pt: 'Sou fluente em <strong>Português</strong> e estou aprendendo <strong>Inglês</strong> — já me comunico bem por escrito e continuo evoluindo.',
    en: 'I\'m fluent in <strong>Portuguese</strong> and learning <strong>English</strong> — I already communicate well in writing and keep improving.'
  },
  '#sobre .about-text p:nth-of-type(3)': {
    pt: 'Me encontro principalmente no Discord e no GitHub (<strong>dry.arc</strong>), ótimos canais pra conectar com outros devs e colaborar em projetos.',
    en: 'You can find me mainly on Discord and GitHub (<strong>dry.arc</strong>), great places to connect with other devs and collaborate on projects.'
  },
  // ── h2 do sobre ────────────────────────────────────
  '#sobre .about-text h2': {
    pt: 'Olá, eu sou <strong>dry</strong> —<br/>desenvolvedor apaixonado por código.',
    en: 'Hey, I\'m <strong>dry</strong> —<br/>a developer passionate about code.'
  },
  // ── hero role ──────────────────────────────────────
  '.hero-role': {
    pt: 'Desenvolvedor <em>Full‑Stack</em>',
    en: 'Full‑Stack <em>Developer</em>'
  },
  // ── título projetos ────────────────────────────────
  '#projetos .proj-card:nth-of-type(1) h3': {
    pt: 'Landing Page - Marca de Moda',
    en: 'Landing Page - Fashion Brand'
  },
  '#projetos .proj-card:nth-of-type(2) h3': {
    pt: 'Update logs - Sailor Piece',
    en: 'Update logs - Sailor Piece'
  },
  // ── links dos projetos ─────────────────────────────
  '#projetos .proj-card:nth-of-type(1) .proj-links a:last-child': {
    pt: 'Abrir ↗',
    en: 'Open ↗'
  },
  '#projetos .proj-card:nth-of-type(2) .proj-links a:last-child': {
    pt: 'Abrir ↗',
    en: 'Open ↗'
  },
  // ── footer ─────────────────────────────────────────
  '.footer [data-pt]': {
    pt: 'feito com foco e café ☕',
    en: 'made with focus and coffee ☕'
  }
};

function applyLang(lang) {
  // 1. Elementos simples com data-pt / data-en (só texto, sem filhos importantes)
  document.querySelectorAll('[data-pt]').forEach(el => {
    if (!el.dataset.en) return;
    // Pula se o próprio pai já for tratado pelo TRANSLATIONS
    el.textContent = lang === 'en' ? el.dataset.en : el.dataset.pt;
  });

  // 2. Elementos complexos do mapa
  Object.entries(TRANSLATIONS).forEach(([selector, texts]) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = texts[lang];
  });

  // 3. Atualiza botão
  langBtn.textContent = lang === 'en' ? 'PT' : 'EN';
  langBtn.classList.toggle('active', lang === 'en');

  // 4. Animação flash no body
  document.body.style.transition = 'opacity 0.15s';
  document.body.style.opacity    = '0.85';
  setTimeout(() => { document.body.style.opacity = '1'; }, 150);

  currentLang = lang;
}

langBtn.addEventListener('click', () => {
  applyLang(currentLang === 'pt' ? 'en' : 'pt');
});