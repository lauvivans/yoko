// Module mascots: Yoko's sea friends, flat dark silhouettes on a 48x48 grid in the same style (#188).
// Colors come from tokens through classes (shell.css): the body is dark, the eyes take the module color.
(() => {
  const mascot = (accent, parts) =>
    `<svg class="c-mascot" viewBox="0 0 48 48" style="--mascot-accent:${accent}" aria-hidden="true" focusable="false">${parts}</svg>`;
  const eye = (x, y, r = 3.4) => `<circle class="m-eye" cx="${x}" cy="${y}" r="${r}"/><circle class="m-pupil" cx="${x}" cy="${y}" r="${(r * 0.41).toFixed(2)}"/>`;
  const eyes = (y, left = 18.5, right = 29.5, r) => eye(left, y, r) + eye(right, y, r);

  window.mascots = {
    // Places: the otter holds a pebble on its belly.
    places: mascot(
      'var(--yellow)',
      '<path class="m-line" stroke-width="4.5" d="M35 41c4 .5 7-1 8.5-4.5"/>' +
        '<circle class="m-body" cx="14.5" cy="10.5" r="3.6"/><circle class="m-body" cx="33.5" cy="10.5" r="3.6"/>' +
        '<path class="m-body" d="M24 6c-8 0-13 5.5-13 13v18a7 7 0 0 0 7 7h12a7 7 0 0 0 7-7V19c0-7.5-5-13-13-13Z"/>' +
        eyes(19.5) +
        '<ellipse class="m-light" cx="24" cy="26.5" rx="5.5" ry="3.8"/><path class="m-pupil" d="M22.4 24.6h3.2L24 26.6Z"/>' +
        '<path class="m-light-line" stroke-width="1" d="M17.5 26 13 25M17.5 28 13 29.5M30.5 26 35 25M30.5 28 35 29.5"/>' +
        '<ellipse class="m-eye" cx="24" cy="36" rx="4.6" ry="3.6"/><circle class="m-body" cx="19.6" cy="35.2" r="2.6"/><circle class="m-body" cx="28.4" cy="35.2" r="2.6"/>',
    ),

    // Occurrences: a turtle peeking out of its shell, the shell marked like a calendar.
    occurrences: mascot(
      'var(--blue)',
      '<rect class="m-body" x="8" y="35" width="8" height="8" rx="3.5"/><rect class="m-body" x="32" y="35" width="8" height="8" rx="3.5"/>' +
        '<circle class="m-body" cx="24" cy="15" r="9.5"/>' +
        '<path class="m-body" d="M5 39c0-11.5 8.5-19.5 19-19.5S43 27.5 43 39a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"/>' +
        '<path class="m-accent-line" stroke-width="1.6" d="M13 31.5h22M18 25.5v13M24 23.5v15M30 25.5v13"/>' +
        eyes(13.5, 20, 28, 2.9) +
        '<path class="m-light-line" stroke-width="1.4" d="M21.5 18.5c1.5 1.2 3.5 1.2 5 0"/>',
    ),

    // Tasks: a crab with two open claws, ready to get things done.
    tasks: mascot(
      'var(--bg-cat-finance)',
      '<path class="m-line" stroke-width="2.4" d="M12 34l-6 3.5M13.5 37.5l-4.5 4.5M36 34l6 3.5M34.5 37.5l4.5 4.5M10 22l4.5 5M38 22l-4.5 5"/>' +
        '<path class="m-body" d="M8 11.5a5.5 5.5 0 1 0 5.5 5.5H8Z"/><path class="m-body" d="M40 11.5a5.5 5.5 0 1 1-5.5 5.5H40Z"/>' +
        '<rect class="m-body" x="16.5" y="14" width="3" height="10" rx="1.5"/><rect class="m-body" x="28.5" y="14" width="3" height="10" rx="1.5"/>' +
        '<ellipse class="m-body" cx="24" cy="31" rx="15" ry="10"/>' +
        eyes(13, 18, 30) +
        '<path class="m-light-line" stroke-width="1.6" d="M20.5 31c2 2 5 2 7 0"/>',
    ),

    // Notes: a seal balancing a pencil on its nose.
    notes: mascot(
      'var(--bg-cat-study)',
      '<path class="m-accent" d="M27.5 1.5l3 1.4-4.6 9.8-3-1.4Z"/><path class="m-pupil" d="M22.9 11.3l3 1.4-2.6 1.6Z"/>' +
        '<ellipse class="m-body" cx="12" cy="40" rx="6" ry="3" transform="rotate(-20 12 40)"/><ellipse class="m-body" cx="36" cy="40" rx="6" ry="3" transform="rotate(20 36 40)"/>' +
        '<path class="m-body" d="M24 13c-7.5 0-12 5.5-12 12.5v9c0 5.5 5 8.5 12 8.5s12-3 12-8.5v-9C36 18.5 31.5 13 24 13Z"/>' +
        eyes(23, 19, 29, 3.1) +
        '<ellipse class="m-light" cx="24" cy="29.5" rx="4.6" ry="3.2"/><path class="m-pupil" d="M22.6 27.8h2.8L24 29.6Z"/>' +
        '<path class="m-light-line" stroke-width="1" d="M18.8 29 15 28.2M18.8 31 15 32M29.2 29 33 28.2M29.2 31 33 32"/>',
    ),

    // Mood: a jellyfish with rosy cheeks, floating along with how you feel.
    mood: mascot(
      'var(--bg-cat-social)',
      '<path class="m-line" stroke-width="2.4" d="M15 29c-1.5 4 1.5 6.5 0 10.5M21 29c-1.5 4.5 1.5 7.5 0 12.5M27 29c1.5 4.5-1.5 7.5 0 12.5M33 29c1.5 4-1.5 6.5 0 10.5"/>' +
        '<path class="m-body" d="M9 26.5C9 16.5 15.5 9 24 9s15 7.5 15 17.5c0 1.6-1.1 2.5-2.5 2.5h-25C10.1 29 9 28.1 9 26.5Z"/>' +
        eyes(19.5) +
        '<circle class="m-blush" cx="14.5" cy="24" r="2"/><circle class="m-blush" cx="33.5" cy="24" r="2"/>' +
        '<path class="m-light-line" stroke-width="1.6" d="M21.5 24.5c1.5 1.4 3.5 1.4 5 0"/>',
    ),

    // Links: a pufferfish, its spikes like links reaching out.
    links: mascot(
      'var(--bg-cat-reading)',
      '<path class="m-line" stroke-width="2.6" d="M24 11V6.5M33.9 15.1l3.2-3.2M38 25h4.5M33.9 34.9l3.2 3.2M24 39v4.5M14.1 34.9l-3.2 3.2M10 25H5.5M14.1 15.1l-3.2-3.2"/>' +
        '<circle class="m-body" cx="24" cy="25" r="14"/>' +
        eyes(22) +
        '<circle class="m-light" cx="24" cy="30.5" r="2"/>',
    ),

    // Routines: a seahorse, curled tail and crown, as steady as a morning routine.
    routines: mascot(
      'var(--bg-cat-health)',
      '<path class="m-line" stroke-width="7" d="M27 19c5.5 3 6.5 9.5 3.5 14.5-2.2 3.6-5.6 5.2-8.2 4.3-2.6-.9-2.3-4 .1-4.6 2-.5 3.1 1 2.6 2.4"/>' +
        '<path class="m-accent" d="M33 21.5l5.5 1.8-4.6 4Z"/>' +
        '<path class="m-line" stroke-width="2" d="M23.5 7l1.2-3.6 1.6 3.4M27.6 7.6l3-2.4.3 3.6"/>' +
        '<circle class="m-body" cx="26" cy="13.5" r="7.5"/>' +
        '<path class="m-body" d="M11 12.2h11v3.8H11a1.9 1.9 0 0 1 0-3.8Z"/>' +
        eye(27.5, 12.5, 3.3),
    ),

    // Media: an anglerfish whose light glows like a screen at night.
    media: mascot(
      'var(--bg-cat-work)',
      '<path class="m-line" stroke-width="2" d="M24 15.5c0-5.5 3.5-9 8-9.5"/>' +
        '<circle class="m-eye" cx="34" cy="6" r="4"/>' +
        '<path class="m-body" d="M9.5 24.5 5 20v10l4.5-3.5ZM38.5 24.5 43 20v10l-4.5-3.5Z"/>' +
        '<circle class="m-body" cx="24" cy="28" r="14"/>' +
        eyes(24) +
        '<path class="m-light" d="M15 31.5h18c-1.2 4.4-4.8 7-9 7s-7.8-2.6-9-7Z"/>' +
        '<path class="m-line" stroke-width="1.1" d="M16.5 31.5l1.6 2.3 1.6-2.3 1.6 2.3 1.6-2.3 1.6 2.3 1.6-2.3 1.6 2.3 1.6-2.3 1.6 2.3 1.6-2.3"/>',
    ),

    // Lists: a starfish, five arms and a dot on each, like a bullet list.
    lists: mascot(
      'var(--bg-cat-home)',
      '<path class="m-body m-round" d="M24 8 29.58 18.31 41.12 20.44 33.03 28.94 34.58 40.56 24 35.5 13.42 40.56 14.97 28.94 6.88 20.44 18.42 18.31Z"/>' +
        '<circle class="m-light" cx="24" cy="13.5" r="1.2"/><circle class="m-light" cx="36" cy="21.8" r="1.2"/><circle class="m-light" cx="31.6" cy="36" r="1.2"/>' +
        '<circle class="m-light" cx="16.4" cy="36" r="1.2"/><circle class="m-light" cx="12" cy="21.8" r="1.2"/>' +
        eyes(24, 20.5, 27.5, 2.8) +
        '<path class="m-light-line" stroke-width="1.4" d="M21.5 29c1.5 1.3 3.5 1.3 5 0"/>',
    ),
  };
})();
