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
- `later`: written down so nobody invents their own version, but not to be
  built yet. The bot skips it.

Keep items small: one PR each, under ~400 changed lines.

---

## Launch

These are the items between the app and charging for it, from the break-it
pass on Oct 21 (dev server, local Supabase). The R items come first because
the bot takes the first `ready` item in the file.

Order: R5 (Preston asked for it first), R1 → R2 → R3, then Data flow
A1–A6, then R4. The rest wait on
Preston.

### Bot can build

- [x] **R1 · Forms survive surprises** · `ready`
  `useActionForm` and `useActionButton` catch a thrown action (a network
  drop or an expired session) and show a form error instead of crashing:
  "You've been signed out. Sign in again", with a link back to this page.
  Today any submit after the session ends throws "An unexpected response
  was received from the server." R7 removes the cause; R1 makes the next
  surprise fail softly.

- [x] **R2 · Error pages** · `ready` · after R1
  Add `app/(app)/error.tsx` inside the app shell: what happened, Try again,
  and Back to dashboard. Add a bare `app/global-error.tsx` for when the
  layout itself breaks. Both use glass, have one `<h1>`, and move focus to
  the heading. Today a server error shows Next's blank "Application error".

- [x] **R3 · Security headers** · `ready`
  In `next.config.ts`:
  - `poweredByHeader: false`
  - `X-Frame-Options: DENY` and `frame-ancestors 'none'`, so no other site
    can embed the app
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` turning off camera, mic and location

  A full CSP is R14, because Mantine's inline styles need care. HSTS is set
  at the host.

- [x] **R4 · Page through Money and Clients** · `ready` · after A2, A4
  With 400 clients, Money renders 1,600 rows (90,000px tall, 5.5s to load
  locally) and Clients renders 400 cards.
  - Clients: 50 per page, with `?page=` in the URL, working alongside
    search.
  - Money: group by status, show the first 25 in each group with a "Show
    all", and keep totals counting everything.

- [x] **R5 · Geist, one font file** · `ready`
  Preston picked Geist (Oct 22) over the current Bricolage + Reddit Sans,
  which load 23 font files. Use one variable-weight Geist file for both body
  and headings, with equal-width numbers on figures so money columns line
  up. Check all three themes.

### Preston's (auth, proxy, dependencies, schema)

- [ ] **R6 · Upgrade Next.js** · `preston`
  16.2.4 has published critical advisories: remote code execution through
  image optimization, ways around the proxy, and server-action denial of
  service. Move to the latest 16.x (16.4.2 as of Oct 21); `npm audit` says
  it isn't a major bump. In the same PR, drop the unused `ioredis`, `pino`
  and `pino-pretty`, and run `npm audit fix` for the moderate advisories.

- [ ] **R7 · Don't redirect server actions in the proxy** · `preston`
  `updateSession` answers a signed-out server-action POST with a 307 to
  `/auth/login`. The client can't follow it, so the form crashes. Skip the
  redirect when the request has a `Next-Action` header and let
  `getDataLayer()` redirect instead: an action can redirect, but a 307 to a
  page can't be followed.

- [ ] **R8 · Forgot password** · `decision`
  "Forgot password?" on login → email link → a "Set a new password" page,
  using Supabase's reset email (including its template wording). Auth is
  Preston's, but the bot can build the pages and actions if he says so.

- [ ] **R9 · Confirm email at signup** · `decision`
  Turn on email confirmation in the live Supabase project and add a "Check
  your email" screen. Decide whether onboarding can start before the email
  is confirmed.

- [ ] **R10 · Limit login attempts** · `decision`
  25 wrong passwords in a row went through with no slowdown. The login
  action has a spot marked for a limiter. Supabase's own limit counts per
  IP, and every login comes from the server's IP, so it doesn't protect a
  single account. Pick where the counts live: Upstash, Redis, or a
  Postgres table.

- [ ] **R11 · Billing** · `decision`
  The big one. Decide first:
  - price
  - trial length, and whether a card is needed up front
  - what an unpaid account sees (read-only is kindest)

  Then build Stripe Checkout, the Customer Portal, and a webhook that
  writes the subscription status on the org (a schema change). The app
  layout checks that status.

- [ ] **R12 · Terms, privacy, delete account** · `decision`
  - Terms of service and privacy policy pages, with wording from Preston
    or a template he approves.
  - Settings, "Export my data": a CSV of clients, payments and leads. The
    bot can build this.
  - Settings, "Delete my account": deletes the org and the auth user. It
    needs a SQL function, so it's Preston's.

- [ ] **R13 · Production setup** · `preston`
  - a live Supabase project with backups (point-in-time recovery)
  - hosting on the subdomain, with env vars set
  - error monitoring (Sentry or the host's own)
  - one signup on the real domain, tested end to end

### Later

- [ ] **R14 · Content Security Policy** · `later` · after R3
  A nonce-based CSP once the R3 headers are in. It needs testing against
  Mantine's inline styles and Next's scripts.

- [ ] **R15 · Browser tests in the repo** · `later`
  The Playwright checks live outside the repo: signup → onboarding →
  clients → money, the edge cases, and axe in every theme. Move them in and
  run them in CI against a local Supabase. This needs `@playwright/test`, a
  new dependency.

- [ ] **R16 · Length limits in the database** · `later`
  The forms cap text length but the tables don't, so a direct API call
  saved a 100,000-character name. Add `check (length(name) <= …)` to the
  text columns. That's a schema change, so it's Preston's.

## Data flow

Every page moves to the same shape, modelled on qrum's events pages:

```
_server/queries.ts   import "server-only"; fetch + map → a view object
page.tsx             starts the promises (no await), renders the title at once
<SectionBoundary>    error fallback with Try again + Suspense + skeleton
section              unwraps the promise; picks the empty state or the content
pieces               props in, markup out
```

Rule: a section that isn't interactive is an async server component that
awaits its promise. One that is interactive (dragging, live controls) is a
client component that calls `use()`. `SectionBoundary` takes `children`, so a
server section stays server-side inside it. Page titles show at once and
numbers stream in.

- [x] **A1 · SectionBoundary and skeletons** · `ready`
  Add `global/components/section-boundary.tsx`: a client error boundary
  (Callout in `--bad`, "Try again" re-renders just that section) wrapped
  around `Suspense`. Add `global/components/skeleton/`: line, block, card and
  table-row pieces in glass, with the pulse off under reduced motion and
  `aria-busy` on the region. Write the rule above into CLAUDE.md ("Where
  things go" gets `_server/`) and add the pieces to `/dev`.

- [x] **A2 · Clients on the pattern** · `ready` · after A1
  `clients/_server/queries.ts` → `getClientsView({ q, status })`. Title
  "Clients" and the Add button show at once; the count and recurring total,
  toolbar results and grid stream in. Skeleton: six cards in the grid.

- [x] **A3 · Leads on the pattern** · `ready` · after A1
  `getLeadsView({ q })`. The board stays a client section (`use()`), since
  dragging needs it. Skeleton: the stage columns with two cards each.

- [x] **A4 · Money on the pattern** · `ready` · after A1
  `getMoneyView({ month })`. The month nav is instant; the collected bar and
  tables stream in. `loadBusiness` stays as the shared loader underneath.

- [x] **A5 · Dashboard in three sections** · `ready` · after A1
  Stats, Snapshot + Needs attention, and Payments each get their own
  boundary, so a slow part doesn't hold up the rest and a failed part
  doesn't blank the page. Data that several sections need is loaded once
  (React `cache`).

- [x] **A6 · Client detail, Life vest, Settings** · `ready` · after A1
  Same pattern. Client detail uses slots like qrum's event page (header,
  services, payments, activity) and calls `notFound()` for a missing client.

---

## Foundations

- [x] **F1 · Theme variables** · `ready`
  Add the Sunset CSS variables to `globals.css` (`--text`, `--text-muted`,
  `--text-faint`, `--accent`, `--ok`, `--warn`, `--bad`, `--field-bg`,
  `--field-bg-hover`, `--field-border`, `--glass-*`). Mantine theme:
  `primaryColor: "orange"`, `primaryShade: 9`; remove the custom purple
  palette. Replace hard-coded colors in existing components with variables.

- [x] **F2 · Glass and background, Sunset** · `ready` · after F1
  Update `glass/style.css` to the tuned light values (8% tint,
  `saturate(170%)`, gradient ring, inner top edge, soft shadow, optional
  `--glass-outline`). Update `Background` to the Sunset blobs. Remove the
  unused commented-out shapes.

- [x] **F3 · Input styling** · `ready` · after F1
  `global/styles/inputs.module.css` and `Input` / `InputWrapper` theme
  overrides so every Mantine input gets the glass field look. Delete the
  empty `inputs/text-input.tsx`.

- [x] **F4 · Domain inputs** · `ready` · after F3
  `MoneyInput`, `PercentInput`, `IntervalSelect`, `BusinessTypeSelect` in
  `global/components/inputs/`, plus `index.ts`. Add each to `/dev`.

- [x] **F5 · Layout building blocks** · `ready` · after F2
  `StepHeader`, `FormSection`, `FieldGrid`, `Callout`, `FormActions`.
  Add each to `/dev`.

- [x] **F6 · Shared action plumbing** · `ready`
  `global/lib/action-result.ts` (`ActionResult`, `toFieldErrors`,
  `attempt`). `global/lib/money.ts` (cents↔dollars, `formatMoney`).
  Update `onboarding/action.ts` to import them instead of defining its own.

- [x] **F7 · Navbar** · `ready` · after F2
  Glass sidebar per the review: layout classes on `Glass`, theme colors,
  `aria-current` in `NavbarLink`, one-line title.

- [x] **F8 · Mobile navigation** · `ready` · after F7
  Bottom tab bar below `sm` using the same `APPCONFIG.navbar` items.

- [x] **F9 · CI and scripts** · `ready`
  Add `"typecheck": "tsc --noEmit"` to `package.json` scripts. Fix existing
  lint warnings (unused imports). `.github/workflows/ci.yml` runs lint and
  typecheck on PRs.

- [x] **F10 · `/dev` route** · `preston`
  Dev-only exception in the proxy plus `dev/layout.tsx` with `notFound()` in
  production. (Touches auth middleware.)

## Cleanup

- [x] **C1 · Dashboard layout** · `ready` · after F2
  Replace the inline `<style>` grid in `app/page.tsx` with Tailwind grid
  classes. Move `SAMPLE` data into `_lib/sample.ts`.

- [x] **C2 · One surface style** · `ready` · after F5
  Move dashboard panels from `Panel` (paper) to `GlassPanel`; delete
  `panel/panel.tsx` once nothing uses it.

- [x] **C3 · Names and typos** · `ready`
  `floor/_componets` → `_components`; `global/lib/parse.csv.tsx` →
  `parse-csv.ts`; nav "Campaigns" label matches the Sources page decision;
  `onboarding/utils/` → `onboarding/_lib/`.

- [x] **C4 · README** · `ready`
  Replace the create-next-app README: what the app is, setup, env vars
  needed (names only), scripts, folder map (link to `CLAUDE.md`).

## Onboarding

- [x] **O1 · App route group** · `ready` · after F7
  Move the dashboard into `app/(app)/page.tsx`. `(app)/layout.tsx`:
  `getDataLayer()` → org; redirect to `/onboarding` if not finished; render
  Navbar + `<main>`. Root layout keeps only providers and background.

- [x] **O2 · Onboarding gate and progress** · `ready` · after O1
  `onboarding/layout.tsx` (finished → `/`), `onboarding/page.tsx` (redirect
  to current step), `requireStep()` helper, `OnboardingProgress` wrapping
  the shared `Stepper` (fix `window` shadowing, drop `completedSteps`, add
  `aria-current`, focus styles, theme colors).

- [x] **O3 · Step 1: business** · `ready` · after O2, F4, F5
  Page + form using `useOnboardingForm`, `businessSchema`, `saveBusiness`.

- [x] **O4 · Step 2: floor form** · `ready` · after O3
  Personal and business `FormSection`s from `EXPENSE_CATEGORIES`,
  tax and estimated revenue, "Finish later" (`skipFloor`). Summary panel
  shows totals as the user types. Uses `calculateFloor` from O4a.

- [x] **O4a · Floor calculation** · `preston` (drafted by Claude, review it)
  `global/lib/floor.ts`: `business + personal / (1 − taxRate)`, matching the
  SQL `org_floor_cents`, plus tests.

- [x] **O5 · Step 3: clients, manual entry** · `ready` · after O3
  Editable rows (name, email, amount, interval), add/remove row, running
  total vs floor, "Skip for now", using `saveClients`.

- [x] **O6 · Step 3: CSV import** · `ready` · after O5
  `papaparse` (needs Preston's OK to add the dependency), column-mapping
  step, preview rows into the manual table, 500-row limit, template
  download.

- [x] **O7 · Done step** · `ready` · after O5
  Summary of what was set up, `finishOnboarding` button.

## App pages

- [x] **P1 · Clients list** · `ready` · after O1
  Card grid from `dl.clients.list()` with primary contact and monthly
  amount; search and status filter in the URL (`?q=&status=`).

- [x] **P2 · Client detail** · `ready` · after P1
  Contacts, services, tags, activity timeline. Edit via actions.

- [x] **P3 · Add / edit client** · `ready` · after P1
  Form + actions for client, primary contact, first service.

- [x] **P4 · Leads board** · `ready` · after O1
  Kanban by stage, move stage via action (keyboard-accessible move, not
  drag-only).

- [x] **P5 · Payment schedule** · `decision` (computed on the fly; see REVIEW-NOTES §2)
  Generate expected `payments` rows ahead of time, or compute on the fly?
  Preston decides; then this becomes `preston` or `ready`.

- [x] **P6 · Money page** · `ready` · after P5
  This month's payments, collected vs expected bar, "Mark paid" action.

- [x] **P7 · Life vest page** · `ready` · after O4a
  Coverage vs floor and what-if sliders using `calculateFloor`.

- [x] **P8 · Dashboard on real data** · `ready` · after P6, P7
  Replace sample data with data-layer queries.

## Leads

Order: L7 → L8 → L5 → L4 → L1 → L2 → L3. All use the existing tables; no
schema changes.

- [x] **L7 · Inputs line up in every form** · `ready`
  Theme-level: inputs in a grid row align at the bottom whatever is above
  them (hint, wrapped label). Remove the one-off fix in `ExpenseFields`.
  Check Add lead, Add client, Life vest and onboarding forms.

- [x] **L8 · Edit a lead** · `ready` · after L7
  Extract `LeadForm` (initial values, action, submit label) used by Add and
  Edit. New `updateLead` action with the same schema. Edit opens from the
  card (the lead's name, or a "⋯" menu that also holds Move to and Delete).
  Stage isn't in the form. Converted leads can still fix contact details.

- [x] **L5 · Search leads** · `ready` · after L8
  Search box above the board, `?q=` in the URL, filtered on the server.
  Matches name, contact, email and phone. Columns without a match say
  "No matches". Same toolbar pattern as Clients.

- [x] **L4 · Scrollable stage columns** · `ready` · after L5
  Desktop: columns a fixed height, each scrolling on its own, focusable with
  a label. Header shows count and monthly value. Phone: one stage at a time
  with stage tabs.

- [x] **L1 · Drag leads between stages** · `ready` · after L4
  dnd-kit (Preston OK'd the dependency): mouse, touch and keyboard. The card
  moves instantly (`useOptimistic`) and snaps back with a message if
  `moveLead` fails. The column under the card highlights. Keep "Move to…"
  in the card menu (WCAG 2.5.7). Screen-reader announcements on pick up and
  drop. Honors `prefers-reduced-motion`.

- [x] **L2 · Converted leads leave the board** · `ready` · after L1
  Converted leads show in Won for 30 days, then drop off the board (still
  counted in stats). Client page shows "Won from a lead on {date}".

- [x] **L3 · Lock converted leads** · `ready` · after L2
  A converted lead can't be dragged, moved or deleted. The card says
  "Client now" and links to the client. To stop working with them, end the
  client (keeps payment history; deleting a client deletes its payments).

- [ ] **L6 · Load more per column** · `later`
  Only if a column passes ~50 leads: "Show more" and batched loading in the
  data layer.

## Dashboard

- [x] **D1 · Explain numbers with "?" tips** · `ready`
  Global `InfoTip`: opens on hover, focus or tap; stays open while hovered;
  Escape or a click elsewhere closes it (WCAG 1.4.13). The explanation is
  the button's description for screen readers. `info` prop on `Stat` and
  the Snapshot figures. Tips on all six dashboard numbers.

- [x] **D2 · Animated Snapshot explainer** · `ready` · after D1
  "?" on the Snapshot opens a step-through: the tank fills to each state
  (Underwater, Treading water, Afloat, Clear) using your own floor, the
  figure counts to the state's number, and each step explains it. Last
  step: where you are now. Next/Back and state chips; no auto-advance.
  Reduced motion: states change without animation.


- [x] **D3 · Dashboard layout** · `ready`
  Three compact stats on top; Snapshot (2/3) beside Needs attention (1/3),
  same height, with the list scrolling inside its card (count in the
  title, fade while there's more); Payments full width below. Attention is
  grouped: setup gaps first, one line per client that owes (oldest debt
  first), stale leads as one line. Snapshot shows how to set a floor
  instead of "0%" when none is set; Needs attention shows "All clear" when
  empty. Phones stack at natural height.
