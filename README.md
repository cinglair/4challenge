# algarism.io — o desafio diário dos algarismos

Jogo diário de matemática: forme o número-alvo usando um único algarismo, uma
quantidade exata de vezes. São três desafios por dia:

| Nível   | Operações liberadas                 |
| ------- | ----------------------------------- |
| Fácil   | `+` `−` `×`, fração e parênteses    |
| Médio   | tudo do Fácil, mais potência e raiz |
| Difícil | tudo do Médio, mais fatorial        |

Os desafios e as dicas vêm do Supabase (tabela `daily_puzzles`); a dica só é
buscada quando o jogador pede. O progresso do dia — inclusive se a dica foi
pedida — fica guardado no `localStorage` do navegador.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) (dev server e build)
- [TanStack Query](https://tanstack.com/query) para a busca dos desafios
- [Vitest](https://vitest.dev), ESLint e Prettier

## Como rodar

Crie um arquivo `.env` na raiz com a URL e a chave publicável do projeto no
Supabase (Project Settings → API); em produção, defina as mesmas variáveis no
provedor de hospedagem:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

```bash
yarn            # instala as dependências
yarn dev        # sobe o app em http://localhost:5173
```

| Script           | O que faz                        |
| ---------------- | -------------------------------- |
| `yarn dev`       | servidor de desenvolvimento      |
| `yarn build`     | checa os tipos, gera `dist/` e pré-renderiza as páginas |
| `yarn preview`   | serve o build de produção        |
| `yarn test`      | roda os testes (Vitest)          |
| `yarn lint`      | ESLint em `src/`                 |
| `yarn typecheck` | `tsc --noEmit`                   |
| `yarn fix`       | formata o projeto com o Prettier |

## Desafios no banco

A tabela `daily_puzzles` guarda um desafio por dia e nível, com a dica e uma
solução possível (mostrada quando o jogador desiste). O esquema está em
`supabase/migrations/` e a carga atual (1º/11/2026 a 30/04/2027) em
`supabase/seed.sql`; rodar a carga sobre dias que já existem só preenche a
coluna `solution`. Para gerar mais dias, conferidos pelo
solver do jogo:

```bash
node scripts/generate-daily-puzzles.mjs 2027-05-01 2027-08-31 > mais-dias.sql
```

Os desafios só ficam legíveis pela API a partir da véspera do dia (UTC).

## Páginas, SEO e anúncios

O site tem a página inicial (o desafio de hoje), uma página por dia em
`/desafio/AAAA-MM-DD/`, o arquivo em `/arquivo/` e as páginas institucionais
(`/sobre/`, `/privacidade/`, `/termos/`, `/contato/`). O roteamento é um
roteador mínimo em `src/shared/router`.

Depois do `vite build`, `scripts/prerender.mjs` grava em `dist/` um HTML por
página, com `<head>` próprio (título, descrição, canonical, Open Graph e
JSON-LD) e o texto da página já no HTML, além do `sitemap.xml`. As páginas dos
desafios saem do banco, só para os dias já liberados; por isso o site precisa
de um build por dia. O workflow `.github/workflows/daily-build.yml` dispara
esse build à meia-noite de Brasília se o repositório tiver o segredo
`CLOUDFLARE_DEPLOY_HOOK` (a URL de um deploy hook da Cloudflare).

Os textos institucionais ficam em `src/shared/site/pages.ts` e o e-mail de
contato em `src/shared/site/index.ts` (`CONTACT_EMAIL`).

Os anúncios (Google AdSense) ficam desligados até as variáveis abaixo serem
definidas. Com elas, o build gera o `ads.txt`, o site passa a mostrar o aviso
de cookies e, para quem aceita, um bloco de anúncio abaixo do jogo:

```bash
VITE_ADSENSE_CLIENT=ca-pub-0000000000000000   # identificador do editor
VITE_ADSENSE_SLOT=0000000000                  # bloco de anúncio
```

## Organização de pastas

```
src/
├── main.tsx                  # ponto de entrada
├── app/                      # raiz do app: providers globais e CSS global
├── features/
│   └── DailyChallenge/       # a tela do jogo
│       ├── index.ts
│       ├── types.ts          # árvore da expressão, cursor, estado do jogo
│       ├── styles.css
│       ├── presentation/     # index → controller (estado) → view (layout)
│       ├── components/       # editor, teclado, abas de nível, enunciado…
│       ├── hooks/            # use-game, use-challenge-input, use-level-hue…
│       ├── services/         # DTO, http, mappers, models, queries
│       ├── mocks/            # desafios de exemplo para os testes
│       ├── utils/            # árvore, avaliador, reducer, formatação, storage
│       └── __tests__/
│   └── Pages/                # páginas institucionais e a de "não encontrada"
└── shared/                   # código reutilizável entre features
    ├── site/                 # URL, rotas e textos (usados também no prerender)
    ├── router/               # navegação e <head> por página
    ├── ads/                  # AdSense e consentimento de cookies
    └── ui/                   # moldura das páginas de texto e rodapé
```

Os imports entre pastas usam o alias `@/` (raiz do projeto), por exemplo
`import { localISODate } from '@/src/shared'`.

## Trocando o mock pela API

Os desafios vêm de `fetchDailyPuzzles` em
`src/features/DailyChallenge/services/http/index.ts`, que hoje lê
`mocks/daily-puzzles.ts`. Para usar o banco de verdade, troque o corpo dessa
função pela chamada real (ex.: `GET /api/puzzles?date=AAAA-MM-DD`) e ajuste o
`DailyPuzzleDTO` e o mapper se o formato da resposta for diferente.

## Protótipo original

`docs/prototype/algarismos.html` é a versão original do jogo em um único
arquivo HTML (React via CDN), mantida como referência.
