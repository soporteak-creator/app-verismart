/* =============================================================
   SHARED / CORE.JS — Counters, video autoplay, progress bar
   ============================================================= */

'use strict';

/* ── Progress bar ── */
export function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = window.scrollY;
    const total = doc.scrollHeight - doc.clientHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
}

/* ── Animated counter ── */
export function animateCounter(el, target, duration = 1800, suffix = '') {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
    const value = target * ease;
    el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
  };
  requestAnimationFrame(update);
}

/* ── Init all counters when they enter viewport ── */
export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = '1';
        const target   = parseFloat(entry.target.dataset.counter);
        const suffix   = entry.target.dataset.suffix  || '';
        const duration = parseInt(entry.target.dataset.duration) || 1800;
        animateCounter(entry.target, target, duration, suffix);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── Video autoplay on viewport enter (phone mockups) ── */
export function initVideoAutoplay() {
  const videos = document.querySelectorAll('.phone__screen video, [data-autoplay]');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 });

  videos.forEach(v => {
    v.muted = true;
    v.loop  = true;
    v.playsInline = true;
    observer.observe(v);
  });
}

/* ── Video hover play (cards) ── */
export function initVideoHover() {
  document.querySelectorAll('[data-video-hover]').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    if (!video) return;
    video.muted = true;
    video.loop  = true;
    video.playsInline = true;
    wrapper.addEventListener('mouseenter', () => video.play().catch(() => {}));
    wrapper.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

/* ── Sticky nav shadow on scroll ── */
export function initNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Tab indicator update ── */
export function setActiveTab(tabs, index) {
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
}

/* ── Smooth scroll for anchor links ── */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Init chart when in viewport ── */
export function initChartOnScroll(canvasId, createFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  let created = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !created) {
      created = true;
      createFn(canvas);
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);
}
