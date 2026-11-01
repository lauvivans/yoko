# 005 · The HTML prototype is the design reference

- **Date:** 2026-11-01
- **Origin:** review of the platform prototype in `docs/prototypes/platform/`
- **Status:** accepted

## Question

Where do the screens and the design tokens live, and in what order does a visual change happen?

## Short answer

- The HTML prototype in `docs/prototypes/platform/` is the living reference for every screen and for the design system. The Figma project was retired, and the repository no longer links to it.
- The tokens are defined in `docs/prototypes/platform/tokens.css`, with the same names as the SASS tokens in `client/src/assets/sass/tokens/` (`--bg-default` is `$bg-default`). `design-system.html` shows them with their current values.
- A visual change follows this order:
  1. change the prototype;
  2. validate it;
  3. implement it in `client/`.
- The code never gets ahead of the prototype. When they differ, the prototype wins and the code is fixed.

## Why

- Figma and the code had drifted apart, and keeping a third copy in sync costs more than it helps a project with one designer.
- The prototype runs in the browser, so it shows real behavior: themes, breakpoints, focus, empty states and loading.
- HTML and CSS are reviewed in pull requests like the rest of the code, so design changes get history and review for free.

## Tokens merged from the code and the prototype

The tokens in the code were the starting point. Where the prototype review made a decision, the prototype won:

- **Theme:** the light theme is a soft gray (`--bg-page`, `--bg-surface`, `--bg-surface-raised`), never pure white. There is a dark theme with the same names.
- **Shell:** the sidebar and the top bar are always dark (`--bg-shell` and the `*-shell` tokens).
- **Places:** Nori's yellow is a base color (`--yellow`, `--bg-places`).
- **Shadows:** `--shadow-sm`, `--shadow-md` and `--shadow-lg` are dark and follow the theme, since the old light-gray shadows don't show on a gray background.
- **Border radius:** `--border-r-pill` (999px) is new, for pills. `--border-r-full` stays 100%, for circles.
- **Border width:** cards use `--border-w-default` (1px).

Values that the prototype used without a decision, such as a 14px radius or a different blue, now follow the tokens.

## Consequences

- `client/src/assets/sass/tokens/` has to be updated with the new and changed tokens. That is an implementation issue, not part of this decision.
- Pages in the prototype use the tokens instead of loose values. Font sizes outside the scale (`text-xs` to `text-xl`) still need a decision: either map them to the scale or add sizes to it.
- Feature issues link to the screens in the prototype.
