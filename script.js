// dry.arc — script.js

// Ano
document.getElementById('year').textContent = new Date().getFullYear();

// Cursor
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

// Mobile menu
const burger = document.getElementById('burger');
const mob = document.getElementById('mob-menu');
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

// Reveal on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const siblings = [...(e.target.closest('.container,.hero-left,.hero-right,.about-text,.about-stats') || document.body).querySelectorAll('.reveal')];
      const idx = siblings.indexOf(e.target);
      e.target.style.transitionDelay = `${idx * 70}ms`;
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Counters
const cobs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.target;
      let curr = 0;
      const step = target / 60;
      const t = setInterval(() => {
        curr = Math.min(curr + step, target);
        e.target.textContent = Math.floor(curr);
        if (curr >= target) clearInterval(t);
      }, 16);
      cobs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n').forEach(el => cobs.observe(el));

// Form
document.getElementById('cform').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Enviado! ✓';
    btn.style.background = '#4ade80';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'Enviar mensagem';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});
