# Yoko!

Self-management app (recurring actions, events, tasks, notes, mood). Public monorepo.

## Language

Everything in the repository and on GitHub is in English: code, docs, file names, issues, PRs, commits and reviews. Published platforms offer Portuguese through the `/pt-BR/` URL prefix. See `docs/decisions/002-language-policy.md`.

## Structure

- `client/`: front-end (React, Vite, TypeScript, SASS). Node 22 (`client/.nvmrc`).
- `api/`: back-end, still empty.
- `docs/`: documentation. Also the Docusaurus site published on Cloudflare Pages (`overview/`, `dev-docs/`, `src/`, `static/`).
  - `docs/engineering-guidelines.md`: rules for writing and reviewing code.
  - `docs/decisions/`: one decision per file, numbered. Every spike ends with a file here.
  - `docs/prototypes/`: HTML prototypes. `docs/prototypes/platform/` is the living reference for screens and design tokens (decision 005).

## Engineering guidelines

Follow the guidelines below when implementing and when reviewing PRs. They are imported from `docs/engineering-guidelines.md`, so edit them there.

@docs/engineering-guidelines.md

## Commands (run inside `client/`)

- `npm run dev`: keep it running during implementation, so the changes can be followed.
- `npm run build`, `npm run type-check`, `npm run lint:all`, `npm run format:check:all`.
- `npm test`: Vitest with Testing Library. No E2E tests set up yet.
- The pre-commit hook (husky + lint-staged) runs prettier, eslint and `vitest related` on the changed files.

## Workflow

- **Visual changes:** change the prototype in `docs/prototypes/platform/` first, validate it, then implement it in `client/` (decision 005).
- **Base branch:** `develop`. PRs target it, not `main`.
- **Branch name:** `<type>/kebab-case-name`, for example `chore/claude-md` or `fix/occurrence-delete`.
- **Commits and PR title:** [Conventional Commits](https://www.conventionalcommits.org/), for example `chore: add spike issue template`. Details in `docs/dev-docs/patterns.mdx`.
- **PR body:** ends with `Closes #<issue>`.
- **Attribution:** no `Co-Authored-By` or "Generated with Claude Code" in commits and PRs.

## Issues and board

- **Issues:** use the templates in `.github/ISSUE_TEMPLATE/` (bug, feature, chore, design, spike). The type goes in the label, not in the title. Documentation counts as `chore`.
- **Board:** "Yoko!" (GitHub Project #4 of `lauvivans`). Status: Backlog → Ready → In progress → In review → Done.
  - When starting an issue, move it to **In progress**.
  - When opening the PR, move it to **In review**.
  - Merging moves the issue to **Done**.
- **Sprints:** 15 days long, in the `Sprint` field. Issues in Ready in the current sprint are the day's tasks.
- **Draft before creating:** show the full text of any issue or PR and only create it after approval.

## Security

The repository is public. Never commit `.env` values, keys, tokens, internal hosts or user data. What can and cannot be published is in `docs/decisions/001-documentation-strategy.md`.
