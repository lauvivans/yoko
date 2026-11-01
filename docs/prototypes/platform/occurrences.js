// Occurrences prototype: Events, Calendar and Actions views over the same sample data.
(() => {
  const categoryIcons = {
    Personal: '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7"/>',
    Social: '<path d="M17 9c0 3.87-3.36 7-7.5 7l-.93 1.12-.55.66c-.47.56-1.37.44-1.68-.23L5 14.6C3.18 13.32 2 11.29 2 9c0-3.87 3.36-7 7.5-7 3.02 0 5.63 1.67 6.8 4.07.45.89.7 1.88.7 2.93Z"/><path d="M22 12.86c0 2.29-1.18 4.32-3 5.6l-1.34 2.95c-.31.67-1.21.8-1.68.23l-1.48-1.78c-2.42 0-4.58-1.07-5.93-2.74L9.5 16c4.14 0 7.5-3.13 7.5-7 0-1.05-.25-2.04-.7-2.93 3.27.75 5.7 3.51 5.7 6.79ZM7 9h5"/>',
    Travel: '<path d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z"/><path d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"/>',
    Study: '<path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15"/>',
    Family: '<path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21c0-3.6 3.1-6 7-6s7 2.4 7 6M16 3.3a4 4 0 0 1 0 7.4M18 15.2c2.4.6 4 2.6 4 5.8"/>',
    Work: '<path d="M8 22h8c4 0 4.7-1.6 4.9-3.5l.8-8c.2-2-.4-3.5-3.7-3.5H6c-3.3 0-3.9 1.5-3.7 3.5l.8 8C3.3 20.4 4 22 8 22ZM8 7v-.8C8 4.4 8 3 11.2 3h1.6C16 3 16 4.4 16 6.2V7M2.3 11.5A16 16 0 0 0 12 14.3a16 16 0 0 0 9.7-2.8"/>',
    Finance: '<path d="M18 13.5a1.5 1.5 0 1 0 0-.01M3 9V6.5A3.5 3.5 0 0 1 6.5 3h11A3.5 3.5 0 0 1 21 6.5V9M3 9v8.5A3.5 3.5 0 0 0 6.5 21h11a3.5 3.5 0 0 0 3.5-3.5V15M3 9h18v6h-4a3 3 0 0 1 0-6"/>',
    Home: '<path d="M9 21V14.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V21M3 10.5 12 3l9 7.5M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/>',
    Health: '<path d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"/>',
    Reading: '<path d="M12 6.5C10.5 5 8 4 3 4v14c5 0 7.5 1 9 2.5M12 6.5C13.5 5 16 4 21 4v14c-5 0-7.5 1-9 2.5M12 6.5v14"/>',
    Hobby: '<path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.7-.8 1.7-1.6 0-.9-.7-1.3-.7-2.2 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4c0-4.6-4-8.6-9-8.6ZM7.5 11.5h.01M10 7.5h.01M15 7.5h.01"/>',
  };
  const categories = ['Personal', 'Work', 'Study', 'Finance', 'Family', 'Travel', 'Home', 'Health', 'Reading', 'Social', 'Hobby'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMs = 86400000;

  // Dates
  const pad = (n) => String(n).padStart(2, '0');
  const offset = (days) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d;
  };
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };
  const toInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromInput = (value) => {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const daysBetween = (a, b) => Math.round((b - a) / dayMs);
  const monthsBetween = (a, b) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
  const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // Repetition of actions: which days the pattern hits, ignoring when it ends.
  const matchesPattern = (o, d) => {
    if (d < o.start) return false;
    if (o.unit === 'week') {
      if (!o.weekdays.includes(d.getDay())) return false;
      const week = Math.floor(daysBetween(addDays(o.start, -o.start.getDay()), addDays(d, -d.getDay())) / 7);
      return week % o.every === 0;
    }
    if (d.getDate() !== o.start.getDate()) return false;
    const months = monthsBetween(o.start, d);
    if (o.unit === 'month') return months % o.every === 0;
    return d.getMonth() === o.start.getMonth() && (months / 12) % o.every === 0;
  };

  // "After N occurrences" ends on the date of the Nth one, like Google Calendar.
  const lastDateOf = (o) => {
    if (o.ends.type === 'on') return o.ends.date;
    if (o.ends.type === 'never') return null;
    let found = 0;
    for (let d = new Date(o.start), i = 0; i < 3660; i += 1, d = addDays(d, 1)) {
      if (matchesPattern(o, d) && ++found === o.ends.count) return d;
    }
    return null;
  };

  const occursOn = (o, d) => {
    if (o.isEvent) return d >= o.start && d <= o.end;
    return matchesPattern(o, d) && (!o.lastDate || d <= o.lastDate);
  };

  // Sample data
  let nextId = 1;
  const event = (title, category, startDays, endDays, startTime = '', endTime = '') => ({
    id: nextId++, isEvent: true, title, description: '', category,
    start: offset(startDays), end: offset(endDays), allDay: !startTime, startTime, endTime,
  });
  const action = (title, category, options) => {
    const o = {
      id: nextId++, isEvent: false, title, description: '', category,
      start: offset(options.startDays ?? -60), allDay: !options.startTime,
      startTime: options.startTime ?? '', endTime: options.endTime ?? '',
      weekdays: options.weekdays ?? [], every: options.every ?? 1, unit: options.unit ?? 'week',
      ends: options.ends ?? { type: 'never' }, doneDays: options.doneDays ?? 0, doneToday: false, goal: options.goal ?? null,
    };
    o.end = o.start;
    o.lastDate = lastDateOf(o);
    return o;
  };
  const occurrences = [
    event('Dentist', 'Personal', -3, -3, '15:30', '16:00'),
    event('Trip to Lisbon', 'Travel', 12, 19, '07:40', '22:15'),
    event('Mom’s birthday', 'Family', 0, 0),
    event('Final exam', 'Study', 26, 26, '09:00', '12:00'),
    event('Codecon 2027', 'Social', 270, 272),
    event('Pay the rent', 'Finance', 40, 40, '10:00', '10:30'),
    event('Book club', 'Reading', 5, 5, '19:00', '21:00'),
    event('Team offsite', 'Work', 33, 34),
    event('Yoga retreat', 'Health', 60, 62),
    event('Dad’s birthday', 'Family', 95, 95),
    event('Concert', 'Social', 18, 18, '20:30', '23:00'),
    event('Car inspection', 'Personal', 50, 50, '08:00', '09:00'),
    event('Paint the bedroom', 'Home', 22, 23),
    event('Pottery class', 'Hobby', 8, 8, '14:00', '16:00'),
    event('Tax deadline', 'Finance', 150, 150),
    event('Half marathon', 'Health', 75, 75, '07:00', '10:00'),
    event('Wedding anniversary', 'Family', 110, 110),
    event('Move to the new flat', 'Home', 130, 131),
    event('Job interview', 'Work', 3, 3, '11:00', '12:00'),
    event('Read “Dune” with Ana', 'Reading', 45, 45, '20:00', '21:30'),
    event('Hiking in Sintra', 'Travel', 68, 69),
    event('Guitar lesson', 'Hobby', 2, 2, '18:00', '19:00'),
    event('Car insurance renewal', 'Finance', 200, 200),
    event('Graduation party', 'Social', 160, 160, '21:00', '23:59'),
    action('Read before bed', 'Reading', { weekdays: [1, 2, 3, 4, 5], startTime: '22:00', endTime: '22:30', doneDays: 34, goal: { label: 'Read 2 books a month', done: 1, target: 2 } }),
    action('Go to the gym', 'Health', { weekdays: [1, 3, 5], startTime: '07:00', endTime: '08:00', doneDays: 21, goal: { label: '12 workouts a month', done: 7, target: 12 } }),
    action('Water the plants', 'Home', { weekdays: [6], doneDays: 9 }),
    action('Review the budget', 'Finance', { unit: 'month', startDays: -88, ends: { type: 'after', count: 12 }, doneDays: 3 }),
    action('Call grandma', 'Family', { weekdays: [0], startTime: '18:00', endTime: '18:30', doneDays: 15 }),
    action('Practice guitar', 'Hobby', { weekdays: [2, 4], every: 2, startTime: '19:00', endTime: '20:00', ends: { type: 'on', date: offset(90) }, doneDays: 12 }),
    action('Study Spanish', 'Study', { weekdays: [2, 4], startTime: '08:00', endTime: '08:30', doneDays: 40, goal: { label: 'Finish level A2', done: 18, target: 30 } }),
    action('Meditate', 'Personal', { weekdays: [0, 6], doneDays: 52 }),
  ];

  // Formatting
  let use24h = false;
  const formatDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const shortDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatTime = (time) => {
    if (use24h) return time;
    const [h, m] = time.split(':').map(Number);
    return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
  };
  const dateText = (o) => (o.start.getTime() === o.end.getTime() ? formatDate(o.start) : `${formatDate(o.start)} – ${formatDate(o.end)}`);
  const timeText = (o) => (o.allDay ? 'All day' : [o.startTime, o.endTime].filter(Boolean).map(formatTime).join(' – '));
  const countdown = (date) => {
    const diff = daysBetween(offset(0), date);
    if (diff < 0) return 'Already happened';
    if (diff === 0) return 'It’s today!';
    return `In <b>${diff}</b> ${diff === 1 ? 'day' : 'days'}`;
  };
  const repeatText = (o) => {
    const every = o.every === 1 ? `every ${o.unit}` : `every ${o.every} ${o.unit}s`;
    let text;
    if (o.unit === 'week') {
      const days = [...o.weekdays].sort();
      if (days.length === 7 && o.every === 1) text = 'Every day';
      else if (days.join() === '1,2,3,4,5') text = o.every === 1 ? 'Weekdays' : `Weekdays, ${every}`;
      else text = `${days.map((d) => dayNames[d]).join(', ')}${o.every === 1 ? '' : `, ${every}`}`;
    } else if (o.unit === 'month') {
      text = `${every[0].toUpperCase()}${every.slice(1)} on day ${o.start.getDate()}`;
    } else {
      text = `${every[0].toUpperCase()}${every.slice(1)} on ${o.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    }
    if (o.ends.type === 'on') text += ` · until ${shortDate(o.ends.date)}`;
    if (o.ends.type === 'after') text += ` · ${o.ends.count} times`;
    return text;
  };

  // List state: Events and Actions keep their own filters and sorting.
  const whenOptions = [
    { id: 'all', label: 'All' },
    { id: '0', label: 'This month' },
    { id: '1', label: 'Next month' },
    ...[2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: `In ${n} months` })),
    { id: 'later', label: 'In more than 6 months' },
  ];
  const sortOptions = [
    { id: 'creation', label: 'Creation (default)' },
    { id: 'category', label: 'Category' },
    { id: 'alphabet', label: 'Alphabet' },
    { id: 'date', label: 'Date' },
  ];
  const sorters = {
    creation: (a, b) => a.id - b.id,
    category: (a, b) => a.category.localeCompare(b.category) || a.start - b.start,
    alphabet: (a, b) => a.title.localeCompare(b.title),
    date: (a, b) => a.start - b.start,
  };
  const defaultFilters = { when: 'all', category: 'All', showPast: true };
  const lists = {
    Events: { filters: { ...defaultFilters }, sortBy: 'creation' },
    Actions: { filters: { ...defaultFilters }, sortBy: 'creation' },
  };
  const pageSize = 6;
  let shownCount = pageSize;
  let query = '';
  let view = 'Events';
  const current = () => lists[view];
  const noun = (o = null) => ((o ? !o.isEvent : view === 'Actions') ? 'action' : 'event');

  const matches = (o) => {
    const { filters } = current();
    if (o.isEvent !== (view === 'Events')) return false;
    if (filters.category !== 'All' && o.category !== filters.category) return false;
    if (query && !o.title.toLowerCase().includes(query)) return false;
    if (!o.isEvent) return true;
    if (!filters.showPast && daysBetween(offset(0), o.end) < 0) return false;
    if (filters.when === 'all') return true;
    const months = monthsBetween(new Date(), o.start);
    return filters.when === 'later' ? months > 6 : months === Number(filters.when);
  };
  const isFiltered = () => {
    const { filters } = current();
    return view === 'Actions' ? filters.category !== 'All' : JSON.stringify(filters) !== JSON.stringify(defaultFilters);
  };

  // Elements
  const $ = (id) => document.getElementById(id);
  const content = document.querySelector('.app__content');
  const occurrencePage = document.querySelector('.p-occurrence');
  const cards = $('cards');
  const toolbar = $('toolbar');
  const calendar = $('calendar');
  const message = $('message');
  const messageText = $('message-text');
  const messageMascot = $('message-mascot');
  const messageReset = $('message-reset');
  const loadMore = $('load-more');
  const showLess = $('show-less');
  const backToTop = $('back-to-top');
  const deleteButton = $('delete');
  const addButton = $('add-occurrence');
  const goals = $('goals');
  const editPage = $('edit-page');
  let editing = null;

  // Cards
  const categoryHtml = (o) => `
    <span class="c-occurrence-card__category">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${categoryIcons[o.category]}</g></svg>
      ${o.category}
    </span>`;

  const goalHtml = (goal) => `
    <div class="c-occurrence-card__goal">
      <span>${escapeHtml(goal.label)} · ${goal.done}/${goal.target}</span>
      <span class="c-progress" role="progressbar" aria-label="${escapeHtml(goal.label)}" aria-valuemin="0" aria-valuemax="${goal.target}" aria-valuenow="${goal.done}"><span style="width:${Math.min(100, (goal.done / goal.target) * 100)}%"></span></span>
    </div>`;

  const cardHtml = (o) => {
    const isEditing = !editPage.hidden && editing?.id === o.id;
    const footer = o.isEvent
      ? `<span class="c-occurrence-card__countdown">${countdown(o.start)}</span>`
      : `<span class="c-occurrence-card__countdown"><b>${o.doneDays}</b> ${o.doneDays === 1 ? 'day' : 'days'} done</span>
         <button class="c-done" type="button" data-done="${o.id}" aria-pressed="${o.doneToday}" aria-label="Done today: ${escapeHtml(o.title)}">✓ Today</button>`;
    return `
      <article class="c-occurrence-card${isEditing ? ' is-editing' : ''}" style="--card-color:var(--bg-cat-${o.category.toLowerCase()})">
        <h3 class="c-occurrence-card__title"><button class="c-occurrence-card__open" type="button" data-id="${o.id}">${escapeHtml(o.title)}</button></h3>
        <div class="c-occurrence-card__datetime">
          <span>${o.isEvent ? dateText(o) : repeatText(o)}</span>
          <span>${timeText(o)}</span>
        </div>
        ${o.goal ? goalHtml(o.goal) : ''}
        <div class="c-occurrence-card__footer">${footer}${categoryHtml(o)}</div>
        <label class="c-occurrence-card__checkbox"><input type="checkbox" value="${o.id}" aria-label="Select ${escapeHtml(o.title)}"></label>
      </article>`;
  };

  const updateSelection = () => {
    const selected = cards.querySelectorAll('input:checked').length;
    $('selected-count').textContent = selected;
    deleteButton.setAttribute('aria-disabled', String(selected === 0));
  };

  // The octopus only shows in empty states, where there is room for it.
  const showMessage = (text, { reset = false, empty = true } = {}) => {
    messageText.textContent = text;
    messageReset.hidden = !reset;
    messageMascot.hidden = !empty;
    message.classList.toggle('is-empty', empty);
  };

  // Calendar
  let calendarMonth = offset(0);
  calendarMonth.setDate(1);

  const renderCalendar = () => {
    $('calendar-title').textContent = calendarMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const first = calendarMonth;
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    const gridStart = addDays(first, -first.getDay());
    const gridEnd = addDays(last, 6 - last.getDay());
    const today = offset(0).getTime();
    const cells = [];
    for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
      const items = occurrences.filter((o) => occursOn(o, d));
      const classes = ['c-calendar__day', d.getMonth() !== first.getMonth() && 'is-outside', d.getTime() === today && 'is-today'].filter(Boolean).join(' ');
      const chip = (o) =>
        `<li><button class="c-calendar__chip" type="button" data-id="${o.id}" style="--chip-color:var(--bg-cat-${o.category.toLowerCase()})">${o.isEvent ? '' : '<span aria-hidden="true">↻ </span>'}${escapeHtml(o.title)}</button></li>`;
      cells.push(`
        <div class="${classes}">
          <button class="c-calendar__date" type="button" data-date="${toInput(d)}" aria-label="${formatDate(d)}, ${items.length} ${items.length === 1 ? 'occurrence' : 'occurrences'}">${d.getDate()}</button>
          <span class="c-calendar__dots" aria-hidden="true">${items.slice(0, 4).map((o) => `<span style="--chip-color:var(--bg-cat-${o.category.toLowerCase()})"></span>`).join('')}</span>
          <ul class="c-calendar__chips">${items.slice(0, 2).map(chip).join('')}</ul>
          ${items.length > 2 ? `<button class="c-calendar__more" type="button" data-date="${toInput(d)}">+${items.length - 2} more</button>` : ''}
        </div>`);
    }
    $('calendar-grid').innerHTML = dayNames.map((n) => `<div class="c-calendar__weekday">${n}</div>`).join('') + cells.join('');
  };

  const dayDialog = $('day-dialog');
  const openDay = (value) => {
    const d = fromInput(value);
    const items = occurrences.filter((o) => occursOn(o, d));
    $('day-title').textContent = formatDate(d);
    $('day-list').innerHTML = items.length
      ? items
          .map((o) => `<li><button type="button" data-id="${o.id}" style="--chip-color:var(--bg-cat-${o.category.toLowerCase()})"><span>${o.isEvent ? '' : '↻ '}${escapeHtml(o.title)}</span><small>${timeText(o)}</small></button></li>`)
          .join('')
      : '<li class="c-day-list__empty">Nothing on this day.</li>';
    dayDialog.showModal();
  };

  calendar.addEventListener('click', (e) => {
    const chip = e.target.closest('.c-calendar__chip');
    const day = e.target.closest('[data-date]');
    if (chip) openForm(occurrences.find((o) => o.id === Number(chip.dataset.id)));
    else if (day) openDay(day.dataset.date);
  });
  $('day-list').addEventListener('click', (e) => {
    const item = e.target.closest('[data-id]');
    if (!item) return;
    dayDialog.close();
    openForm(occurrences.find((o) => o.id === Number(item.dataset.id)));
  });
  const moveMonth = (months) => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + months, 1);
    renderCalendar();
  };
  $('calendar-prev').addEventListener('click', () => moveMonth(-1));
  $('calendar-next').addEventListener('click', () => moveMonth(1));
  $('calendar-today').addEventListener('click', () => {
    calendarMonth = offset(0);
    calendarMonth.setDate(1);
    renderCalendar();
  });

  // Infinite list: more cards load as the end of the list scrolls into view.
  // The delay stands in for the API call, so the loading text can be seen.
  const loadingDelay = 600;
  let loading = false;
  const loadObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || loadMore.hidden || loading) return;
      loading = true;
      setTimeout(() => {
        loading = false;
        shownCount += pageSize;
        render();
      }, loadingDelay);
    },
    { root: content },
  );

  const render = () => {
    const isCalendar = view === 'Calendar';
    toolbar.hidden = isCalendar;
    cards.hidden = isCalendar;
    calendar.hidden = !isCalendar;
    goals.hidden = view !== 'Actions';
    $('add-label').textContent = `Add ${noun()}`;
    loadMore.hidden = true;
    showLess.hidden = true;
    message.hidden = isCalendar;

    if (isCalendar) {
      renderCalendar();
      return;
    }

    // Keep the selection while more cards load.
    const checked = new Set([...cards.querySelectorAll('input:checked')].map((input) => input.value));
    const all = occurrences.filter((o) => o.isEvent === (view === 'Events'));
    const visible = all.filter(matches).sort(sorters[current().sortBy]);
    cards.innerHTML = visible.slice(0, shownCount).map(cardHtml).join('');
    cards.querySelectorAll('input[type="checkbox"]').forEach((input) => (input.checked = checked.has(input.value)));
    updateSelection();

    const hasMore = shownCount < visible.length;
    loadMore.hidden = !hasMore;
    loadMore.textContent = `Loading more ${noun()}s…`;
    message.hidden = hasMore;
    showLess.hidden = hasMore || shownCount <= pageSize;
    if (hasMore) {
      // Observing again re-checks the end of the list, in case it's still on screen.
      loadObserver.unobserve(loadMore);
      loadObserver.observe(loadMore);
    }

    if (all.length === 0) {
      showMessage(view === 'Events' ? 'No events yet. Add one to start counting the days.' : 'No recurring actions yet. Add one and mark the days you do it.');
    } else if (visible.length === 0 && query) showMessage(`No ${noun()}s match “${query}”.`);
    else if (visible.length === 0) showMessage(`No ${noun()}s were found with these filters.`, { reset: true });
    else showMessage('That’s everything for now.', { empty: false });
  };

  cards.addEventListener('change', updateSelection);
  cards.addEventListener('click', (e) => {
    const done = e.target.closest('.c-done');
    if (done) {
      const o = occurrences.find((item) => item.id === Number(done.dataset.done));
      o.doneToday = !o.doneToday;
      const step = o.doneToday ? 1 : -1;
      o.doneDays += step;
      if (o.goal) o.goal.done = Math.max(0, o.goal.done + step);
      render();
      renderGoals();
      cards.querySelector(`[data-done="${o.id}"]`)?.focus();
      return;
    }
    const open = e.target.closest('.c-occurrence-card__open');
    if (open) openForm(occurrences.find((o) => o.id === Number(open.dataset.id)));
  });

  showLess.addEventListener('click', () => {
    shownCount = pageSize;
    content.scrollTo({ top: 0, behavior: 'smooth' });
    render();
  });
  backToTop.addEventListener('click', () => content.scrollTo({ top: 0, behavior: 'smooth' }));
  content.addEventListener('scroll', () => {
    backToTop.hidden = content.scrollTop < 300 || !editPage.hidden || view === 'Calendar';
  });

  // Dialogs close when the backdrop is clicked.
  const closeOnBackdrop = (dialog) =>
    dialog.addEventListener('click', (e) => {
      const r = dialog.getBoundingClientRect();
      const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside && e.target === dialog) dialog.close();
    });
  closeOnBackdrop(dayDialog);

  // Create and edit form. Actions add the repetition fields.
  const formDialog = $('occurrence-dialog');
  const form = $('occurrence-form');
  const field = (name) => form.elements.namedItem(name);
  const weekdayInputs = () => [...form.querySelectorAll('input[name="weekday"]')];
  // Same width as the CSS rule that puts the panel next to the list ($desktop-lg-min).
  let formIsAction = false;

  // Category cards: radio buttons with the category color and icon. form.elements.category is a RadioNodeList, so .value still works.
  $('occurrence-category').innerHTML = categories
    .map(
      (c) => `<label class="c-category" style="--category-color:var(--bg-cat-${c.toLowerCase()})">
        <input class="u-visually-hidden" type="radio" name="category" value="${c}">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${categoryIcons[c]}</g></svg>
        ${c}
      </label>`,
    )
    .join('');

  const syncTime = () => {
    const allDay = field('allDay').checked;
    $('time-row').hidden = allDay;
    field('startTime').required = !allDay;
    field('endTime').required = !allDay;
  };

  const syncRepeat = () => {
    const unit = field('unit').value;
    const every = Number(field('every').value) || 1;
    [...field('unit').options].forEach((option) => (option.textContent = every === 1 ? option.value : `${option.value}s`));
    $('weekday-field').hidden = unit !== 'week';
    const ends = form.querySelector('input[name="ends"]:checked').value;
    field('endsOn').disabled = ends !== 'on';
    field('endsAfter').disabled = ends !== 'after';
    $('ends-count-unit').textContent = Number(field('endsAfter').value) === 1 ? 'occurrence' : 'occurrences';
  };

  const openForm = (o = null) => {
    editing = o;
    formIsAction = o ? !o.isEvent : view === 'Actions';
    const heading = $('occurrence-form-title');
    heading.textContent = o ? 'Edit ' : `New ${formIsAction ? 'action' : 'event'}`;
    if (o) {
      const name = document.createElement('b');
      name.textContent = o.title;
      heading.append(name);
    }
    field('title').value = o?.title ?? '';
    field('description').value = o?.description ?? '';
    field('category').value = o?.category ?? 'Personal';
    field('startDate').value = toInput(o?.start ?? offset(0));
    field('endDate').value = toInput(o?.end ?? offset(0));
    field('allDay').checked = o?.allDay ?? false;
    field('startTime').value = o?.startTime || '09:00';
    field('endTime').value = o?.endTime || '10:00';

    $('end-date-field').hidden = formIsAction;
    field('endDate').required = !formIsAction;
    $('repeat-fields').hidden = !formIsAction;
    const weekdays = o?.weekdays ?? [offset(0).getDay()];
    weekdayInputs().forEach((input) => (input.checked = weekdays.includes(Number(input.value))));
    field('every').value = o?.every ?? 1;
    field('unit').value = o?.unit ?? 'week';
    const ends = o?.ends ?? { type: 'never' };
    form.querySelector(`input[name="ends"][value="${ends.type}"]`).checked = true;
    field('endsOn').value = toInput(ends.type === 'on' ? ends.date : offset(90));
    field('endsAfter').value = ends.type === 'after' ? ends.count : 10;

    [...form.elements].forEach((el) => el.setCustomValidity?.(''));
    syncTime();
    syncRepeat();
    $('submit-form').textContent = o ? 'Save' : 'Create';

    // Creating opens a dialog. Editing opens the side panel.
    if (o) {
      editPage.setAttribute('aria-label', `Edit ${noun(o)}`);
      editPage.append(form);
      occurrencePage.classList.add('is-editing');
      editPage.hidden = false;
      render();
      field('title').focus();
    } else {
      formDialog.append(form);
      formDialog.showModal();
    }
  };

  const closeForm = () => {
    if (editPage.hidden) {
      formDialog.close();
      return;
    }
    editPage.hidden = true;
    occurrencePage.classList.remove('is-editing');
    render();
    document.querySelector(`[data-id="${editing.id}"]`)?.focus();
  };

  form.addEventListener('input', (e) => e.target.setCustomValidity?.(''));
  form.addEventListener('change', (e) => {
    if (['unit', 'every', 'ends'].includes(e.target.name)) syncRepeat();
  });
  field('every').addEventListener('input', syncRepeat);
  field('endsAfter').addEventListener('input', syncRepeat);
  field('allDay').addEventListener('change', syncTime);
  addButton.addEventListener('click', () => openForm());
  $('close-form').addEventListener('click', closeForm);
  closeOnBackdrop(formDialog);

  const validate = () => {
    const title = field('title').value.trim();
    const allDay = field('allDay').checked;
    const start = field('startDate').value ? fromInput(field('startDate').value) : null;
    const end = formIsAction ? start : field('endDate').value ? fromInput(field('endDate').value) : null;
    const startTime = field('startTime').value;
    const endTime = field('endTime').value;

    field('title').setCustomValidity(title ? '' : `Give the ${formIsAction ? 'action' : 'event'} a name.`);
    field('endDate').setCustomValidity(!formIsAction && start && end && end < start ? 'The end date can’t be before the start date.' : '');
    const sameDay = start && end && start.getTime() === end.getTime();
    field('endTime').setCustomValidity(!allDay && sameDay && startTime && endTime && endTime < startTime ? 'The end time can’t be before the start time.' : '');

    if (formIsAction) {
      const noDay = field('unit').value === 'week' && !weekdayInputs().some((input) => input.checked);
      weekdayInputs()[0].setCustomValidity(noDay ? 'Pick at least one day.' : '');
      const every = Number(field('every').value);
      field('every').setCustomValidity(Number.isInteger(every) && every >= 1 && every <= 99 ? '' : 'Use a number from 1 to 99.');
      const ends = form.querySelector('input[name="ends"]:checked').value;
      const endsOn = field('endsOn').value ? fromInput(field('endsOn').value) : null;
      field('endsOn').setCustomValidity(ends === 'on' && (!endsOn || (start && endsOn < start)) ? 'The end has to be after the start date.' : '');
      const count = Number(field('endsAfter').value);
      field('endsAfter').setCustomValidity(ends === 'after' && !(Number.isInteger(count) && count >= 1) ? 'Use a number of 1 or more.' : '');
    }
    if (!form.reportValidity()) return null;
    return { title, allDay, start, end, startTime: allDay ? '' : startTime, endTime: allDay ? '' : endTime };
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = validate();
    if (!valid) return;
    const category = categories.includes(field('category').value) ? field('category').value : 'Personal';
    const data = { ...valid, isEvent: !formIsAction, description: field('description').value.trim(), category };
    if (formIsAction) {
      const endsType = form.querySelector('input[name="ends"]:checked').value;
      Object.assign(data, {
        weekdays: weekdayInputs().filter((input) => input.checked).map((input) => Number(input.value)),
        every: Number(field('every').value),
        unit: ['week', 'month', 'year'].includes(field('unit').value) ? field('unit').value : 'week',
        ends:
          endsType === 'on' ? { type: 'on', date: fromInput(field('endsOn').value) }
          : endsType === 'after' ? { type: 'after', count: Number(field('endsAfter').value) }
          : { type: 'never' },
      });
      data.lastDate = lastDateOf(data);
    }
    if (editing) Object.assign(editing, data);
    else occurrences.push({ id: nextId++, doneDays: 0, doneToday: false, goal: null, ...data });
    render();
    renderGoals();
    closeForm();
  });

  // Delete with confirmation
  const deleteDialog = $('delete-dialog');
  closeOnBackdrop(deleteDialog);
  deleteButton.addEventListener('click', () => {
    const selected = cards.querySelectorAll('input:checked').length;
    if (selected === 0) return;
    $('delete-count').textContent = `${selected} ${noun()}${selected === 1 ? '' : 's'}`;
    deleteDialog.returnValue = '';
    deleteDialog.showModal();
  });
  deleteDialog.addEventListener('close', () => {
    if (deleteDialog.returnValue !== 'delete') return;
    const ids = [...cards.querySelectorAll('input:checked')].map((input) => Number(input.value));
    ids.forEach((id) => occurrences.splice(occurrences.findIndex((o) => o.id === id), 1));
    render();
    renderGoals();
  });

  // 12 or 24-hour clock
  const clockButton = $('clock-format');
  clockButton.addEventListener('click', () => {
    use24h = !use24h;
    clockButton.setAttribute('aria-pressed', String(use24h));
    render();
  });

  // Goals of the actions
  const renderGoals = () => {
    const withGoals = occurrences.filter((o) => !o.isEvent && o.goal);
    $('goal-list').innerHTML = withGoals.length
      ? withGoals
          .map(
            (o) => `<li>
              <span><b>${escapeHtml(o.goal.label)}</b> · ${escapeHtml(o.title)}</span>
              <span class="c-progress" role="progressbar" aria-label="${escapeHtml(o.goal.label)}" aria-valuemin="0" aria-valuemax="${o.goal.target}" aria-valuenow="${o.goal.done}"><span style="width:${Math.min(100, (o.goal.done / o.goal.target) * 100)}%"></span></span>
              <small>${o.goal.done} of ${o.goal.target}</small>
            </li>`,
          )
          .join('')
      : '<li>No goals yet.</li>';
  };

  // Popovers: filter, sort and goals
  const dropdowns = ['filter', 'sort', 'goals'].map((name) => ({ toggle: $(`${name}-toggle`), popover: $(`${name}-popover`) }));
  const closeDropdowns = (except) =>
    dropdowns.forEach((d) => {
      if (d === except) return;
      d.popover.hidden = true;
      d.toggle.setAttribute('aria-expanded', 'false');
    });
  dropdowns.forEach((d) =>
    d.toggle.addEventListener('click', () => {
      closeDropdowns(d);
      d.popover.hidden = !d.popover.hidden;
      d.toggle.setAttribute('aria-expanded', String(!d.popover.hidden));
    }),
  );
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.c-dropdown')) closeDropdowns();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = dropdowns.find((d) => !d.popover.hidden);
    if (open) {
      closeDropdowns();
      open.toggle.focus();
    } else if (!editPage.hidden) closeForm();
  });

  const renderChips = (container, options, selected, onPick) => {
    container.innerHTML = options
      .map((o) => `<button class="c-chip" type="button" data-id="${o.id}" aria-pressed="${o.id === selected}">${o.label}</button>`)
      .join('');
    container.onclick = (e) => {
      const chip = e.target.closest('.c-chip');
      if (chip) onPick(chip.dataset.id);
    };
  };

  const renderControls = () => {
    const list = current();
    if (!list) return;
    const { filters } = list;
    $('when-head').hidden = view !== 'Events';
    $('when-options').hidden = view !== 'Events';
    renderChips($('when-options'), whenOptions, filters.when, (id) => {
      filters.when = id;
      update();
    });
    renderChips($('category-options'), [{ id: 'All', label: 'All' }, ...categories.map((c) => ({ id: c, label: c }))], filters.category, (id) => {
      filters.category = id;
      update();
    });
    renderChips($('sort-options'), sortOptions, list.sortBy, (id) => {
      list.sortBy = id;
      closeDropdowns();
      update();
    });
    $('show-past').checked = filters.showPast;
    const category = filters.category === 'All' ? 'All categories' : filters.category;
    const when = filters.when === 'all' ? 'Any time' : whenOptions.find((o) => o.id === filters.when).label;
    $('filter-label').textContent = view === 'Events' ? `${when} · ${category}` : category;
    $('sort-label').textContent = `Sort: ${sortOptions.find((o) => o.id === list.sortBy).label.replace(' (default)', '').toLowerCase()}`;
    $('filter-toggle').classList.toggle('is-active', isFiltered());
  };

  const update = () => {
    shownCount = pageSize;
    renderControls();
    render();
  };

  const resetFilters = () => {
    current().filters = { ...defaultFilters };
    update();
  };
  $('show-past').addEventListener('change', (e) => {
    current().filters.showPast = e.target.checked;
    update();
  });
  $('reset-filters').addEventListener('click', resetFilters);
  messageReset.addEventListener('click', resetFilters);

  // Tabs
  document.querySelectorAll('.p-occurrence__tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.p-occurrence__tab').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      view = tab.dataset.view;
      closeDropdowns();
      if (!editPage.hidden) closeForm();
      cards.innerHTML = '';
      update();
    });
  });

  // Search filters the cards by title
  $('search').addEventListener('input', (e) => {
    query = e.target.value.trim().toLowerCase();
    shownCount = pageSize;
    render();
  });

  renderGoals();
  update();
})();
