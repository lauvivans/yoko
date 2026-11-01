// Mascot on screen: the module's mascot lives in a strip at the top of the module, like a desktop pet. It walks around, stops to look,
// says something now and then, naps, and cheers when you finish something.
// It's decorative (aria-hidden), holds still while you type or a panel is open, and is off with reduced motion or in Settings.
(() => {
  const page = document.body.dataset.page;
  const art = window.mascots?.[page];
  const BUDDY_KEY = 'yoko-prototype-buddy';
  const buddyOff = () => {
    try {
      return localStorage.getItem(BUDDY_KEY) === 'off';
    } catch {
      return false;
    }
  };
  if (!art || buddyOff() || !('animate' in Element.prototype) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const SIZE = 72;
  const ARRIVE_MS = 250;
  const WALK_PX_PER_S = 70;
  const IDLE_MS = [2500, 6000];
  const NAP_MS = 7000;
  const BUBBLE_MS = 2600;
  const lines = {
    occurrences: ['Counting the days with you.', 'Big day coming up?'],
    places: ['Where to next?', 'I saved you a pebble.'],
    links: ['Saving that for later?', 'So many tabs, so little time.'],
    notes: ['Write it down before it swims away.', 'I’ve got a pencil.'],
    tasks: ['One task at a time.', 'You’ve got this!'],
    mood: ['How are you today?', 'It’s okay to drift sometimes.'],
    routines: ['Same time, same steps. Nice.', 'Little steps, every day.'],
    media: ['One more episode?', 'Popcorn’s ready.'],
    lists: ['Need anything else on the list?', 'Tick, tick, tick!'],
  }[page] ?? ['Hi!'];
  const cheers = ['Nice!', 'Done and done!', 'Look at you go!', 'Woohoo!'];

  document.querySelector('.app__content').insertAdjacentHTML(
    'afterbegin',
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
  const pupils = [...body.querySelectorAll('.m-pupil')];

  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const between = ([min, max]) => min + Math.random() * (max - min);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const ground = () => stage.clientHeight - SIZE - 4;
  const busy = () =>
    document.hidden ||
    document.querySelector('dialog[open], .c-workspace__panel:not([hidden]), .p-links__detail:not([hidden])') ||
    document.activeElement?.matches?.('input, textarea, select, [contenteditable]');

  let x = 0;
  let walking = null;
  const place = () => (mover.style.transform = `translate(${x}px, ${ground()}px)`);
  // Drawings that face a side turn around to look where they walk; front-facing ones stay as they are.
  const look = (right) => {
    const facing = window.YokoMascots?.facing(page);
    body.classList.toggle('is-flipped', (facing === 'left' && right) || (facing === 'right' && !right));
  };

  // Near an edge, the bubble lines up with the mascot's inner side so it isn't clipped.
  const alignBubble = () => {
    const nearLeft = x < SIZE;
    const nearRight = stage.clientWidth - x - SIZE < SIZE;
    bubble.style.left = nearLeft ? '0' : nearRight ? 'auto' : '';
    bubble.style.right = nearRight && !nearLeft ? '0' : '';
    bubble.style.translate = nearLeft || nearRight ? '0 0' : '';
  };
  const say = async (text, ms = BUBBLE_MS) => {
    alignBubble();
    bubble.textContent = text;
    bubble.hidden = false;
    bubble.animate([{ opacity: 0, transform: 'translateY(6px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 250, easing: 'ease-out' });
    await wait(ms);
    bubble.hidden = true;
  };
  const hop = () =>
    body.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-22px) rotate(-6deg)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }],
      { duration: 700, easing: 'ease-out' },
    ).finished;

  const walkTo = async (target) => {
    look(target > x);
    const waddle = body.animate(
      [{ transform: 'translateY(0) rotate(-5deg)' }, { transform: 'translateY(-5px) rotate(0)' }, { transform: 'translateY(0) rotate(5deg)' }, { transform: 'translateY(-5px) rotate(0)' }, { transform: 'translateY(0) rotate(-5deg)' }],
      { duration: 700, iterations: Infinity },
    );
    const y = ground();
    walking = mover.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: `translate(${target}px, ${y}px)` }], {
      duration: (Math.abs(target - x) / WALK_PX_PER_S) * 1000,
      easing: 'linear',
    });
    try {
      await walking.finished;
      x = target;
    } catch {
      // Cancelled halfway by a cheer, which already saved where it stopped.
    } finally {
      walking = null;
      waddle.cancel();
      place();
    }
  };
  const lookAround = async () => {
    look(true);
    await wait(700);
    look(false);
    await wait(700);
  };
  const nap = async () => {
    stage.classList.add('is-napping');
    await say('Zzz…', NAP_MS);
    stage.classList.remove('is-napping');
  };

  // The eyes follow the pointer, unless it's napping.
  window.addEventListener('pointermove', (e) => {
    if (stage.classList.contains('is-napping')) return;
    const box = body.getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    const distance = Math.hypot(dx, dy) || 1;
    const shift = `translate(${(dx / distance) * 1.2}px, ${(dy / distance) * 1.2}px)`;
    pupils.forEach((p) => (p.style.transform = shift));
  });

  const react = (text) => {
    if (walking) {
      x = new DOMMatrix(getComputedStyle(mover).transform).m41;
      walking.cancel();
    }
    stage.classList.remove('is-napping');
    hop();
    say(text);
  };
  body.addEventListener('click', () => react(pick(lines)));
  document.addEventListener('yoko:cheer', () => react(pick(cheers)));
  document.addEventListener('yoko:mood', () => react(pick(cheers)));
  window.addEventListener('resize', () => {
    x = Math.min(x, stage.clientWidth - SIZE);
    place();
  });

  const live = async () => {
    x = (stage.clientWidth - SIZE) * (0.1 + Math.random() * 0.6);
    place();
    await wait(ARRIVE_MS);
    stage.classList.add('is-out');
    body.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'ease-out' });
    await say('Hi!');
    for (;;) {
      if (busy()) {
        await wait(1000);
        continue;
      }
      const roll = Math.random();
      if (roll < 0.45) await walkTo(Math.random() * (stage.clientWidth - SIZE));
      else if (roll < 0.65) await lookAround();
      else if (roll < 0.8) await say(pick(lines));
      else if (roll < 0.9) await hop();
      else await nap();
      await wait(between(IDLE_MS));
    }
  };
  live();
})();
