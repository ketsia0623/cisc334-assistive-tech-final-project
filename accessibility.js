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

  const style = document.createElement('style');
  style.id = 'hc-style';
  style.textContent = `
    body.hc-mode { background: #000 !important; color: #fff !important; }
    body.hc-mode header, body.hc-mode footer { background: #000 !important; border-color: #333 !important; }
    body.hc-mode .hero, body.hc-mode .section-pad { background: #000 !important; }
    body.hc-mode .game-card, body.hc-mode .card { background: #111 !important; border-color: #444 !important; color: #fff !important; }
    body.hc-mode a, body.hc-mode h1, body.hc-mode h2, body.hc-mode h3, body.hc-mode p { color: #fff !important; }
    body.hc-mode .btn, body.hc-mode .btn-primary { background: #fff !important; color: #000 !important; }
    body.hc-mode *:focus-visible { outline: 3px solid #fff !important; }
  `;
  document.head.appendChild(style);

  if (localStorage.getItem(HC_KEY) === 'on') {
    document.body.classList.add('hc-mode');
  }

  function createButton() {
    const isOn = document.body.classList.contains('hc-mode');
    const btn = document.createElement('button');
    btn.id = 'hc-toggle';
    
    btn.style.cssText = `
      position: fixed; bottom: 1rem; right: 1rem; z-index: 9999;
      padding: 10px 16px; border: 2px solid #333; background: #fff; color: #000;
      font-family: sans-serif; font-size: 14px; cursor: pointer; border-radius: 4px;
    `;

    btn.innerText = isOn ? 'Turn Off High Contrast' : 'Turn On High Contrast';

    btn.addEventListener('click', () => {
      const nowOn = document.body.classList.toggle('hc-mode');
      localStorage.setItem(HC_KEY, nowOn ? 'on' : 'off');
      btn.innerText = nowOn ? 'Turn Off High Contrast' : 'Turn On High Contrast';
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();