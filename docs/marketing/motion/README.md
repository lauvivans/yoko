# Yoko motion

A short promo video of the platform prototype (`docs/prototypes/platform/`). It opens with an animated intro, shows live clips of the prototype in use, then a few highlights and an outro with the mascots.

The video is generated from the prototype, so it can be recorded again whenever the screens change. The `.mp4` isn't versioned.

## Files

- `motion.html`: the intro, highlights and outro, as a [GSAP](https://gsap.com) timeline. It reads the tokens, styles and mascots straight from the prototype.
- `shots.mjs`: takes the screenshots used in the highlights.
- `clips.mjs`: records the live clips, with a visible cursor and captions.
- `render.mjs`: renders `motion.html` frame by frame and joins it with the clips.

Everything is written to `out/`, which is ignored by git. The video ends up in `out/yoko-motion.mp4` (1920×1080, 30 fps).

## Recording

1. Serve the repository root on port 4173, from the repository root: `npx serve -l 4173 .`
2. In this folder:

```sh
npm install
npx playwright install chromium
npm run video
```

`npm run video` runs `shots`, `clips` and `render` in order. Each one can also run alone, for example `npm run render` after changing only `motion.html`.

To preview a few moments without rendering the whole video, pass the seconds to the renderer: `node render.mjs 2,4.5`. The frames are saved in `out/frames/`.
