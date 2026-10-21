// Edge cases and break points.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT = process.env.OUT_DIR ?? require('path').join(__dirname, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const results = [];
const check = (name, pass, detail = '') => { results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

async function signup(page, email, org) {
  const f = (p) => page.locator(`[data-path="${p}"]`).first();
  await page.goto(BASE + '/auth/signup');
  await f('firstName').fill('Test'); await f('lastName').fill('User'); await f('orgName').fill(org);
  await f('phone').fill('9045550100'); await f('email').fill(email);
  await f('password').fill('correct-horse-9'); await f('confirmPassword').fill('correct-horse-9');
  await page.getByRole('button', { name: /create/i }).click();
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const errors = [];
  const mk = async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.split('\n')[0]));
    page.on('response', (r) => { if (r.status() >= 500) errors.push(`http ${r.status()} ${r.url()}`); });
    return page;
  };
  const f = (page, p) => page.locator(`[data-path="${p}"]`).first();

  // 1. Signed out → protected pages redirect to login
  const anon = await mk();
  for (const p of ['/', '/clients', '/money', '/onboarding/floor']) {
    await anon.goto(BASE + p);
    check(`signed-out ${p} → login`, anon.url().includes('/auth/login'), anon.url().replace(BASE, ''));
  }

  // 2. Signup validation: empty submit shows errors, no navigation
  await anon.goto(BASE + '/auth/signup');
  await anon.getByRole('button', { name: /create/i }).click();
  await anon.waitForTimeout(800);
  check('signup empty submit shows errors', (await anon.getByText(/required|Enter a valid/i).count()) > 0);

  // 3. User A signs up
  const a = await mk();
  const emailA = `a${Date.now()}@example.com`;
  await signup(a, emailA, 'Alpha Co');
  await a.waitForURL(/onboarding\/business/, { timeout: 30000 });
  check('signup A → onboarding', true);

  // 4. Duplicate email
  const dup = await mk();
  await signup(dup, emailA, 'Dup Co');
  await dup.waitForTimeout(4000);
  check('duplicate email blocked', dup.url().includes('/auth/signup') && (await dup.getByText(/already exists|Could not create/i).count()) > 0, dup.url().replace(BASE, ''));

  // 5. Skip ahead by URL is blocked
  await a.goto(BASE + '/onboarding/done');
  check('skip to step 4 by URL → back to step 1', a.url().includes('/onboarding/business'), a.url().replace(BASE, ''));
  await a.goto(BASE + '/clients');
  check('unfinished onboarding + /clients → onboarding', a.url().includes('/onboarding'), a.url().replace(BASE, ''));

  // 6. Business step: empty type shows error
  await a.goto(BASE + '/onboarding/business');
  await f(a, 'name').fill('');
  await a.getByRole('button', { name: 'Continue' }).click();
  await a.waitForTimeout(800);
  check('business step validation', (await a.getByText('Required').count()) > 0 && (await a.getByText('Pick a business type').count()) > 0);
  await f(a, 'name').fill('Alpha Co');
  await f(a, 'business_type').click(); await f(a, 'business_type').fill('Consult');
  await a.getByRole('option', { name: 'Consulting' }).click();
  await a.getByRole('button', { name: 'Continue' }).click();
  await a.waitForURL(/onboarding\/floor/, { timeout: 30000 });

  // 7. Floor: bad values
  await f(a, 'tax_rate').fill('90');
  await a.getByRole('button', { name: 'Continue to clients' }).click();
  await a.waitForTimeout(1500);
  const tooHigh = await a.getByText('That looks too high').count();
  check('tax over 60 rejected with a message, not saved', a.url().includes('/onboarding/floor') && tooHigh > 0, `msg=${tooHigh}`);
  // Finish later
  await a.goto(BASE + '/onboarding/floor');
  await a.getByRole('button', { name: 'Finish later' }).click();
  await a.waitForURL(/onboarding\/clients/, { timeout: 30000 });
  check('finish later → step 3', true);

  // 8. Clients: invalid row shows error; then skip
  await f(a, 'clients.0.name').fill('Bad Row');
  await f(a, 'clients.0.email').fill('not-an-email');
  await a.getByRole('button', { name: 'Save and continue' }).click();
  await a.waitForTimeout(800);
  check('client row validation (email + amount)', (await a.getByText('Enter a valid email').count()) > 0 && (await a.getByText(/more than \$0|Enter a dollar/).count()) > 0);
  await a.getByRole('button', { name: 'Skip for now' }).click();
  await a.waitForURL(/onboarding\/done/, { timeout: 30000 });
  check('skip clients → done', true);
  await a.getByRole('button', { name: 'Go to my dashboard' }).click();
  await a.waitForURL((u) => u.pathname === '/', { timeout: 30000 });
  await a.screenshot({ path: `${OUT}/edge-empty-dashboard.png`, fullPage: true });
  check('empty dashboard shows setup gaps', (await a.getByText("Your floor isn't set").count()) > 0 && (await a.getByText('No clients yet').count()) > 0);
  await a.goto(BASE + '/onboarding');
  check('finished user + /onboarding → dashboard', new URL(a.url()).pathname === '/', a.url().replace(BASE, ''));

  // 9. Empty states render
  for (const p of ['/clients', '/leads', '/money', '/life-vest']) {
    await a.goto(BASE + p);
    await a.waitForTimeout(500);
    await a.screenshot({ path: `${OUT}/edge-empty${p.replace('/', '-')}.png`, fullPage: true });
    check(`empty ${p} renders`, (await a.locator('h1').count()) === 1);
  }

  // 10. Bad client id → 404, not a crash
  await a.goto(BASE + '/clients/not-a-uuid');
  check('bad client id → not found', await a.getByText(/could not be found/i).first().waitFor({ timeout: 15000 }).then(() => true, () => false));
  await a.goto(BASE + '/clients/00000000-0000-4000-8000-000000000000');
  check('unknown client uuid → not found', await a.getByText(/could not be found/i).first().waitFor({ timeout: 15000 }).then(() => true, () => false));

  // 11. A creates a client; B must not see it
  await a.goto(BASE + '/clients/new');
  await f(a, 'name').fill('Alpha Secret Client'); await f(a, 'amount').fill('1000');
  await a.getByRole('button', { name: 'Add client' }).click();
  await a.waitForURL(/\/clients\/[0-9a-f-]{36}/, { timeout: 30000 });
  const secretUrl = a.url();
  // add client validation: zero amount
  await a.goto(BASE + '/clients/new');
  await f(a, 'name').fill('Zero'); await f(a, 'amount').fill('0');
  await a.getByRole('button', { name: 'Add client' }).click();
  await a.waitForTimeout(800);
  check('add client with $0 rejected', a.url().endsWith('/clients/new') && (await a.getByText('Must be more than $0').count()) > 0);

  const b = await mk();
  await signup(b, `b${Date.now()}@example.com`, 'Beta Co');
  await b.waitForURL(/onboarding/, { timeout: 30000 });
  // finish B onboarding quickly
  await f(b, 'business_type').click(); await f(b, 'business_type').fill('Other'); await b.getByRole('option', { name: 'Other' }).click();
  await b.getByRole('button', { name: 'Continue' }).click(); await b.waitForURL(/floor/);
  await b.getByRole('button', { name: 'Finish later' }).click(); await b.waitForURL(/onboarding\/clients/);
  await b.getByRole('button', { name: 'Skip for now' }).click(); await b.waitForURL(/done/);
  await b.getByRole('button', { name: 'Go to my dashboard' }).click(); await b.waitForURL((u) => u.pathname === '/');
  await b.goto(secretUrl);
  check("B can't open A's client by URL", (await b.getByText('Alpha Secret Client').count()) === 0, b.url().replace(BASE, ''));
  await b.goto(BASE + '/clients');
  check("B's client list excludes A's data", (await b.getByText('Alpha Secret Client').count()) === 0);

  // 12. Double-click Mark paid records once
  await a.goto(BASE + '/money');
  const btn = a.getByRole('button', { name: /^Mark .* paid$/ }).first();
  await btn.dblclick();
  await a.waitForTimeout(2500);
  await a.reload();
  check('double-click Mark paid: one Undo, no error', (await a.getByRole('button', { name: /^Undo payment/ }).count()) === 1);

  // 13. Login with wrong password
  const bad = await mk();
  await bad.goto(BASE + '/auth/login');
  await f(bad, 'email').fill(emailA); await f(bad, 'password').fill('wrong-password-1');
  await bad.getByRole('button', { name: /sign in/i }).click();
  await bad.waitForTimeout(2500);
  check('wrong password → generic error', (await bad.getByText(/don't match an account/).count()) > 0);

  console.log(results.join('\n'));
  console.log('\nRuntime errors:', errors.length ? '\n' + [...new Set(errors)].join('\n') : 'none');
  await browser.close();
})();
