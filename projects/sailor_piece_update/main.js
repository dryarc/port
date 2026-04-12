/* ═══════════════════════════════════════════════
   SAILOR PIECE — MASSIVE UPDATE  |  main.js
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Scroll Reveal ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── Video preview on hover ── */
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

  /* ── Modal ── */
  const backdrop  = document.getElementById('modal');
  const modalVid  = document.getElementById('modalVideo');

  window.openModal = function (src) {
    if (!backdrop || !modalVid) return;
    modalVid.src = src;
    modalVid.play().catch(() => {});
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    if (!backdrop || !modalVid) return;
    backdrop.classList.remove('open');
    modalVid.pause();
    modalVid.src = '';
    document.body.style.overflow = '';
  };

  backdrop && backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) window.closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeModal();
  });
})();
