/* ─────────────────────────────────────────────
   MindBloom — Shared Accessibility Script
   Handles black & white mode across all pages.
   The preference is saved in localStorage so it
   persists when the user navigates between pages.
───────────────────────────────────────────── */
 
(function () {
  const BW_KEY = 'mindbloom-bw-mode';
 
  /* ── Inject the B&W CSS override ── */
  const style = document.createElement('style');
  style.id = 'bw-style';
  style.textContent = `
    /* Black & white mode — overrides all colour variables */
    body.bw-mode {
      filter: grayscale(100%) contrast(1.25);
    }
    /* Make the toggle button stand out even in B&W mode */
    body.bw-mode #bw-toggle {
      background: #000 !important;
      color: #fff !important;
      border: 2px solid #fff !important;
      filter: none !important;  /* don't double-apply grayscale to the button */
    }
    /* Ensure focus rings are visible in B&W */
    body.bw-mode *:focus-visible {
      outline: 3px solid #000 !important;
      outline-offset: 2px !important;
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
    btn.setAttribute('aria-label', isOn ? 'Switch to colour mode' : 'Switch to black and white mode for easier reading');
    btn.title = 'Toggle black & white mode';
 
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
      btn.setAttribute('aria-label', nowOn ? 'Switch to colour mode' : 'Switch to black and white mode for easier reading');
      updateLabel(btn, nowOn);
 
      /* Announce change to screen readers */
      announce(nowOn ? 'Black and white mode on' : 'Colour mode on');
    });
 
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
 
    document.body.appendChild(btn);
  }
 
  function updateLabel(btn, isOn) {
    btn.innerHTML = isOn
      ? '<span aria-hidden="true" style="font-size:16px;">🎨</span> Colour mode'
      : '<span aria-hidden="true" style="font-size:16px;">⬛</span> B&amp;W mode';
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