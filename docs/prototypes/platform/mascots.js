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

    // Occurrences: a whale blowing a spout, its song comes back every year like the dates you keep.
    occurrences: mascot(
      'var(--blue)',
      '<path class="m-body" d="M5 29c0-7.5 7-13 17.5-13 8.5 0 13.5 4 15.5 9.5l4.5-5.5c1.5 4 .5 8.5-3 10.5.5 6.5-5.5 12.5-17.5 12.5C11.5 43 5 37.5 5 29Z"/>' +
        '<path class="m-accent-line" stroke-width="1.8" d="M16 15c-1.5-3-1-6 1-8.5M16 15c1.5-3.5 4-5.5 7.5-6"/>' +
        '<circle class="m-eye" cx="14" cy="5.5" r="1.6"/><circle class="m-eye" cx="25.5" cy="8" r="1.6"/>' +
        eye(14, 27, 3.3) +
        '<path class="m-light-line" stroke-width="1.4" d="M8 33.5c3 2.4 7 3 10.5 2M10 38c4 2 9.5 2.4 14 1.2"/>',
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

    // Routines: a seahorse, crown and curled tail, as steady as a morning routine.
    routines: mascot(
      'var(--bg-cat-health)',
      '<path class="m-line" stroke-width="5" d="M26.5 34.5c-1.2 4.2-.2 8 3.4 8.6 3 .5 4.4-2.4 2.5-4.1-1.5-1.3-3.4.2-2.5 1.7"/>' +
        '<path class="m-accent" d="M34.5 21.5 40.5 20l-1.2 6-4.6 1.2Z"/>' +
        '<path class="m-body" d="M25 16.5c5.5-1.2 10.8 2.6 11.2 9.2.4 5.6-3.2 9.8-7.8 10.8-3.6.8-6.3-1.6-6.3-5.6v-9.5c0-2.6 1-4.4 2.9-4.9Z"/>' +
        '<path class="m-line" stroke-width="1.8" d="M24.5 7.6 25.5 4l1.8 3.3M28.6 7.2l2.7-2.6.6 3.4"/>' +
        '<ellipse class="m-body" cx="27.3" cy="12" rx="6.6" ry="5.6" transform="rotate(-10 27.3 12)"/>' +
        '<path class="m-body" d="M13 11.9h9.5v3.4H13a1.7 1.7 0 0 1 0-3.4Z"/><circle class="m-body" cx="12.3" cy="13.6" r="2.1"/>' +
        '<path class="m-light-line" stroke-width="1.2" d="M23.6 22.5h3M23.3 26h3.6M23.4 29.5h3.6M24.4 33h3"/>' +
        eye(28.5, 11.4, 3),
    ),

    // Media: a penguin with a tub of popcorn, ready for the next episode.
    media: mascot(
      'var(--bg-cat-work)',
      '<ellipse class="m-body" cx="11.5" cy="27" rx="3" ry="8" transform="rotate(18 11.5 27)"/><ellipse class="m-body" cx="36.5" cy="27" rx="3" ry="8" transform="rotate(-18 36.5 27)"/>' +
        '<path class="m-body" d="M24 5c-8 0-12 7-12 16v13c0 6 5 9 12 9s12-3 12-9V21c0-9-4-16-12-16Z"/>' +
        '<ellipse class="m-light" cx="24" cy="29" rx="7.5" ry="11"/>' +
        eyes(15, 20, 28, 3) +
        '<path class="m-yellow" d="M21.8 18.6h4.4L24 21.4Z"/>' +
        '<ellipse class="m-yellow" cx="19" cy="43.2" rx="3.6" ry="1.5"/><ellipse class="m-yellow" cx="29" cy="43.2" rx="3.6" ry="1.5"/>' +
        '<circle class="m-pop" cx="19" cy="29.5" r="2.3"/><circle class="m-pop" cx="22.5" cy="28" r="2.4"/><circle class="m-pop" cx="26" cy="28.4" r="2.4"/><circle class="m-pop" cx="29.2" cy="29.6" r="2.2"/>' +
        '<path class="m-accent" d="M16.5 30.5h15l-2 10h-11Z"/>' +
        '<path class="m-light-line" stroke-width="1.5" d="M21 31l.8 9M27 31l-.8 9"/>',
    ),

    // Lists: a puffin with a row of fish in its beak, lined up like a list.
    lists: mascot(
      'var(--bg-cat-home)',
      '<ellipse class="m-red" cx="19" cy="43.4" rx="3.6" ry="1.5"/><ellipse class="m-red" cx="29" cy="43.4" rx="3.6" ry="1.5"/>' +
        '<path class="m-body" d="M24 6c-8 0-12 6-12 14v14c0 6 5 9 12 9s12-3 12-9V20c0-8-4-14-12-14Z"/>' +
        '<ellipse class="m-light" cx="24" cy="16.5" rx="8.5" ry="6.5"/><ellipse class="m-light" cx="24" cy="34" rx="7" ry="7.5"/>' +
        eyes(15, 20.3, 27.7, 2.6) +
        '<path class="m-fish" d="M17.5 23.5h13M17 26.5h14M17.5 29.5h13"/>' +
        '<path class="m-red" d="M20.2 19.2h7.6L24 25.5Z"/><path class="m-yellow" d="M21.4 19.2h5.2l-.9 1.6h-3.4Z"/>',
    ),
  };
})();
