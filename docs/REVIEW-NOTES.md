# Review notes

What was built on `bot/dev` in one pass, why, and what to look at. Read top
to bottom alongside the commits; each section matches one commit.

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
