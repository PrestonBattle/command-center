# Command Center

A subscription app for one-person businesses. It replaces scattered folders and
spreadsheets with one place for clients, money coming in, leads, and the
**Life Vest**: the monthly revenue the owner needs to cover their life, their
business and their taxes, and how close they are to it.

## Stack

- **Next.js 16** (App Router, Turbopack) and **React 19**
- **TypeScript**, strict
- **Mantine 9** components, **Tailwind 4** utilities
- **Supabase**: Postgres with row-level security, and auth
- **zod 4** for validation, shared by forms and server actions

## Getting started

```bash
npm install
# create .env.local with the variables below
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Name | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key. Server only; never expose it to the browser |

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output |

CI runs `lint` and `typecheck` on every pull request.

## Project layout

```
src/
  app/            routes: (app) signed-in pages, onboarding, auth, dev showcase
  global/
    components/   shared UI (Glass, inputs, nav, …)
    data/         data layer: the only code that talks to Supabase
    lib/          pure helpers (money, action results, …)
    types/        database row types
    styles/       globals, theme, CSS modules
  proxy.ts        auth middleware
```

The full conventions (file size, server actions, hooks, styling, accessibility)
are in [CLAUDE.md](./CLAUDE.md). Read it before contributing; the same rules
apply to people and to the backlog bot.

## How work flows

- `dev` is the integration branch. Feature branches merge into it by PR.
- `bot/dev` is where the backlog bot works. It opens one small PR per item in
  [docs/BACKLOG.md](./docs/BACKLOG.md); those merge into `bot/dev`, and
  `bot/dev` merges into `dev` when a batch is ready.

## Money

All amounts are stored as **integer cents**. People type dollars; the zod
schemas convert. Values that can be calculated (the floor, monthly revenue,
overdue status) are never stored, so they can't go stale.
