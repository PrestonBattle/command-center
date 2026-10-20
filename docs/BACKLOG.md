# Backlog

The bot takes the **first unchecked item whose status is `ready`** and whose
`after` items are all checked, and opens one PR for it against `bot/dev`. Each PR ticks its own
box, so merging the PR marks the item done. An item with an open `bot/<ID>-…`
PR is in progress and is skipped.

Status:
- `ready`: the bot can build it.
- `preston`: Preston writes this one himself (core logic he wants to own).
  The bot skips it.
- `decision`: needs a choice from Preston first. The bot skips it.

Keep items small: one PR each, under ~400 changed lines.

---

## Foundations

- [ ] **F1 · Theme variables** · `ready`
  Add the Sunset CSS variables to `globals.css` (`--text`, `--text-muted`,
  `--text-faint`, `--accent`, `--ok`, `--warn`, `--bad`, `--field-bg`,
  `--field-bg-hover`, `--field-border`, `--glass-*`). Mantine theme:
  `primaryColor: "orange"`, `primaryShade: 9`; remove the custom purple
  palette. Replace hard-coded colors in existing components with variables.

- [ ] **F2 · Glass and background, Sunset** · `ready` · after F1
  Update `glass/style.css` to the tuned light values (8% tint,
  `saturate(170%)`, gradient ring, inner top edge, soft shadow, optional
  `--glass-outline`). Update `Background` to the Sunset blobs. Remove the
  unused commented-out shapes.

- [ ] **F3 · Input styling** · `ready` · after F1
  `global/styles/inputs.module.css` and `Input` / `InputWrapper` theme
  overrides so every Mantine input gets the glass field look. Delete the
  empty `inputs/text-input.tsx`.

- [ ] **F4 · Domain inputs** · `ready` · after F3
  `MoneyInput`, `PercentInput`, `IntervalSelect`, `BusinessTypeSelect` in
  `global/components/inputs/`, plus `index.ts`. Add each to `/dev`.

- [ ] **F5 · Layout building blocks** · `ready` · after F2
  `StepHeader`, `FormSection`, `FieldGrid`, `Callout`, `FormActions`.
  Add each to `/dev`.

- [ ] **F6 · Shared action plumbing** · `ready`
  `global/lib/action-result.ts` (`ActionResult`, `toFieldErrors`,
  `attempt`). `global/lib/money.ts` (cents↔dollars, `formatMoney`).
  Update `onboarding/action.ts` to import them instead of defining its own.

- [ ] **F7 · Navbar** · `ready` · after F2
  Glass sidebar per the review: layout classes on `Glass`, theme colors,
  `aria-current` in `NavbarLink`, one-line title.

- [ ] **F8 · Mobile navigation** · `ready` · after F7
  Bottom tab bar below `sm` using the same `APPCONFIG.navbar` items.

- [ ] **F9 · CI and scripts** · `ready`
  Add `"typecheck": "tsc --noEmit"` to `package.json` scripts. Fix existing
  lint warnings (unused imports). `.github/workflows/ci.yml` runs lint and
  typecheck on PRs.

- [ ] **F10 · `/dev` route** · `preston`
  Dev-only exception in the proxy plus `dev/layout.tsx` with `notFound()` in
  production. (Touches auth middleware.)

## Cleanup

- [ ] **C1 · Dashboard layout** · `ready` · after F2
  Replace the inline `<style>` grid in `app/page.tsx` with Tailwind grid
  classes. Move `SAMPLE` data into `_lib/sample.ts`.

- [ ] **C2 · One surface style** · `ready` · after F5
  Move dashboard panels from `Panel` (paper) to `GlassPanel`; delete
  `panel/panel.tsx` once nothing uses it.

- [ ] **C3 · Names and typos** · `ready`
  `floor/_componets` → `_components`; `global/lib/parse.csv.tsx` →
  `parse-csv.ts`; nav "Campaigns" label matches the Sources page decision;
  `onboarding/utils/` → `onboarding/_lib/`.

- [x] **C4 · README** · `ready`
  Replace the create-next-app README: what the app is, setup, env vars
  needed (names only), scripts, folder map (link to `CLAUDE.md`).

## Onboarding

- [ ] **O1 · App route group** · `ready` · after F7
  Move the dashboard into `app/(app)/page.tsx`. `(app)/layout.tsx`:
  `getDataLayer()` → org; redirect to `/onboarding` if not finished; render
  Navbar + `<main>`. Root layout keeps only providers and background.

- [ ] **O2 · Onboarding gate and progress** · `ready` · after O1
  `onboarding/layout.tsx` (finished → `/`), `onboarding/page.tsx` (redirect
  to current step), `requireStep()` helper, `OnboardingProgress` wrapping
  the shared `Stepper` (fix `window` shadowing, drop `completedSteps`, add
  `aria-current`, focus styles, theme colors).

- [ ] **O3 · Step 1: business** · `ready` · after O2, F4, F5
  Page + form using `useOnboardingForm`, `businessSchema`, `saveBusiness`.

- [ ] **O4 · Step 2: floor form** · `ready` · after O3
  Personal and business `FormSection`s from `EXPENSE_CATEGORIES`,
  tax and estimated revenue, "Finish later" (`skipFloor`). Summary panel
  shows totals as the user types. Uses `calculateFloor` from O4a.

- [ ] **O4a · Floor calculation** · `preston`
  `global/lib/floor.ts`: `business + personal / (1 − taxRate)`, matching the
  SQL `org_floor_cents`, plus tests.

- [ ] **O5 · Step 3: clients, manual entry** · `ready` · after O3
  Editable rows (name, email, amount, interval), add/remove row, running
  total vs floor, "Skip for now", using `saveClients`.

- [ ] **O6 · Step 3: CSV import** · `ready` · after O5
  `papaparse` (needs Preston's OK to add the dependency), column-mapping
  step, preview rows into the manual table, 500-row limit, template
  download.

- [ ] **O7 · Done step** · `ready` · after O5
  Summary of what was set up, `finishOnboarding` button.

## App pages

- [ ] **P1 · Clients list** · `ready` · after O1
  Card grid from `dl.clients.list()` with primary contact and monthly
  amount; search and status filter in the URL (`?q=&status=`).

- [ ] **P2 · Client detail** · `ready` · after P1
  Contacts, services, tags, activity timeline. Edit via actions.

- [ ] **P3 · Add / edit client** · `ready` · after P1
  Form + actions for client, primary contact, first service.

- [ ] **P4 · Leads board** · `ready` · after O1
  Kanban by stage, move stage via action (keyboard-accessible move, not
  drag-only).

- [ ] **P5 · Payment schedule** · `decision`
  Generate expected `payments` rows ahead of time, or compute on the fly?
  Preston decides; then this becomes `preston` or `ready`.

- [ ] **P6 · Money page** · `ready` · after P5
  This month's payments, collected vs expected bar, "Mark paid" action.

- [ ] **P7 · Life vest page** · `ready` · after O4a
  Coverage vs floor and what-if sliders using `calculateFloor`.

- [ ] **P8 · Dashboard on real data** · `ready` · after P6, P7
  Replace sample data with data-layer queries.
