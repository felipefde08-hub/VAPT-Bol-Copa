# VAPT Bolão Copa 2026

Sistema de bolão para a Copa do Mundo 2026.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — rodar o servidor de API (porta 5000)
- `pnpm --filter @workspace/vapt-bolao run dev` — rodar o frontend (porta 22477)
- `pnpm run typecheck` — typecheck completo em todos os pacotes
- `pnpm run build` — typecheck + build de todos os pacotes
- `pnpm --filter @workspace/api-spec run codegen` — regenerar API hooks e schemas Zod a partir do spec OpenAPI
- `pnpm --filter db run push` — aplicar mudanças de schema no DB (apenas dev)
- Variável obrigatória: `DATABASE_URL` — string de conexão Postgres

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validação: Zod (`zod/v4`), `drizzle-zod`
- Codegen de API: Orval (via spec OpenAPI)
- Build: esbuild

## Estrutura

```
artifacts/vapt-bolao/   — frontend React + Vite
artifacts/api-server/   — backend Express
lib/db/                 — schema Drizzle + migrações
lib/api-spec/           — spec OpenAPI
lib/api-zod/            — schemas Zod gerados
lib/api-client-react/   — hooks React gerados
scripts/                — scripts utilitários
```
