// Docs site: theme toggle, shared with the app's preference when the browser allows it.
(() => {
  const root = document.documentElement;
  const key = 'yoko-prototype-theme';
  try {
    const saved = localStorage.getItem(key);
    if (saved) root.dataset.theme = saved;
  } catch {
    // Storage blocked: keep the light theme.
  }
  const toggle = document.getElementById('theme-toggle');
  const sync = () => toggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    sync();
    try {
      localStorage.setItem(key, root.dataset.theme);
    } catch {
      // Storage blocked: the theme just isn't remembered.
    }
  });
  sync();
})();
