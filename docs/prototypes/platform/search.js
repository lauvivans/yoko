// Search: a palette over the whole app (Ctrl/⌘ K), with suggestions, results from every module and keyboard navigation.
// Picking a result opens its page filtered by it; the page's own filter does the rest.
(() => {
  const $ = (id) => document.getElementById(id);
  const index = window.YokoSearchData ?? [];
  const params = new URLSearchParams(location.search);
  const MAX_PER_GROUP = 5;
  const MAX_RECENT = 4;
  const RECENT_KEY = 'yoko-prototype-recent-search';
  const canFilterPage = Boolean(document.body.dataset.search);

  const stroke = (paths) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
  const icons = {
    search: stroke('<path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"/>'),
    Events: stroke('<path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"/>'),
    Actions: stroke('<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>'),
    Tasks: stroke('<path d="M9 11l2 2 4-4M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"/>'),
    Notes: stroke('<path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5M22 10h-4c-3 0-4-1-4-4V2l8 8ZM7 13h6M7 17h4"/>'),
    Links: stroke('<path d="M13.06 10.94a5.74 5.74 0 0 1 0 8.13c-2.25 2.24-5.89 2.25-8.13 0-2.24-2.25-2.25-5.89 0-8.13M10.59 13.41a5.89 5.89 0 0 1 0-8.33c2.3-2.3 6.03-2.3 8.33 0 2.3 2.3 2.3 6.03 0 8.33"/>'),
    Places: stroke('<path d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z"/><path d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.19 5.19 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"/>'),
    Moods: stroke('<path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM15.5 9.75h.01M8.5 9.75h.01M8.4 13.3h7.2c.5 0 .9.4.9.9 0 2.49-2.01 4.5-4.5 4.5s-4.5-2.01-4.5-4.5c0-.5.4-.9.9-.9Z"/>'),
    plus: stroke('<path d="M12 5v14M5 12h14"/>'),
    page: stroke('<path d="M14 5h7M14 12h7M14 19h7M3 4h7v7H3ZM3 15h7v5H3Z"/>'),
    filter: stroke('<path d="M5.4 2.1h13.2c1.1 0 2 .9 2 2v2.2c0 .8-.5 1.8-1 2.3l-4.3 3.8c-.6.5-1 1.5-1 2.3v4.3c0 .6-.4 1.4-.9 1.7l-1.4.9c-1.3.8-3.1-.1-3.1-1.7v-5.3c0-.7-.4-1.6-.8-2.1L4.4 8.6c-.5-.5-.9-1.4-.9-2V4.2c0-1.2.9-2.1 1.9-2.1Z"/>'),
    recent: stroke('<path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10ZM15.71 15.18l-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1"/>'),
  };

  const pages = [
    { label: 'Home', href: 'home.html' },
    { label: 'Occurrences', href: 'occurrences.html' },
    { label: 'Places', href: 'places.html' },
    { label: 'Links', href: 'links.html' },
    { label: 'Notes', href: 'notes.html' },
    { label: 'Tasks', href: 'tasks.html' },
    { label: 'Mood history', href: 'mood.html' },
    { label: 'Design system', href: 'design-system.html' },
  ];
  const creates = [
    { label: 'New event', href: 'occurrences.html?new=1' },
    { label: 'New task', href: 'tasks.html?new=1' },
    { label: 'New note', href: 'notes.html?new=1' },
    { label: 'Save a link', href: 'links.html?new=1' },
    { label: 'Add a place', href: 'places.html?new=1' },
    { label: 'Log my mood', mood: true },
  ];

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  const shortcut = isMac ? '⌘ K' : 'Ctrl K';

  document.body.insertAdjacentHTML(
    'beforeend',
    `<dialog class="c-palette" id="palette" aria-label="Search">
      <div class="c-palette__field">
        ${icons.search}
        <input id="palette-input" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" placeholder="Search events, tasks, notes, links, places…" autocomplete="off" spellcheck="false">
        <kbd class="c-palette__esc">Esc</kbd>
        <button class="c-palette__cancel" type="button" id="palette-cancel">Cancel</button>
      </div>
      <div class="c-palette__list" id="palette-list" role="listbox" aria-label="Results"></div>
      <div class="c-palette__foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>
    </dialog>`,
  );
  const palette = $('palette');
  const input = $('palette-input');
  const list = $('palette-list');
  const searchField = $('search');
  let options = [];
  let active = 0;

  $('search-shortcut').textContent = shortcut;

  const readRecent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
      return Array.isArray(saved) ? saved.filter((r) => typeof r?.title === 'string' && typeof r?.href === 'string') : [];
    } catch {
      return [];
    }
  };
  const saveRecent = (item) => {
    try {
      const next = [item, ...readRecent().filter((r) => r.href !== item.href)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked: recent searches just aren't kept.
    }
  };

  const hrefOf = (item) => {
    const query = new URLSearchParams({ q: item.title });
    if (item.view) query.set('view', item.view);
    if (item.day !== undefined) query.set('day', item.day);
    return `${item.page}?${query}`;
  };

  // Rank: title starts with the query, then a word in the title does, then the title or the detail contains it.
  const score = (item, q) => {
    const title = item.title.toLowerCase();
    if (title.startsWith(q)) return 3;
    if (title.split(/[\s\-–·]+/).some((word) => word.startsWith(q))) return 2;
    if (title.includes(q)) return 1;
    return item.detail?.toLowerCase().includes(q) ? 0.5 : 0;
  };

  const highlight = (text, q) => {
    const span = document.createElement('span');
    span.className = 'c-palette__title';
    const at = q ? text.toLowerCase().indexOf(q) : -1;
    if (at < 0) {
      span.textContent = text;
      return span;
    }
    const mark = document.createElement('mark');
    mark.textContent = text.slice(at, at + q.length);
    span.append(text.slice(0, at), mark, text.slice(at + q.length));
    return span;
  };

  const groupsFor = (q) => {
    if (!q) {
      const recent = readRecent().map((r) => ({ ...r, icon: icons.recent }));
      return [
        { name: 'Recent', items: recent },
        { name: 'Create', items: creates.map((c) => ({ ...c, title: c.label, icon: icons.plus })) },
        { name: 'Go to', items: pages.map((p) => ({ title: p.label, href: p.href, icon: icons.page })) },
      ];
    }
    const filter = canFilterPage ? [{ name: 'This page', items: [{ title: `Filter this page by “${input.value.trim()}”`, filter: input.value.trim(), icon: icons.filter }] }] : [];
    const modules = ['Events', 'Actions', 'Tasks', 'Notes', 'Links', 'Places', 'Moods'].map((module) => ({
      name: module,
      items: index
        .filter((item) => item.module === module)
        .map((item) => ({ item, rank: score(item, q) }))
        .filter((r) => r.rank > 0)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, MAX_PER_GROUP)
        .map(({ item }) => ({ title: item.title, detail: item.detail, href: hrefOf(item), icon: icons[module], recent: true })),
    }));
    const matching = (entries) => entries.filter((e) => e.label.toLowerCase().includes(q));
    return [
      ...filter,
      ...modules,
      { name: 'Create', items: matching(creates).map((c) => ({ ...c, title: c.label, icon: icons.plus })) },
      { name: 'Go to', items: matching(pages).map((p) => ({ title: p.label, href: p.href, icon: icons.page })) },
    ];
  };

  const setActive = (i) => {
    if (!options.length) return;
    active = (i + options.length) % options.length;
    options.forEach(({ el }, j) => el.setAttribute('aria-selected', String(j === active)));
    input.setAttribute('aria-activedescendant', options[active].el.id);
    options[active].el.scrollIntoView?.({ block: 'nearest' });
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
    const groups = groupsFor(q).filter((g) => g.items.length);
    options = [];
    const sections = groups.map((group, g) => {
      const section = document.createElement('div');
      section.setAttribute('role', 'group');
      section.setAttribute('aria-labelledby', `palette-group-${g}`);
      const heading = document.createElement('div');
      heading.className = 'c-palette__group';
      heading.id = `palette-group-${g}`;
      heading.textContent = group.name;
      section.append(heading);
      group.items.forEach((item) => {
        const el = document.createElement('div');
        el.className = 'c-palette__item';
        el.id = `palette-option-${options.length}`;
        el.setAttribute('role', 'option');
        el.insertAdjacentHTML('afterbegin', item.icon);
        const text = document.createElement('span');
        text.className = 'c-palette__text';
        text.append(highlight(item.title, q));
        if (item.detail) {
          const detail = document.createElement('span');
          detail.className = 'c-palette__detail';
          detail.textContent = item.detail;
          text.append(detail);
        }
        el.append(text);
        const optionIndex = options.length;
        el.addEventListener('mousemove', () => optionIndex !== active && setActive(optionIndex));
        el.addEventListener('click', () => choose(item));
        options.push({ el, item });
        section.append(el);
      });
      return section;
    });
    if (!groups.some((g) => g.name !== 'This page')) {
      const empty = document.createElement('p');
      empty.className = 'c-palette__empty';
      empty.textContent = `Nothing found for “${input.value.trim()}”.`;
      sections.push(empty);
    }
    list.replaceChildren(...sections);
    input.removeAttribute('aria-activedescendant');
    setActive(0);
  };

  const applyFilter = (text) => {
    searchField.value = text;
    searchField.dispatchEvent(new Event('input', { bubbles: true }));
    $('search-text').textContent = text || document.body.dataset.search || 'Search';
    $('search-box').classList.toggle('is-filtering', Boolean(text));
    $('search-clear').hidden = !text;
  };

  function choose(item) {
    palette.close();
    if (item.filter !== undefined) return applyFilter(item.filter);
    if (item.mood) return $('mood-toggle').click();
    if (item.recent) saveRecent({ title: item.title, detail: item.detail, href: item.href, recent: true });
    location.href = item.href;
  }

  const open = () => {
    if (palette.open) return;
    input.value = searchField.value;
    palette.showModal();
    input.select();
    render();
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
    } else if (e.key === 'Enter' && options[active]) {
      e.preventDefault();
      choose(options[active].item);
    }
  });
  palette.addEventListener('click', (e) => {
    if (e.target === palette) palette.close();
  });
  $('palette-cancel').addEventListener('click', () => palette.close());
  $('search-open').addEventListener('click', open);
  $('search-clear').addEventListener('click', () => {
    applyFilter('');
    $('search-open').focus();
  });
  document.addEventListener('keydown', (e) => {
    const typing = e.target.closest?.('input, textarea, select, [contenteditable]');
    if ((e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
      e.preventDefault();
      open();
    }
  });

  // Arriving from a result or a shortcut: filter, switch view or start creating, once the page has set up its listeners.
  window.addEventListener('load', () => {
    const view = params.get('view');
    if (view) document.querySelector(`[data-view="${CSS.escape(view)}"]`)?.click();
    const q = params.get('q');
    if (q) applyFilter(q);
    if (params.get('new')) document.querySelector('[data-new]')?.click();
  });
})();
