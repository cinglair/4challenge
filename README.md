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
| `yarn build`     | checa os tipos e gera `dist/`    |
| `yarn preview`   | serve o build de produção        |
| `yarn test`      | roda os testes (Vitest)          |
| `yarn lint`      | ESLint em `src/`                 |
| `yarn typecheck` | `tsc --noEmit`                   |
| `yarn fix`       | formata o projeto com o Prettier |

## Desafios no banco

A tabela `daily_puzzles` guarda um desafio por dia e nível, com a dica. O
esquema está em `supabase/migrations/` e a carga atual (1º/11/2026 a
30/04/2027) em `supabase/seed.sql`. Para gerar mais dias, conferidos pelo
solver do jogo:

```bash
node scripts/generate-daily-puzzles.mjs 2027-05-01 2027-08-31 > mais-dias.sql
```

Os desafios só ficam legíveis pela API a partir da véspera do dia (UTC).

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
└── shared/                   # código reutilizável entre features
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
