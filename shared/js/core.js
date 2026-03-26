/* =========================================
   VERISMART PITCH — CORE.JS
   Shared functions: counters, video, progress
   ========================================= */

'use strict';

/* === Progress Bar === */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* === Animated Counter === */
function animateCounter(el, from, to, duration, decimals, suffix, prefix) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out expo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value = from + (to - from) * ease;
    const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    el.innerHTML = (prefix || '') + formatted + '<span class="suffix">' + (suffix || '') + '</span>';
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* === Init All KPI Counters === */
function initCounters() {
  const cards = document.querySelectorAll('[data-counter]');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const el = entry.target.querySelector('.kpi-card__value');
        if (!el) return;
        const to = parseFloat(el.dataset.value);
        const dec = parseInt(el.dataset.decimals || '0');
        const suf = el.dataset.suffix || '';
        const pre = el.dataset.prefix || '';
        animateCounter(el, 0, to, 1800, dec, suf, pre);
      }
    });
  }, { threshold: 0.4 });

  cards.forEach(c => observer.observe(c));
}

/* === Video IntersectionObserver === */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('.phone-mockup video, [data-autoplay]');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.3 });

  videos.forEach(v => {
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    observer.observe(v);
  });
}

/* === Card Video Hover === */
function initCardVideoHover() {
  const cards = document.querySelectorAll('[data-video-hover]');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

/* === Score Bars Animation === */
function initScoreBars() {
  const bars = document.querySelectorAll('.score-fill[data-score]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const score = bar.dataset.score;
        setTimeout(() => { bar.style.width = score + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

/* === Smooth Anchor Navigation === */
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* === Active Nav Highlight === */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav__links a[href^="#"]');
  if (!navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* === Load JSON Data === */
async function loadData(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load: ' + path);
    return await res.json();
  } catch (err) {
    console.warn('Data load error:', err);
    return null;
  }
}

/* === Init All === */
function initCore() {
  initProgressBar();
  initCounters();
  initVideoAutoplay();
  initCardVideoHover();
  initScoreBars();
  initSmoothNav();
  initActiveNav();
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCore);
} else {
  initCore();
}

// Export for use in main.js
window.VSCore = { loadData, animateCounter };
