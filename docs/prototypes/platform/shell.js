// Builds the app shell (sidebar and top bar) for every prototype, so the
// navigation lives in one place. Each page sets <body data-page="..."> and
// <body data-search="..."> and has <div class="app"><div class="app__main">.
(() => {
  const page = document.body.dataset.page;
  const root = document.documentElement;
  const mascot = '../../../client/public/mascot.svg';

  const stroke = (paths, width = 1.5) =>
    `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;

  const icons = {
    occurrences: stroke('<path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z"/><path d="m15.71 15.18-3.1-1.85c-.54-.32-.98-1.09-.98-1.72V7.51"/>'),
    places: stroke('<path d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z"/><path d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"/>'),
    links: stroke('<path d="M14.99 17.5h1.51c3.02 0 5.5-2.47 5.5-5.5 0-3.02-2.47-5.5-5.5-5.5h-1.51M9 6.5H7.5A5.51 5.51 0 0 0 2 12c0 3.02 2.47 5.5 5.5 5.5H9M8 12h8"/>'),
    notes: stroke('<path d="m21.66 10.44-.98 4.18c-.84 3.61-2.5 5.07-5.62 4.77-.5-.04-1.04-.13-1.62-.27l-1.68-.4c-4.17-.99-5.46-3.05-4.48-7.23l.98-4.19c.2-.85.44-1.59.74-2.2 1.17-2.42 3.16-3.07 6.5-2.28l1.67.39c4.19.98 5.47 3.05 4.49 7.23Z"/><path d="M15.06 19.39c-.62.42-1.4.77-2.35 1.08l-1.58.52c-3.97 1.28-6.06.21-7.35-3.76L2.5 13.28c-1.28-3.97-.22-6.07 3.75-7.35l1.58-.52c.41-.13.8-.24 1.17-.31-.3.61-.54 1.35-.74 2.2l-.98 4.19c-.98 4.18.31 6.24 4.48 7.23l1.68.4c.58.14 1.12.23 1.62.27ZM12.64 8.53l4.85 1.23M11.66 12.4l2.9.74"/>'),
    tasks: stroke('<path d="M12.37 8.88h5.25M6.38 8.88l.75.75 2.25-2.25M12.37 15.88h5.25M6.38 15.88l.75.75 2.25-2.25"/><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"/>'),
    mood: stroke('<path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"/><path d="M15.5 9.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8.5 9.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8.4 13.3h7.2c.5 0 .9.4.9.9 0 2.49-2.01 4.5-4.5 4.5s-4.5-2.01-4.5-4.5c0-.5.4-.9.9-.9Z"/>'),
    theme: stroke('<path d="M2.03 12.42c.36 5.15 4.73 9.34 9.96 9.57 3.69.16 6.99-1.56 8.97-4.27.82-1.12.38-1.87-.99-1.62-.67.12-1.36.17-2.08.14C13 16.04 9 11.82 8.98 6.68c-.01-1.38.28-2.69.8-3.88.57-1.32-.12-1.95-1.45-1.39C4.12 3.19 1.24 7.45 2.03 12.42Z"/>'),
    signOut: stroke('<path d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99M15 12H3.62M5.85 8.65 2.5 12l3.35 3.35"/>'),
    sun: stroke('<path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"/><path d="M19.14 19.14 19.01 19.01M19.01 4.99l.13-.13M4.86 19.14l.13-.13M12 2.08V2M12 22v-.08M2.08 12H2M22 12h-.08M4.99 4.99l-.13-.13"/>'),
    chevronLeft: stroke('<path d="M15 19.92 8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"/>'),
    chevronRight: stroke('<path d="m8.91 19.92 6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"/>'),
    routines: stroke('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>'),
    media: stroke('<path d="M2 9h20M7 3l2 6M15 3l2 6"/><path d="M6 21h12a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4Z"/><path d="M10 13.5v3.2c0 .5.5.8.9.5l2.6-1.6c.4-.3.4-.8 0-1.1l-2.6-1.6c-.4-.2-.9.1-.9.6Z"/>'),
    lists: stroke('<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>'),
    settings: stroke('<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9Z"/>'),
    search: stroke('<path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"/>'),
  };

  const modules = [
    { id: 'occurrences', label: 'Occurrences', href: 'occurrences.html', color: 'var(--blue)' },
    { id: 'places', label: 'Places', href: 'places.html', color: 'var(--yellow)' },
    { id: 'links', label: 'Links', href: 'links.html', color: 'var(--bg-cat-reading)' },
    { id: 'notes', label: 'Notes', href: 'notes.html', color: 'var(--blue)' },
    { id: 'tasks', label: 'Tasks', href: 'tasks.html', color: 'var(--blue)' },
    { id: 'mood', label: 'Mood history', href: 'mood.html', color: 'var(--blue)' },
    { id: 'routines', label: 'Routines', href: 'routines.html', color: 'var(--bg-cat-health)' },
    { id: 'media', label: 'Media', href: 'media.html', color: 'var(--bg-cat-work)' },
    { id: 'lists', label: 'Lists', href: 'lists.html', color: 'var(--bg-cat-home)' },
  ];

  // Each module has its own accent: Yoko's blue, or yellow on Places.
  const current = modules.find((m) => m.id === page);
  if (current?.color) root.style.setProperty('--module', current.color);

  // Theme: the preference (light, dark or system) and the theme it resolves to, remembered when the browser allows it.
  // Pages without the shell (login, landing, docs, 404) only read the resolved theme.
  const THEME_KEY = 'yoko-prototype-theme';
  const PREFERENCE_KEY = 'yoko-prototype-theme-preference';
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const store = {
    get: (key) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Storage blocked: the theme just isn't remembered.
      }
    },
  };
  const themes = ['light', 'dark', 'system'];
  let themePreference = [store.get(PREFERENCE_KEY), store.get(THEME_KEY)].find((t) => themes.includes(t)) ?? 'light';
  const applyTheme = () => {
    root.dataset.theme = themePreference === 'system' ? (systemDark.matches ? 'dark' : 'light') : themePreference;
    store.set(THEME_KEY, root.dataset.theme);
  };
  applyTheme();
  systemDark.addEventListener?.('change', () => themePreference === 'system' && applyTheme());
  window.YokoTheme = {
    preference: () => themePreference,
    set: (preference) => {
      if (!themes.includes(preference)) return;
      themePreference = preference;
      store.set(PREFERENCE_KEY, preference);
      applyTheme();
    },
  };

  const sidebar = document.createElement('aside');
  sidebar.className = 'c-sidebar';
  sidebar.setAttribute('aria-label', 'Main');
  sidebar.innerHTML = `
    <nav><ul>
      ${modules
        .map((m) => {
          const classes = ['c-sidebar__item', m.id === page && 'c-sidebar__item--active', m.soon && 'c-sidebar__item--soon']
            .filter(Boolean)
            .join(' ');
          const current = m.id === page ? ' aria-current="page"' : '';
          return `<li data-module="${m.id}"><a class="${classes}" href="${m.href}" data-label="${m.label}" aria-label="${m.label}"${current}>${icons[m.id]}</a></li>`;
        })
        .join('')}
    </ul></nav>
    <ul class="c-sidebar__bottom">
      <li><a class="c-sidebar__item${page === 'settings' ? ' c-sidebar__item--active' : ''}" href="settings.html" data-label="Settings" aria-label="Settings"${page === 'settings' ? ' aria-current="page"' : ''}>${icons.settings}</a></li>
      <li class="c-sidebar__theme"><button class="c-sidebar__item" type="button" id="theme-toggle" data-label="Switch theme" aria-label="Switch theme">${icons.theme}</button></li>
      <li><a class="c-sidebar__item" href="login.html" data-label="Sign out" aria-label="Sign out">${icons.signOut}</a></li>
    </ul>`;

  const topbar = document.createElement('header');
  topbar.className = 'c-topbar';
  topbar.innerHTML = `
    <a class="c-topbar__brand" href="home.html"><img src="${mascot}" alt="Yoko home"><span>Yoko!</span></a>
    <div class="c-topbar__status">
      <span class="c-topbar__greeting">${icons.sun}<span id="greeting"></span></span>
      <span class="c-topbar__mood" id="mood-phrase"></span>
    </div>
    <div class="c-topbar__actions">
      <div class="c-search" id="search-box">
        <button class="c-search__open" type="button" id="search-open" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">${icons.search}<span class="c-search__text" id="search-text">${document.body.dataset.search || 'Search'}</span><kbd class="c-search__kbd" id="search-shortcut"></kbd></button>
        <button class="c-search__clear" type="button" id="search-clear" aria-label="Clear the filter" hidden><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M18 6 6 18M6 6l12 12"/></svg></button>
        <input type="search" id="search" hidden>
      </div>
      <div class="c-mood">
        <button class="c-icon-btn" type="button" id="mood-toggle" aria-label="How are you feeling?" aria-expanded="false" aria-controls="mood-popover">${icons.mood}</button>
        <div class="c-mood__popover" id="mood-popover">
          <p>How are you feeling?</p>
          <div class="c-mood__picker">
            <button class="c-mood__arrow" type="button" id="mood-prev" aria-label="Previous moods">${icons.chevronLeft}</button>
            <div class="c-mood__viewport"><div class="c-mood__list" id="mood-list"></div></div>
            <button class="c-mood__arrow" type="button" id="mood-next" aria-label="More moods">${icons.chevronRight}</button>
          </div>
          <span class="c-mood__name" id="mood-name" aria-live="polite"></span>
          <form class="c-mood__note" id="mood-note" hidden>
            <label class="u-visually-hidden" for="mood-why">What’s happening?</label>
            <textarea id="mood-why" rows="3" maxlength="280" placeholder="What’s happening? (optional)"></textarea>
            <button class="c-button c-button--module" type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>`;

  const app = document.querySelector('.app');
  app.prepend(sidebar);
  app.querySelector('.app__main').prepend(topbar);

  // Modules the person chose to hide (Settings > Modules). Hiding only takes them out of the way; nothing is deleted.
  const HIDDEN_KEY = 'yoko-prototype-hidden-modules';
  const readHidden = () => {
    try {
      const saved = JSON.parse(store.get(HIDDEN_KEY) ?? '[]');
      return Array.isArray(saved) ? saved.filter((id) => modules.some((m) => m.id === id)) : [];
    } catch {
      return [];
    }
  };
  let hiddenModules = readHidden();
  const applyModules = () => {
    sidebar.querySelectorAll('[data-module]').forEach((item) => (item.hidden = hiddenModules.includes(item.dataset.module)));
    topbar.querySelector('.c-mood').hidden = hiddenModules.includes('mood');
    document.dispatchEvent(new CustomEvent('yoko:modules'));
  };
  applyModules();
  window.YokoModules = {
    all: modules.map(({ id, label, href }) => ({ id, label, href })),
    isVisible: (id) => !hiddenModules.includes(id),
    byHref: (href) => modules.find((m) => href.split(/[?#]/)[0] === m.href)?.id,
    setVisible: (id, visible) => {
      hiddenModules = visible ? hiddenModules.filter((h) => h !== id) : [...new Set([...hiddenModules, id])];
      store.set(HIDDEN_KEY, JSON.stringify(hiddenModules));
      applyModules();
    },
  };

  // Greeting by period of the day (decision 004, without the location).
  const hour = new Date().getHours();
  const period = hour < 5 ? 'It’s late' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${period}, Laura`;

  document.getElementById('theme-toggle').addEventListener('click', () => {
    window.YokoTheme.set(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const moodToggle = document.getElementById('mood-toggle');
  const moodPopover = document.getElementById('mood-popover');
  const moodList = document.getElementById('mood-list');
  const moodName = document.getElementById('mood-name');
  const moodPrev = document.getElementById('mood-prev');
  const moodNext = document.getElementById('mood-next');
  const moodNote = document.getElementById('mood-note');
  const moodWhy = document.getElementById('mood-why');
  // Mood faces drawn in the app's style, instead of the system emoji that change with each OS.
  const face = (color, parts) => `<svg class="c-face" viewBox="0 0 24 24" style="--face-color:${color}" aria-hidden="true"><circle class="c-face__head" cx="12" cy="12" r="10"/>${parts}</svg>`;
  const dot = (x, y) => `<circle class="c-face__dot" cx="${x}" cy="${y}" r="1.25"/>`;
  const line = (d) => `<path class="c-face__line" d="${d}"/>`;
  const eyes = dot(8.5, 10) + dot(15.5, 10);
  const smile = line('M8 14c1 1.7 2.4 2.5 4 2.5s3-.8 4-2.5');
  const happyEyes = line('M7 10.5c.7-1.3 2.3-1.3 3 0M14 10.5c.7-1.3 2.3-1.3 3 0');
  const blush = '<circle class="c-face__blush" cx="6.5" cy="13.6" r="1.6"/><circle class="c-face__blush" cx="17.5" cy="13.6" r="1.6"/>';
  const moods = [
    { name: 'Happy', face: face('var(--yellow)', eyes + smile) },
    { name: 'Excited', face: face('var(--bg-cat-health)', happyEyes + '<path class="c-face__dot" d="M7.5 13.5h9c0 2.7-2 4.5-4.5 4.5s-4.5-1.8-4.5-4.5Z"/>') },
    { name: 'Grateful', face: face('var(--bg-cat-family)', happyEyes + blush + smile) },
    { name: 'Calm', face: face('var(--bg-cat-reading)', line('M7 10c.7 1.2 2.3 1.2 3 0M14 10c.7 1.2 2.3 1.2 3 0M9.5 15c.8.8 1.6 1.1 2.5 1.1s1.7-.3 2.5-1.1')) },
    { name: 'Curious', face: face('var(--bg-cat-study)', eyes + line('M14 6.8l3-1.1M10 15.6c1.4-.7 2.9-.7 4.5.3')) },
    { name: 'Tired', face: face('var(--bg-cat-work)', line('M7 10.5h3M14 10.5h3M16.5 2.5h3l-3 3.5h3') + '<ellipse class="c-face__dot" cx="12" cy="15.5" rx="1.4" ry="1.7"/>') },
    { name: 'Anxious', face: face('var(--bg-cat-travel)', eyes + line('M6.8 7.6l2.6-1M17.2 7.6l-2.6-1M8 16l1.33-1 1.33 1 1.34-1 1.33 1 1.34-1 1.33 1')) },
    { name: 'Sad', face: face('var(--blue)', eyes + line('M8.5 16.5c.9-1.3 2.1-1.9 3.5-1.9s2.6.6 3.5 1.9') + '<path class="c-face__tear" d="M7.6 12.3c.6.9 1 1.5 1 2a1 1 0 0 1-2 0c0-.5.4-1.1 1-2Z"/>') },
  ];
  window.moodFaces = Object.fromEntries(moods.map((m) => [m.name, m.face]));
  const visibleMoods = 4;
  let firstMood = 0;
  let selectedMood = null;

  const showMoods = () => {
    moodList.style.setProperty('--first', firstMood);
    moodPrev.disabled = firstMood === 0;
    moodNext.disabled = firstMood + visibleMoods >= moods.length;
    // Moods outside the window can't be reached by Tab.
    [...moodList.children].forEach((button, i) => {
      button.inert = i < firstMood || i >= firstMood + visibleMoods;
    });
  };

  moods.forEach((mood) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'c-mood__option';
    button.innerHTML = mood.face;
    button.setAttribute('aria-label', mood.name);
    button.setAttribute('aria-pressed', 'false');
    const showName = () => (moodName.textContent = mood.name);
    const hideName = () => (moodName.textContent = selectedMood?.name ?? '');
    button.addEventListener('mouseenter', showName);
    button.addEventListener('focus', showName);
    button.addEventListener('mouseleave', hideName);
    button.addEventListener('blur', hideName);
    button.addEventListener('click', () => {
      selectedMood = mood;
      moodList.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      moodName.textContent = mood.name;
      moodNote.hidden = false;
      moodWhy.focus();
    });
    moodList.appendChild(button);
  });
  moodPrev.addEventListener('click', () => {
    firstMood = Math.max(0, firstMood - 1);
    showMoods();
  });
  moodNext.addEventListener('click', () => {
    firstMood = Math.min(moods.length - visibleMoods, firstMood + 1);
    showMoods();
  });
  showMoods();
  // Saving logs the mood with its optional note. The Mood history page listens to add it to the list.
  moodNote.addEventListener('submit', (e) => {
    e.preventDefault();
    const mood = selectedMood;
    document.getElementById('mood-phrase').innerHTML = `I’m feeling <strong>${mood.name}</strong> today`;
    moodToggle.innerHTML = `<span class="c-mood__current">${mood.face}</span>`;
    moodToggle.setAttribute('aria-label', `Feeling ${mood.name.toLowerCase()}. Change mood`);
    document.dispatchEvent(new CustomEvent('yoko:mood', { detail: { mood: mood.name, why: moodWhy.value.trim() } }));
    moodWhy.value = '';
    moodNote.hidden = true;
    moodPopover.classList.remove('is-open');
    moodToggle.setAttribute('aria-expanded', 'false');
    moodToggle.focus();
  });
  moodWhy.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) moodNote.requestSubmit();
  });
  moodToggle.addEventListener('click', () => {
    const open = moodPopover.classList.toggle('is-open');
    moodToggle.setAttribute('aria-expanded', String(open));
  });

  // Every page with the shell gets the search palette, in this order.
  ['search-data.js', 'search.js'].forEach((src) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.body.append(script);
  });
})();
