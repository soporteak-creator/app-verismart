/* =============================================================
   VERISMART / MAIN.JS — GSAP + ScrollTrigger animations
   ============================================================= */

'use strict';

import {
  initProgressBar,
  initCounters,
  initVideoAutoplay,
  initVideoHover,
  initNav,
  initSmoothScroll,
  initChartOnScroll
} from '../../../shared/js/core.js';

/* ── Data ── */
let data = null;

async function loadData() {
  const res  = await fetch('../../../data/verismart.json');
  data = await res.json();
}

/* ── GSAP setup ── */
function setupGSAP() {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  /* ─ Hero entrance ─ */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero__eyebrow',  { y: 24, opacity: 0, duration: .7 })
    .from('.hero__title',    { y: 40, opacity: 0, duration: .9 }, '-=.4')
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: .7 }, '-=.5')
    .from('.hero__actions',  { y: 20, opacity: 0, duration: .6 }, '-=.4')
    .from('.hero__scroll-hint', { opacity: 0, duration: .5 }, '-=.2');

  /* ─ Generic fade-up on sections ─ */
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.to(el, {
      y: 0, opacity: 1, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.slide-left').forEach(el => {
    gsap.to(el, {
      x: 0, opacity: 1, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.slide-right').forEach(el => {
    gsap.to(el, {
      x: 0, opacity: 1, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.fade-in').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: .9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  /* ─ Stagger for grid children ─ */
  document.querySelectorAll('.stagger-children').forEach(parent => {
    gsap.from(parent.children, {
      y: 32, opacity: 0, duration: .7, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: parent, start: 'top 82%', toggleActions: 'play none none none' }
    });
  });

  /* ─ Problem section — pinned ─ */
  const problemSection = document.querySelector('#problem');
  if (problemSection) {
    ScrollTrigger.create({
      trigger: problemSection,
      start: 'top top',
      end: '+=400',
      pin: false,
    });

    gsap.from('.problem-item', {
      x: -40, opacity: 0, duration: .6, stagger: .12, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.problem-list',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ─ Stack layers stagger ─ */
  gsap.from('.stack-layer', {
    y: 30, opacity: 0, duration: .6, stagger: .08, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.stack-diagram',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });

  /* ─ Code block ─ */
  gsap.from('.code-block', {
    y: 40, opacity: 0, duration: .9, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.code-block',
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });

  /* ─ Comparison table rows ─ */
  gsap.from('.compare-table tbody tr', {
    opacity: 0, x: -20, duration: .4, stagger: .06, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.compare-table',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  /* ─ Migration phases ─ */
  gsap.from('.migration-phase', {
    opacity: 0, y: 30, duration: .6, stagger: .15, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.migration-timeline',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  /* ─ Savings strip ─ */
  gsap.from('.savings-stat', {
    scale: .85, opacity: 0, duration: .6, stagger: .1, ease: 'back.out(1.6)',
    scrollTrigger: {
      trigger: '.savings-strip',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });

  /* ─ Closing section ─ */
  const closingSection = document.querySelector('#closing');
  if (closingSection) {
    const closingTl = gsap.timeline({
      scrollTrigger: {
        trigger: closingSection,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });
    closingTl
      .from('.closing-logo',         { scale: 1.3, opacity: 0, duration: 1, ease: 'power3.out' })
      .from('.closing-content > *',  { y: 30, opacity: 0, duration: .7, stagger: .12, ease: 'power3.out' }, '-=.5');
  }

  /* ─ KPI cards ─ */
  gsap.from('.kpi-card', {
    scale: .92, opacity: 0, duration: .6, stagger: .08, ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.kpi-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });
}

/* ── Chart ── */
function createCostChart(canvas) {
  if (!data || !window.Chart) return;
  const chart = data.growth_chart;
  new window.Chart(canvas, {
    type: 'line',
    data: {
      labels: chart.labels,
      datasets: [
        {
          label: 'AWS (actual)',
          data: chart.aws_cost,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239,68,68,.08)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#EF4444',
        },
        {
          label: 'Railway (propuesto)',
          data: chart.railway_cost,
          borderColor: '#1B3F8B',
          backgroundColor: 'rgba(27,63,139,.08)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#1B3F8B',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0C1D4A',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,.7)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()} USD`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,.05)' },
          ticks: { color: '#6B6860', font: { family: 'DM Sans', size: 12 } }
        },
        y: {
          grid: { color: 'rgba(0,0,0,.05)' },
          ticks: {
            color: '#6B6860',
            font: { family: 'DM Sans', size: 12 },
            callback: v => '$' + v.toLocaleString()
          },
          beginAtZero: true
        }
      }
    }
  });
}

/* ── Build DOM from data ── */
function buildPage() {
  /* Stack layers */
  const stackDiagram = document.querySelector('.stack-diagram');
  if (stackDiagram && data) {
    const layers = [
      data.stack_actual.frontend,
      data.stack_actual.backend,
      data.stack_actual.database,
      data.stack_actual.container,
      data.stack_actual.infra,
    ];
    stackDiagram.innerHTML = layers.map((l, i) => `
      <div class="stack-layer">
        <div class="stack-layer__icon">${l.icon}</div>
        <div class="stack-layer__name">${l.name}</div>
        ${l.version ? `<span class="stack-layer__version">v${l.version}</span>` : ''}
      </div>
      ${i < layers.length - 1 ? '<span class="stack-arrow">→</span>' : ''}
    `).join('');
  }

  /* KPI counters (problem section) */
  const problemMetrics = document.getElementById('problem-metrics');
  if (problemMetrics && data) {
    const m = data.problem_metrics;
    problemMetrics.innerHTML = `
      <div class="kpi-card">
        <span class="kpi-value" data-counter="${m.aws_monthly_cost}" data-suffix="" id="ctr-aws">0</span>
        <span class="kpi-label">Costo mensual AWS (USD)</span>
        <span class="kpi-delta kpi-delta--down">↑ Sube cada mes</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value" data-counter="${m.avg_latency_ms}" data-suffix="ms" id="ctr-lat">0ms</span>
        <span class="kpi-label">Latencia promedio (usuarios CL)</span>
        <span class="kpi-delta kpi-delta--down">↑ Alta para LatAm</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value" data-counter="${m.uptime_pct}" data-suffix="%" id="ctr-up">0%</span>
        <span class="kpi-label">Uptime reportado</span>
        <span class="kpi-delta kpi-delta--down">↓ Bajo el SLA objetivo</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value" data-counter="${m.deploy_time_min}" data-suffix="min" id="ctr-deploy">0min</span>
        <span class="kpi-label">Tiempo de deploy</span>
        <span class="kpi-delta kpi-delta--down">↑ Muy lento para iteración</span>
      </div>
    `;
  }

  /* Comparison table */
  const compTable = document.querySelector('.compare-table tbody');
  if (compTable && data) {
    const rows = [
      { label: 'Costo mensual (USD)', key: 'monthly_usd', fmt: v => `$${v.toLocaleString()}` },
      { label: 'Latencia (Chile)', key: 'latency_ms', fmt: v => `~${v}ms` },
      { label: 'Uptime SLA', key: 'uptime_pct', fmt: v => `${v}%` },
      { label: 'Región LatAm', key: 'region_latam', fmt: v => v ? '<span class="check">✓</span>' : '<span class="cross">✗</span>' },
      { label: 'Docker nativo', key: 'docker_native', fmt: v => v ? '<span class="check">✓</span>' : '<span class="cross">✗</span>' },
      { label: 'MongoDB gestionado', key: 'mongodb_managed', fmt: v => v ? '<span class="check">✓</span>' : '<span class="cross">✗</span>' },
      { label: 'Soporte', key: 'support', fmt: v => v },
    ];

    const providers = data.providers;
    compTable.innerHTML = rows.map(row => `
      <tr>
        <td><strong>${row.label}</strong></td>
        ${providers.map(p => `
          <td class="${p.highlight ? 'highlight' : ''} ${p.current ? 'current-provider' : ''}">
            ${row.fmt(p[row.key])}
          </td>
        `).join('')}
      </tr>
    `).join('');
  }

  /* Savings strip */
  const savingsStrip = document.querySelector('.savings-strip');
  if (savingsStrip && data) {
    const s = data.savings;
    savingsStrip.innerHTML = `
      <div class="savings-stat">
        <span class="savings-stat__value" data-counter="${s.savings_pct}" data-suffix="%" >0%</span>
        <span class="savings-stat__label">Ahorro en infraestructura</span>
      </div>
      <div class="savings-stat">
        <span class="savings-stat__value" data-counter="${s.savings_annual}" data-suffix="" >0</span>
        <span class="savings-stat__label">USD ahorrados al año</span>
      </div>
      <div class="savings-stat">
        <span class="savings-stat__value" data-counter="${s.proposed_annual}" data-suffix="" >0</span>
        <span class="savings-stat__label">Nuevo costo anual (USD)</span>
      </div>
    `;
  }

  /* Migration timeline */
  const migTimeline = document.querySelector('.migration-timeline');
  if (migTimeline && data) {
    migTimeline.innerHTML = data.migration_phases.map(phase => `
      <div class="migration-phase fade-up">
        <div class="migration-phase__number">${phase.phase}</div>
        <div class="migration-phase__content">
          <div class="migration-phase__title">${phase.title}</div>
          <div class="migration-phase__duration">⏱ ${phase.duration}</div>
          <div class="migration-phase__tasks">
            ${phase.tasks.map(t => `<div class="migration-phase__task">${t}</div>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  /* Closing savings amount */
  const closingAmount = document.querySelector('.closing-savings-amount');
  if (closingAmount && data) {
    closingAmount.dataset.counter = data.savings.savings_annual;
    closingAmount.textContent = '0';
  }
}

/* ── Init ── */
async function init() {
  await loadData();
  buildPage();

  initProgressBar();
  initCounters();
  initVideoAutoplay();
  initVideoHover();
  initNav();
  initSmoothScroll();
  initChartOnScroll('cost-chart', createCostChart);

  // Wait for GSAP to be available
  if (window.gsap && window.ScrollTrigger) {
    setupGSAP();
  } else {
    window.addEventListener('load', setupGSAP);
  }
}

document.addEventListener('DOMContentLoaded', init);
