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
5. **Checks:** `npm run lint`, `npm run typecheck`, `npm test` (25 tests).
   All pass.
6. **Overnight pass:** read §12 first. It lists every bug found by
   clicking through the app, what fixed each one, and the browser tests in
   `scripts/e2e/` you can rerun.

### What I could and couldn't verify

- **Verified:** types, lint, unit tests, a production build, and the
  `/dev/components` page rendered at desktop and phone width.
- **Overnight:** the whole app against a local stand-in for Supabase
  (real Postgres with your schema and RLS, GoTrue auth, PostgREST), in a
  real browser, at desktop and phone size. See §12.
- **Still not verified:** your hosted Supabase project itself (I can't
  reach it) and Google Fonts (blocked here; fine on your machine).

### Decisions I made that are yours to overrule

- **Payments are computed, not stored** until marked paid (§2).
- **Floor calculation written by me** (§2, backlog O4a). Review it.
- **Lead moves use a select, not drag-and-drop** (§6), for accessibility.
- **Campaigns and Settings removed from the nav** until those pages exist (§1).

### Known gaps, roughly in priority order

1. Editing a client's name or a service's amount (only add/end/delete now).
2. Recording a payment with a different amount or date than expected.
3. Settings page (profile, business details, sign out on mobile, themes).
4. Sources: no UI to pick where a lead came from.
5. A "Record payment" for one-off invoices with no service.

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

---

## 11. Fix: `component={Link}` in server components

First bug from a real run. `<Button component={Link}>` inside a server
component crashes with "Functions cannot be passed directly to Client
Components": `Link` is a function, and Mantine's Button is a client
component. The production build didn't catch it because these pages render
on request, not at build time.

Fix: `global/components/button-link.tsx` adds `ButtonLink` and `IconLink`,
client components that hold the `Link` reference themselves, so server
components only pass an `href`. Replaced in the dashboard's payments panel,
the Clients page and Money's month navigation. Client components (BackButton,
lead cards, auth pages) can keep using `component={Link}` directly.
CLAUDE.md now says so, so the bot won't repeat it.

---

## 12. Overnight: test, fix, polish

Commits `8d7604a` → `334ab77`. I ran the app against a local copy of
Supabase and clicked through every page the way a new customer would,
then tried to break it. Everything below was found that way, not by
reading code.

### Bugs found and fixed

| What you'd have seen | Cause | Fix |
|---|---|---|
| Console hydration error on every page | Sign-out button's `className` was a multi-line template string; server and client whitespace differed | Joined classes from an array (`8d7604a`) |
| Favicon 404 | Icon in `public/` under the wrong name | Moved to `src/app/favicon.ico`, removed unused template SVGs (`8d7604a`) |
| Onboarding progress bar stuck on step 1 | The onboarding layout is kept between steps, so it never re-read the org | `goTo()` helper revalidates the layout before redirecting (`c2b20df`) |
| Sign-up / log-in **crashed** on any invalid input ("Cannot read properties of undefined (reading 'forEach')") | `zodResolver` is the zod **3** resolver; the schemas are zod 4 | `zod4Resolver` (`54def3c`) |
| First click on Continue / Save did nothing when a field was invalid | `validateInputOnBlur`: clicking the button blurred the field, the error appeared, the layout shifted, and the click landed on empty space | Validate on submit only (`useActionForm`, `54def3c`) |
| Typing 90% tax saved **60%** without a word | `PercentInput` clamped to its max on blur | No clamping; the schema shows "That looks too high" (`54def3c`) |
| White text on orange buttons failed contrast (4.29:1, needs 4.5) | Mantine's orange-9 (`#d9480f`) | Custom `sunset` palette; buttons now use `--accent` (7:1+) (`0a622ab`) |
| Screen readers announced Life vest sliders with no name | `aria-labelledby` lands on the wrapper, not the thumb | `thumbLabel` (`0a622ab`) |
| Money table needed a sideways swipe on phones to see who paid | Fixed 640px-wide table | Columns fold together below `sm` (`334ab77`) |
| React warning on 404 pages | `ColorSchemeScript` re-rendered in the browser; the app is light-only, so it did nothing anyway | Removed (`334ab77`) |

### Polish

- Phone layouts for the dashboard payments list and the water-line stats
  (`c2b20df`); soft initials avatars; "Retainer" as the default service
  name for imported clients; login and sign-up on glass with a shared
  `AuthHeader`.
- Every button and icon button is 44px on touch screens. Compact buttons
  stay compact with a mouse (`global/styles/controls.module.css`).
- `color="ink"`: warm browns for Cancel / Undo / Skip / Back, replacing
  Mantine's cold near-black `"dark"`. Use it for any secondary button.
- Clients filter restyled as glass; scrolls on phones instead of clipping.
- Expense inputs line up in rows even when a label wraps to two lines.
- A proper 404 page (`NotFoundPanel`), with the navbar inside the app.
- `WaterLinePanel` split under 150 lines; its state bands and
  `coverageDate` are now pure functions with tests.

### Tests you can rerun

`scripts/e2e/` has the three browser scripts (README inside):

- `e2e.cjs`: the full happy path with a screenshot per step. Passes at
  1280×900 and 390×844.
- `edge.cjs`: 27 edge cases, including **RLS isolation** (account B can't
  open or list account A's clients), duplicate email, skipping onboarding
  by URL, double-clicking Mark paid, bad ids. All pass, twice in a row.
- `axe.cjs`: WCAG 2.1 AA scan of all 12 pages. Zero violations.

Playwright isn't a dependency; adding it is your call (README explains).

### Worth your eyes

- **`signup/page.tsx` is 164 lines**, over the 150 guideline, with form
  state in the page. Moving it into a `use-signup-form.ts` hook is easy,
  but auth is on your owned-by-Preston list, so I left it.
- **The search box on Clients has no visible label**, only `aria-label` and
  a placeholder. Common for search, and axe passes it, but CLAUDE.md asks for
  visible labels. Your call.
- **The scheduled backlog bot** still runs weekday mornings. Nearly
  everything in `docs/BACKLOG.md` is ticked, so it will mostly find nothing
  to do. Add items or pause it.

---

## 13. Harbor themes and Settings

Your palette (mist, powder, harbor, midnight, ink, champagne, blush) as
themes, picked on a new **Settings** page. (Sunset was removed in §14.)

**How it works**
- `global/lib/themes.ts` lists the themes. `global/styles/themes.css` has
  one block per theme that overrides the same variables Sunset sets in
  `globals.css`. No component changed: they all read `var(--text)` etc.
- The choice is a cookie (`cc-theme`), per device. The root layout reads it
  and renders `<html data-theme="...">` on the server, so pages never flash
  Sunset first. `settings/actions.ts` sets the cookie; the picker switches
  colors instantly and saves in the background (`use-theme-choice.ts`).
- Why a cookie, not a database column: it's a per-device look, and the
  layout can read a cookie before anything renders. Easy to move to the
  member row later if you want it to follow the account.
- Mantine bits that ignored our variables now follow them: filled-button
  text (`variantColorResolver` → `--on-accent`), dialogs, dropdown menus,
  dimmed/placeholder text.
- Settings also has **Sign out**, which phones couldn't reach before.

**Accessibility**
- axe: 0 violations, every page plus the delete dialog, in all 3 themes.
- Contrast measured on the actual glass at the brightest spot behind text.
  Harbor light: 4.6:1 minimum. Harbor night needed darker glass, a dimmer
  champagne glow, and slightly lighter status colors to clear 4.5:1 at the
  bottom-right of the Money table, its worst spot.
- Fixed along the way (all themes): the X on every dialog had no name for
  screen readers.

**Your build error** (`.next/dev/types/routes.d.ts` "Declaration or
statement expected") isn't in the code. `tsconfig.json` includes the types
`npm run dev` generates; building while dev runs (or after it crashed
mid-write) reads a half-written file. Stop dev, delete `.next`, build. The
production build passes here.

---

## 14. Harbor deep added, Sunset removed

**Themes now:** Harbor (default), Harbor deep, Harbor night.

- **Harbor is the base.** Its values moved into `:root` in `globals.css`;
  `themes.css` only holds Harbor deep and Harbor night. The Mantine palette
  is now `harbor` (built from your colors) instead of the orange one, and
  `ink` (secondary buttons) is a blue-black instead of brown.
- **Background variables renamed** from `--sunset-peach`, `--sunset-gold`…
  to position names: `--bg-base`, `--bg-top-left`, `--bg-center`,
  `--bg-bottom-right`… A theme-neutral name won't go stale the next time
  colors change.
- **Harbor deep** = Harbor's mist page with midnight-blue cards. Inside any
  card, menu or dialog it switches to the night palette (light text,
  champagne accent). That palette is written once in `themes.css` and
  shared with Harbor night, so the two can't drift apart. Cards are 92%
  solid: less see-through than the other themes, on purpose (at 82% they
  looked slate grey).
- Anyone whose cookie still says `sunset` gets Harbor (tested).

**Checked:** axe 0 violations in all 3 themes (every page + delete dialog);
worst-case contrast on the glass: Harbor 4.6:1, Harbor deep 5.2:1, Harbor
night 4.6:1; edge suite 27/27; lint, types, 27 unit tests.

