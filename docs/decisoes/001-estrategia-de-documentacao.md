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
- Não vamos manter documentação privada por enquanto. Se surgir necessidade, ela vai para um repositório privado separado, nunca para uma pasta ignorada pelo git.

## A premissa do diagrama de banco

O repositório é público. Quando a `api/` tiver migrations ou models, qualquer pessoa poderá montar o diagrama do banco a partir do código. Esconder o diagrama seria *segurança por obscuridade*: dá sensação de proteção, mas não protege nada.

A segurança do Yoko precisa vir de:

- autenticação e autorização em todos os endpoints;
- validação de entrada;
- segredos fora do repositório;
- dependências atualizadas.

Saber como as tabelas se chamam não deve ajudar um atacante. Se ajudar, o problema está no código, não na documentação.

## Pode e não pode publicar

| Pode publicar | Nunca publicar |
|---|---|
| Diagrama do banco (tabelas, relações) | Valores de variáveis de ambiente (`.env`), chaves, tokens, senhas |
| Arquitetura e fluxo entre `client/` e `api/` | Strings de conexão, hosts e IPs de banco ou servidores internos |
| Lista de endpoints e contratos (inclusive auth) | IDs de contas de cloud, painéis administrativos, URLs de staging não públicas |
| Nomes de variáveis de ambiente (sem valores), via `.env.example` | Dados reais de usuários, inclusive em prints e exemplos |
| Padrões, decisões, protótipos, design tokens | Vulnerabilidades ainda não corrigidas (vão por report privado, ver abaixo) |
| Como rodar o projeto localmente | Runbooks de incidente com detalhes de infraestrutura |

**Regra prática:** se a informação já é dedutível lendo o código público, pode documentar. Se é algo que só existe no painel da cloud ou no `.env`, não pode.

## Como outros projetos open-source fazem

- **Docusaurus** mantém o site na pasta `website/` do próprio monorepo.
- **Supabase** mantém a documentação em `apps/docs`, no monorepo, com schema e arquitetura públicos.
- **Excalidraw** tem uma pasta `dev-docs/` na raiz, com Docusaurus, para a documentação de quem contribui.
- **Padrão comum:** documentação junto do código, pública e versionada. O que é sensível não vira documentação. Vira segredo no provedor (Cloudflare, GitHub Secrets) ou vai para o canal privado de segurança: `SECURITY.md` mais o *private vulnerability reporting* do GitHub.

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

1. **Configurações do Firebase no histórico do git.** Commits antigos versionaram `.env` e `.env.development` com `VITE_FIREBASE_*`. A configuração web do Firebase não é secreta por definição, porque vai no bundle do navegador. Mesmo assim, o projeto Firebase antigo deve ser **apagado**, se não estiver mais em uso, ou ter a API key **restringida** no Google Cloud. Reescrever o histórico do git não é necessário.
2. **`client/.env.development` vazio está versionado.** O ideal é remover o arquivo, ignorar `.env*` e criar um `.env.example` quando houver variáveis.
3. **Não existe `SECURITY.md`.** Falta um canal privado para reportar vulnerabilidades.

## Próximos passos (issues)

- Mover o Docusaurus para `docs/` e limpar o template.
- Higiene de segurança: `SECURITY.md`, private vulnerability reporting, remover `.env.development`, ignorar `.env*` e revisar o projeto Firebase antigo.
