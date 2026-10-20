# Command Center — rules for every change

Command Center is a subscription app for one-person businesses: clients, money
in, leads, and the "Life Vest" floor (the monthly revenue they need). These
rules apply to every change, by a person or a bot. If a rule and a request
conflict, follow the rule and say so in the PR.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Mantine 9 + Tailwind 4 · Supabase (Postgres + RLS) · zod 4 · @mantine/form.
Middleware lives in `src/proxy.ts`.

## Where things go

```
src/
  app/
    (app)/               signed-in app: layout = auth gate + navbar
      <feature>/
        page.tsx         server component: load data, render
        actions.ts       "use server" mutations for this feature
        _components/     components only this feature uses
        _lib/            helpers only this feature uses
        _hooks/          client hooks only this feature uses
    onboarding/          same shape as a feature
    auth/                login / signup (outside (app))
    dev/                 component showcase, dev-only, sample data
  global/
    components/          shared UI, one folder per component
    hooks/               shared client hooks (use-*.ts)
    lib/                 shared pure helpers (money.ts, dates.ts, …)
    data/                data layer: the ONLY code that talks to Supabase
    types/               row types (types/supabase/types.ts)
    styles/              globals.css, theme, CSS modules
    config/              APPCONFIG (nav, hidden routes)
```

A thing lives in `global/` once a second feature needs it. Not before.

## Size and separation

- One component per file. Files stay under ~150 lines; split before that.
- Pages compose; they don't contain logic. Data loading at the top, JSX below.
- No inline `<style>` blocks. Use Tailwind utilities or a CSS module.
- Presentational components take props and render. State, effects and
  submissions live in a hook (`use-<thing>.ts`), and the component calls it.
- Pure logic (math, formatting, mapping) goes in `_lib/` or `global/lib/`
  as plain functions with no React imports, so it can be tested alone.

## No repeated code

Before writing anything, search `src/global/` for an existing component,
hook or helper. Reuse or extend it. If you'd paste the same logic a second
time, extract it instead. Known building blocks:

- `Glass`, `GlassPanel` — every card and surface.
- `global/components/inputs` — `MoneyInput`, `PercentInput`,
  `IntervalSelect`. Plain text fields are Mantine `TextInput`; the theme
  styles every Mantine input, so never style a raw `<input>`.
- `global/components/layout` — `PageHeader`, `FormSection`, `FieldGrid`,
  `Callout`, `FormActions`, `StatusBadge`, `Stat`, `EmptyState`.
- `global/hooks/use-is-active.ts` — which nav link is current.
- `global/lib/intervals.ts` — billing interval options and labels.
- `useOnboardingForm` pattern — form + zod resolver + action + pending.
- `global/lib/money.ts` — `dollarsToCents`, `centsToDollars`, `formatDollars`,
  `formatCents`. All money conversion and display.
- `global/lib/action-result.ts` — `ActionResult`, `invalid()`, `toFieldErrors()`.
- `global/lib/attempt.ts` — `attempt(label, work)`: the write step of every
  action, turning `DbError`s into a friendly `formError`.
- `getDataLayer()` — all reads and writes.

## Data and actions

- **Every mutation is a server action** in the feature's `actions.ts`.
  No API routes for app data, no Supabase calls in components.
- Action shape, always:
  1. `"use server"`, parameter `input: unknown`
  2. `schema.safeParse(input)`; on failure return
     `{ ok: false, formError, fieldErrors }`
  3. `const dl = await getDataLayer()`
  4. writes inside `try`; catch `DbError` and return `e.userMessage`
  5. `redirect()` or `revalidatePath()` AFTER the try/catch, never inside
- Return type is `ActionResult` from `global/lib/action-result.ts`.
- zod schemas live next to the feature (`_lib/schemas.ts`) and are shared
  by the form (client validation) and the action (server validation).
- Money is integer cents in the database. Users type dollars; the schema
  converts. Never store floats, never store derived values (floor, MRR,
  overdue, days-in-stage) — compute them.
- The data layer (`global/data/`) is the only place that imports the
  Supabase client. Need a new query? Add a method there.

## Styling

- Sunset theme: light glass on the warm blurred background.
- Colors come from CSS variables only (`var(--text)`, `--text-muted`,
  `--text-faint`, `--accent`, `--ok`, `--warn`, `--bad`, `--field-*`,
  `--glass-*`). No hex codes in components; add a variable instead.
- Status colors carry meaning: `--ok` paid/above floor, `--bad` overdue,
  `--warn` stale/at risk. Don't use them for decoration.
- Mantine components are styled once in the theme, not per use.
- Spacing and type follow Tailwind's scale. Headings use `font-display`.

## Accessibility (required, not optional)

- Real elements: `<button>`, `<a href>`, `<label>`, `<nav>`, `<main>`,
  `<ol>/<li>` for steps, `<table>` for tables. Never `onClick` on a div.
- Every input has a visible label. Icon-only buttons get `aria-label`.
- Current nav link and current step use `aria-current`.
- Form errors are tied to their field (Mantine does this; don't bypass it)
  and the form-level error sits in a `role="alert"` region.
- Visible focus: use `focus-visible:` styles; never remove outlines without
  a replacement.
- Contrast: 4.5:1 for text, 3:1 for large text and UI edges. Check text on
  glass, not just on white.
- Touch targets at least 44×44px. Inputs at 16px+ font (stops iOS zoom).
- Colors are never the only signal: pair status color with a word or icon.
- Respect `prefers-reduced-motion` for any animation.
- One `<h1>` per page; headings don't skip levels.

## Documentation

- Every exported function, hook and component has a JSDoc comment saying
  what it is for. Comments explain *why*, not what the code says.
- Non-obvious decisions get a short comment at the spot (see the existing
  comments in `global/data/` for the tone).
- When you add a building block to `global/`, add it to the list under
  "No repeated code" above and to the `/dev` showcase.

## Naming

- Files and folders: kebab-case (`money-input.tsx`). Components: PascalCase.
  Hooks: `useThing` in `use-thing.ts`. Constants: `UPPER_SNAKE`.
- Types: `ThingRow` for database rows, `ThingInput` / `Thing` for zod
  input/output types.
- No `any`. No non-null `!` unless the comment says why it's safe.

## Checks before every PR

```bash
npm run lint
npm run typecheck
```

Both must pass with no new warnings.

## Pull requests

- One backlog item per PR. Aim for under ~400 changed lines.
- Branch: `bot/<backlog-id>-<short-slug>` from `bot/dev`. PRs target `bot/dev`.
  `bot/dev` is the bot's working line; Preston merges it into `dev` when ready.
- Title: conventional commit style, e.g. `feat(onboarding): floor step form`.
- Fill in the PR template, including the accessibility checklist.
- Never merge your own PR. Never push directly to `bot/dev`, `dev`, `main` or `master`.

## Off-limits for bots

These are owned by Preston. A bot may read them and suggest changes in a PR
description, but must not change them:

- Auth flow and `src/proxy.ts` / `src/app/supabase/*`
- RLS policies, SQL functions, migrations, the database schema
- Money math: floor, MRR, payment schedule generation
- `.env*` files, secrets, `package.json` dependencies (ask first)

If a backlog item needs one of these, stop and open a draft PR explaining
what decision is needed instead of guessing.
