# 001 · Estratégia de documentação

- **Data:** 2026-10-30
- **Origem:** spike #132
- **Status:** proposta

## Pergunta

Como documentar o Yoko (front-end e API) num repositório open-source sem expor informações que prejudiquem a segurança da aplicação?

## Resposta curta

- Toda a documentação fica pública, no repositório, em `docs/` na raiz.
- O Docusaurus sai de `client/docs/` e passa a ser o site de `docs/`, cobrindo o projeto inteiro.
- Diagramas de banco, arquitetura e endpoints **podem** ser documentados. Eles não são segredo, porque o código já os revela.
- O que nunca entra em lugar nenhum do repo (código, docs ou issues) são **segredos e detalhes de infraestrutura**. A lista está abaixo.
- **Exceção da API (OWASP API9):** documentar endpoints em markdown no repo pode. O que não pode é expor uma documentação interativa (Swagger/OpenAPI UI) no host de produção da API, nem publicar o inventário de ambientes (URLs de staging, hosts internos).
- Não vamos manter documentação privada por enquanto. Se surgir necessidade, ela vai para um repositório privado separado, nunca para uma pasta ignorada pelo git.

## A premissa do diagrama de banco

O repositório é público. Quando a `api/` tiver migrations ou models, qualquer pessoa poderá montar o diagrama do banco a partir do código. Esconder o diagrama seria *segurança por obscuridade*: dá sensação de proteção, mas não protege nada.

Guias públicos de governo seguem a mesma linha:

- O GOV.UK pede código aberto "minus any sensitive information, like secret keys and credentials" e afirma que o código que contribui para a segurança não precisa ficar fechado.
- O manual da Escócia lista o que deve ficar fechado: chaves e credenciais, algoritmos antifraude e políticas ainda não anunciadas.

Projetos reais também publicam o schema. O Cal.com, um SaaS em produção, versiona `packages/prisma/schema.prisma` e `migrations/` no repositório público.

A segurança do Yoko precisa vir de:

- autenticação e autorização em todos os endpoints;
- validação de entrada;
- segredos fora do repositório;
- dependências atualizadas.

O GOV.UK lembra que publicar versões exatas do stack facilita encontrar software desatualizado. A resposta para isso é atualizar, não esconder.

## Pode e não pode publicar

| Pode publicar | Nunca publicar |
|---|---|
| Diagrama do banco, schema e migrations | Valores de variáveis de ambiente (`.env`), chaves, tokens, senhas |
| Arquitetura e fluxo entre `client/` e `api/` | Strings de conexão, hosts e IPs de banco ou servidores internos |
| Lista de endpoints e contratos (inclusive auth), em markdown | Swagger/OpenAPI UI interativo no host de produção da API |
| Nomes de variáveis de ambiente (sem valores), via `.env.example` | Inventário de ambientes: URLs de staging, previews e hosts internos |
| Regras de segurança (ex. Firebase Security Rules) | IDs de contas de cloud e painéis administrativos |
| Padrões, decisões, protótipos, design tokens | Dados reais de usuários, inclusive em prints e exemplos |
| Como rodar o projeto localmente | Vulnerabilidades ainda não corrigidas (vão por report privado, ver abaixo) |
| | Runbooks de incidente com detalhes de infraestrutura |

**Regra prática:** se a informação já é dedutível lendo o código público, pode documentar. Se é algo que só existe no painel da cloud ou no `.env`, não pode.

## Como outros projetos open-source fazem

Exemplos conferidos nos repositórios em 2026-10-30:

- **Cal.com:** documentação em `apps/docs`. Schema Prisma e migrations públicos, `.env.example` e `SECURITY.md` com canal de e-mail e prazo de resposta de 3 dias úteis.
- **Excalidraw:** versiona `firebase-project/` com `firestore.rules` e `storage.rules`, e um `.env.production` só com URLs públicas. A proteção está nas regras, não em esconder a configuração. Também tem `dev-docs/` na raiz.
- **Supabase:** documentação em `apps/docs`, dentro do monorepo.
- **n8n e Appwrite:** pasta `docs/` na raiz e `SECURITY.md`.
- **Appwrite:** pasta `rfc/` com decisões de design públicas, no mesmo espírito de `docs/decisoes/`.
- **Docusaurus:** o próprio repositório usa `website/`. A documentação oficial recomenda colocar o site numa subpasta do monorepo e apontar o diretório de build do host para ela.

O padrão é o mesmo em todos: a documentação fica junto do código, pública e versionada. O que é sensível não vira documentação. Vira segredo no provedor (Cloudflare, GitHub Secrets) ou vai para o canal privado de segurança.

## Onde fica o Docusaurus

Ele vai para `docs/`, na raiz. Motivos:

- A documentação hoje cobre só o front-end, mas o projeto agora inclui a `api/`.
- Os protótipos já estão em `docs/prototipos/`. O Docusaurus ignora pastas que não estão configuradas, então os dois convivem sem conflito.

Estrutura proposta:

```
docs/
├── docusaurus.config.ts, package.json, sidebars.ts, src/, static/
├── dev-docs/        # padrões, tecnologias, design (o que já existe hoje)
├── decisoes/        # uma decisão por arquivo, como este
└── prototipos/      # protótipos HTML (fora do site)
```

Na mesma mudança, convém limpar o que sobrou do template do Docusaurus:

- `docs/tutorial-*`;
- `url` de exemplo;
- `editUrl` apontando para o repositório do Facebook;
- copyright de 2024.

Também será preciso atualizar o diretório de build do deploy no Cloudflare Pages. Isso é feito no painel, porque o repositório não tem workflow de deploy.

## Decisões (ADRs)

Não vamos adotar um processo formal de ADR. A pasta `docs/decisoes/` com arquivos numerados já resolve: cada spike termina com um arquivo ali.

## Achados durante o spike

### 1. Configurações do Firebase no histórico do git

Commits antigos versionaram `.env` e `.env.development` com `VITE_FIREBASE_*`.

Pela documentação oficial do Firebase, essas chaves "only identify your Firebase project" e "are OK to include in code or checked-in config files". Ou seja, não são segredos. Mesmo assim, o Firebase considera *critical* aplicar restrições de API à chave e proteger os dados com Security Rules e App Check: "Don't rely only on restricting and/or obscuring your API keys."

**Ação:**
- Se o projeto Firebase antigo não estiver mais em uso, **apagar o projeto**.
- Se ainda estiver em uso, **restringir a chave** às APIs do Firebase no Google Cloud.

Reescrever o histórico do git não é necessário. O OWASP também recomenda revogar e rotacionar em vez de reescrever, porque reescrever o histórico "may introduce other problems".

### 2. `client/.env.development` vazio está versionado

O ideal é remover o arquivo, ignorar `.env*` e criar um `.env.example` quando houver variáveis.

### 3. Não existe `SECURITY.md`

Falta um canal privado para reportar vulnerabilidades. Projetos sem `SECURITY.md` tendem a ter scores menores no OpenSSF. O GitHub oferece o *private vulnerability reporting* para repositórios públicos, ativado em Settings › Advanced Security. O formulário pode ser customizado com `.github/VULNERABILITY_REPORT.yml`.

### 4. Prevenção de vazamentos

O *push protection* do GitHub "for users" já vem ligado por padrão e bloqueia segredos conhecidos em pushes para repositórios públicos. O push protection por repositório vem desligado e depende do GitHub Secret Protection.

## Próximos passos (issues)

- **Mover o Docusaurus para `docs/` e limpar o template.**
- **Higiene de segurança:**
  - criar `SECURITY.md` e ativar o private vulnerability reporting;
  - remover `client/.env.development` e ignorar `.env*`;
  - apagar o projeto Firebase antigo ou restringir a chave;
  - conferir se o push protection por repositório está disponível e ligá-lo.

## Fontes

- GOV.UK Service Manual, [Making source code open and reusable](https://gov.uk/service-manual/technology/making-source-code-open-and-reusable) e [Service Standard, ponto 12](https://www.gov.uk/service-manual/service-standard/point-12-make-new-source-code-open)
- Scottish Government, [Making source code open](https://servicemanual.gov.scot/making-source-code-open)
- OWASP, [API9:2023 Improper Inventory Management](https://api-security.owasp.org/editions/2023/en/0xa9-improper-inventory-management)
- OWASP, [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- Firebase, [Learn about using and managing API keys](https://firebase.google.com/docs/projects/api-keys)
- GitHub Docs, [Configuring private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-a-repository)
- GitHub Docs, [About push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection)
- Docusaurus, [Installation (monorepo)](https://docusaurus.io/docs/installation)
- [On Categorizing Open Source Software Security Vulnerability Reporting Mechanisms on GitHub](https://arxiv.org/html/2502.07395v2) (arXiv)
- Repositórios: [calcom/cal.com](https://github.com/calcom/cal.com), [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw), [supabase/supabase](https://github.com/supabase/supabase), [n8n-io/n8n](https://github.com/n8n-io/n8n), [appwrite/appwrite](https://github.com/appwrite/appwrite), [facebook/docusaurus](https://github.com/facebook/docusaurus)
