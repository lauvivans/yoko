# Design guidelines

Product design rules that are not obvious from the code. Screens and design tokens live in [Figma](https://www.figma.com/design/s9HB9I0wyGOTvnlWuWkOu6/yoko-?node-id=0-1&t=QBeoAmwyvJ2a6apC-1) and in the design reference of the docs site.

## Header

The header has:

- the logo;
- a message and an icon based on the period of the day (see [decision 004](../decisions/004-period-of-the-day.md));
- a search field, when the user is signed in;
- a toggle that shows and hides the mood selector;
- a menu button that opens a popover with every feature: recurring actions, events, tasks and notes, and mood history;
- an access button that shows the sign-in or sign-out icon, depending on the user's state;
- a phrase with how the user is feeling, when they picked a mood and hid the selector.

## Icons

- Yoko uses the [Iconsax line oval collection](https://www.svgrepo.com/collection/iconsax-line-oval-icons) from SVG Repo, for a consistent and concise UI. Icons are React components in `client/src/components/display/icons/`.
- The mascot is an [octopus from SVG Repo](https://www.svgrepo.com/vectors/octopus/).
- Each SVG Repo collection has its own license. Since the repository is public, confirm the license of the collection and of the mascot before adding new icons.

## Category colors

Each occurrence category has a background color. Styles use the semantic token, which points to a base color, both in `client/src/assets/sass/tokens/_colors.scss`.

| Category | Semantic token     | Base token       | Color     |
| -------- | ------------------ | ---------------- | --------- |
| Personal | `$bg-cat-personal` | `$ice-mint`      | `#ccf0ec` |
| Work     | `$bg-cat-work`     | `$periwinkle`    | `#ccccf0` |
| Study    | `$bg-cat-study`    | `$pale-lavender` | `#dbccf0` |
| Finance  | `$bg-cat-finance`  | `$tea-green`     | `#d8f0cc` |
| Family   | `$bg-cat-family`   | `$pastel-pink`   | `#f0ccd8` |
| Travel   | `$bg-cat-travel`   | `$baby-blue`     | `#cce1f0` |
| Home     | `$bg-cat-home`     | `$pale-peach`    | `#f0e7cc` |
| Health   | `$bg-cat-health`   | `$melon`         | `#f0d2cc` |
| Reading  | `$bg-cat-reading`  | `$mint-green`    | `#ccf0de` |
| Social   | `$bg-cat-social`   | `$light-magenta` | `#edccf0` |
| Hobby    | `$bg-cat-hobby`    | `$pale-lime`     | `#e7f0cc` |

A new category needs a base color, a `$bg-cat-*` token and a row here.
