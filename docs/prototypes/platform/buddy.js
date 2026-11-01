// Mascot visits: the module's mascot peeks in, swims across or says something now and then, and cheers when you finish something.
// It's decorative (aria-hidden), stays out of the way of typing and open panels, and is off with reduced motion or in Settings.
(() => {
  const page = document.body.dataset.page;
  const art = window.mascots?.[page];
  const BUDDY_KEY = 'yoko-prototype-buddy';
  const visitsOff = () => {
    try {
      return localStorage.getItem(BUDDY_KEY) === 'off';
    } catch {
      return false;
    }
  };
  if (!art || visitsOff() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const SIZE = 72;
  const FIRST_VISIT_MS = 6000;
  const VISIT_EVERY_MS = [25000, 45000];
  const MAX_VISITS = 4;
  const BUBBLE_MS = 2600;
  // Mascots drawn facing left turn around when they swim to the right.
  const facesLeft = ['occurrences', 'routines'];
  const lines = {
    occurrences: ['Counting the days with you.', 'Big day coming up?'],
    places: ['Where to next?', 'I saved you a pebble.'],
    links: ['Saving that for later?', 'So many tabs, so little time.'],
    notes: ['Write it down before it swims away.', 'I’ve got a pencil.'],
    tasks: ['Snip snip, one task at a time.', 'You’ve got this!'],
    mood: ['How are you floating today?', 'It’s okay to drift sometimes.'],
    routines: ['Same time, same steps. Nice.', 'Little steps, every day.'],
    media: ['One more episode?', 'Popcorn’s ready.'],
    lists: ['I brought fish. Need anything else?', 'Tick, tick, tick!'],
  }[page] ?? ['Hi!'];
  const cheers = ['Nice!', 'Done and done!', 'Look at you go!', 'Woohoo!'];

  document.querySelector('.app__main').insertAdjacentHTML(
    'beforeend',
    `<div class="c-buddy" aria-hidden="true">
      <div class="c-buddy__mover">
        <p class="c-buddy__bubble" hidden></p>
        <button class="c-buddy__body" type="button" tabindex="-1">${art}</button>
      </div>
    </div>`,
  );
  const stage = document.querySelector('.c-buddy');
  const mover = stage.querySelector('.c-buddy__mover');
  const body = stage.querySelector('.c-buddy__body');
  const bubble = stage.querySelector('.c-buddy__bubble');
  const pupils = [...body.querySelectorAll('circle.m-pupil')];

  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const width = () => stage.clientWidth;
  const height = () => stage.clientHeight;
  const place = (x, y) => (mover.style.transform = `translate(${x}px, ${y}px)`);
  const move = (frames, duration, easing = 'ease-in-out') =>
    mover.animate(frames.map(([x, y]) => ({ transform: `translate(${x}px, ${y}px)` })), { duration, easing, fill: 'forwards' }).finished;
  const face = (right) => body.classList.toggle('is-flipped', facesLeft.includes(page) && right);
  const busy = () =>
    document.querySelector('dialog[open], .c-workspace__panel:not([hidden]), .p-links__detail:not([hidden])') ||
    document.activeElement?.matches?.('input, textarea, select, [contenteditable]');

  let acting = false;
  const say = async (text) => {
    bubble.textContent = text;
    bubble.hidden = false;
    bubble.animate([{ opacity: 0, transform: 'translateY(6px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 250, easing: 'ease-out' });
    await wait(BUBBLE_MS);
    bubble.hidden = true;
  };
  const hop = () =>
    body.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-22px) rotate(-6deg)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }],
      { duration: 700, easing: 'ease-out' },
    ).finished;

  // The eyes follow the pointer while the mascot is out.
  window.addEventListener('pointermove', (e) => {
    if (!acting) return;
    const box = body.getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    const distance = Math.hypot(dx, dy) || 1;
    const shift = `translate(${(dx / distance) * 1.2}px, ${(dy / distance) * 1.2}px)`;
    pupils.forEach((p) => (p.style.transform = shift));
  });

  const acts = {
    // Peek up from the bottom, look around, go back down.
    async peek(text) {
      const x = width() * (0.15 + Math.random() * 0.65);
      const hidden = height();
      const out = height() - SIZE + 14;
      face(Math.random() < 0.5);
      place(x, hidden);
      await move([[x, hidden], [x, out]], 700, 'cubic-bezier(.34,1.56,.64,1)');
      if (text) await say(text);
      else await wait(2200);
      await move([[x, out], [x, hidden]], 500, 'ease-in');
    },
    // Swim across the bottom, bobbing.
    async cross() {
      const toRight = Math.random() < 0.5;
      const y = height() - SIZE - 6;
      const [from, to] = toRight ? [-SIZE, width() + SIZE] : [width() + SIZE, -SIZE];
      face(toRight);
      const steps = 6;
      const frames = Array.from({ length: steps + 1 }, (_, i) => [from + ((to - from) * i) / steps, y + (i % 2 ? -10 : 0)]);
      await move(frames, 7000, 'linear');
    },
    // Pop in at a corner and say something.
    async chat() {
      await acts.peek(pick(lines));
    },
  };

  const run = async (act, ...args) => {
    if (acting) return;
    acting = true;
    stage.classList.add('is-out');
    try {
      await act(...args);
    } finally {
      stage.classList.remove('is-out');
      bubble.hidden = true;
      acting = false;
    }
  };

  // Click: a happy hop and a line.
  body.addEventListener('click', async () => {
    await hop();
    await say(pick(lines));
  });

  // Cheer when something is done (pages send yoko:cheer).
  const onCheer = () => {
    if (acting) {
      hop().then(() => say(pick(cheers)));
      return;
    }
    run(async () => {
      await acts.peek(pick(cheers));
    });
  };
  document.addEventListener('yoko:cheer', onCheer);
  document.addEventListener('yoko:mood', onCheer);

  let visits = 0;
  const scheduleVisit = (delay) =>
    setTimeout(async () => {
      if (visits >= MAX_VISITS) return;
      if (!busy() && !document.hidden) {
        visits++;
        await run(acts[pick(['peek', 'cross', 'chat'])]);
      }
      scheduleVisit(VISIT_EVERY_MS[0] + Math.random() * (VISIT_EVERY_MS[1] - VISIT_EVERY_MS[0]));
    }, delay);
  scheduleVisit(FIRST_VISIT_MS);
})();
