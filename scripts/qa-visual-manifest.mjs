/**
 * Defines the minimum visual QA matrix for the generated Astro site.
 *
 * Screenshot capture remains browser-owned; this script makes the required
 * routes, responsive widths and expected evidence machine-readable.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = process.env.QA_VISUAL_REPORT_PATH || path.join(ROOT, '.tmp', 'visual-matrix.json');
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || path.join(ROOT, '.tmp', 'visual');
const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 1400 },
  { id: 'mobile', width: 375, height: 1200 },
];
const TEMPLATES = [
  { id: 'home', route: '/', variant: 'public landing' },
  { id: 'commercial', route: '/voennaya-ipoteka-krasnodar/', variant: 'commercial landing' },
  { id: 'calculator', route: '/kalkulyator-voennoy-ipoteki/', variant: 'interactive calculator' },
  { id: 'journal', route: '/journal/', variant: 'journal archive' },
  { id: 'category', route: '/journal/category/voennaya-ipoteka/', variant: 'journal category' },
  { id: 'article', route: '/journal/proverka-obekta-po-voennoy-ipoteke/', variant: 'journal article' },
  { id: 'contacts', route: '/contacts/', variant: 'contact page' },
  { id: 'form', route: '/podbor/', variant: 'lead form' },
];

const matrix = TEMPLATES.flatMap((template) => VIEWPORTS.map((viewport) => {
  const screenshot = path.join(SCREENSHOT_DIR, `${template.id}-${viewport.id}.png`);
  return {
    ...template,
    viewport,
    screenshot: path.relative(ROOT, screenshot).replaceAll(path.sep, '/'),
    captured: fs.existsSync(screenshot),
  };
}));

const report = {
  schema: 'voen-navigator.visual-matrix.v1',
  generatedAt: new Date().toISOString(),
  matrix,
  summary: { expected: matrix.length, captured: matrix.filter((item) => item.captured).length },
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Visual matrix: ${report.summary.captured}/${report.summary.expected} screenshots present.`);
console.log(`Report: ${path.relative(ROOT, OUTPUT).replaceAll(path.sep, '/')}`);

if (report.summary.captured !== report.summary.expected) process.exit(1);
