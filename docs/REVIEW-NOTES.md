# Review notes

What was built on `bot/dev` in one pass, why, and what to look at. Each
numbered section matches one commit.

## Start here

1. **Run the schema.** `supabase/schema.sql` on your Supabase project (skip
   if you already ran the v1 schema and the onboarding additions).
2. **Install and run.** `npm install`, then `npm run dev`. New packages:
   `papaparse` (CSV import) and `vitest` (tests).
3. **Walk the flow.** Sign up → onboarding (business, floor, clients, done)
   → dashboard → Clients → Leads → Money → Life vest.
4. **See every shared component** at `/dev/components` (dev only, no login).
5. **Checks:** `npm run lint`, `npm run typecheck`, `npm test` (21 tests).
   All pass, and `next build` compiles all 17 routes.

### What I could and couldn't verify

- **Verified:** types, lint, unit tests, a production build, and the
  `/dev/components` page rendered at desktop and phone width.
- **Not verified:** the signed-in pages against a real database. My
  environment has no access to your Supabase project, so I couldn't click
  through onboarding, add a client or mark a payment paid. **Expect a few
  rough edges on your first run** and tell me what breaks.

### Decisions I made that are yours to overrule

- **Payments are computed, not stored** until marked paid (§2).
- **Floor calculation written by me** (§2, backlog O4a). Review it.
- **Lead moves use a select, not drag-and-drop** (§6), for accessibility.
- **Campaigns and Settings removed from the nav** until those pages exist (§1).

### Known gaps, roughly in priority order

1. Editing a client's name or a service's amount (only add/end/delete now).
2. Recording a payment with a different amount or date than expected.
3. Settings page (profile, business details, sign out on mobile, themes).
4. Login and signup still use the old paper `Panel` (backlog C2).
5. Sources: no UI to pick where a lead came from.
6. A "Record payment" for one-off invoices with no service.

---

## 1. Foundations

**CSS layer order** (`globals.css`). The file now starts with
`@layer theme, base, mantine, components, utilities;` and imports Mantine's
*layered* stylesheets. Before, Mantine's unlayered CSS could beat Tailwind
classes on Mantine components. Now Tailwind utilities always win, and CSS
modules (unlayered) beat both. Notifications CSS was never imported, so
toasts were unstyled; it is now.

**Fonts.** `font-sans` is Reddit Sans and `font-display` is Bricolage
Grotesque, via `@theme inline`. The body was still `Arial`. Mantine's theme
uses the same variables.

**Inputs** (`styles/inputs.module.css` + `mantine-theme.ts`). Every Mantine
input gets the glass field look from one place: 48px tall, 16px text (stops
iOS zoom), visible focus ring in `--accent`, red border on error, labels and
errors in theme colors.

**Domain inputs** (`components/inputs/`). `MoneyInput` ($, commas, 2
decimals, no negatives), `PercentInput` (0–60), `IntervalSelect`
(1/3/6/12 months). Interval labels live in `lib/intervals.ts` so non-UI code
can use them.

**Layout blocks** (`components/layout/`). `PageHeader` (the page's one h1),
`FormSection`, `FieldGrid`, `Callout`, `FormActions`, `StatusBadge`, `Stat`,
`EmptyState`. Every page below is built from these.

**Navigation.** Sidebar is now Glass, one-line title, 44px targets, focus
rings, icons hidden from screen readers (the label says it). New
`MobileNav` bottom tab bar below `sm`. Both read `APPCONFIG.navbar` and use
`useIsActive()`, so they can't drift apart. Sign out is its own component.

- **Removed from nav:** Campaigns and Settings. Neither page exists; links
  to 404s are worse than no link. Add them back when the pages are built.
- **Removed `hiddenRoutes`.** The nav now only renders inside the `(app)`
  layout, so it never needs to hide itself on /auth or /onboarding.
- **Look at:** sign out isn't in the mobile tab bar (5 slots are full). It
  should live on a future Settings page.

---

## 2. Data layer and money logic

**CRUD factory** (`data/crud.ts`). Added `insertMany` and `upsert`, plus an
`Insert<T>` type that allows passing your own `id`. A private `withOrg()`
stamps `org_id` on every row so callers can never pick the org.

**Floor** (`lib/floor.ts`). `business + personal / (1 − taxRate)`, same as
`org_floor_cents()` in SQL. Your backlog marked this as yours (O4a); I wrote
it so the app works end to end. **Review it closely** and rewrite it if you
want the practice; the tests in `floor.test.ts` will tell you if you broke it.

**Payment schedule: decision made for you (P5), easy to reverse.**
Expected payments are **computed on the fly** from `client_services`, never
stored. Only "Mark paid" writes a `payments` row (keyed by service + due
date, which the schema already makes unique). Why this way:
- changing a service's amount or interval just works; there's nothing to
  regenerate or clean up
- no scheduled job needed to create next month's rows
- "overdue" stays derived, per your rule about not storing derived values

The trade-off: a one-off payment with no service won't appear in the
schedule. If you want one-off invoices, add them as `payments` rows with
`service_id = null` and list them alongside.

**Billing rules** (`lib/billing.ts`). A service bills every
`interval_months` counting from its start month, on `billing_day` or the
start date's day; a day past month end falls on the last day (31 → Feb 28).
Only `active` and `onboarding` clients count, matching the SQL.

**Dates** (`lib/dates.ts`). Dates are "YYYY-MM-DD" strings, like Postgres
`date` columns, to avoid timezone bugs.

**Tests.** Added Vitest (`npm test`, also in CI) with 13 tests for floor,
billing and money. These are the functions where a bug costs a user real
money, so they're the ones worth testing first.

**Schema** (`supabase/schema.sql`). The v1 schema plus the onboarding
columns, in the repo so it's versioned with the code. **Run it on your
Supabase project before using the app**, if you haven't already.

---

## 3. App shell

**Root layout** now holds only providers, fonts and the background.
**`(app)/layout.tsx`** is the gate for the signed-in app: if the org hasn't
finished onboarding, it redirects to `/onboarding`. It renders the sidebar,
the mobile tab bar and `<main id="main">`. The old `app/page.tsx` is gone;
the dashboard is `(app)/page.tsx`.

**`getCurrentOrg()`** (`data/index.ts`) wraps the org fetch in React
`cache()`, so the layout and the page share one query per request.

**Skip link.** The first Tab on any app page shows "Skip to content", which
jumps past the nav. Standard accessibility, invisible otherwise.

**`/dev`.** You'd already added the dev-only exception in the middleware.
`dev/layout.tsx` adds `notFound()` in production as a second lock.

---

## 4. Onboarding, end to end

The flow: `/onboarding` → your current step → business → floor → clients →
done → dashboard. The layout sends finished users to `/`; each page calls
`requireStep(n)` so typing a later step's URL sends you back to where you are.
Finished steps in the progress bar are clickable so people can go back and edit.

**Folder renames (C3).** `utils/` → `_lib/`, `schema.ts` → `schemas.ts`,
`action.ts` → `actions.ts`, the `_componets` typo is gone, and the empty
`parse.csv.tsx` became `global/lib/parse-csv.ts`.

**Moved to `global/`** because Life vest uses them too: expense categories
(`lib/expense-categories.ts`), the floor schema (`lib/schemas/floor.ts`), the
client-row schema (`lib/schemas/client.ts`), and shared zod fields
(`lib/schemas/fields.ts`). Business types and the steps list stay in
onboarding; nothing else needs them.

**Two hooks every form uses.** `useActionForm` (form + schema + action +
server errors + pending) and `useActionButton` (one-click actions). These
replace the `useOnboardingForm` idea from before, made general.

**Step 2** uses `FloorForm` from `components/floor/`, the same one Life
vest uses. It's in Mantine's *controlled* mode so the summary updates as you
type; the summary is `aria-live="polite"` so screen readers hear the new
total. "Finish later" skips without saving.

**Step 3.** Type rows or import a CSV (Papa Parse, the new dependency you
OK'd in the backlog). The import guesses which column is which from the
headers (`csv-columns.ts`, with tests), lets you correct it, then drops the
rows into the table for review; nothing saves until you press Save. Blank
rows are ignored. A running total compares against the floor.
- **Look at:** on desktop, only the first row shows labels; later rows hide
  theirs visually (`sm:sr-only`) but screen readers still read them.
- **Known limit:** errors are matched to rows by position. If someone leaves
  a blank row *between* filled rows and a later row has an error, the error
  can show one row off. Rare; fix by removing blank rows on blur if it bites.

**Saving clients** (`lib/create-clients.ts`) is shared with the Add client
page: client + primary contact (if email) + one service named "Services",
started today. Three inserts, with cleanup if a later one fails.

**`BackButton` fix.** It rendered a `<button>` inside a `<Link>`, which is
invalid HTML and read twice by screen readers. Now it's a single link styled
as a button.

---

## 5. Clients

- **List** (`/clients`): card grid, search and status filter kept in the URL
  (`?q=&status=`) so filtered views can be bookmarked. Each card is fully
  clickable (the name's link stretches over the card) while email and phone
  stay separate links. Joining clients with contacts and services is pure
  logic in `_lib/client-summaries.ts`.
- **Add** (`/clients/new`): name, email, amount and interval, the same schema
  and save logic as onboarding's rows.
- **Detail** (`/clients/[id]`): status picker, delete (with a warning that
  suggests "Ended" instead), services with monthly total, add/end service,
  contacts with add, and payments received.
- **Ending a service** sets `ended_on` to today instead of deleting, so
  history and past payments stay intact.
- **`ConfirmButton`** (`components/confirm-button.tsx`) is the shared
  are-you-sure dialog.
- **Look at:** there's no editing of a client's name or a service's amount
  yet, only add, end and delete. That's the next obvious gap.
- **Look at:** `addContact` lists every contact to check for a primary.
  Fine at this size; a filtered query in the data layer would be cleaner.

---

## 6. Leads

- **Board** (`/leads`): five columns (New, Contacted, Proposal, Won, Lost),
  each a labelled `<section>` with a count. Leads that haven't moved in 14
  days get a "Stale" badge (`_lib/stages.ts`, `STALE_AFTER_DAYS`).
- **Moving a lead is a select, not drag-and-drop.** The mockup had dragging;
  a select works by keyboard and screen reader, and on phones. Drag can be
  added on top later (e.g. `@dnd-kit`), keeping the select as the fallback.
- **"Make client"** on won leads creates the client (with a monthly service
  at the lead's estimate, if it has one), links the lead to it via
  `converted_client_id`, and opens the client's page. Afterwards the card
  shows "View client".
- **Look at:** sources (where leads come from) aren't wired up yet; the
  table and data-layer CRUD exist, but there's no UI to pick one.

---

## 7. Money

- **`/money?month=YYYY-MM`**: one month's expected payments, worked out from
  services (see §2), with a Collected / Overdue / Still-expected bar and a
  written legend, so color is never the only signal. Month arrows are plain
  links, so they work without JavaScript and can be bookmarked.
- **"Still unpaid from earlier months"** appears on the current month and
  looks back 3 months (`OVERDUE_LOOKBACK_MONTHS`). Without it, a payment
  missed in September would quietly disappear on October 1.
- **Mark paid** records today as the paid date. The server reads the
  client and amount from the service, never from the browser, and upserts
  on `(service_id, due_on)`, so a double click can't record it twice.
  **Undo** deletes the payment row.
- **Look at:** marking something paid always uses the service's *current*
  amount and *today's* date. A partial payment, or a different paid date,
  would need a small "Record payment" dialog. Worth doing once it's real.
- The bar's segment widths are inline `style` because they're computed
  values; that's the one place inline styles are right.

---

## 8. Life vest

- **Coverage** (`/life-vest`): revenue as a % of the floor, a bar with a
  dashed floor marker (scaled to 150% of the floor so being over still shows
  headroom), the cushion or shortfall, and how much the biggest client is of
  revenue. Until clients exist it uses the onboarding revenue estimate, and
  says so.
- **What if…**: lose a client (picked from your real clients), land new
  work, personal costs up or down. Nothing saves; the result is announced
  politely to screen readers as it changes. Logic is in
  `_lib/what-if.ts` with tests.
- **Editing costs** reuses `FloorForm` from onboarding with a different
  action (`updateFloor`), which shares `saveFloorData` with onboarding.
- **Look at:** the what-if ranges (up to $5,000 new work, −$1,000 to
  +$2,000 personal) are guesses; tune them to your users.

---

## 9. Dashboard

- **`/`** now runs on real data: greeting by the org's local time, three
  tiles (collected this month, overdue with a link to chase, pipeline),
  your **WaterLinePanel**, a "Needs attention" list and this month's
  unpaid payments.
- **WaterLinePanel kept, two changes.** It sits on `Glass` instead of the
  paper `Panel`, and it calls `calculateFloorCents` instead of repeating
  the formula. I also rendered the state chip ("Underwater", "Afloat", …):
  the labels were defined but never shown, and they're what makes the
  state readable without relying on color.
- **Needs attention** (`_lib/attention.ts`, tested): overdue payments
  first, then leads stuck 14+ days, then setup gaps (no floor, no clients).
  Each row links to where you fix it.
- **Removed:** `app/data.ts` (sample data) and the three sample panels
  (money arriving, needs attention, pipeline) it fed.
- **Still on paper `Panel`:** the login and signup pages. They're auth
  files, so I left them; moving them to Glass is a quick follow-up (C2).

---

## 10. Dev showcase and checks

- **`/dev/components`**: every shared piece with sample data, including a
  working `FloorForm` with a fake save. The `/dev` index moved off white
  text (invisible on Sunset) to the shared components.
- **README** lists `npm test` and points to the schema.
- The production build was checked with a stubbed font file, because my
  environment can't reach Google Fonts. Your machine can, so nothing to do.
