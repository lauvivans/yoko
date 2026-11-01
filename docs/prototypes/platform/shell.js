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
    search: stroke('<path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"/>'),
  };

  // Nori's cat, used as the Places mascot.
  window.noriCat =
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#1a1a1a" d="M11 15 12.5 4l6.5 8h10l6.5-8L37 15v24a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5Z"/><circle cx="18.5" cy="23" r="3.4" fill="#fddc5c"/><circle cx="29.5" cy="23" r="3.4" fill="#fddc5c"/><circle cx="18.5" cy="23" r="1.4" fill="#1a1a1a"/><circle cx="29.5" cy="23" r="1.4" fill="#1a1a1a"/><path fill="#fdfdff" d="M22.5 29h3l-1.5 2.2Z"/><path fill="none" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round" d="M37 40c4.5.5 7-2.5 6-6.5s-3.5-4.5-2.5-8.5"/></svg>';

  const modules = [
    { id: 'occurrences', label: 'Occurrences', href: 'occurrences.html', color: 'var(--blue)' },
    { id: 'places', label: 'Places', href: 'places.html', color: 'var(--yellow)' },
    { id: 'links', label: 'Links', href: 'links.html', color: 'var(--bg-cat-reading)' },
    { id: 'notes', label: 'Notes', href: 'notes.html', color: 'var(--blue)' },
    { id: 'tasks', label: 'Tasks', href: 'tasks.html', color: 'var(--blue)' },
    { id: 'mood', label: 'Mood history', href: 'mood.html', color: 'var(--blue)' },
  ];

  // Each module has its own accent: Yoko's blue, or Nori's yellow on Places.
  const current = modules.find((m) => m.id === page);
  if (current?.color) root.style.setProperty('--module', current.color);

  // Theme, remembered across pages when the browser allows it.
  try {
    const saved = localStorage.getItem('yoko-prototype-theme');
    if (saved) root.dataset.theme = saved;
  } catch {
    // Storage blocked: start with the light theme.
  }

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
          return `<li><a class="${classes}" href="${m.href}" data-label="${m.label}" aria-label="${m.label}"${current}>${icons[m.id]}</a></li>`;
        })
        .join('')}
    </ul></nav>
    <ul class="c-sidebar__bottom">
      <li><button class="c-sidebar__item" type="button" id="theme-toggle" data-label="Switch theme" aria-label="Switch theme">${icons.theme}</button></li>
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
      <label class="c-search">${icons.search}<input type="search" id="search" placeholder="${document.body.dataset.search || 'Search'}" aria-label="${document.body.dataset.search || 'Search'}"></label>
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
        </div>
      </div>
    </div>`;

  const app = document.querySelector('.app');
  app.prepend(sidebar);
  app.querySelector('.app__main').prepend(topbar);

  // Greeting by period of the day (decision 004, without the location).
  const hour = new Date().getHours();
  const period = hour < 5 ? 'It’s late' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${period}, Laura`;

  document.getElementById('theme-toggle').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('yoko-prototype-theme', root.dataset.theme);
    } catch {
      // Storage blocked: the theme just isn't remembered.
    }
  });

  const moodToggle = document.getElementById('mood-toggle');
  const moodPopover = document.getElementById('mood-popover');
  const moodList = document.getElementById('mood-list');
  const moodName = document.getElementById('mood-name');
  const moodPrev = document.getElementById('mood-prev');
  const moodNext = document.getElementById('mood-next');
  const moods = [
    { name: 'Happy', emoji: '😊' },
    { name: 'Excited', emoji: '🤩' },
    { name: 'Grateful', emoji: '🥰' },
    { name: 'Calm', emoji: '😌' },
    { name: 'Curious', emoji: '🤔' },
    { name: 'Tired', emoji: '😴' },
    { name: 'Anxious', emoji: '😰' },
    { name: 'Sad', emoji: '😢' },
  ];
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
    button.textContent = mood.emoji;
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
      document.getElementById('mood-phrase').innerHTML = `I’m feeling <strong>${mood.name}</strong> today`;
      moodToggle.innerHTML = `<span class="c-mood__current">${mood.emoji}</span>`;
      moodToggle.setAttribute('aria-label', `Feeling ${mood.name.toLowerCase()}. Change mood`);
      moodPopover.classList.remove('is-open');
      moodToggle.setAttribute('aria-expanded', 'false');
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
  moodToggle.addEventListener('click', () => {
    const open = moodPopover.classList.toggle('is-open');
    moodToggle.setAttribute('aria-expanded', String(open));
  });
})();
