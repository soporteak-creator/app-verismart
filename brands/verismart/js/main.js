/* =========================================
   VERISMART — MAIN.JS
   GSAP + ScrollTrigger animations
   Data loading + Chart.js rendering
   ========================================= */

'use strict';

const DATA_PATH = '../../data/verismart.json';

/* ─── GSAP Registration ─── */
gsap.registerPlugin(ScrollTrigger);

/* ─── Data Load & Bootstrap ─── */
async function bootstrap() {
  const data = await window.VSCore.loadData(DATA_PATH);
  if (!data) { console.error('Data not loaded'); return; }

  populateKPIs(data.kpis);
  populateRoadmap(data.roadmap);
  populateImprovements(data.improvements);
  populateComparison(data.comparison);
  populateProblems(data.problems);

  // init after DOM fill
  requestAnimationFrame(() => {
    initHeroAnim();
    initScrollAnimations();
    initCharts(data.comparison);
    initClosingAnim();
  });
}

/* ─── Populate KPIs ─── */
function populateKPIs(kpis) {
  const grid = document.getElementById('kpi-grid');
  if (!grid || !kpis) return;
  grid.innerHTML = kpis.map(k => `
    <div class="kpi-card" data-counter>
      <div class="kpi-card__value"
           data-value="${k.value}"
           data-decimals="${Number.isInteger(k.value) ? 0 : 1}"
           data-suffix="${k.suffix}"
           data-prefix="${k.prefix || ''}">
        ${k.prefix || ''}0<span class="suffix">${k.suffix}</span>
      </div>
      <div class="kpi-card__label">${k.label}</div>
    </div>
  `).join('');
}

/* ─── Populate Problems ─── */
function populateProblems(problems) {
  const grid = document.getElementById('problems-grid');
  if (!grid || !problems) return;
  grid.innerHTML = problems.map(p => `
    <div class="problem-card gsap-slide-up">
      <div class="problem-card__icon">${p.icon}</div>
      <div class="problem-card__title">${p.title}</div>
      <div class="problem-card__desc">${p.description}</div>
      <ul class="problem-card__list">
        ${p.details.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* ─── Populate Comparison Table ─── */
function populateComparison(comp) {
  const tbody = document.getElementById('compare-tbody');
  if (!tbody || !comp) return;
  tbody.innerHTML = comp.servers.map(s => `
    <tr class="${s.current ? 'current-row' : ''} ${s.recommended ? 'recommended-row' : ''}">
      <td>
        ${s.name}
        ${s.current ? '<span class="badge badge--danger" style="margin-left:6px">Actual</span>' : ''}
        ${s.recommended ? '<span class="recommended-tag">★ Recomendado</span>' : ''}
      </td>
      <td class="${s.recommended ? 'recommended-col' : ''}">$${s.monthly_cost}/mes</td>
      <td>${s.cpu}</td>
      <td>${s.ram}</td>
      <td>${s.autoscaling ? '<span class="check">✓</span>' : '<span class="cross">✗</span>'}</td>
      <td>${s.managed_db ? '<span class="check">✓</span>' : '<span class="cross">✗</span>'}</td>
      <td>
        <div class="score-bar">
          <div class="score-track">
            <div class="score-fill" data-score="${s.score}"></div>
          </div>
          <span style="font-size:.75rem;font-weight:600;color:var(--color-primary);min-width:2.5rem">${s.score}/100</span>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ─── Populate Roadmap ─── */
function populateRoadmap(roadmap) {
  const tl = document.getElementById('roadmap-timeline');
  if (!tl || !roadmap) return;
  tl.innerHTML = roadmap.map(p => `
    <div class="roadmap-phase gsap-slide-up">
      <div class="roadmap-phase__dot" style="background:${p.color}">${p.phase}</div>
      <div class="roadmap-phase__content">
        <div class="roadmap-phase__weeks">${p.weeks}</div>
        <div class="roadmap-phase__title">${p.title}</div>
        <ul class="roadmap-phase__tasks">
          ${p.tasks.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

/* ─── Populate Improvements ─── */
function populateImprovements(improvements) {
  const grid = document.getElementById('improvements-grid');
  if (!grid || !improvements) return;
  grid.innerHTML = improvements.map(item => `
    <div class="improvement-card gsap-slide-up">
      <div class="improvement-card__icon">${item.icon}</div>
      <div>
        <div class="improvement-card__title">${item.title}</div>
        <div class="improvement-card__desc">${item.desc}</div>
      </div>
    </div>
  `).join('');
}

/* ─── HERO Animation ─── */
function initHeroAnim() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-badge', { opacity: 0, y: -20, duration: 0.6 })
    .from('.hero-headline', { opacity: 0, y: 50, duration: 0.8 }, '-=0.3')
    .from('.hero-sub', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
    .from('.hero-stack', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.2')
    .from('.hero-visual', { opacity: 0, x: 60, duration: 1, ease: 'power2.out' }, '-=1.2');
}

/* ─── Scroll Animations ─── */
function initScrollAnimations() {

  // Generic slide-up batches
  ScrollTrigger.batch('.gsap-slide-up', {
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      overwrite: true
    }),
    start: 'top 88%'
  });

  // Section headlines
  document.querySelectorAll('.section-headline').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Stack layers stagger
  const stackLayers = document.querySelectorAll('.stack-layer');
  if (stackLayers.length) {
    gsap.from(stackLayers, {
      scrollTrigger: { trigger: '.stack-diagram', start: 'top 80%' },
      opacity: 0,
      x: -30,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }

  // KPI cards pop-in
  ScrollTrigger.batch('.kpi-card', {
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)' }
    ),
    start: 'top 85%'
  });

  // Roadmap phases
  document.querySelectorAll('.roadmap-phase').forEach((phase, i) => {
    gsap.from(phase, {
      scrollTrigger: { trigger: phase, start: 'top 85%' },
      opacity: 0,
      x: -50,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });

  // Comparison table rows
  ScrollTrigger.batch('#compare-tbody tr', {
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }
    ),
    start: 'top 88%'
  });

  // Pinned numbers section
  const numerosSection = document.getElementById('numeros');
  if (numerosSection) {
    ScrollTrigger.create({
      trigger: numerosSection,
      start: 'top top',
      end: '+=200',
      pin: true,
      pinSpacing: false
    });
  }
}

/* ─── Chart.js ─── */
function initCharts(comp) {
  const canvas = document.getElementById('cost-chart');
  if (!canvas || !comp) return;

  // Only init when in viewport
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      renderChart(canvas, comp);
    }
  }, { threshold: 0.3 });

  observer.observe(canvas);
}

function renderChart(canvas, comp) {
  const ctx = canvas.getContext('2d');

  // Animated entrance
  gsap.from(canvas.parentElement, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out'
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: comp.chart_labels,
      datasets: [
        {
          label: 'AWS Lightsail (actual)',
          data: comp.chart_lightsail,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#ef4444',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Railway (propuesto)',
          data: comp.chart_railway,
          borderColor: '#003087',
          backgroundColor: 'rgba(0,48,135,0.06)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#003087',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 1400,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: "'DM Sans', sans-serif", size: 13 },
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` $${ctx.parsed.y} USD/mes`
          },
          backgroundColor: 'rgba(15,23,42,0.9)',
          titleFont: { family: "'Syne', sans-serif", size: 13 },
          bodyFont: { family: "'DM Sans', sans-serif", size: 12 },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { family: "'DM Sans', sans-serif", size: 12 } }
        },
        y: {
          beginAtZero: false,
          min: 0,
          max: 100,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font: { family: "'DM Sans', sans-serif", size: 12 },
            callback: v => '$' + v
          }
        }
      }
    }
  });
}

/* ─── Closing Section Animation ─── */
function initClosingAnim() {
  const cierre = document.getElementById('cierre');
  if (!cierre) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cierre,
      start: 'top 60%',
      once: true
    }
  });

  tl.to('.cierre-logo', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    .to('.cierre-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('.cierre-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.3');

  // Set initial states
  gsap.set(['.cierre-logo', '.cierre-tagline', '.cierre-cta'], { y: 30 });
}

/* ─── Boot ─── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
