# 002 · Language policy

- **Date:** 2026-10-31
- **Origin:** issue #139
- **Status:** accepted

## Question

Which language does the project use in the repository, on GitHub and on the platforms it publishes?

## Short answer

- English is the default for everything in the repository: code, comments, docs, decisions, file and folder names, issue and PR templates.
- English is also the language on GitHub: issues, PRs, commits and review comments.
- Published platforms (the docs site and the app) are in English by default and offer Portuguese as a translation, selected by a path prefix in the URL: `/` for English, `/pt-BR/` for Portuguese.

## Why

- The repository is public. English opens it to contributors and readers who don't speak Portuguese.
- One default language avoids mixed files and duplicated rules.
- A path prefix is the standard for Docusaurus i18n and keeps each language at a stable, shareable URL.

## Consequences

- Existing Portuguese content is migrated in separate issues: renaming `docs/decisoes/` and `docs/prototipos/`, translating decision 001 and the issue templates.
- The docs site gets i18n with `en` as the default locale and `pt-BR` as a second locale, after the move to `docs/` (#135).
- The app gets i18n with the same URL pattern, as a feature of its own.
