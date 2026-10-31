# 001 · Documentation strategy

- **Date:** 2026-10-30
- **Origin:** spike #132
- **Status:** proposed

## Question

How do we document Yoko (front-end and API) in an open-source repository without exposing information that harms the application's security?

## Short answer

- All documentation is public, in the repository, under `docs/` at the root.
- Docusaurus moves out of `client/docs/` and becomes the site for `docs/`, covering the whole project.
- Database diagrams, architecture and endpoints **can** be documented. They are not secrets, because the code already reveals them.
- What never goes anywhere in the repo (code, docs or issues) are **secrets and infrastructure details**. The list is below.
- **API exception (OWASP API9):** documenting endpoints in markdown in the repo is fine. What is not allowed is exposing interactive documentation (Swagger/OpenAPI UI) on the API's production host, or publishing the environment inventory (staging URLs, internal hosts).
- We won't keep private documentation for now. If the need comes up, it goes to a separate private repository, never to a git-ignored folder.

## The database diagram premise

The repository is public. Once `api/` has migrations or models, anyone can build the database diagram from the code. Hiding the diagram would be _security through obscurity_: it feels protective, but protects nothing.

Public government guides follow the same line:

- GOV.UK asks for open code "minus any sensitive information, like secret keys and credentials" and states that code that contributes to security doesn't need to stay closed.
- The Scottish manual lists what should stay closed: keys and credentials, anti-fraud algorithms and policies not yet announced.

Real projects publish their schema too. Cal.com, a SaaS in production, versions `packages/prisma/schema.prisma` and `migrations/` in its public repository.

Yoko's security has to come from:

- authentication and authorization on every endpoint;
- input validation;
- secrets kept out of the repository;
- up-to-date dependencies.

GOV.UK notes that publishing exact stack versions makes outdated software easier to find. The answer to that is updating, not hiding.

## Can and cannot publish

| Can publish                                                     | Never publish                                                          |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Database diagram, schema and migrations                         | Environment variable values (`.env`), keys, tokens, passwords          |
| Architecture and flow between `client/` and `api/`              | Connection strings, hosts and IPs of databases or internal servers     |
| Endpoint list and contracts (including auth), in markdown       | Interactive Swagger/OpenAPI UI on the API's production host            |
| Environment variable names (without values), via `.env.example` | Environment inventory: staging URLs, previews and internal hosts       |
| Security rules (e.g. Firebase Security Rules)                   | Cloud account IDs and admin dashboards                                 |
| Patterns, decisions, prototypes, design tokens                  | Real user data, including in screenshots and examples                  |
| How to run the project locally                                  | Unfixed vulnerabilities (they go through private reporting, see below) |
|                                                                 | Incident runbooks with infrastructure details                          |

**Rule of thumb:** if the information can be deduced by reading the public code, it can be documented. If it only exists in the cloud dashboard or in `.env`, it can't.

## How other open-source projects do it

Examples checked in the repositories on 2026-10-30:

- **Cal.com:** documentation in `apps/docs`. Public Prisma schema and migrations, `.env.example` and a `SECURITY.md` with an e-mail channel and a 3-business-day response time.
- **Excalidraw:** versions `firebase-project/` with `firestore.rules` and `storage.rules`, and a `.env.production` with public URLs only. The protection is in the rules, not in hiding the configuration. It also has `dev-docs/` at the root.
- **Supabase:** documentation in `apps/docs`, inside the monorepo.
- **n8n and Appwrite:** a `docs/` folder at the root and a `SECURITY.md`.
- **Appwrite:** an `rfc/` folder with public design decisions, in the same spirit as `docs/decisions/`.
- **Docusaurus:** its own repository uses `website/`. The official documentation recommends putting the site in a monorepo subfolder and pointing the host's build directory to it.

The pattern is the same everywhere: documentation lives with the code, public and versioned. What is sensitive doesn't become documentation. It becomes a secret in the provider (Cloudflare, GitHub Secrets) or goes to the private security channel.

## Where Docusaurus lives

It moves to `docs/`, at the root. Reasons:

- The documentation only covers the front-end today, but the project now includes `api/`.
- The prototypes are already in `docs/prototypes/`. Docusaurus ignores folders that aren't configured, so both live side by side without conflict.

Proposed structure:

```
docs/
├── docusaurus.config.ts, package.json, sidebars.ts, src/, static/
├── dev-docs/        # patterns, technologies, design (what exists today)
├── decisions/       # one decision per file, like this one
└── prototypes/      # HTML prototypes (outside the site)
```

In the same change, it's worth cleaning up what is left from the Docusaurus template:

- `docs/tutorial-*`;
- the sample `url`;
- `editUrl` pointing to Facebook's repository;
- the 2024 copyright.

The deploy build directory on Cloudflare Pages will also need updating. That is done in the dashboard, because the repository has no deploy workflow.

## Decisions (ADRs)

We won't adopt a formal ADR process. The `docs/decisions/` folder with numbered files is enough: every spike ends with a file there.

## Findings during the spike

### 1. Firebase configuration in the git history

Old commits versioned `.env` and `.env.development` with `VITE_FIREBASE_*`.

According to the official Firebase documentation, these keys "only identify your Firebase project" and "are OK to include in code or checked-in config files". So they aren't secrets. Even so, Firebase considers it _critical_ to apply API restrictions to the key and to protect the data with Security Rules and App Check: "Don't rely only on restricting and/or obscuring your API keys."

**Action:**

- If the old Firebase project is no longer in use, **delete the project**.
- If it is still in use, **restrict the key** to the Firebase APIs in Google Cloud.

Rewriting the git history isn't needed. OWASP also recommends revoking and rotating instead of rewriting, because rewriting history "may introduce other problems".

### 2. An empty `client/.env.development` is versioned

Ideally, remove the file, ignore `.env*` and create a `.env.example` when there are variables.

### 3. There is no `SECURITY.md`

There is no private channel to report vulnerabilities. Projects without a `SECURITY.md` tend to get lower OpenSSF scores. GitHub offers _private vulnerability reporting_ for public repositories, turned on in Settings › Advanced Security. The form can be customized with `.github/VULNERABILITY_REPORT.yml`.

### 4. Leak prevention

GitHub's push protection "for users" is on by default and blocks known secrets in pushes to public repositories. Per-repository push protection is off by default and depends on GitHub Secret Protection.

## Next steps (issues)

- **Move Docusaurus to `docs/` and clean up the template.**
- **Security hygiene:**
  - create `SECURITY.md` and turn on private vulnerability reporting;
  - remove `client/.env.development` and ignore `.env*`;
  - delete the old Firebase project or restrict its key;
  - check whether per-repository push protection is available and turn it on.

## Sources

- GOV.UK Service Manual, [Making source code open and reusable](https://gov.uk/service-manual/technology/making-source-code-open-and-reusable) and [Service Standard, point 12](https://www.gov.uk/service-manual/service-standard/point-12-make-new-source-code-open)
- Scottish Government, [Making source code open](https://servicemanual.gov.scot/making-source-code-open)
- OWASP, [API9:2023 Improper Inventory Management](https://api-security.owasp.org/editions/2023/en/0xa9-improper-inventory-management)
- OWASP, [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- Firebase, [Learn about using and managing API keys](https://firebase.google.com/docs/projects/api-keys)
- GitHub Docs, [Configuring private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-a-repository)
- GitHub Docs, [About push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection)
- Docusaurus, [Installation (monorepo)](https://docusaurus.io/docs/installation)
- [On Categorizing Open Source Software Security Vulnerability Reporting Mechanisms on GitHub](https://arxiv.org/html/2502.07395v2) (arXiv)
- Repositories: [calcom/cal.com](https://github.com/calcom/cal.com), [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw), [supabase/supabase](https://github.com/supabase/supabase), [n8n-io/n8n](https://github.com/n8n-io/n8n), [appwrite/appwrite](https://github.com/appwrite/appwrite), [facebook/docusaurus](https://github.com/facebook/docusaurus)
