// Signs up a fresh user, finishes onboarding with one client, then runs axe on every page.
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const f = (x) => p.locator(`[data-path="${x}"]`).first();
  const scan = async (label) => {
    const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    for (const v of r.violations) console.log(`[${label}] ${v.impact} ${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes.slice(0,3).map(n=>n.target.join(' ')).join(' | ')}`);
    if (!r.violations.length) console.log(`[${label}] clean`);
  };
  await p.goto(BASE + '/auth/login'); await scan('login');
  await p.goto(BASE + '/auth/signup'); await scan('signup');
  await f('firstName').fill('A'); await f('lastName').fill('X'); await f('orgName').fill('Axe Co'); await f('phone').fill('9045550100');
  await f('email').fill(`axe${Date.now()}@example.com`); await f('password').fill('correct-horse-9'); await f('confirmPassword').fill('correct-horse-9');
  await p.getByRole('button', { name: /create/i }).click(); await p.waitForURL(/business/, { timeout: 30000 });
  await scan('onboarding/business');
  await f('business_type').click(); await f('business_type').fill('Other'); await p.getByRole('option', { name: 'Other' }).click();
  await p.getByRole('button', { name: 'Continue' }).click(); await p.waitForURL(/floor/);
  await scan('onboarding/floor');
  await p.getByRole('button', { name: /finish later/i }).click(); await p.waitForURL(/clients/);
  await scan('onboarding/clients');
  await p.getByRole('button', { name: /skip/i }).click(); await p.waitForURL(/done/);
  await scan('onboarding/done');
  await p.getByRole('button', { name: /dashboard|finish|go to/i }).first().click(); await p.waitForURL(u => new URL(u).pathname === '/');
  for (const path of ['/', '/clients', '/clients/new', '/leads', '/money', '/life-vest']) {
    await p.goto(BASE + path); await p.waitForTimeout(500); await scan(path);
  }
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
