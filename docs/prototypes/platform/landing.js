// Landing page: the Places demo and, when motion is allowed, the GSAP animations.
const $ = (id) => document.getElementById(id);
const root = document.documentElement;

// Theme chosen in the app, when the browser allows reading it.
try {
  const saved = localStorage.getItem('yoko-prototype-theme');
  if (saved) root.dataset.theme = saved;
} catch {
  // Storage blocked: keep the light theme.
}

// Without GSAP (offline, blocked CDN) the page stays still instead of hidden.
const hasMotion = root.classList.contains('has-motion') && 'gsap' in window && 'ScrollTrigger' in window;
if (!hasMotion) root.classList.remove('has-motion');

const seconds = (token) => parseFloat(getComputedStyle(root).getPropertyValue(token)) / 1000;
const motion = {
  fast: seconds('--duration-fast'),
  base: seconds('--duration-default'),
  slow: seconds('--duration-slow'),
  idle: seconds('--duration-idle'),
};

$('places-feature').insertAdjacentHTML('afterbegin', window.otter);
$('places-badge').insertAdjacentHTML('afterbegin', window.otter);

/* Yoko says hi */

const BUBBLE_MS = 2600;
const lines = ['Hi! I’m Yoko.', 'Eight arms, zero forgotten tasks.', 'How are you feeling today?', 'Psst… try the map below.'];
let lineIndex = 0;
let bubbleTimer;
const bubble = $('yoko-bubble');

const hideBubble = () => {
  if (!hasMotion) {
    bubble.hidden = true;
    return;
  }
  gsap.to(bubble, { autoAlpha: 0, scale: 0.8, duration: motion.fast, onComplete: () => (bubble.hidden = true) });
};

const hop = () => {
  gsap.killTweensOf('#yoko');
  gsap
    .timeline({ defaults: { transformOrigin: '50% 100%' } })
    .to('#yoko', { scaleX: 1.15, scaleY: 0.85, duration: motion.fast, ease: 'power2.out' })
    .to('#yoko', { scaleX: 0.92, scaleY: 1.1, y: -28, duration: motion.base, ease: 'power2.out' })
    .to('#yoko', { scaleX: 1, scaleY: 1, y: 0, duration: motion.slow, ease: 'bounce.out' });
};

$('yoko').addEventListener('click', () => {
  bubble.textContent = lines[lineIndex++ % lines.length];
  bubble.hidden = false;
  if (hasMotion) {
    gsap.fromTo(bubble, { autoAlpha: 0, scale: 0.6, y: 8 }, { autoAlpha: 1, scale: 1, y: 0, duration: motion.base, ease: 'back.out(3)', transformOrigin: '50% 100%', overwrite: true });
    hop();
  }
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(hideBubble, BUBBLE_MS);
});

/* Places demo. Sample data, the same as the Places prototype; photos are gradients. */

const MAX_NEW_PLACES = 3;
const categories = {
  Travel: 'var(--bg-cat-travel)',
  Social: 'var(--bg-cat-social)',
  Hobby: 'var(--bg-cat-hobby)',
  Reading: 'var(--bg-cat-reading)',
  Family: 'var(--bg-cat-family)',
};
const places = [
  { id: 1, title: 'Primrose Hill', where: 'Camden, London', x: 18, y: 19, category: 'Hobby', visited: '12 Mar 2025', fav: true,
    note: 'Sunset picnic with the whole city at our feet. Bring a blanket, the grass gets wet early.',
    photos: [['#f6b26b', '#e06666', 'Sunset from the top'], ['#93c47d', '#38761d', 'The lawn'], ['#9fc5e8', '#3d85c6', 'City view']] },
  { id: 2, title: 'British Library', where: "King's Cross, London", x: 47, y: 17, category: 'Reading', visited: '14 Mar 2025', fav: false,
    note: 'Saw the treasures gallery. The King’s Library tower is even taller in person.',
    photos: [['#b4a7d6', '#674ea7', 'The tower of books'], ['#d5a6bd', '#a64d79', 'Reading room']] },
  { id: 3, title: 'Borough Market', where: 'Southwark, London', x: 54, y: 83, category: 'Social', visited: '15 Mar 2025', fav: true,
    note: 'Lunch with friends. Go before noon on Saturdays or it gets packed.',
    photos: [['#ffd966', '#e69138', 'Food stalls'], ['#ea9999', '#cc0000', 'Strawberries'], ['#b6d7a8', '#6aa84f', 'Green market']] },
  { id: 4, title: 'Tower Bridge', where: 'Tower Hamlets, London', x: 65, y: 73, category: 'Travel', visited: '15 Mar 2025', fav: false,
    note: 'Walked across at night. The glass floor of the walkway is scary and worth it.',
    photos: [['#6fa8dc', '#1c4587', 'At night'], ['#a2c4c9', '#45818e', 'From the river']] },
  { id: 5, title: 'Regent’s Park', where: 'Marylebone, London', x: 31, y: 31, category: 'Family', visited: '16 Mar 2025', fav: false,
    note: 'Rose garden with the family. Queen Mary’s Gardens are at their best in June.',
    photos: [['#f4cccc', '#e06666', 'Rose garden'], ['#d9ead3', '#93c47d', 'Boating lake']] },
];
const calendarIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"/></svg>';
const gradient = ([from, to]) => `linear-gradient(135deg, ${from}, ${to})`;

const markers = new Map();
let selected = null;
let activeFilter = 'All';
let nextId = places.length + 1;
let newPlaces = 0;

const dropIn = (shapes, scrollTrigger) =>
  gsap.from(shapes, {
    y: -70, autoAlpha: 0, duration: motion.slow * 1.5, ease: 'bounce.out', stagger: 0.12,
    clearProps: 'transform,opacity,visibility', scrollTrigger,
  });

const addPin = (place) => {
  const pin = document.createElement('button');
  pin.type = 'button';
  pin.className = 'c-pin-btn';
  pin.style.setProperty('--x', `${place.x}%`);
  pin.style.setProperty('--y', `${place.y}%`);
  pin.setAttribute('aria-label', place.title);
  const shape = document.createElement('span');
  shape.className = 'c-pin';
  shape.style.setProperty('--pin-color', categories[place.category]);
  const number = document.createElement('span');
  number.textContent = places.indexOf(place) + 1;
  shape.append(number);
  pin.append(shape);
  pin.addEventListener('click', () => select(place));
  $('demo-pins').append(pin);
  markers.set(place.id, pin);
  return shape;
};

const tag = (text, color) => {
  const el = document.createElement('span');
  el.className = color ? 'c-tag' : 'c-tag c-tag--plain';
  if (color) el.style.setProperty('--tag-color', color);
  el.textContent = text;
  return el;
};

const renderCard = (place, photoIndex) => {
  const photo = place.photos[photoIndex];
  $('demo-photo').style.backgroundImage = photo ? gradient(photo) : '';
  $('demo-caption').textContent = photo ? photo[2] : 'No photos yet';

  const thumbs = place.photos.map((p, i) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'c-demo__thumb';
    thumb.style.backgroundImage = gradient(p);
    thumb.setAttribute('aria-label', `Show photo: ${p[2]}`);
    thumb.setAttribute('aria-pressed', String(i === photoIndex));
    thumb.addEventListener('click', () => renderCard(place, i));
    return thumb;
  });
  $('demo-thumbs').replaceChildren(...thumbs);
  $('demo-thumbs').hidden = thumbs.length === 0;

  $('demo-title').textContent = place.title;
  $('demo-where').textContent = place.where;
  $('demo-note').textContent = place.note;
  const visited = tag(`Visited ${place.visited}`);
  visited.insertAdjacentHTML('afterbegin', calendarIcon);
  $('demo-tags').replaceChildren(tag(place.category, categories[place.category]), visited);
  $('demo-fav').setAttribute('aria-pressed', String(place.fav));
};

const select = (place) => {
  selected = place;
  markers.forEach((pin, id) => pin.firstElementChild.classList.toggle('is-selected', id === place.id));
  renderCard(place, 0);
  if (hasMotion) {
    gsap.fromTo('#demo-photo, .c-demo__body > *', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: motion.base, ease: 'power2.out', overwrite: true });
  }
};

$('demo-fav').addEventListener('click', () => {
  selected.fav = !selected.fav;
  $('demo-fav').setAttribute('aria-pressed', String(selected.fav));
  if (hasMotion) gsap.fromTo('#demo-fav svg', { scale: 0.5 }, { scale: 1, duration: motion.slow, ease: 'elastic.out(1.2, 0.4)', overwrite: true });
});

const showSignInHint = () => {
  const hint = $('demo-hint');
  hint.textContent = 'You’ve got the idea! ';
  const link = document.createElement('a');
  link.href = 'login.html';
  link.textContent = 'Sign in to pin your own places';
  hint.append(link, '.');
};

const dropPin = (x, y) => {
  if (newPlaces >= MAX_NEW_PLACES) return;
  newPlaces++;
  const place = {
    id: nextId++, title: 'Your new place', where: 'Somewhere you’ve been', x, y,
    category: activeFilter === 'All' ? 'Travel' : activeFilter, visited: 'today', fav: false,
    note: 'Give it a name, add the photos and write down what you want to remember.', photos: [],
  };
  places.push(place);
  const shape = addPin(place);
  if (hasMotion) dropIn(shape);
  select(place);
  if (newPlaces === MAX_NEW_PLACES) showSignInHint();
};

$('demo-map').addEventListener('click', (e) => {
  if (e.target.closest('.c-pin-btn')) return;
  const box = $('demo-map').getBoundingClientRect();
  dropPin(((e.clientX - box.left) / box.width) * 100, ((e.clientY - box.top) / box.height) * 100);
});
$('demo-drop').addEventListener('click', () => dropPin(15 + Math.random() * 70, 20 + Math.random() * 65));

const applyFilter = () => {
  const shown = [];
  places.forEach((place) => {
    const pin = markers.get(place.id);
    const hidden = activeFilter !== 'All' && place.category !== activeFilter;
    if (pin.hidden && !hidden) shown.push(pin.firstElementChild);
    pin.hidden = hidden;
  });
  if (hasMotion && shown.length) gsap.from(shown, { scale: 0, duration: motion.base, ease: 'back.out(3)', stagger: 0.05, clearProps: 'transform' });
  const visible = places.filter((place) => !markers.get(place.id).hidden);
  if (visible.length && !visible.includes(selected)) select(visible[0]);
};

const chips = ['All', ...Object.keys(categories)].map((name) => {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'c-chip';
  chip.textContent = name;
  if (categories[name]) chip.style.setProperty('--chip-color', categories[name]);
  chip.addEventListener('click', () => {
    activeFilter = name;
    chips.forEach((c) => {
      c.classList.toggle('is-selected', c === chip);
      c.setAttribute('aria-pressed', String(c === chip));
    });
    applyFilter();
  });
  return chip;
});
$('demo-filters').replaceChildren(...chips);

const firstShapes = places.map(addPin);
chips[0].click();

/* Motion, in the spirit of Cassie Evans' work: characters that react and scenes built by the scroll */

if (hasMotion) {
  gsap.registerPlugin(ScrollTrigger);

  const YOKO_TILT = -8;
  const WORD_PAUSE = 1.6;
  const BLINK_PAUSE = [2, 5];

  gsap
    .timeline({ defaults: { ease: 'power3.out', duration: motion.slow } })
    .from('#hero-yoko', { autoAlpha: 0, scale: 0, rotation: -40, duration: motion.slow * 2.5, ease: 'elastic.out(1, 0.5)' })
    .from('.c-hero .js-intro:not(#hero-yoko)', { autoAlpha: 0, y: 30, stagger: 0.12 }, '<0.2')
    .call(() => nextWord());

  gsap.to('#yoko-float', { y: -10, duration: motion.idle / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  const blink = () =>
    gsap
      .timeline({ delay: gsap.utils.random(...BLINK_PAUSE), onComplete: blink })
      .to('#yoko-eye', { scaleY: 0.1, transformOrigin: '50% 50%', duration: motion.fast / 2, ease: 'power2.in' })
      .to('#yoko-eye', { scaleY: 1, duration: motion.fast, ease: 'power2.out' });
  blink();

  const words = ['days', 'tasks', 'routines', 'notes', 'lists', 'places', 'links', 'movies', 'moods'];
  let wordIndex = 0;
  // The new word rolls in while the old one rolls out, so the line is never empty.
  const nextWord = () => {
    const box = $('hero-words');
    const current = box.firstElementChild;
    wordIndex = (wordIndex + 1) % words.length;
    const incoming = document.createElement('span');
    incoming.className = 'c-hero__word';
    incoming.textContent = words[wordIndex];
    gsap.set(box, { width: current.offsetWidth });
    box.append(incoming);
    gsap
      .timeline({ delay: WORD_PAUSE, defaults: { duration: motion.slow, ease: 'power3.inOut' }, onComplete: nextWord })
      .to(current, { yPercent: -100, autoAlpha: 0, onComplete: () => current.remove() })
      .fromTo(incoming, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1 }, '<')
      .to(box, { width: incoming.offsetWidth }, '<');
  };

  // Eyes follow the pointer: Yoko's and the otter's pupils.
  const lookAt = (targets, anchor, range) => {
    const toX = gsap.quickTo(targets, 'x', { duration: motion.base, ease: 'power3' });
    const toY = gsap.quickTo(targets, 'y', { duration: motion.base, ease: 'power3' });
    return (e) => {
      const box = anchor.getBoundingClientRect();
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const pull = Math.min(1, distance / 300);
      toX((dx / distance) * range * pull);
      toY((dy / distance) * range * pull);
    };
  };
  const yokoLooks = lookAt('#yoko-eye', $('yoko-art'), 3);
  const otterLooks = lookAt($('places-badge').querySelectorAll('circle[r="1.4"]'), $('places-badge'), 1.2);
  const tilt = gsap.quickTo('#yoko-art', 'rotation', { duration: motion.slow, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    yokoLooks(e);
    otterLooks(e);
    tilt(YOKO_TILT + gsap.utils.clamp(-1, 1, (e.clientX / innerWidth) * 2 - 1) * 6);
  });

  gsap.utils.toArray('.js-reveal').forEach((el) =>
    gsap.from(el, { autoAlpha: 0, y: 30, duration: motion.slow, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }),
  );

  // Feature cards land like they were tossed on the table.
  gsap.set('.c-feature', { autoAlpha: 0, y: 60, rotation: () => gsap.utils.random(-8, 8) });
  ScrollTrigger.batch('.c-feature', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, rotation: 0, stagger: 0.1, duration: motion.slow * 1.6, ease: 'elastic.out(1, 0.7)', clearProps: 'transform' }),
  });

  gsap
    .timeline({ scrollTrigger: { trigger: '#places-intro', start: 'top 80%', once: true } })
    .from('#places-badge > svg', { y: 20, rotation: -30, scale: 0.4, transformOrigin: '50% 100%', duration: motion.slow * 2, ease: 'elastic.out(1, 0.4)' }, 0)
    .from('.c-showcase__list li', { autoAlpha: 0, x: -24, stagger: 0.08, duration: motion.slow, ease: 'power3.out' }, 0.2);

  // The map draws itself as you scroll, then the pins drop in.
  const mapScroll = { trigger: '#demo-map', start: 'top 95%', end: 'center 55%', scrub: 1 };
  gsap.utils.toArray('#demo-map .js-draw').forEach((path) => {
    const length = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: mapScroll });
  });
  gsap.from('#demo-map .js-parks > *', { scale: 0, transformOrigin: '50% 50%', stagger: 0.1, ease: 'back.out(2)', scrollTrigger: mapScroll });
  dropIn(firstShapes, { trigger: '#demo-map', start: 'top 60%', once: true });
}
