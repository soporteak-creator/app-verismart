/* =========================================
   main.js – Lógica VeriSmart Pitch
   ========================================= */

'use strict';

let data = null;

/* =========================================
   DATA LOADING
   ========================================= */
async function loadData() {
  try {
    const res = await fetch('/data/verismart.json');
    data = await res.json();
    buildPage();
  } catch (e) {
    console.warn('Data load failed, using inline fallback');
    buildPage();
  }
}

/* =========================================
   PAGE BUILDER
   ========================================= */
function buildPage() {
  buildComparison();
  buildRoadmap();
  buildCostCards();
  buildImprovements();
  initAnimations();
  staggerReveal('.hero__content > *', 160);
}

/* ---- Comparison Table ---- */
function buildComparison() {
  const tbody = document.getElementById('comparison-tbody');
  if (!tbody || !data) return;

  const metrics = [
    { key: 'costo_mensual', label: 'Costo mensual (USD)', format: v => '$' + v + '/mo' },
    { key: 'ram_gb', label: 'RAM disponible', format: v => v + ' GB' },
    { key: 'escalabilidad', label: 'Escalabilidad (0-10)', format: v => v + '/10' },
    { key: 'facilidad_deploy', label: 'Facilidad de deploy (0-10)', format: v => v + '/10' },
    { key: 'docker_soporte', label: 'Soporte Docker', format: v => v ? '<span class="check">✓</span>' : '<span class="cross">✗</span>' },
  ];

  const providers = data.comparison.providers;
  const mData = data.comparison.metrics;
  const recommended = data.comparison.recommended;
  const recIdx = providers.indexOf(recommended);

  metrics.forEach(metric => {
    const tr = document.createElement('tr');
    let html = `<td style="font-weight:600;color:var(--text-primary)">${metric.label}</td>`;
    providers.forEach((p, i) => {
      const val = mData[metric.key][i];
      const isRec = i === recIdx;
      html += `<td class="${isRec ? 'highlight' : ''}">${metric.format(val)}</td>`;
    });
    tr.innerHTML = html;
    tbody.appendChild(tr);
  });

  // Header recommended badge
  const ths = document.querySelectorAll('#comparison-thead th');
  ths.forEach((th, i) => {
    if (i > 0 && providers[i - 1] === recommended) {
      th.classList.add('highlight');
      th.innerHTML += ' <span style="font-size:0.65rem;display:block;font-weight:500;opacity:0.85">★ Recomendado</span>';
    }
  });
}

/* ---- Roadmap ---- */
function buildRoadmap() {
  const container = document.getElementById('roadmap-container');
  if (!container || !data) return;

  data.roadmap.forEach((phase, idx) => {
    const item = document.createElement('div');
    item.className = 'roadmap__item';
    item.style.setProperty('--phase-color', phase.color);

    const tasksHTML = phase.tasks.map(t =>
      `<div class="roadmap__task">${t}</div>`
    ).join('');

    item.innerHTML = `
      <div class="roadmap__dot" style="background:${phase.color};box-shadow:0 0 0 3px ${phase.color}40"></div>
      <div class="roadmap__weeks">${phase.weeks} · ${phase.duration}</div>
      <div class="phase-pill" style="background:${phase.color}">Fase ${phase.phase}: ${phase.title}</div>
      <div class="roadmap__tasks mt-xl">${tasksHTML}</div>
    `;
    container.appendChild(item);
  });

  // Re-init roadmap observer (data was injected after DOMContentLoaded)
  if (typeof initRoadmap === 'function') initRoadmap();
}

/* ---- Cost Cards ---- */
function buildCostCards() {
  if (!data) return;
  renderCostCard('cost-current', data.costComparison.current, false);
  renderCostCard('cost-proposed', data.costComparison.proposed, true);
}

function renderCostCard(id, costData, isProposed) {
  const el = document.getElementById(id);
  if (!el) return;

  const itemsHTML = costData.items.map(item => `
    <div class="cost-item">
      <span class="cost-item__name">${item.name}</span>
      <span class="cost-item__amount">${item.cost === 0 ? 'Gratis' : '$' + item.cost + '/mo'}</span>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="cost-card__header">
      <span>${costData.label}</span>
      ${isProposed ? '<span class="badge badge--success">Propuesto</span>' : '<span class="badge badge--danger">Actual</span>'}
    </div>
    <div class="cost-card__items">${itemsHTML}</div>
    <div class="cost-total">
      <span class="cost-total__label">Total mensual</span>
      <span class="cost-total__value">$${costData.total}<span style="font-size:1rem;font-weight:500">/mo</span></span>
    </div>
    <p class="cost-note">${costData.note}</p>
  `;
}

/* ---- Improvements ---- */
function buildImprovements() {
  const grid = document.getElementById('improvements-grid');
  if (!grid || !data) return;

  data.improvements.forEach(item => {
    const card = document.createElement('div');
    card.className = 'improvement-card will-change';
    card.innerHTML = `
      <div class="improvement-card__icon">${item.icon}</div>
      <div class="improvement-card__title">${item.title}</div>
      <div class="improvement-card__desc">${item.description}</div>
    `;
    grid.appendChild(card);
  });
}

/* =========================================
   GSAP ANIMATIONS
   ========================================= */
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ---- Generic fade-in sections ----
  gsap.utils.toArray('.gsap-fade-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ---- Stagger children ----
  gsap.utils.toArray('.gsap-stagger').forEach(parent => {
    const children = parent.children;
    gsap.fromTo(children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ---- Pin: Problem Section ----
  const problemSection = document.querySelector('#section-problems');
  if (problemSection) {
    const problemCards = problemSection.querySelectorAll('.problem-card');
    problemCards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }

  // ---- Pin: KPI Section ----
  const kpiSection = document.querySelector('#section-kpis');
  if (kpiSection) {
    ScrollTrigger.create({
      trigger: kpiSection,
      start: 'top top',
      end: '+=600',
      pin: true,
      scrub: 1,
    });

    gsap.fromTo(kpiSection.querySelectorAll('.kpi-card'),
      { opacity: 0, scale: 0.92, y: 20 },
      {
        opacity: 1, scale: 1, y: 0,
        stagger: 0.12,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: kpiSection,
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // ---- Comparison table rows ----
  const tableRows = document.querySelectorAll('#comparison-tbody tr');
  tableRows.forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0,
        delay: i * 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ---- Pin: Closing section ----
  const closingSection = document.querySelector('#section-closing');
  if (closingSection) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: closingSection,
        start: 'top top',
        end: '+=800',
        pin: true,
        scrub: 1,
      }
    });

    tl.fromTo('.closing-logo', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 })
      .fromTo('.closing-tagline', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.3)
      .fromTo('.closing-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.5);
  }

  // ---- Improvement cards stagger ----
  const impGrid = document.getElementById('improvements-grid');
  if (impGrid) {
    gsap.fromTo(impGrid.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: impGrid,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // ---- Stack layers ----
  gsap.fromTo('.stack-layer',
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.stack-diagram',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  // ---- Chart init ----
  if (typeof initGrowthChart === 'function') {
    initGrowthChart(
      'resource-chart',
      ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
      [55, 62, 69, 74, 79, 84, 90],
      'Uso de recursos (%)',
      '#E53E3E'
    );
  }
}

/* =========================================
   INIT
   ========================================= */
document.addEventListener('DOMContentLoaded', loadData);
