/* =========================================================
   PAAM — Interaktionen & Animationen
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const onScroll = () => {
    if (window.scrollY > 32) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle?.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });

  // Auto-reveal everything that's a section heading / key block
  const toReveal = document.querySelectorAll(
    '.hero__title, .hero__lede, .hero__actions, .hero__meta, ' +
    '.editorial__quote, .editorial__sig, ' +
    '.scene__copy > *, ' +
    '.pakete__header > *, .paket, ' +
    '.calc__intro > *, .calc__slider-wrap, ' +
    '.risk__intro > *, .risk__panel, ' +
    '.pillar, .prozess__step, ' +
    '.about__text > *, .about__img, ' +
    '.voice, .faq__item, ' +
    '.kontakt__intro > *, .kontakt__form'
  );
  toReveal.forEach(el => { el.classList.add('reveal'); io.observe(el); });

  /* =========================================================
     Resilienz-Rechner
     ========================================================= */
  const slider = document.getElementById('peopleSlider');
  const peopleCount = document.getElementById('peopleCount');
  const peopleVisual = document.getElementById('peopleVisual');

  const waterEl  = document.getElementById('waterValue');
  const kcalEl   = document.getElementById('kcalValue');
  const spaceEl  = document.getElementById('spaceValue');
  const energyEl = document.getElementById('energyValue');

  const waterBar  = document.getElementById('waterBar');
  const kcalBar   = document.getElementById('kcalBar');
  const spaceBar  = document.getElementById('spaceBar');
  const energyBar = document.getElementById('energyBar');

  const PERSON_SVG = `<svg viewBox="0 0 22 30" fill="currentColor">
    <circle cx="11" cy="6" r="4"/>
    <path d="M4 28c0-5 3-9 7-9s7 4 7 9H4z"/>
  </svg>`;

  // Prepare 6 silhouettes
  if (peopleVisual) {
    for (let i = 0; i < 6; i++) {
      const d = document.createElement('div');
      d.className = 'calc__person';
      d.innerHTML = PERSON_SVG;
      peopleVisual.appendChild(d);
    }
  }

  const DAYS = 10;
  const MAX_PEOPLE = 6;

  // Formatiert Zahlen mit deutschem Punkt als Tausender-Trennzeichen
  const fmt = n => n.toLocaleString('de-DE');
  const fmtDec = (n, d = 1) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

  function animateNumber(el, from, to, suffix = '', duration = 700, decimals = 0) {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      el.innerHTML = (decimals ? fmtDec(v, decimals) : fmt(Math.round(v))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function updateCalc(newP) {
    const p = Number(newP);
    peopleCount.textContent = p;

    // Visual silhouettes
    if (peopleVisual) {
      peopleVisual.querySelectorAll('.calc__person').forEach((el, idx) => {
        el.classList.toggle('active', idx < p);
      });
    }

    // Bedarfe (realistisch, mit leichter Skalierung)
    const water  = 3 * DAYS * p;                     // Liter (3 L/Person/Tag)
    const kcal   = 2500 * DAYS * p;                  // kcal
    const space  = 0.35 * p;                         // m²
    const energy = 1.2 * p;                          // kWh pro 10 Tage Grundlast

    // Max-Werte für Balkenskala (6 Personen = 100%)
    const waterMax  = 3 * DAYS * MAX_PEOPLE;
    const kcalMax   = 2500 * DAYS * MAX_PEOPLE;
    const spaceMax  = 0.35 * MAX_PEOPLE;
    const energyMax = 1.2 * MAX_PEOPLE;

    waterBar.style.width  = (water  / waterMax  * 100) + '%';
    kcalBar.style.width   = (kcal   / kcalMax   * 100) + '%';
    spaceBar.style.width  = (space  / spaceMax  * 100) + '%';
    energyBar.style.width = (energy / energyMax * 100) + '%';

    waterEl.innerHTML  = `${fmt(water)} <small>Liter</small>`;
    kcalEl.innerHTML   = `${fmt(kcal)} <small>kcal</small>`;
    spaceEl.innerHTML  = `${fmtDec(space, 2)} <small>m² Stellfläche</small>`;
    energyEl.innerHTML = `${fmtDec(energy, 1)} <small>kWh Reserve</small>`;
  }

  if (slider) {
    slider.addEventListener('input', e => updateCalc(e.target.value));
    updateCalc(slider.value);
  }

  /* =========================================================
     Risiko-Check (PLZ, Dummy-Daten)
     Deterministisch auf Basis der PLZ — damit dieselbe PLZ
     jedes Mal dasselbe Ergebnis liefert.
     ========================================================= */
  const riskForm   = document.getElementById('riskForm');
  const plzInput   = document.getElementById('plzInput');
  const riskEmpty  = document.getElementById('riskEmpty');
  const riskResult = document.getElementById('riskResult');
  const resultPlz    = document.getElementById('resultPlz');
  const resultRegion = document.getElementById('resultRegion');
  const resultScore  = document.getElementById('resultScore');
  const resultMeta   = document.getElementById('resultMeta');
  const resultFactors= document.getElementById('resultFactors');

  // Grobe Regionen-Zuordnung anhand der ersten Ziffer der PLZ
  const PLZ_REGIONS = {
    '0': 'Dresden, Leipzig & Oberlausitz',
    '1': 'Berlin & Brandenburg',
    '2': 'Hamburg, Bremen & Niedersachsen Nord',
    '3': 'Hannover, Kassel & Mittelhessen',
    '4': 'Düsseldorf, Dortmund & Münsterland',
    '5': 'Köln, Bonn & Rhein-Main',
    '6': 'Frankfurt, Darmstadt & Saarpfalz',
    '7': 'Stuttgart, Karlsruhe & Alb-Donau',
    '8': 'München, Allgäu & Oberbayern',
    '9': 'Nürnberg, Erzgebirge & Oberfranken'
  };

  // Einfacher deterministischer Hash
  function hash(str, seed = 0) {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }
  const pseudo = (plz, factor) => (hash(plz + factor) % 1000) / 1000; // 0..1

  function levelFor(v) {
    if (v < 0.34) return 'low';
    if (v < 0.67) return 'medium';
    return 'high';
  }
  function labelFor(v) {
    if (v < 0.34) return 'Gering';
    if (v < 0.67) return 'Moderat';
    return 'Erhöht';
  }

  function analyse(plz) {
    const first = plz[0];
    const region = PLZ_REGIONS[first] || 'Ihre Region';

    // Vier Risikofaktoren, pseudo-zufällig aber deterministisch
    const factors = [
      { key: 'flood',   name: 'Hochwasserrisiko',       v: pseudo(plz, 'flood')  * 0.9 + 0.05 },
      { key: 'power',   name: 'Stromnetz-Instabilität', v: pseudo(plz, 'power')  * 0.9 + 0.05 },
      { key: 'storm',   name: 'Sturm & Extremwetter',   v: pseudo(plz, 'storm')  * 0.9 + 0.05 },
      { key: 'industry',name: 'Industrie- & Verkehrsrisiken', v: pseudo(plz, 'indu')   * 0.9 + 0.05 }
    ];

    // Durchschnittsrisiko → Resilienz-Index (invertiert, 0..100)
    const avgRisk = factors.reduce((s, f) => s + f.v, 0) / factors.length;
    const resilienceScore = Math.round((1 - avgRisk) * 100);

    return { region, factors, resilienceScore, avgRisk };
  }

  function renderRisk(plz) {
    const r = analyse(plz);

    resultPlz.textContent = plz;
    resultRegion.textContent = r.region;

    // Score
    resultScore.textContent = r.resilienceScore;
    resultScore.classList.remove('low','medium','high');
    // Bei Resilienz: hoch = gut
    if (r.resilienceScore >= 66) { resultScore.classList.add('low');  resultMeta.innerHTML = 'Ihre Region ist strukturell resilient aufgestellt.'; }
    else if (r.resilienceScore >= 40) { resultScore.classList.add('medium'); resultMeta.innerHTML = 'Moderate Exposition — gezielte Vorsorge empfehlenswert.'; }
    else { resultScore.classList.add('high'); resultMeta.innerHTML = 'Erhöhte Exposition — eine persönliche Analyse ist angeraten.'; }

    // Factors
    resultFactors.innerHTML = r.factors.map(f => {
      const lvl = levelFor(f.v);
      const pct = Math.round(f.v * 100);
      return `
        <div class="risk__factor">
          <div class="risk__factor-head"><span>${f.name}</span><span>${labelFor(f.v)}</span></div>
          <div class="risk__factor-bar"><div class="risk__factor-fill ${lvl}" style="width:0%"></div></div>
        </div>
      `;
    }).join('');

    // Show result, animate bars
    riskEmpty.style.display = 'none';
    riskResult.classList.add('show');

    // Animate score
    const startScore = 0, endScore = r.resilienceScore;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      resultScore.textContent = Math.round(startScore + (endScore - startScore) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Animate factor bars (slight stagger)
    requestAnimationFrame(() => {
      resultFactors.querySelectorAll('.risk__factor-fill').forEach((bar, i) => {
        const pct = Math.round(r.factors[i].v * 100);
        setTimeout(() => { bar.style.width = pct + '%'; }, 80 + i * 120);
      });
    });
  }

  if (riskForm) {
    // Nur Zahlen im PLZ-Feld
    plzInput.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });

    riskForm.addEventListener('submit', e => {
      e.preventDefault();
      const plz = plzInput.value.trim();
      if (plz.length < 4) {
        plzInput.style.borderColor = 'var(--danger)';
        plzInput.focus();
        setTimeout(() => { plzInput.style.borderColor = ''; }, 1200);
        return;
      }
      renderRisk(plz.padEnd(5, '0'));
    });
  }

  /* =========================================================
     FAQ Accordion
     ========================================================= */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Optional: single open at a time. Hier: multi-open zulassen.
      item.classList.toggle('open');
    });
  });

  /* =========================================================
     Contact form — nur visuell (keine Backend-Aktion)
     ========================================================= */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('cName').value.trim();
      const cont  = document.getElementById('cEmail').value.trim();
      if (!name || !cont) {
        [document.getElementById('cName'), document.getElementById('cEmail')].forEach(i => {
          if (!i.value.trim()) {
            i.style.borderBottomColor = 'var(--danger)';
            setTimeout(() => { i.style.borderBottomColor = ''; }, 1400);
          }
        });
        return;
      }
      contactForm.querySelector('button[type="submit"]').style.display = 'none';
      document.getElementById('contactThanks').classList.add('show');
    });
  }

  /* =========================================================
     Subtiler Parallax auf dem Hero-Bild
     ========================================================= */
  const heroImg = document.querySelector('.hero__img');
  if (heroImg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      heroImg.style.transform = `scale(1.06) translateY(${y * 0.12}px)`;
    }, { passive: true });
  }

})();
