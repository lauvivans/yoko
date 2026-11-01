// Module mascots on a 48x48 grid in the same style (#188). Each theme is a full cast, one per module.
// Colors come from tokens through classes (shell.css): the body is dark, the eyes take the module color.
(() => {
  const THEME_KEY = 'yoko-prototype-mascot-theme';
  const accents = {
    occurrences: 'var(--blue)',
    places: 'var(--yellow)',
    links: 'var(--bg-cat-reading)',
    notes: 'var(--bg-cat-study)',
    tasks: 'var(--bg-cat-finance)',
    mood: 'var(--bg-cat-social)',
    routines: 'var(--bg-cat-health)',
    media: 'var(--bg-cat-work)',
    lists: 'var(--bg-cat-home)',
  };
  // A body color turns a silhouette drawing into the soft style: pastel body, dark eyes with a shine, light lines.
  const mascot = (accent, parts, body, dusk) =>
    `<svg class="c-mascot${dusk ? ' is-dusk' : body ? ' is-soft' : ''}${dusk === 'glow' ? ' is-glow' : ''}" viewBox="0 0 48 48" style="--mascot-accent:${accent}${body ? `;--mascot-body:var(--${body})` : ''}" aria-hidden="true" focusable="false">${parts}</svg>`;
  const eye = (x, y, r = 3.4) => `<circle class="m-eye" cx="${x}" cy="${y}" r="${r}"/><circle class="m-pupil" cx="${x}" cy="${y}" r="${(r * 0.41).toFixed(2)}"/>`;
  const eyes = (y, left = 18.5, right = 29.5, r) => eye(left, y, r) + eye(right, y, r);
  const blush = (y, left, right, r = 1.8) => `<circle class="m-blush" cx="${left}" cy="${y}" r="${r}"/><circle class="m-blush" cx="${right}" cy="${y}" r="${r}"/>`;
  const dots = (y, left, right) => `<ellipse class="m-eye m-dot" cx="${left}" cy="${y}" rx="1.3" ry="1.7"/><ellipse class="m-eye m-dot" cx="${right}" cy="${y}" rx="1.3" ry="1.7"/>`;
  const shiny = (x, y, rx, ry) =>
    `<ellipse class="m-eye m-dot" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/><circle class="m-light m-shine" cx="${x - rx * 0.35}" cy="${y - ry * 0.4}" r="${(rx * 0.42).toFixed(2)}"/><circle class="m-light m-shine" cx="${x + rx * 0.4}" cy="${y + ry * 0.4}" r="${(rx * 0.2).toFixed(2)}"/>`;
  const bigEyes = (y, left, right, rx = 3, ry = 3.8) => shiny(left, y, rx, ry) + shiny(right, y, rx, ry);
  const tint = (color) => `class="m-tint m-edge" style="--tint:var(--${color})"`;
  // Little one: a green baby alien with pointed ears, head centered at (x, y), in a hoodie of the module color. The mouth changes with each pose.
  const alien = (x, y, mouth) =>
    `<path class="m-accent m-edge" d="M${x - 10} ${y + 8}h20l2.5 13.5a3 3 0 0 1-3 3.5H${x - 10.5}a3 3 0 0 1-3-3.5Z"/>` +
    `<path ${tint('green')} d="M${x - 11} ${y - 2}c-3-1-6.5-.5-8.5 1.5 2.5 2.5 6 3.5 9 3Z"/><path ${tint('green')} d="M${x + 11} ${y - 2}c3-1 6.5-.5 8.5 1.5-2.5 2.5-6 3.5-9 3Z"/>` +
    `<ellipse ${tint('green')} cx="${x}" cy="${y}" rx="12.5" ry="10.5"/>` +
    bigEyes(y + 0.5, x - 5, x + 5, 3.2, 3.8) +
    blush(y + 5, x - 8.5, x + 8.5, 1.8) +
    mouth;
  const kiss = (x, y) => `<path class="m-line" stroke-width="1.1" d="M${x - 0.4} ${y - 1.2}c1 0 1.4.5 1 1-.4.4-.4.6 0 1 .4.5 0 1-1 1"/>`;
  const grin = (x, y) => `<path class="m-line" stroke-width="1.2" d="M${x - 1.4} ${y}c.8.9 2 .9 2.8 0"/>`;
  // Ghost: a round sheet ghost with a wavy hem, with its head top at (x, y) and its hem down to y + 30.
  const ghost = (x, y) =>
    `<path class="m-cream" d="M${x} ${y}c-7.5 0-12 5.5-12 13v16c0 1 1 1.5 1.8.9l2.5-2 2.6 2.4c.6.5 1.4.5 2 0L${x} ${y + 28}l3.1 2.3c.6.5 1.4.5 2 0l2.6-2.4 2.5 2c.8.6 1.8.1 1.8-.9V${y + 13}C${x + 12} ${y + 5.5} ${x + 7.5} ${y} ${x} ${y}Z"/>` +
    `<ellipse class="m-eye" style="fill:var(--dark)" cx="${x - 4}" cy="${y + 10}" rx="2.2" ry="3"/><ellipse class="m-eye" style="fill:var(--dark)" cx="${x + 4}" cy="${y + 10}" rx="2.2" ry="3"/>` +
    `<ellipse class="m-blush" cx="${x - 7.5}" cy="${y + 14.5}" rx="1.8" ry="1.1"/><ellipse class="m-blush" cx="${x + 7.5}" cy="${y + 14.5}" rx="1.8" ry="1.1"/>`;
  // Black cat: a sitting black cat with yellow eyes, drawn smaller on the right so props fit above-left (x 4–21, y 2–22).
  const kitty = (asleep) =>
    '<g transform="translate(12 7) scale(.82)">' +
    '<path class="m-line" stroke-width="2.6" d="M31 42c6.5 0 9.5-3.5 9.5-8 0-3-2-5-4.5-5"/>' +
    '<path class="m-body" d="M24 24c-5.5 0-9 4-9.5 9.5-.5 5 .5 8.5 2.5 10.5h14c2-2 3-5.5 2.5-10.5C33 28 29.5 24 24 24Z"/>' +
    '<path class="m-body" d="M13 18 11.5 5q.3-1.6 1.6-.7L20 10.5ZM35 18l1.5-13q-.3-1.6-1.6-.7L28 10.5Z"/>' +
    '<ellipse class="m-body" cx="24" cy="17" rx="12.5" ry="10"/>' +
    (asleep
      ? '<path class="m-line" stroke-width="1.3" style="stroke:var(--yellow)" d="M15.5 16.5c1.4 1.4 3.6 1.4 5 0M27 16.5c1.4 1.4 3.6 1.4 5 0"/>'
      : '<ellipse class="m-eye" style="fill:var(--yellow)" cx="18.8" cy="16.5" rx="3.6" ry="3.8"/><ellipse class="m-eye" style="fill:var(--yellow)" cx="29.2" cy="16.5" rx="3.6" ry="3.8"/>' +
        '<ellipse class="m-pupil" style="fill:var(--dark);translate:none" cx="18.8" cy="16.5" rx=".9" ry="3"/><ellipse class="m-pupil" style="fill:var(--dark);translate:none" cx="29.2" cy="16.5" rx=".9" ry="3"/>') +
    '<path class="m-light" d="M22.8 21h2.4L24 22.6Z"/>' +
    '</g>';
  const popcorn = (y, x = 24) =>
    `<circle class="m-pop" cx="${x - 5}" cy="${y + 1}" r="2.3"/><circle class="m-pop" cx="${x - 1.5}" cy="${y - 0.5}" r="2.4"/><circle class="m-pop" cx="${x + 2}" cy="${y - 0.1}" r="2.4"/><circle class="m-pop" cx="${x + 5.2}" cy="${y + 1.1}" r="2.2"/>` +
    `<path class="m-accent" d="M${x - 7.5} ${y + 2}h15l-2 10h-11Z"/><path class="m-light-line" stroke-width="1.5" d="M${x - 3} ${y + 2.5}l.8 9M${x + 3} ${y + 2.5}l-.8 9"/>`;

  // Every cast lists the modules in the same order, as [name, why, drawing].
  const themes = {
    sea: {
      name: 'Sea',
      dusk: true,
      bodies: { occurrences: 'tide', places: 'slate', links: 'kelp', notes: 'slate', tasks: 'plum', mood: 'dusk', routines: 'kelp', media: 'night', lists: 'night' },
      crew: {
        occurrences: [
          'Whale',
          'Its song comes back every year, like the dates you keep.',
          '<path class="m-body" d="M5 29c0-7.5 7-13 17.5-13 8.5 0 13.5 4 15.5 9.5l4.5-5.5c1.5 4 .5 8.5-3 10.5.5 6.5-5.5 12.5-17.5 12.5C11.5 43 5 37.5 5 29Z"/>' +
            '<path class="m-accent-line" stroke-width="1.8" d="M16 15c-1.5-3-1-6 1-8.5M16 15c1.5-3.5 4-5.5 7.5-6"/>' +
            '<circle class="m-accent" cx="14" cy="5.5" r="1.6"/><circle class="m-accent" cx="25.5" cy="8" r="1.6"/>' +
            eye(14, 27, 3.3) +
            '<path class="m-light-line" stroke-width="1.4" d="M8 33.5c3 2.4 7 3 10.5 2M10 38c4 2 9.5 2.4 14 1.2"/>',
        ],
        places: [
          'Otter',
          'Holds on to a favorite pebble, like you hold on to the places you’ve been.',
          '<path class="m-line" stroke-width="4.5" d="M35 41c4 .5 7-1 8.5-4.5"/>' +
            '<circle class="m-body" cx="14.5" cy="10.5" r="3.6"/><circle class="m-body" cx="33.5" cy="10.5" r="3.6"/>' +
            '<path class="m-body" d="M24 6c-8 0-13 5.5-13 13v18a7 7 0 0 0 7 7h12a7 7 0 0 0 7-7V19c0-7.5-5-13-13-13Z"/>' +
            eyes(19.5) +
            '<ellipse class="m-light" cx="24" cy="26.5" rx="5.5" ry="3.8"/><path class="m-pupil" d="M22.4 24.6h3.2L24 26.6Z"/>' +
            '<path class="m-light-line" stroke-width="1" d="M17.5 26 13 25M17.5 28 13 29.5M30.5 26 35 25M30.5 28 35 29.5"/>' +
            '<ellipse class="m-eye" cx="24" cy="36" rx="4.6" ry="3.6"/><circle class="m-body" cx="19.6" cy="35.2" r="2.6"/><circle class="m-body" cx="28.4" cy="35.2" r="2.6"/>',
        ],
        links: [
          'Pufferfish',
          'Its spikes reach out in every direction, like links.',
          '<path class="m-line" stroke-width="2.6" d="M24 11V6.5M33.9 15.1l3.2-3.2M38 25h4.5M33.9 34.9l3.2 3.2M24 39v4.5M14.1 34.9l-3.2 3.2M10 25H5.5M14.1 15.1l-3.2-3.2"/>' +
            '<circle class="m-body" cx="24" cy="25" r="14"/>' +
            eyes(22) +
            '<circle class="m-light" cx="24" cy="30.5" r="2"/>',
        ],
        notes: [
          'Seal',
          'Balances a pencil on its nose, always ready to write something down.',
          '<path class="m-accent" d="M27.5 1.5l3 1.4-4.6 9.8-3-1.4Z"/><path class="m-pupil" d="M22.9 11.3l3 1.4-2.6 1.6Z"/>' +
            '<ellipse class="m-body" cx="12" cy="40" rx="6" ry="3" transform="rotate(-20 12 40)"/><ellipse class="m-body" cx="36" cy="40" rx="6" ry="3" transform="rotate(20 36 40)"/>' +
            '<path class="m-body" d="M24 13c-7.5 0-12 5.5-12 12.5v9c0 5.5 5 8.5 12 8.5s12-3 12-8.5v-9C36 18.5 31.5 13 24 13Z"/>' +
            eyes(23, 19, 29, 3.1) +
            '<ellipse class="m-light" cx="24" cy="29.5" rx="4.6" ry="3.2"/><path class="m-pupil" d="M22.6 27.8h2.8L24 29.6Z"/>' +
            '<path class="m-light-line" stroke-width="1" d="M18.8 29 15 28.2M18.8 31 15 32M29.2 29 33 28.2M29.2 31 33 32"/>',
        ],
        tasks: [
          'Crab',
          'Two claws ready to get things done.',
          '<path class="m-line" stroke-width="2.4" d="M12 34l-6 3.5M13.5 37.5l-4.5 4.5M36 34l6 3.5M34.5 37.5l4.5 4.5M10 22l4.5 5M38 22l-4.5 5"/>' +
            '<path class="m-body" d="M8 11.5a5.5 5.5 0 1 0 5.5 5.5H8Z"/><path class="m-body" d="M40 11.5a5.5 5.5 0 1 1-5.5 5.5H40Z"/>' +
            '<rect class="m-body" x="16.5" y="14" width="3" height="10" rx="1.5"/><rect class="m-body" x="28.5" y="14" width="3" height="10" rx="1.5"/>' +
            '<ellipse class="m-body" cx="24" cy="31" rx="15" ry="10"/>' +
            eyes(13, 18, 30),
        ],
        mood: [
          'Jellyfish',
          'Floats along with how you feel, rosy cheeks and all.',
          '<path class="m-line" stroke-width="2.4" d="M15 29c-1.5 4 1.5 6.5 0 10.5M21 29c-1.5 4.5 1.5 7.5 0 12.5M27 29c1.5 4.5-1.5 7.5 0 12.5M33 29c1.5 4-1.5 6.5 0 10.5"/>' +
            '<path class="m-body" d="M9 26.5C9 16.5 15.5 9 24 9s15 7.5 15 17.5c0 1.6-1.1 2.5-2.5 2.5h-25C10.1 29 9 28.1 9 26.5Z"/>' +
            eyes(19.5) +
            blush(24, 14.5, 33.5, 2),
        ],
        routines: [
          'Seahorse',
          'Seahorse couples greet each other every morning, a routine of their own.',
          '<path class="m-line" stroke-width="5" d="M26.5 34.5c-1.2 4.2-.2 8 3.4 8.6 3 .5 4.4-2.4 2.5-4.1-1.5-1.3-3.4.2-2.5 1.7"/>' +
            '<path class="m-accent" d="M34.5 21.5 40.5 20l-1.2 6-4.6 1.2Z"/>' +
            '<path class="m-body" d="M25 16.5c5.5-1.2 10.8 2.6 11.2 9.2.4 5.6-3.2 9.8-7.8 10.8-3.6.8-6.3-1.6-6.3-5.6v-9.5c0-2.6 1-4.4 2.9-4.9Z"/>' +
            '<path class="m-line" stroke-width="1.8" d="M24.5 7.6 25.5 4l1.8 3.3M28.6 7.2l2.7-2.6.6 3.4"/>' +
            '<ellipse class="m-body" cx="27.3" cy="12" rx="6.6" ry="5.6" transform="rotate(-10 27.3 12)"/>' +
            '<path class="m-body" d="M13 11.9h9.5v3.4H13a1.7 1.7 0 0 1 0-3.4Z"/><circle class="m-body" cx="12.3" cy="13.6" r="2.1"/>' +
            '<path class="m-light-line" stroke-width="1.2" d="M23.6 22.5h3M23.3 26h3.6M23.4 29.5h3.6M24.4 33h3"/>' +
            eye(28.5, 11.4, 3),
        ],
        media: [
          'Penguin',
          'Never without popcorn, ready for the next episode.',
          '<ellipse class="m-body" cx="11.5" cy="27" rx="3" ry="8" transform="rotate(18 11.5 27)"/><ellipse class="m-body" cx="36.5" cy="27" rx="3" ry="8" transform="rotate(-18 36.5 27)"/>' +
            '<path class="m-body" d="M24 5c-8 0-12 7-12 16v13c0 6 5 9 12 9s12-3 12-9V21c0-9-4-16-12-16Z"/>' +
            '<ellipse class="m-light" cx="24" cy="29" rx="7.5" ry="11"/>' +
            eyes(15, 20, 28, 3) +
            '<path class="m-yellow" d="M21.8 18.6h4.4L24 21.4Z"/>' +
            '<ellipse class="m-yellow" cx="19" cy="43.2" rx="3.6" ry="1.5"/><ellipse class="m-yellow" cx="29" cy="43.2" rx="3.6" ry="1.5"/>' +
            popcorn(28.5),
        ],
        lists: [
          'Puffin',
          'Carries a row of fish in its beak, lined up like a list.',
          '<ellipse class="m-red" cx="19" cy="43.4" rx="3.6" ry="1.5"/><ellipse class="m-red" cx="29" cy="43.4" rx="3.6" ry="1.5"/>' +
            '<path class="m-body" d="M24 6c-8 0-12 6-12 14v14c0 6 5 9 12 9s12-3 12-9V20c0-8-4-14-12-14Z"/>' +
            '<ellipse class="m-light" cx="24" cy="16.5" rx="8.5" ry="6.5"/><ellipse class="m-light" cx="24" cy="34" rx="7" ry="7.5"/>' +
            eyes(15, 20.3, 27.7, 2.6) +
            '<path class="m-fish" d="M17.5 23.5h13M17 26.5h14M17.5 29.5h13"/>' +
            '<path class="m-red" d="M20.2 19.2h7.6L24 25.5Z"/><path class="m-yellow" d="M21.4 19.2h5.2l-.9 1.6h-3.4Z"/>',
        ],
      },
    },

    halloween: {
      name: 'Halloween',
      dusk: true,
      bodies: { occurrences: 'night', places: 'plum', links: 'dusk', notes: 'night', tasks: 'dusk', mood: 'pumpkin', routines: 'night', media: 'night', lists: 'dusk' },
      crew: {
        occurrences: [
          'Black cat',
          'Crosses your path on every big day, for luck.',
          '<path class="m-line" stroke-width="2.4" d="M30 42c6.5 0 9.5-3.5 9.5-8 0-3-2-5-4.5-5s-4 2-3.5 4 2.5 2.5 3.5 1"/>' +
            '<path class="m-body" d="M24 23c-5 0-8 4-8.5 9-.5 5 .5 9 2.5 11.5h12c2-2.5 3-6.5 2.5-11.5-.5-5-3.5-9-8.5-9Z"/>' +
            '<path class="m-light-line" stroke-width=".9" d="M22 38.5v5M26 38.5v5"/>' +
            '<path class="m-body" d="M13.5 18 11.5 5.5q.3-1.6 1.6-.7L20.5 11ZM34.5 18l2-12.5q-.3-1.6-1.6-.7L27.5 11Z"/>' +
            '<ellipse class="m-body" cx="24" cy="16.5" rx="12" ry="9.5"/>' +
            '<circle class="m-eye" style="fill:var(--yellow)" cx="18.8" cy="15.5" r="4"/><circle class="m-eye" style="fill:var(--yellow)" cx="29.2" cy="15.5" r="4"/>' +
            '<ellipse class="m-pupil" style="fill:var(--dark);translate:none" cx="18.8" cy="15.5" rx="1" ry="3.2"/><ellipse class="m-pupil" style="fill:var(--dark);translate:none" cx="29.2" cy="15.5" rx="1" ry="3.2"/>' +
            '<path class="m-light-line" stroke-width="1" d="M22.5 21.3c.5.6 1 .6 1.5 0 .5.6 1 .6 1.5 0M11 18.5c-2-.5-4-.3-5.5.5M11.5 21c-2 .2-3.5 1-4.5 2M37 18.5c2-.5 4-.3 5.5.5M36.5 21c2 .2 3.5 1 4.5 2"/>',
        ],
        places: [
          'Wolf pup',
          'Roams the moors at night, and remembers every path.',
          `<path ${tint('dusk')} d="M33 40c6 0 10-4 10-10-3 2-6 3-10 4Z"/>` +
            `<path ${tint('dusk')} d="M15 29h18l2 11a3 3 0 0 1-3 3.5H16a3 3 0 0 1-3-3.5Z"/><ellipse ${tint('bone')} cx="24" cy="37" rx="4.5" ry="5"/>` +
            `<path ${tint('dusk')} d="M11 4l9 8-8 5ZM37 4l-9 8 8 5Z"/><path ${tint('plum')} stroke-width="0" d="M12.5 7.5l4.5 4-4 2.5ZM35.5 7.5l-4.5 4 4 2.5Z"/>` +
            `<ellipse ${tint('dusk')} cx="24" cy="19" rx="13" ry="11"/>` +
            `<ellipse ${tint('bone')} cx="24" cy="24.5" rx="5.5" ry="4"/><ellipse class="m-body" cx="24" cy="22.6" rx="1.7" ry="1.1"/>` +
            eyes(18, 18, 30, 2.6),
        ],
        links: [
          'Familiar',
          'Flies a note from one place to the next, like a link.',
          '<path class="m-yellow m-edge" d="M41 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>' +
            `<ellipse ${tint('dusk')} cx="12.5" cy="28" rx="3.6" ry="7.5" transform="rotate(20 12.5 28)"/><ellipse ${tint('dusk')} cx="35.5" cy="28" rx="3.6" ry="7.5" transform="rotate(-20 35.5 28)"/>` +
            `<path ${tint('dusk')} d="M14 17.5 12.5 7.5l7 5.5ZM34 17.5l1.5-10-7 5.5Z"/>` +
            `<path ${tint('dusk')} d="M24 11c-7 0-12 5-12 12v7c0 6.5 5 11 12 11s12-4.5 12-11v-7c0-7-5-12-12-12Z"/>` +
            `<circle ${tint('plum')} cx="19.3" cy="21" r="5.3"/><circle ${tint('plum')} cx="28.7" cy="21" r="5.3"/>` +
            eyes(21, 19.3, 28.7, 3.2) +
            '<path class="m-yellow m-edge" d="M22.6 24.8h2.8L24 27.6Z"/>' +
            '<ellipse class="m-yellow m-edge" cx="20" cy="42" rx="2.4" ry="1.1"/><ellipse class="m-yellow m-edge" cx="28" cy="42" rx="2.4" ry="1.1"/>' +
            '<rect class="m-light m-edge" x="18" y="31" width="12" height="8" rx="1"/><path class="m-line" stroke-width="1" style="stroke:var(--dark)" d="M18.5 31.5 24 36l5.5-4.5"/><circle class="m-accent m-edge" cx="24" cy="36" r="1.4"/>',
        ],
        notes: [
          'Raven',
          'Writes everything down with its own feather.',
          `<path ${tint('night')} d="M12 39l-7 4 3.5-7.5Z"/>` +
            `<ellipse ${tint('night')} cx="20" cy="31" rx="11" ry="10"/><circle ${tint('night')} cx="24" cy="16" r="8.5"/>` +
            '<path class="m-yellow m-edge" d="M31.5 15l6 2-6 2Z"/>' +
            eye(26, 15, 2.9) +
            '<circle class="m-blush" cx="28.5" cy="20" r="1.5"/>' +
            `<path ${tint('dusk')} d="M12 27c3 5 8 7 13 6-2 5-7 7-12 5-2-3-2.5-7-1-11Z"/>` +
            '<path class="m-light m-edge" d="M30 42c3-8 7-13 13-17-2 7-6 12-13 17Z"/><path class="m-line" stroke-width="1" d="M31 41l9-12"/>' +
            '<path class="m-line" stroke-width="1.4" d="M17 41v3M23 41v3"/>',
        ],
        tasks: [
          'Skeleton',
          'Works to the bone, and rattles with joy when a task is done.',
          '<path class="m-line" stroke-width="1.8" style="stroke:var(--bone)" d="M19.5 31l-4 5 .5 4.5M28.5 31l4 4.5M21.5 40v5M26.5 40v5"/>' +
            '<path class="m-accent-line" stroke-width="2.4" d="M34.5 38.5l2 2 4-5"/>' +
            '<path class="m-body" d="M19 29.5h10l-1 10.5h-8Z"/><path class="m-light-line" stroke-width="1" d="M21 32.5h6M21 35h6M21.5 37.5h5M24 30v9"/>' +
            `<path ${tint('bone')} d="M24 3c-8.5 0-13.5 5-13.5 11.5 0 5.5 3 9.5 7 11.5 2 1 4.5 1.5 6.5 1.5s4.5-.5 6.5-1.5c4-2 7-6 7-11.5C37.5 8 32.5 3 24 3Z"/>` +
            '<ellipse class="m-eye" style="fill:var(--dark)" cx="18.5" cy="13" rx="3.4" ry="4.4" transform="rotate(-12 18.5 13)"/><ellipse class="m-eye" style="fill:var(--dark)" cx="29.5" cy="13" rx="3.4" ry="4.4" transform="rotate(12 29.5 13)"/>' +
            '<path class="m-pupil" style="fill:var(--dark);translate:none" d="M22.8 19.5l.9-1.8.4 1.8ZM25.2 19.5l-.9-1.8-.4 1.8Z"/>' +
            '<path class="m-line" stroke-width="1.1" style="stroke:var(--dark)" d="M14.5 20.5c5 4.5 14 4.5 19 0"/>' +
            '<path class="m-line" stroke-width=".8" style="stroke:var(--dark)" d="M16.5 21.2l-.5 2M19 22.6l-.3 2.1M21.5 23.4l-.1 2.1M24 23.7v2.1M26.5 23.4l.1 2.1M29 22.6l.3 2.1M31.5 21.2l.5 2"/>',
        ],
        mood: [
          'Jack-o’-lantern',
          'Grins through the gloomy days, and lights up on the good ones.',
          '<path class="m-line" stroke-width="2.2" style="stroke:var(--moss)" d="M24 10c0-3 1-5.5 3.5-6.5"/><path class="m-line" stroke-width="1.1" style="stroke:var(--moss)" d="M27.5 3.5c2.5-.5 4 1 3.2 2.3s-2.7.6-2.2-.8"/>' +
            `<path ${tint('pumpkin')} d="M24 9c-9.5 0-15 7.5-15 17.5S15 43 24 43s15-6.5 15-16.5S33.5 9 24 9Z"/>` +
            '<path class="m-line" stroke-width=".8" style="stroke:var(--dark);stroke-opacity:.35" d="M17.5 11c-3.5 7-3.5 24 0 31M30.5 11c3.5 7 3.5 24 0 31"/>' +
            '<ellipse class="m-eye" style="fill:var(--dark)" cx="18.5" cy="22" rx="3.2" ry="4.4" transform="rotate(-15 18.5 22)"/><ellipse class="m-eye" style="fill:var(--dark)" cx="29.5" cy="22" rx="3.2" ry="4.4" transform="rotate(15 29.5 22)"/>' +
            '<circle class="m-light m-shine" cx="17.6" cy="20.4" r=".9"/><circle class="m-light m-shine" cx="28.6" cy="20.4" r=".9"/>' +
            '<path class="m-line" stroke-width="1.5" style="stroke:var(--dark)" d="M15 31c4 4.5 14 4.5 18 0"/><path class="m-line" stroke-width="1" style="stroke:var(--dark)" d="M17 30l.8 3M20.5 31.8l.4 3M24 32.4v3M27.5 31.8l-.4 3M31 30l-.8 3"/>',
        ],
        routines: [
          'Sleepy bat',
          'Sleeps all day, and wakes up at the same time every night.',
          '<path class="m-line" stroke-width="2.5" d="M2 6c10-2 34-2 44 1"/><path class="m-line" stroke-width="1.6" d="M21 6v4M27 6v4"/>' +
            `<path ${tint('dusk')} d="M15 13c-5 4-6 13-3 19 1.5-2.5 3.5-3.5 5-3l2 6h10l2-6c1.5-.5 3.5.5 5 3 3-6 2-15-3-19Z"/>` +
            `<ellipse ${tint('night')} cx="24" cy="23" rx="9.5" ry="12"/>` +
            `<path ${tint('night')} d="M18 33l-2.5 7 5.5-4ZM30 33l2.5 7-5.5-4Z"/>` +
            eyes(27, 20.5, 27.5, 2.6) +
            blush(23, 18, 30, 1.4) +
            '<path class="m-line" stroke-width="1.2" style="stroke:var(--white)" d="M22.6 22c.8-.8 2-.8 2.8 0"/><path class="m-light m-edge" d="M22 21.6l.8 1.6.8-1.4ZM26 21.6l-.8 1.6-.8-1.4Z"/>',
        ],
        media: [
          'Mummy',
          'Wraps up in its bandages for one more episode.',
          '<path class="m-light-line" stroke-width="1.3" d="M35 11c3.5-.5 6 1 7.5 4.5"/>' +
            '<path class="m-body" d="M15 26h18l1.5 13.5a3.5 3.5 0 0 1-3.5 4H17a3.5 3.5 0 0 1-3.5-4Z"/>' +
            '<ellipse class="m-body" cx="24" cy="16" rx="12" ry="11"/>' +
            '<path class="m-light-line" stroke-width="1.3" d="M16 8c5-1.5 11-1.5 16 0M12.5 12c7 1 16 .5 23-1M12.5 21.5c7 1.5 16 1.5 23 0M14.5 25c6 1 13 1 19-.5M14.5 31c6 1 13 .5 19-1M14 36c6 1.2 14 .8 20-1"/>' +
            eye(19.5, 16.5, 3) + eye(29, 16.8, 2.2) +
            popcorn(30.5).replace('class="m-accent"', 'class="m-accent m-edge"'),
        ],
        lists: [
          'Ghost',
          'Drifts down the hall with a list of everyone it has haunted.',
          '<path class="m-cream" d="M20 5c-7.5 0-12 5.5-12 13v18.5c0 1 1 1.5 1.8.9l2.5-2 2.6 2.4c.6.5 1.4.5 2 0L20 35.5l3.1 2.3c.6.5 1.4.5 2 0l2.6-2.4 2.5 2c.8.6 1.8.1 1.8-.9V18C32 10.5 27.5 5 20 5Z"/>' +
            '<ellipse class="m-eye" style="fill:var(--dark)" cx="16" cy="16.5" rx="2.4" ry="3.4"/><ellipse class="m-eye" style="fill:var(--dark)" cx="24" cy="16.5" rx="2.4" ry="3.4"/>' +
            '<ellipse class="m-blush" cx="12.5" cy="21.5" rx="1.8" ry="1.1"/><ellipse class="m-blush" cx="27.5" cy="21.5" rx="1.8" ry="1.1"/>' +
            '<ellipse class="m-pupil" style="fill:var(--dark);translate:none" cx="20" cy="23" rx="1.4" ry="1.9"/>' +
            '<path class="m-light m-edge" d="M32 22h11v16l-1.8-1.3-1.8 1.3-1.8-1.3-1.8 1.3-1.8-1.3L32 38Z"/><path class="m-line" stroke-width=".8" style="stroke:var(--dark)" d="M34.5 26h6M34.5 29h6M34.5 32h4.5"/>' +
            '<ellipse class="m-cream" cx="32" cy="29" rx="2.4" ry="2"/>',
        ],
      },
    },

    coffee: {
      name: 'Coffee',
      crew: {
        occurrences: [
          'Cake bun',
          'Saves a slice of cake for every date worth celebrating.',
          '<path class="m-cream" d="M19 9c-7.5 0-11 5.5-11 12v11c0 6 4.5 9 11 9s11-3 11-9V21c0-6.5-3.5-12-11-12Z"/>' +
            dots(20, 15.5, 22.5) +
            blush(24, 13, 25, 1.6) +
            '<path class="m-line" stroke-width="1" d="M18 23.5c.6.6 1.4.6 2 0"/>' +
            '<rect class="m-light m-edge" x="24" y="33" width="20" height="11" rx="1.5"/><rect class="m-accent m-edge" x="24" y="30" width="20" height="4.5" rx="2"/>' +
            '<rect class="m-light m-edge" x="32.7" y="22" width="2.6" height="8"/>' +
            '<path class="m-yellow" d="M34 15.5c1.6 2 2 3.4 1.3 4.5a1.5 1.5 0 0 1-2.6 0c-.7-1.1-.3-2.5 1.3-4.5Z"/>' +
            '<ellipse class="m-cream" cx="26" cy="36" rx="3" ry="2.2"/>',
        ],
        places: [
          'Coffee to go',
          'Takes its coffee for a walk, and loves finding a new café.',
          '<ellipse class="m-cream" cx="16" cy="43" rx="3.5" ry="2"/><ellipse class="m-cream" cx="26" cy="43" rx="3.5" ry="2"/>' +
            '<path class="m-cream" d="M21 9c-7.5 0-11 5.5-11 12v11c0 6 4.5 9 11 9s11-3 11-9V21c0-6.5-3.5-12-11-12Z"/>' +
            dots(20, 17.5, 24.5) +
            blush(24, 15, 27, 1.6) +
            '<path class="m-line" stroke-width="1" d="M20 23.5c.6.6 1.4.6 2 0"/>' +
            '<path class="m-accent m-edge" d="M31 25h10l-1.3 16a1.5 1.5 0 0 1-1.5 1.4h-4.4a1.5 1.5 0 0 1-1.5-1.4Z"/>' +
            '<rect class="m-body" x="30" y="22.5" width="12" height="3.2" rx="1.2"/><rect class="m-light m-edge" x="31.8" y="30.5" width="8.4" height="4.5"/>' +
            '<path class="m-line" stroke-width="1.2" d="M34 19c-1-1.5 1-2.5 0-4M38 19c-1-1.5 1-2.5 0-4"/>' +
            '<circle class="m-cream" cx="31" cy="32" r="2.6"/>',
        ],
        links: [
          'Laptop bun',
          'Opens a new tab with every sip.',
          '<path class="m-cream" d="M24 8c-7.5 0-11 5.5-11 12v10h22V20c0-6.5-3.5-12-11-12Z"/>' +
            dots(19, 20.5, 27.5) +
            blush(23, 18, 30, 1.6) +
            '<path class="m-line" stroke-width="1" d="M23 22.5c.6.6 1.4.6 2 0"/>' +
            '<rect class="m-body m-edge" x="9" y="25" width="30" height="16" rx="1.5"/><rect class="m-body m-edge" x="5" y="41" width="38" height="3" rx="1.5"/>' +
            '<path class="m-accent-line" stroke-width="1.6" d="M21 30.5h-2a2.5 2.5 0 0 0 0 5h2M27 30.5h2a2.5 2.5 0 0 1 0 5h-2M21.5 33h5"/>' +
            '<ellipse class="m-cream" cx="12" cy="26" rx="2.6" ry="2"/><ellipse class="m-cream" cx="36" cy="26" rx="2.6" ry="2"/>',
        ],
        notes: [
          'Writer bun',
          'Jots down every thought while the coffee is still warm.',
          '<path class="m-line" stroke-width="1.2" d="M39 21c-1-1.5 1-2.5 0-4"/>' +
            '<path class="m-cream" d="M20 8c-7.5 0-11 5.5-11 12v11c0 6 4.5 9 11 9s11-3 11-9V20c0-6.5-3.5-12-11-12Z"/>' +
            dots(19, 16.5, 23.5) +
            blush(23, 14, 26, 1.6) +
            '<path class="m-line" stroke-width="1" d="M19 22.5c.6.6 1.4.6 2 0"/>' +
            '<path class="m-accent m-edge" d="M34 25h10v12c0 2-1.5 3.5-3.5 3.5h-3c-2 0-3.5-1.5-3.5-3.5Z"/><path class="m-line" stroke-width="1.6" d="M44 28c2 0 2.5 1.5 2.3 3s-1 2.4-2.3 2.4"/>' +
            '<rect class="m-light m-edge" x="8" y="33" width="20" height="11" rx="1" transform="rotate(-6 18 38.5)"/>' +
            '<path class="m-line" stroke-width=".9" d="M11 37.5l12-1.3M11.4 40.5l9-1"/>' +
            '<path class="m-accent m-edge" d="M24 38l8-11 2 1.4-8 11-2.6 1Z"/>' +
            '<circle class="m-cream" cx="26" cy="36" r="2.4"/>',
        ],
        tasks: [
          'Barista bun',
          'Takes every order, and checks each one off.',
          '<path class="m-cream" d="M22 8c-7.5 0-11 5.5-11 12v12c0 6 4.5 9 11 9s11-3 11-9V20c0-6.5-3.5-12-11-12Z"/>' +
            '<path class="m-accent m-edge" d="M15 27h14v8c0 3-3 5.5-7 5.5S15 38 15 35Z"/><path class="m-line" stroke-width="1" d="M15 27l-3-4M29 27l3-4"/>' +
            dots(18.5, 18.5, 25.5) +
            blush(22, 16, 28, 1.6) +
            '<path class="m-line" stroke-width="1" d="M21 21.5c.6.6 1.4.6 2 0"/>' +
            '<rect class="m-light m-edge" x="32" y="22" width="11" height="14" rx="1"/>' +
            '<path class="m-accent-line" stroke-width="1.5" d="M34 26l1 1 1.6-1.8M34 31l1 1 1.6-1.8"/><path class="m-line" stroke-width=".8" d="M38.3 26.3h3M38.3 31.3h3"/>' +
            '<circle class="m-cream" cx="32.5" cy="30" r="2.4"/>',
        ],
        mood: [
          'Mug hug',
          'Hugs a warm mug, however you’re feeling.',
          '<ellipse class="m-cream" cx="24" cy="18" rx="12" ry="10"/>' +
            dots(17, 20, 28) +
            blush(20.5, 16.5, 31.5, 1.7) +
            '<path class="m-line" stroke-width="1" d="M23 20.5c.6.6 1.4.6 2 0"/>' +
            '<path class="m-line" stroke-width="5.5" d="M37 26c6 0 8 3 7.5 6.5s-3.5 5.5-8 5"/><path class="m-accent-line" stroke-width="2.6" d="M37 26c6 0 8 3 7.5 6.5s-3.5 5.5-8 5"/>' +
            '<path class="m-accent m-edge" d="M7 23h34v13c0 5-4 8.5-8.5 8.5h-17C11 44.5 7 41 7 36Z"/>' +
            '<path class="m-light-line" stroke-width="1.6" d="M11 28v6"/>' +
            '<ellipse class="m-cream" cx="13.5" cy="24.5" rx="4.5" ry="2.8" transform="rotate(-15 13.5 24.5)"/><ellipse class="m-cream" cx="34.5" cy="24.5" rx="4.5" ry="2.8" transform="rotate(15 34.5 24.5)"/>',
        ],
        routines: [
          'Morning bun',
          'Has the same cup at sunrise, every single day.',
          '<circle class="m-yellow" cx="39" cy="10" r="5"/><path class="m-line" stroke-width="1.2" d="M39 1.5V3M47.5 10H46M45 4l-1 1M33 4l1 1"/>' +
            '<path class="m-cream" d="M22 9c-7.5 0-11 5.5-11 12v11c0 6 4.5 9 11 9s11-3 11-9V21c0-6.5-3.5-12-11-12Z"/>' +
            '<path class="m-line" stroke-width="1" d="M17.3 20c.7.8 1.7.8 2.4 0M24.3 20c.7.8 1.7.8 2.4 0"/>' +
            blush(23, 16, 28, 1.6) +
            '<path class="m-line" stroke-width="1.2" d="M20 31c-1-1.5 1-2.5 0-4M24 31c-1-1.5 1-2.5 0-4"/>' +
            '<path class="m-accent m-edge" d="M15 32h14v6c0 3-2.5 5-5 5h-4c-2.5 0-5-2-5-5Z"/>' +
            '<ellipse class="m-cream" cx="15" cy="36.5" rx="2.6" ry="2.2"/><ellipse class="m-cream" cx="29" cy="36.5" rx="2.6" ry="2.2"/>',
        ],
        media: [
          'Boba bun',
          'Sips slowly through every episode, headphones on.',
          '<path class="m-cream" d="M20 10c-7.5 0-11 5.5-11 12v10c0 6 4.5 9 11 9s11-3 11-9V22c0-6.5-3.5-12-11-12Z"/>' +
            '<path class="m-line" stroke-width="2" d="M9.5 21c0-8 4.5-12.5 10.5-12.5S30.5 13 30.5 21"/>' +
            '<rect class="m-accent m-edge" x="6.5" y="18" width="5" height="8" rx="2.2"/><rect class="m-accent m-edge" x="28.5" y="18" width="5" height="8" rx="2.2"/>' +
            dots(21, 16.5, 23.5) +
            blush(25, 14.5, 25.5, 1.6) +
            '<path class="m-accent m-edge" d="M35.5 7l1.8.5-3 15-1.8-.5Z"/>' +
            '<path class="m-light m-edge" d="M30 21h12l-1.6 20a2 2 0 0 1-2 1.8h-4.8a2 2 0 0 1-2-1.8Z"/>' +
            '<circle class="m-body" cx="33.5" cy="38.5" r="1.4"/><circle class="m-body" cx="37" cy="39.5" r="1.4"/><circle class="m-body" cx="38.5" cy="36" r="1.4"/><circle class="m-body" cx="34.5" cy="35" r="1.4"/>' +
            '<circle class="m-cream" cx="30" cy="31" r="2.4"/>',
        ],
        lists: [
          'Menu bun',
          'Writes the day’s menu on the board, one item at a time.',
          '<path class="m-line" stroke-width="1.6" d="M30 37l-3 7M42 37l3 7"/>' +
            '<rect class="m-body m-edge" x="25" y="10" width="22" height="28" rx="1.5"/>' +
            '<path class="m-accent-line" stroke-width="1.5" d="M28 16l1 1 1.6-1.8M28 22l1 1 1.6-1.8M28 28l1 1 1.6-1.8"/><path class="m-light-line" stroke-width="1" d="M33 16.4h10M33 22.4h8M33 28.4h9"/>' +
            '<path class="m-cream" d="M14 14c-7 0-10 5-10 11v10c0 5.5 4 8.5 10 8.5s10-3 10-8.5V25c0-6-3-11-10-11Z"/>' +
            dots(24, 11, 17.5) +
            blush(27.5, 9, 20, 1.5) +
            '<path class="m-line" stroke-width="1" d="M13.3 27c.6.6 1.4.6 2 0"/>' +
            '<circle class="m-cream" cx="24.5" cy="30" r="2.4"/>',
        ],
      },
    },

    space: {
      name: 'Little one',
      crew: {
        occurrences: [
          'Countdown alien',
          'Marks every big day on the calendar with a little heart.',
          alien(21, 19, grin(21, 25.5)) +
            '<rect class="m-light m-edge" x="31" y="27" width="13" height="13" rx="1.5"/><rect class="m-red m-edge" x="31" y="27" width="13" height="3.5" rx="1.5"/>' +
            '<path class="m-red" d="M37.5 38c-2-1.3-3.3-2.3-3.3-3.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.5 1.9 1.1.5-.6 1.1-1.1 1.9-1.1.8 0 1.4.6 1.4 1.4 0 1.1-1.3 2.1-3.3 3.4Z"/>' +
            `<circle ${tint('green')} cx="31.5" cy="33" r="2.4"/>`,
        ],
        places: [
          'Explorer alien',
          'Drops a pin on every new world it visits.',
          alien(20, 19, grin(20, 25.5)) +
            '<path class="m-accent m-edge" d="M38 42c-4-5-7-9-7-13a7 7 0 0 1 14 0c0 4-3 8-7 13Z"/><circle class="m-light m-edge" cx="38" cy="29" r="2.6"/>' +
            `<circle ${tint('green')} cx="31.5" cy="33" r="2.4"/>`,
        ],
        links: [
          'Signal alien',
          'Phones home with every link it finds.',
          alien(20, 19, grin(20, 25.5)) +
            '<path class="m-accent-line" stroke-width="1.8" d="M40 16c2 1.5 3 3.5 3 6M42.5 12.5c3 2 4.5 5.5 4.5 9"/>' +
            `<rect ${tint('bg-cat-travel')} x="32" y="20" width="7" height="14" rx="2"/><rect class="m-light m-edge" x="33.5" y="22" width="4" height="5" rx="1"/><circle class="m-yellow m-edge" cx="35.5" cy="18" r="1.4"/>` +
            `<circle ${tint('green')} cx="32" cy="31" r="2.4"/>`,
        ],
        notes: [
          'Curious alien',
          'Writes down everything it learns about your planet.',
          alien(24, 17, grin(24, 23.5)) +
            '<rect class="m-light m-edge" x="15" y="31" width="18" height="11" rx="1" transform="rotate(-5 24 36.5)"/><path class="m-line" stroke-width=".9" d="M18 35l11-1M18.3 38l8-.7"/>' +
            '<path class="m-yellow m-edge" d="M30 39l8-12 2 1.3-8 12-2.6 1Z"/>' +
            `<circle ${tint('green')} cx="31" cy="37" r="2.3"/><circle ${tint('green')} cx="15.5" cy="38" r="2.3"/>`,
        ],
        tasks: [
          'Busy alien',
          'Checks off every task with a happy little beep.',
          alien(20, 19, grin(20, 25.5)) +
            '<rect class="m-light m-edge" x="30" y="22" width="14" height="18" rx="1.5"/><rect class="m-body" x="34" y="20.5" width="6" height="3" rx="1"/>' +
            '<path class="m-accent-line" stroke-width="1.6" d="M32.5 28l1 1 1.8-2M32.5 34l1 1 1.8-2"/><path class="m-line" stroke-width=".9" d="M37 28.3h4.5M37 34.3h4.5"/>' +
            `<circle ${tint('green')} cx="30.5" cy="32" r="2.4"/>`,
        ],
        mood: [
          'Lovebug alien',
          'Blows you a kiss, whatever kind of day it is.',
          '<path class="m-red m-edge" d="M40 13c-3.2-2-5.3-3.6-5.3-5.4 0-1.3 1-2.2 2.2-2.2 1.3 0 2.3.8 3.1 1.8.8-1 1.8-1.8 3.1-1.8 1.2 0 2.2.9 2.2 2.2 0 1.8-2.1 3.4-5.3 5.4Z"/>' +
            alien(22, 19, kiss(22, 25.5)) +
            `<ellipse ${tint('green')} cx="34" cy="27" rx="2.4" ry="3" transform="rotate(-20 34 27)"/>`,
        ],
        routines: [
          'Early alien',
          'Wakes up with the same alarm every morning, and never snoozes.',
          alien(20, 19, grin(20, 25.5)) +
            '<path class="m-line" stroke-width="1.4" d="M33 23l-2-2M43 23l2-2"/>' +
            '<circle class="m-yellow m-edge" cx="38" cy="31" r="7"/><circle class="m-light m-edge" cx="38" cy="31" r="4.6"/><path class="m-line" stroke-width="1.2" d="M38 31v-3M38 31l2 1.2"/>' +
            `<circle ${tint('green')} cx="31.5" cy="33" r="2.4"/>`,
        ],
        media: [
          'Movie alien',
          'Never misses an episode, popcorn in hand.',
          alien(24, 15, '<path class="m-body" d="M22.5 20.5h3c0 1.6-.7 2.6-1.5 2.6s-1.5-1-1.5-2.6Z"/>') +
            popcorn(30).replace('class="m-accent"', 'class="m-accent m-edge"'),
        ],
        lists: [
          'Stargazer alien',
          'Keeps a list of every star it has wished on.',
          '<path class="m-yellow m-edge" d="M40 3l1.6 3.5 3.8.4-2.8 2.6.8 3.8-3.4-2-3.4 2 .8-3.8-2.8-2.6 3.8-.4Z"/>' +
            alien(20, 19, grin(20, 25.5)) +
            '<path class="m-light m-edge" d="M31 22h11v18c0 1.5-1 2.5-2.5 2.5H33.5C32 42.5 31 41.5 31 40Z"/>' +
            '<path class="m-yellow" d="M33.5 26.3l.6 1.2 1.3.2-1 .9.3 1.3-1.2-.7-1.2.7.3-1.3-1-.9 1.3-.2ZM33.5 32.3l.6 1.2 1.3.2-1 .9.3 1.3-1.2-.7-1.2.7.3-1.3-1-.9 1.3-.2Z"/><path class="m-line" stroke-width=".9" d="M36.5 27.8h3.5M36.5 33.8h3.5M33 38.8h7"/>' +
            `<circle ${tint('green')} cx="31.5" cy="33" r="2.4"/>`,
        ],
      },
    },

    ghost: {
      name: 'Ghost',
      crew: {
        occurrences: [
          'Party ghost',
          'Pops out of nowhere for every date worth celebrating.',
          '<path class="m-accent m-edge" d="M24 2l5 11H19Z"/><circle class="m-yellow m-edge" cx="24" cy="2" r="1.6"/>' +
            ghost(24, 12) + grin(24, 26),
        ],
        places: [
          'Wandering ghost',
          'Floats off to a new place every night, map in hand.',
          ghost(20, 12) + grin(20, 26) +
            '<rect class="m-light m-edge" x="29" y="25" width="15" height="12" rx="1"/><path class="m-accent-line" stroke-width="1.2" stroke-dasharray="1.5 1.5" d="M31 34c3-4 6 0 10-5"/><circle class="m-red" cx="41" cy="28.5" r="1.4"/>' +
            '<ellipse class="m-cream" cx="30" cy="30" rx="2.6" ry="2"/>',
        ],
        links: [
          'Mail ghost',
          'Slips a note under every door, one after another.',
          ghost(20, 12) + grin(20, 26) +
            '<rect class="m-light m-edge" x="29" y="26" width="15" height="10" rx="1"/><path class="m-line" stroke-width="1" d="M29.5 26.5 36.5 32l7-5.5"/>' +
            '<ellipse class="m-cream" cx="30" cy="31" rx="2.6" ry="2"/>',
        ],
        notes: [
          'Poet ghost',
          'Writes everything down before it fades away.',
          ghost(20, 12) + grin(20, 26) +
            '<path class="m-light m-edge" d="M30 40c3-9 7-14 14-18-2 8-6 13-14 18Z"/>' +
            '<ellipse class="m-cream" cx="31" cy="36" rx="2.6" ry="2"/>',
        ],
        tasks: [
          'Busy ghost',
          'Haunts every task until it’s checked off.',
          ghost(20, 12) + grin(20, 26) +
            '<rect class="m-light m-edge" x="30" y="22" width="13" height="16" rx="1.5"/><path class="m-accent-line" stroke-width="1.5" d="M32.5 27.5l1 1 1.8-2M32.5 33l1 1 1.8-2"/>' +
            '<ellipse class="m-cream" cx="30.5" cy="31" rx="2.6" ry="2"/>',
        ],
        mood: [
          'Cuddly ghost',
          'Gives the softest hugs on the gloomy days.',
          '<path class="m-red" d="M40 13c-2.5-1.6-4-2.8-4-4.1 0-1 .8-1.7 1.7-1.7.9 0 1.7.6 2.3 1.4.6-.8 1.4-1.4 2.3-1.4.9 0 1.7.7 1.7 1.7 0 1.3-1.5 2.5-4 4.1Z"/>' +
            ghost(24, 12) + kiss(24, 27) +
            '<ellipse class="m-cream" cx="12" cy="26" rx="2.6" ry="3.6" transform="rotate(-30 12 26)"/><ellipse class="m-cream" cx="36" cy="26" rx="2.6" ry="3.6" transform="rotate(30 36 26)"/>',
        ],
        routines: [
          'Night-shift ghost',
          'Floats by at the same time every night.',
          '<path class="m-accent m-edge" d="M14 15c2-7 8-10 15-9-1 3-1 6 1 9Z"/><circle class="m-light m-edge" cx="30" cy="5.5" r="2"/>' +
            ghost(24, 12) + grin(24, 26) +
            '<path class="m-line" stroke-width="1.2" d="M38 8h4l-4 4h4M43 2h3l-3 3h3"/>',
        ],
        media: [
          'Movie ghost',
          'Watches every episode, and isn’t scared of any of them.',
          ghost(24, 6) + '<path class="m-body" d="M22.5 21h3c0 1.6-.7 2.6-1.5 2.6s-1.5-1-1.5-2.6Z"/>' +
            popcorn(30).replace('class="m-accent"', 'class="m-accent m-edge"'),
        ],
        lists: [
          'Shopping ghost',
          'Floats down the aisles with a list as long as its sheet.',
          ghost(18, 12) + grin(18, 26) +
            '<path class="m-light m-edge" d="M28 18h13v24l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-3 1.5Z"/><path class="m-line" stroke-width=".9" d="M31 23h7M31 27h7M31 31h5M31 35h7"/>' +
            '<ellipse class="m-cream" cx="28.5" cy="30" rx="2.6" ry="2"/>',
        ],
      },
    },

    kitty: {
      name: 'Black cat',
      crew: {
        occurrences: [
          'Party cat',
          'Wears a party hat for every date worth celebrating.',
          kitty() + '<path class="m-accent m-edge" d="M31.7 1.5l4.5 11.5h-9Z"/><circle class="m-yellow m-edge" cx="31.7" cy="1.5" r="1.6"/>',
        ],
        places: [
          'Napping cat',
          'Naps in every place worth coming back to.',
          '<path class="m-accent m-edge" d="M14 22c-3-4-5-6.5-5-9.5a5 5 0 0 1 10 0c0 3-2 5.5-5 9.5Z"/><circle class="m-light m-edge" cx="14" cy="12.5" r="1.8"/><path class="m-line" stroke-width="1.1" d="M21 5h3l-3 3.5h3M26 1h2.5L26 4h2.5"/>' + kitty(true),
        ],
        links: [
          'Yarn cat',
          'Follows the thread from one link to the next.',
          '<path class="m-accent-line" stroke-width="1" d="M18 18c2 6 6 9 9 15"/><circle class="m-accent m-edge" cx="14" cy="14" r="6"/><path class="m-line" stroke-width=".8" d="M9.5 12c2.5 1.5 6 1.5 8.5-1M10 16.5c2.5 1 5.5.5 8-1.5"/>' + kitty(),
        ],
        notes: [
          'Desk cat',
          'Naps right next to your notes, so you’ll never lose them.',
          '<rect class="m-light m-edge" x="5" y="8" width="18" height="13" rx="1"/><path class="m-line" stroke-width=".9" d="M8 12.5h12M8 16h8"/><path class="m-accent m-edge" d="M19 21 24 10l2 1-5 11-2.6 1Z"/>' + kitty(),
        ],
        tasks: [
          'Pushy cat',
          'Knocks tasks off the list, one by one.',
          '<rect class="m-light m-edge" x="6" y="5" width="14" height="17" rx="1.5"/><path class="m-accent-line" stroke-width="1.5" d="M8.5 10l1 1 1.8-2M8.5 16l1 1 1.8-2"/><path class="m-line" stroke-width=".8" d="M13 10.3h4.5M13 16.3h4.5"/>' + kitty(),
        ],
        mood: [
          'Loaf cat',
          'Tucks its paws in and purrs, whatever the day brings.',
          '<path class="m-red" d="M15 18c-3.5-2.3-5.6-4-5.6-5.8 0-1.4 1.1-2.4 2.4-2.4 1.3 0 2.4.9 3.2 2 .8-1.1 1.9-2 3.2-2 1.3 0 2.4 1 2.4 2.4 0 1.8-2.1 3.5-5.6 5.8Z"/><path class="m-red" d="M23 9c-1.8-1.2-3-2-3-3 0-.8.6-1.3 1.3-1.3.7 0 1.3.5 1.7 1 .4-.5 1-1 1.7-1 .7 0 1.3.5 1.3 1.3 0 1-1.2 1.8-3 3Z"/>' + kitty(),
        ],
        routines: [
          'Breakfast cat',
          'Asks for breakfast at six sharp, every single morning.',
          '<path class="m-accent m-edge" d="M5 15h18l-2.5 7h-13Z"/><path class="m-light m-edge" d="M8.5 13c2-2.6 6.5-2.6 8.5 0-2 2.6-6.5 2.6-8.5 0Zm8.5 0 3-2.2v4.4Z"/><circle class="m-pupil" style="fill:var(--dark)" cx="11" cy="12.6" r=".6"/><circle class="m-yellow m-edge" cx="44" cy="5" r="3.5"/>' + kitty(),
        ],
        media: [
          'Remote cat',
          'Keeps a paw on the remote, so it’s always one more episode.',
          popcorn(9, 12).replace('class="m-accent"', 'class="m-accent m-edge"') + kitty(),
        ],
        lists: [
          'Shopping cat',
          'Keeps the shopping list warm until it’s all ticked off.',
          '<path class="m-light m-edge" d="M6 4h14v18l-1.75-1.3-1.75 1.3-1.75-1.3-1.75 1.3-1.75-1.3-1.75 1.3L6 22Z"/><path class="m-line" stroke-width=".8" d="M9 8.5h8M9 12h8M9 15.5h5"/>' + kitty(),
        ],
      },
    },
  };

  // Mascots drawn looking to one side, so a visiting one turns to look where it moves.
  const facing = {
    sea: { occurrences: 'left', routines: 'left' },
    halloween: {},
    coffee: {},
    space: {},
    ghost: {},
    kitty: {},
  };

  const castOf = (theme) =>
    Object.fromEntries(Object.entries(themes[theme].crew).map(([id, [, , parts]]) => [id, mascot(accents[id], parts, themes[theme].bodies?.[id], themes[theme].dusk)]));
  const saved = () => {
    try {
      const theme = localStorage.getItem(THEME_KEY);
      return themes[theme] ? theme : 'sea';
    } catch {
      return 'sea';
    }
  };

  window.YokoMascots = {
    theme: saved(),
    themes: Object.entries(themes).map(([id, { name, crew }]) => ({
      id,
      name,
      cast: castOf(id),
      crew: Object.entries(crew).map(([module, [character, why]]) => ({ module, character, why })),
    })),
    facing(module) {
      return facing[this.theme][module];
    },
    setTheme(theme) {
      if (!themes[theme]) return;
      this.theme = theme;
      window.mascots = castOf(theme);
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        // Storage blocked: the theme just isn't remembered.
      }
    },
  };
  window.mascots = castOf(window.YokoMascots.theme);
})();
