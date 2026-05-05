/* ─────────────────────────────────────────────
   MindBloom — Shared Accessibility Script
   Handles high-contrast mode across all pages.
   Pressing the toggle switches to a pure black
   background with white text (and back).
   The preference is saved in localStorage so it
   persists when the user navigates between pages.
───────────────────────────────────────────── */

(function () {
  const HC_KEY = 'mindbloom-hc-mode';

  /* ── Inject the high-contrast CSS override ── */
  const style = document.createElement('style');
  style.id = 'hc-style';
  style.textContent = `
    /* High-contrast mode — pure black bg, white text */
    body.hc-mode {
      background: #000 !important;
      color: #fff !important;
    }
    body.hc-mode header,
    body.hc-mode footer {
      background: #000 !important;
      border-color: #333 !important;
    }
    body.hc-mode .hero {
      background: #000 !important;
    }
    body.hc-mode #games-section {
      background: #000 !important;
    }
    body.hc-mode .game-card {
      background: #111 !important;
      border-color: #444 !important;
      color: #fff !important;
    }
    body.hc-mode .game-card:hover {
      background: #1a1a1a !important;
    }
    body.hc-mode .card-title,
    body.hc-mode .card-number,
    body.hc-mode .card-tag,
    body.hc-mode .card-desc,
    body.hc-mode .card-cta {
      color: #fff !important;
    }
    body.hc-mode .card-topline {
      background: #fff !important;
    }
    body.hc-mode .games-title,
    body.hc-mode .games-sub,
    body.hc-mode .section-eyebrow {
      color: #fff !important;
    }
    body.hc-mode .section-eyebrow::before {
      background: #fff !important;
    }
    body.hc-mode .logo,
    body.hc-mode nav a {
      color: #fff !important;
    }
    body.hc-mode .logo-mark {
      border-color: #fff !important;
    }
    body.hc-mode .hero-title,
    body.hc-mode .hero-title em,
    body.hc-mode .hero-body,
    body.hc-mode .hero-label,
    body.hc-mode .frame-caption,
    body.hc-mode .stat-num,
    body.hc-mode .stat-lbl,
    body.hc-mode .footer-logo,
    body.hc-mode .footer-note {
      color: #fff !important;
    }
    body.hc-mode .chip {
      color: #fff !important;
      border-color: #555 !important;
    }
    body.hc-mode .btn-primary {
      background: #fff !important;
      color: #000 !important;
    }
    body.hc-mode .btn-ghost {
      color: #ccc !important;
    }
    body.hc-mode .nav-cta {
      background: #fff !important;
      color: #000 !important;
    }
    body.hc-mode .hero-wave svg path {
      fill: #000 !important;
    }
    body.hc-mode .hero-plant-frame {
      border-color: #444 !important;
    }
    body.hc-mode .corner--tl,
    body.hc-mode .corner--tr,
    body.hc-mode .corner--bl,
    body.hc-mode .corner--br {
      border-color: #666 !important;
    }
    body.hc-mode .hero-stats {
      border-color: #333 !important;
    }
    body.hc-mode .stat {
      border-color: #333 !important;
    }
    body.hc-mode .games-grid {
      background: #333 !important;
      border-color: #333 !important;
    }
    body.hc-mode .footer-nav a {
      color: #ccc !important;
    }
    /* Focus rings always visible */
    body.hc-mode *:focus-visible {
      outline: 3px solid #fff !important;
      outline-offset: 3px !important;
    }
    /* Keep the toggle button itself clean */
    body.hc-mode #hc-toggle {
      background: #fff !important;
      color: #000 !important;
      border-color: #fff !important;
    }
  `;
  document.head.appendChild(style);

  /* ── Apply saved preference immediately (before paint) ── */
  if (localStorage.getItem(HC_KEY) === 'on') {
    document.body.classList.add('hc-mode');
  }

  /* ── Build the toggle button ── */
  function createButton() {
    const isOn = document.body.classList.contains('hc-mode');

    const btn = document.createElement('button');
    btn.id = 'hc-toggle';
    btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    btn.setAttribute('aria-label', isOn ? 'Switch to normal contrast mode' : 'Switch to high contrast mode: black background, white text');
    btn.title = 'Toggle high contrast mode';

    btn.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 30px;
      border: 2px solid #8ab86a;
      background: #111;
      color: #c8dab4;
      font-family: 'Epilogue', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      transition: background 0.2s, color 0.2s, transform 0.15s;
      line-height: 1;
      letter-spacing: 0.04em;
    `;

    updateLabel(btn, isOn);

    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.05)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });

    btn.addEventListener('click', () => {
      const nowOn = document.body.classList.toggle('hc-mode');
      localStorage.setItem(HC_KEY, nowOn ? 'on' : 'off');
      btn.setAttribute('aria-pressed', nowOn ? 'true' : 'false');
      btn.setAttribute('aria-label', nowOn
        ? 'Switch to normal contrast mode'
        : 'Switch to high contrast mode: black background, white text');
      updateLabel(btn, nowOn);
      announce(nowOn ? 'High contrast mode on' : 'Normal contrast mode on');
    });

    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });

    document.body.appendChild(btn);
  }

  function updateLabel(btn, isOn) {
    btn.innerHTML = isOn
      ? '<span aria-hidden="true" style="font-size:15px;">◑</span> Normal'
      : '<span aria-hidden="true" style="font-size:15px;">◑</span> High contrast';
  }

  /* ── Screen reader live announcement ── */
  function announce(msg) {
    let el = document.getElementById('hc-announce');
    if (!el) {
      el = document.createElement('div');
      el.id = 'hc-announce';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
      document.body.appendChild(el);
    }
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = msg; });
  }

  /* ── Wait for DOM then insert button ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();