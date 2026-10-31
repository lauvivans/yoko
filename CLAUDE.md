# Yoko!

App de autogestão (ações recorrentes, eventos, tarefas, notas, humor). Monorepo público.

## Estrutura

- `client/`: front-end (React, Vite, TypeScript, SASS). Node 22 (`client/.nvmrc`).
- `client/docs/`: site de documentação (Docusaurus), publicado no Cloudflare Pages. Vai para `docs/` (#135).
- `api/`: back-end, ainda vazio.
- `docs/`: documentação geral.
  - `docs/decisoes/`: uma decisão por arquivo, numerada. Todo spike termina com um arquivo aqui.
  - `docs/prototipos/`: protótipos HTML.

## Comandos (rodar dentro de `client/`)

- `npm run dev`: deixe rodando durante a implementação, para que as mudanças possam ser acompanhadas.
- `npm run build`, `npm run type-check`, `npm run lint:all`, `npm run format:check:all`.
- `npm test`: Vitest com Testing Library. Ainda não há testes E2E configurados.
- O pre-commit (husky + lint-staged) roda prettier, eslint e `vitest related` nos arquivos alterados.

## Testes

Antes de implementar, mapeie os casos mais importantes: comportamento principal, casos de borda e fluxos críticos.

- Testing Library para componentes e interação.
- Vitest puro para lógica isolada.

## Fluxo de trabalho

- **Branch base:** `develop`. Os PRs apontam para ela, não para `main`.
- **Nome de branch:** `<tipo>/nome-em-kebab-case`, por exemplo `chore/claude-md` ou `fix/occurrence-delete`.
- **Commits e título de PR:** [Conventional Commits](https://www.conventionalcommits.org/), por exemplo `chore: add spike issue template`. Os detalhes estão em `client/docs/dev-docs/patterns.mdx`.
- **Corpo do PR:** em português, terminando com `Closes #<issue>`.
- **Atribuição:** sem `Co-Authored-By` ou "Generated with Claude Code" em commits e PRs.

## Issues e board

- **Issues:** em português, com os templates de `.github/ISSUE_TEMPLATE/` (bug, feature, chore, design, spike). O tipo vai no label, não no título. Documentação entra como `chore`.
- **Board:** "Yoko!" (GitHub Project #4 de `lauvivans`). Status: Backlog → Ready → In progress → In review → Done.
  - Ao começar uma issue, mova-a para **In progress**.
  - Ao abrir o PR, mova-a para **In review**.
  - O merge leva a issue para **Done**.
- **Sprints:** de 15 dias, no campo `Sprint`. Issues em Ready na sprint atual são as tarefas do dia.
- **Rascunho antes de criar:** mostre o texto completo de qualquer issue ou PR e só crie depois de aprovado.

## Segurança

O repositório é público. Nunca commite valores de `.env`, chaves, tokens, hosts internos ou dados de usuários. O que pode e o que não pode ser publicado está em `docs/decisoes/001-estrategia-de-documentacao.md`.
