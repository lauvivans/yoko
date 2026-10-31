# Yoko!

[![License: MIT](https://img.shields.io/github/license/lauvivans/yoko)](LICENSE)

A self-management app that keeps your recurring actions, events, tasks, notes and mood in one place.

## Why Yoko

Small habits and important dates get lost across calendars, to-do apps and notes. Yoko puts them side by side: how many days since you started (or stopped) something, how many days until the next event, what you have to do today and how you are feeling.

Everything works without an account, saved in your browser. Once the back-end is ready, signing in will keep your data long term.

## Features

Available:

- **Recurring actions:** track something you do (or stop doing) and count the days. E.g. how long since you stopped eating junk food.
- **Events:** keep important dates and count down to them. E.g. a friend's graduation.
- **Calendar:** see every action and event in one view.

Planned:

- **Tasks:** plan your day with time ranges and statuses.
- **Notes:** write things down.
- **Mood:** register how you feel and look back at your history.
- **Greeting by period of the day:** the header follows sunrise and sunset where you are.
- **Account:** sign in to keep your data and sync what you saved before signing in.

Each feature's rules are in the [product requirements](docs/product/requirements.md).

## Preview

The screens are designed in [Figma](https://www.figma.com/design/s9HB9I0wyGOTvnlWuWkOu6/yoko-?node-id=0-1&t=QBeoAmwyvJ2a6apC-1). HTML prototypes are in [`docs/prototypes/`](docs/prototypes/).

## Tech stack

| Tool                                    | Role                                    |
| --------------------------------------- | --------------------------------------- |
| React 19 + TypeScript                   | UI                                      |
| Vite                                    | Dev server and build                    |
| SASS                                    | Styles, with design tokens and BEM      |
| React Router                            | Routing                                 |
| Zustand                                 | Global state, persisted to localStorage |
| React Hook Form + Zod                   | Forms and validation                    |
| date-fns                                | Dates and recurrence math               |
| Sentry                                  | Error tracking                          |
| Vitest + Testing Library                | Unit and integration tests              |
| ESLint, Prettier, Husky and lint-staged | Code quality on every commit            |
| semantic-release                        | Versioning and releases                 |
| Docusaurus on Cloudflare Pages          | Documentation site                      |
| Supabase                                | Back-end (being defined in #144)        |

## Repository structure

```
.
├── client/   # front-end (React, Vite, TypeScript, SASS)
├── api/      # back-end, not started yet
└── docs/     # product requirements, architecture, decisions, design and prototypes
```

## Getting started

Prerequisites: Node 22 (see [`client/.nvmrc`](client/.nvmrc)).

```sh
cd client
npm install
npm run dev
```

Other commands, all inside `client/`:

| Command                    | What it does               |
| -------------------------- | -------------------------- |
| `npm test`                 | Runs the tests with Vitest |
| `npm run build`            | Builds for production      |
| `npm run type-check`       | Checks types               |
| `npm run lint:all`         | Lints the whole client     |
| `npm run format:check:all` | Checks formatting          |

## Documentation

- [Product requirements](docs/product/requirements.md)
- [Data model](docs/architecture/data-model.md)
- [Decisions](docs/decisions/)
- [Design guidelines](docs/design/guidelines.md)
- [Engineering guidelines](docs/engineering-guidelines.md)

## Contributing

- Work is tracked on the [Yoko! board](https://github.com/users/lauvivans/projects/4). Open an issue with one of the [templates](.github/ISSUE_TEMPLATE/) before starting.
- Branches are named `<type>/kebab-case-name` and PRs target `develop`.
- Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org/).
- Code follows the [engineering guidelines](docs/engineering-guidelines.md). Every PR is reviewed against them.
- Everything in the repository is in English (see [decision 002](docs/decisions/002-language-policy.md)).

## License

[MIT](LICENSE) © Laura Vivan Gonçalves
