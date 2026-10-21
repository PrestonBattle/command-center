// End-to-end walk through Command Center against the local Supabase stand-in.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT = process.env.OUT_DIR ?? require('path').join(__dirname, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const width = Number(process.env.W || 1440), height = Number(process.env.H || 900);
const tag = process.env.TAG || 'desktop';
const email = `test${Date.now()}@example.com`;
const log = [];
const note = (m) => { log.push(m); console.log(m); };

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width, height } });
  page.setDefaultTimeout(20000);
  page.on('pageerror', (e) => note(`  [pageerror] ${e.message.split('\n')[0]}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts|Download the React DevTools/.test(m.text())) note(`  [console] ${m.text().split('\n')[0].slice(0, 300)}`); });
  page.on('response', (r) => { if (r.status() >= 500) note(`  [http ${r.status()}] ${r.url()}`); });
  let n = 0;
  const shot = async (name) => { await page.waitForTimeout(700); await page.screenshot({ path: `${OUT}/${tag}-${String(++n).padStart(2, '0')}-${name}.png`, fullPage: true }); };
  const step = async (name, fn) => {
    note(`STEP ${name}`);
    try { await fn(); await shot(name); note(`  ok (${page.url().replace(BASE, '')})`); }
    catch (e) { note(`  FAIL: ${e.message.split('\n')[0]}`); await shot(name + '-FAIL').catch(() => {}); }
  };
  const f = (path) => page.locator(`[data-path="${path}"]`).first();
  const pick = async (path, option) => { await f(path).click(); await page.getByRole('option', { name: option }).first().click(); };
  const nav = (p) => page.waitForURL((u) => u.pathname.startsWith(p), { timeout: 30000 });

  await step('signup', async () => {
    await page.goto(BASE + '/auth/signup');
    await f('firstName').fill('Nora');
    await f('lastName').fill('Hale');
    await f('orgName').fill('Northline Studio');
    await f('phone').fill('9045550100');
    await f('email').fill(email);
    await f('password').fill('correct-horse-9');
    await f('confirmPassword').fill('correct-horse-9');
    await page.getByRole('button', { name: /sign up|create/i }).click();
    await nav('/onboarding/business');
  });

  await step('onboarding-business', async () => {
    await f('business_type').click();
    await f('business_type').fill('Web');
    await page.getByRole('option', { name: /Web design/ }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await nav('/onboarding/floor');
  });

  await step('onboarding-floor', async () => {
    await f('expenses.housing').fill('1500');
    await f('expenses.food').fill('500');
    await f('expenses.software').fill('300');
    await f('tax_rate').fill('28');
    await page.getByRole('button', { name: 'Continue to clients' }).click();
    await nav('/onboarding/clients');
  });

  await step('onboarding-clients', async () => {
    await f('clients.0.name').fill('Harbor Dental');
    await f('clients.0.email').fill('office@harbor.test');
    await f('clients.0.amount').fill('2500');
    await page.getByRole('button', { name: 'Add another client' }).click();
    await f('clients.1.name').fill('Ridgeline Law');
    await f('clients.1.amount').fill('3750');
    await pick('clients.1.interval_months', 'Quarterly');
    // CSV import
    const csv = require('path').join(require('os').tmpdir(), 'cc-e2e-clients.csv');
    fs.writeFileSync(csv, 'Company,E-mail,Monthly fee,Billing\nMaple Physio,hi@maple.test,"$1,500",Monthly\nCedar Yoga,,900,monthly\n');
    await page.getByRole('button', { name: 'Import from a spreadsheet' }).click();
    await page.locator('input[type=file]').setInputFiles(csv);
    await page.getByRole('button', { name: /Add 2 clients/ }).click();
    await page.getByRole('button', { name: 'Save and continue' }).click();
    await nav('/onboarding/done');
  });

  await step('onboarding-done', async () => {
    await page.getByRole('button', { name: 'Go to my dashboard' }).click();
    await page.waitForURL((u) => u.pathname === '/', { timeout: 30000 });
  });

  await step('clients-list', async () => { await page.goto(BASE + '/clients'); await page.getByRole('link', { name: 'Harbor Dental' }).waitFor(); });

  await step('client-detail', async () => {
    await page.getByRole('link', { name: 'Harbor Dental' }).click();
    await nav('/clients/');
    await page.getByRole('button', { name: 'Add a service' }).click();
    await f('name').fill('Ads management');
    await f('amount').fill('550');
    await page.getByRole('button', { name: 'Add service' }).click();
    await page.getByText('Ads management').waitFor();
    await page.getByRole('button', { name: 'Add a contact' }).click();
    await f('name').fill('Dana Office');
    await f('role').fill('Office manager');
    await page.getByRole('button', { name: 'Add contact' }).click();
    await page.getByText('Dana Office').waitFor();
  });

  await step('client-new', async () => {
    await page.goto(BASE + '/clients/new');
    await f('name').fill('Bluebird Bakery');
    await f('amount').fill('450');
    await page.getByRole('button', { name: 'Add client' }).click();
    await nav('/clients/');
    await page.getByRole('heading', { name: 'Bluebird Bakery' }).waitFor();
  });

  await step('clients-filter', async () => {
    await page.goto(BASE + '/clients');
    await page.getByLabel('Search clients').fill('maple');
    await page.waitForURL(/q=maple/);
    await page.getByRole('link', { name: 'Maple Physio' }).waitFor();
  });

  await step('leads-add-move-convert', async () => {
    await page.goto(BASE + '/leads');
    await page.getByRole('button', { name: 'Add lead' }).click();
    await f('name').fill('Granite CPA');
    await f('estimated_monthly').fill('1500');
    await page.getByRole('dialog').getByRole('button', { name: 'Add lead' }).click();
    await page.getByRole('heading', { name: 'Granite CPA' }).waitFor();
    await page.getByLabel('Stage for Granite CPA').first().click();
    await page.getByRole('option', { name: 'Won' }).click();
    await page.getByRole('button', { name: 'Make client' }).waitFor({ timeout: 20000 });
    await page.getByRole('button', { name: 'Make client' }).click();
    await nav('/clients/');
  });

  await step('money-mark-paid', async () => {
    await page.goto(BASE + '/money');
    const btn = page.getByRole('button', { name: /^Mark .* paid$/ }).first();
    await btn.click();
    await page.getByRole('button', { name: /^Undo payment/ }).first().waitFor();
  });

  await step('money-prev-month', async () => {
    await page.getByRole('link', { name: /Previous month/ }).click();
    await page.waitForURL(/month=/);
  });

  await step('life-vest', async () => {
    await page.goto(BASE + '/life-vest');
    await page.getByPlaceholder('Nobody leaves').click();
    await page.getByRole('option').first().click();
    await f('expenses.housing').fill('1700');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await page.getByText('Your floor is updated.').waitFor();
  });

  await step('dashboard', async () => { await page.goto(BASE + '/'); await page.getByText('Payments this month').waitFor(); });

  await step('sign-out', async () => {
    if (width < 640) { await page.goto(BASE + '/auth/login'); return; }
    await page.getByRole('button', { name: 'Sign out' }).click();
    await nav('/auth/login');
  });

  await step('login-again', async () => {
    await page.goto(BASE + '/auth/login');
    if (!page.url().includes('/auth/login')) return;
    await f('email').fill(email);
    await f('password').fill('correct-horse-9');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await page.waitForURL((u) => u.pathname === '/', { timeout: 30000 });
  });

  fs.writeFileSync(`${OUT}/${tag}-log.txt`, log.join('\n'));
  await browser.close();
})();
