/**
 * Non-mutating browser smoke checks for client islands and public UI.
 *
 * Start a local preview first, then run `pnpm qa:browser`. The runner never
 * submits a lead form and only treats failures of local assets/routes as gates.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:4323';
const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const REPORT_PATH = process.env.QA_BROWSER_REPORT_PATH || path.join(ROOT, '.tmp', 'browser-scenarios.json');

async function runScenario(page, name, action) {
  try {
    await action();
    return { name, verdict: 'PASS' };
  } catch (error) {
    return { name, verdict: 'FAIL', evidence: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  if (!fs.existsSync(CHROME_PATH)) throw new Error(`Chrome was not found: ${CHROME_PATH}`);
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  const localNetworkFailures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.url().startsWith(BASE_URL) && response.status() >= 400) {
      localNetworkFailures.push(`${response.status()} ${response.url()}`);
    }
  });

  const scenarios = [];
  scenarios.push(await runScenario(page, 'homepage loads', async () => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1 }).waitFor();
  }));
  scenarios.push(await runScenario(page, 'cookie consent persists', async () => {
    const accept = page.getByRole('button', { name: /принять/i }).first();
    if (await accept.isVisible()) await accept.click();
    const consent = await page.evaluate(() => localStorage.getItem('vn_cookie_consent'));
    if (consent !== 'accepted') throw new Error('cookie consent was not persisted');
  }));
  scenarios.push(await runScenario(page, 'route map overlay opens', async () => {
    const trigger = page.locator('[aria-controls="route-map-overlay"]').first();
    await trigger.click();
    await page.locator('#route-map-overlay[data-open="true"]').waitFor();
  }));
  scenarios.push(await runScenario(page, 'request modal opens without submission', async () => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    const trigger = page.getByRole('link', { name: /рассчитать варианты/i }).first();
    await trigger.click();
    const dialog = page.locator('.vn-modal__panel').first();
    await dialog.waitFor();
    if (await dialog.locator('form').count() === 0) throw new Error('request modal has no form');
  }));
  scenarios.push(await runScenario(page, 'lead form exposes validation boundary', async () => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /рассчитать варианты/i }).first().click();
    const form = page.locator('.vn-modal__panel').first().locator('form').first();
    if (await form.count() === 0) throw new Error('lead form was not rendered');
    const valid = await form.evaluate((element) => element.reportValidity());
    if (valid) throw new Error('empty lead form unexpectedly passed native validation');
  }));
  scenarios.push(await runScenario(page, 'journal article island route loads', async () => {
    await page.goto(`${BASE_URL}/journal/proverka-obekta-po-voennoy-ipoteke/`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1 }).waitFor();
  }));
  scenarios.push(await runScenario(page, 'mobile layouts have no horizontal overflow', async () => {
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    try {
      for (const route of ['/', '/journal/proverka-obekta-po-voennoy-ipoteke/', '/podbor/']) {
        await mobilePage.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
        const dimensions = await mobilePage.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        if (dimensions.scrollWidth > dimensions.clientWidth) {
          throw new Error(`${route} overflows horizontally: ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
        }
      }
    } finally {
      await mobilePage.close();
    }
  }));

  await browser.close();
  const failures = scenarios.filter((item) => item.verdict !== 'PASS');
  const report = {
    schema: 'voen-navigator.browser-scenarios.v1',
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    scenarios,
    consoleErrors,
    localNetworkFailures,
    summary: { scenarios: scenarios.length, scenarioFailures: failures.length, consoleErrors: consoleErrors.length, localNetworkFailures: localNetworkFailures.length },
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Browser scenarios: ${scenarios.length - failures.length}/${scenarios.length} passed, ${consoleErrors.length} console errors, ${localNetworkFailures.length} local network failures.`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH).replaceAll(path.sep, '/')}`);
  if (failures.length || consoleErrors.length || localNetworkFailures.length) process.exit(1);
}

main();
