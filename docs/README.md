# Yoko! docs site

The documentation site at [yoko-docs.arualvivan.com](https://yoko-docs.arualvivan.com), built with [Docusaurus](https://docusaurus.io/) and deployed by Cloudflare Pages.

Only these folders are part of the site:

- `overview/`: the "Docs" section, starting with what Yoko is.
- `dev-docs/`: the "Dev docs" section: patterns, technologies and design reference.
- `src/` and `static/`: the homepage, styles and images.

The other folders in `docs/` (decisions, product, architecture, design, prototypes) are read on GitHub.

## Running locally

Requires Node 20 or later.

```sh
cd docs
npm install
npm start
```

`npm run build` builds the site into `build/` and fails on broken links.
