/* ─────────────────────────────────────────────
   MindBloom — Shared Accessibility Script
   Handles high-contrast mode across all pages.
   The preference is saved in localStorage so it
   persists when the user navigates between pages.
───────────────────────────────────────────── */
 
(function () {
  const BW_KEY = 'mindbloom-bw-mode';
 
  /* ── Inject the high-contrast CSS override ── */
  const style = document.createElement('style');
  style.id = 'bw-style';
  style.textContent = `
    /* High-contrast mode — black background, white text, no color filtering */
    body.bw-mode,
    body.bw-mode * {
      background-color: #000000 !important;
      color: #ffffff !important;
      border-color: #ffffff !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
 
    /* Preserve images and media (don't invert them) */
    body.bw-mode img,
    body.bw-mode video,
    body.bw-mode canvas,
    body.bw-mode svg {
      filter: grayscale(100%) contrast(1.2) !important;
    }
 
    /* Links should be clearly distinguishable */
    body.bw-mode a,
    body.bw-mode a * {
      color: #ffff00 !important;
      text-decoration: underline !important;
    }
 
    /* Buttons: white background, black text for max contrast */
    body.bw-mode button,
    body.bw-mode [role="button"],
    body.bw-mode input[type="button"],
    body.bw-mode input[type="submit"],
    body.bw-mode button *,
    body.bw-mode [role="button"] * {
      background-color: #ffffff !important;
      color: #000000 !important;
      border: 2px solid #ffffff !important;
    }
 
    /* Inputs and form fields */
    body.bw-mode input,
    body.bw-mode textarea,
    body.bw-mode select {
      background-color: #000000 !important;
      color: #ffffff !important;
      border: 2px solid #ffffff !important;
    }
 
    /* The toggle button itself — keep it distinct */
    body.bw-mode #bw-toggle,
    body.bw-mode #bw-toggle * {
      background-color: #000000 !important;
      color: #ffffff !important;
      border: 2px solid #ffffff !important;
    }
 
    /* Focus rings — thick and visible */
    body.bw-mode *:focus-visible {
      outline: 3px solid #ffff00 !important;
      outline-offset: 2px !important;
    }
 
    /* Cards / panels */
    body.bw-mode [class*="card"],
    body.bw-mode [class*="panel"],
    body.bw-mode [class*="modal"],
    body.bw-mode [class*="dropdown"] {
      background-color: #000000 !important;
      border: 1px solid #ffffff !important;
    }
  `;
  document.head.appendChild(style);
 
  /* ── Apply saved preference immediately (before paint) ── */
  if (localStorage.getItem(BW_KEY) === 'on') {
    document.body.classList.add('bw-mode');
  }
 
  /* ── Build the toggle button ── */
  function createButton() {
    const isOn = document.body.classList.contains('bw-mode');
 
    const btn = document.createElement('button');
    btn.id = 'bw-toggle';
    btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    btn.setAttribute('aria-label', isOn ? 'Switch to color mode' : 'Switch to high contrast mode for easier reading');
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
      border: 2px solid #97C459;
      background: #173404;
      color: #C0DD97;
      font-family: 'Nunito', sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      transition: background 0.2s, color 0.2s, transform 0.15s;
      line-height: 1;
    `;
 
    updateLabel(btn, isOn);
 
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.05)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });
 
    btn.addEventListener('click', () => {
      const nowOn = document.body.classList.toggle('bw-mode');
      localStorage.setItem(BW_KEY, nowOn ? 'on' : 'off');
      btn.setAttribute('aria-pressed', nowOn ? 'true' : 'false');
      btn.setAttribute('aria-label', nowOn ? 'Switch to color mode' : 'Switch to high contrast mode for easier reading');
      updateLabel(btn, nowOn);
 
      /* Announce change to screen readers */
      announce(nowOn ? 'High contrast mode on' : 'Color mode on');
    });
 
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
 
    document.body.appendChild(btn);
  }
 
  function updateLabel(btn, isOn) {
    btn.innerHTML = isOn
      ? '<span aria-hidden="true" style="font-size:16px;">🎨</span> Color mode'
      : '<span aria-hidden="true" style="font-size:16px;">⬛</span> High contrast';
  }
 
  /* ── Screen reader live announcement ── */
  function announce(msg) {
    let el = document.getElementById('bw-announce');
    if (!el) {
      el = document.createElement('div');
      el.id = 'bw-announce';
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