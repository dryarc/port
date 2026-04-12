/* ═══════════════════════════════════════════════
   SAILOR PIECE — MASSIVE UPDATE  |  main.js
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════
     PARTICLES — floating orbs in background
  ════════════════════════════════════════════ */
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(124,92,252,',
    'rgba(0,212,255,',
    'rgba(232,200,122,',
  ];

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.8 + 0.4;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = -Math.random() * 0.4 - 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 120;
    this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  Particle.prototype.draw = function () {
    const progress = this.life / this.maxLife;
    const alpha = progress < 0.2
      ? progress / 0.2
      : progress > 0.8
        ? (1 - progress) / 0.2
        : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.col + (alpha * 0.55) + ')';
    ctx.fill();
  };

  for (let i = 0; i < 90; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger starts
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.life += 1;
      if (p.life > p.maxLife) p.reset();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  /* ════════════════════════════════════════════
     SCROLL REVEAL — staggered per batch
  ════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ════════════════════════════════════════════
     COUNTER ANIMATION — stat numbers roll up
  ════════════════════════════════════════════ */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur    = 900;
        const start  = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // ease-out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => counterObserver.observe(el));

  /* ════════════════════════════════════════════
     VIDEO HOVER PREVIEW
  ════════════════════════════════════════════ */
  document.querySelectorAll('.entry-media').forEach((media) => {
    const video = media.querySelector('video');
    if (!video) return;

    media.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    media.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  /* ════════════════════════════════════════════
     VIDEO MODAL
     - reads src from data-video on .entry-media
     - click anywhere on the media panel opens modal
  ════════════════════════════════════════════ */
  const backdrop = document.getElementById('modal');
  const modalVid = document.getElementById('modalVideo');

  window.openModal = function (src) {
    if (!backdrop || !modalVid) return;
    modalVid.pause();
    modalVid.src = src;
    modalVid.load();
    modalVid.play().catch(() => {});
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    if (!backdrop || !modalVid) return;
    backdrop.classList.remove('open');
    modalVid.pause();
    modalVid.removeAttribute('src');
    modalVid.load();
    document.body.style.overflow = '';
  };

  /* Bind click on every .entry-media using data-video attr */
  document.querySelectorAll('.entry-media[data-video]').forEach((media) => {
    media.addEventListener('click', () => {
      window.openModal(media.dataset.video);
    });

    /* cursor hint */
    media.style.cursor = 'pointer';
  });

  /* Close on backdrop click */
  backdrop && backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) window.closeModal();
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeModal();
  });

  /* ════════════════════════════════════════════
     ENTRY HOVER SHIMMER — ripple on mouse enter
  ════════════════════════════════════════════ */
  document.querySelectorAll('.entry, .entry-featured, .qol-entry').forEach((el) => {
    el.addEventListener('mouseenter', (e) => {
      el.classList.add('shimmer-active');
    });
    el.addEventListener('mouseleave', () => {
      el.classList.remove('shimmer-active');
    });
  });

  /* ════════════════════════════════════════════
     PARALLAX — subtle hero image drift on scroll
  ════════════════════════════════════════════ */
  const heroCover = document.querySelector('.hero-cover');

  if (heroCover) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroCover.style.transform = `scale(1.04) translateY(${scrollY * 0.18}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

})();
