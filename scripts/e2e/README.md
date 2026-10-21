# Browser tests

Three scripts that drive a real browser through the app. They are how the
overnight bugs in `docs/REVIEW-NOTES.md` §12 were found. They are not part of
CI yet.

| Script | What it does |
|---|---|
| `e2e.cjs` | The happy path: sign up → onboarding (with a CSV import) → clients → leads (convert) → money (mark paid, undo) → life vest → dashboard → sign out → sign in. Screenshot per step. |
| `edge.cjs` | 27 edge cases: signed-out redirects, duplicate email, skipping onboarding steps by URL, validation messages, bad / unknown client ids, a second account can't see the first account's clients (RLS), double-clicking Mark paid, wrong password, empty states. Prints `PASS` / `FAIL` per check. |
| `axe.cjs` | Runs axe (WCAG 2.1 AA) on every page and prints violations, or `clean`. |

## Run them

**Never point these at production.** Each run creates new accounts and data.
Use a throwaway Supabase project, or the local one from `supabase start`
(Supabase CLI), with `supabase/schema.sql` applied.

Playwright isn't a dependency of the app. Adding one is your call
(CLAUDE.md: dependencies are "ask first"), so either add it:

```bash
npm i -D playwright @axe-core/playwright
npx playwright install chromium
```

or install it somewhere else and point `NODE_PATH` at that `node_modules`.

Then, with `npm run dev` running against the test project:

```bash
node scripts/e2e/edge.cjs
node scripts/e2e/axe.cjs
W=390 H=844 TAG=phone node scripts/e2e/e2e.cjs   # phone size
node scripts/e2e/e2e.cjs                         # desktop
```

| Env var | Default | Meaning |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Where the app is running |
| `OUT_DIR` | `scripts/e2e/screenshots` | Screenshots (git-ignored) |
| `W`, `H`, `TAG` | 1440, 900, `desktop` | Viewport size and screenshot filename prefix (`e2e.cjs`) |
| `CHROMIUM_PATH` | Playwright's own | Use a specific Chromium binary |

## If a check fails

Look at the screenshot with the same name first. Most failures so far were
real bugs (a crash on invalid sign-up, a lost first click, a tax rate saved
as a different number than typed); a few were the test reading the page
before it finished rendering, fixed by waiting for the text instead of
counting it immediately.
