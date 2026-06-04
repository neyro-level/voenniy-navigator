/**
 * GEO (Generative Engine Optimization) check script.
 *
 * Scans the built dist/index.html against 9 checks.
 * Threshold: 80/100. Fails the build if below.
 *
 * Usage: node scripts/geo-check.mjs
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const INDEX_HTML = path.join(ROOT, 'dist/index.html');
const ROBOTS_TXT = path.join(ROOT, 'dist/robots.txt');
const LLMS_TXT = path.join(ROOT, 'dist/llms.txt');

function load(file) {
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf-8');
}

function score(label, weight, passed) {
  return { label, weight, passed };
}

function main() {
  const html = load(INDEX_HTML);
  const robots = load(ROBOTS_TXT);
  const llms = load(LLMS_TXT);

  const checks = [];

  // 1. First 200 words (20 pts)
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const mainText = mainMatch ? mainMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  checks.push(score('First 200 words (main + text)', 20, mainText.length >= 200));

  // 2. Schema.org (15 pts) — Organization (or RealEstateAgent/ProfessionalService) + FAQPage + WebSite
  const hasOrg = html.includes('"@type":"Organization"') || html.includes('"@type": "Organization"') ||
                 html.includes('"@type":"RealEstateAgent"') || html.includes('"@type": "RealEstateAgent"') ||
                 html.includes('"@type":"ProfessionalService"') || html.includes('"@type": "ProfessionalService"');
  const hasFAQ = html.includes('"@type":"FAQPage"') || html.includes('"@type": "FAQPage"');
  const hasWebSite = html.includes('"@type":"WebSite"') || html.includes('"@type": "WebSite"');
  checks.push(score('Schema.org (Org + FAQ + WebSite)', 15, hasOrg && hasFAQ && hasWebSite));

  // 3. llms.txt (10 pts)
  checks.push(score('llms.txt exists', 10, llms.length > 0 && llms.startsWith('#')));

  // 4. Semantic HTML (15 pts) — <main>, 5+ <section>, 3+ aria-label
  const sectionCount = (html.match(/<section/gi) || []).length;
  const ariaLabelCount = (html.match(/aria-label=/gi) || []).length;
  checks.push(score('Semantic HTML (main + 5 sections + 3 aria-label)', 15, !!mainMatch && sectionCount >= 5 && ariaLabelCount >= 3));

  // 5. FAQ structure (10 pts) — FAQPage schema + itemscope/itemtype microdata
  const hasFAQMicrodata = html.includes('itemscope') && html.includes('https://schema.org/FAQPage');
  checks.push(score('FAQ structure (JSON-LD + microdata)', 10, hasFAQ && hasFAQMicrodata));

  // 6. Meta tags (10 pts) — title, description, og:image, canonical
  const hasTitle = html.includes('<title>');
  const hasDesc = html.includes('name="description"');
  const hasOgImage = html.includes('property="og:image"');
  const hasCanonical = html.includes('rel="canonical"');
  checks.push(score('Meta tags (title + desc + og:image + canonical)', 10, hasTitle && hasDesc && hasOgImage && hasCanonical));

  // 7. robots.txt AI crawlers (10 pts) — 3+ AI-ботов разрешены
  const aiBots = ['ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'GPTBot', 'Google-Extended'];
  const allowedAIBots = aiBots.filter((bot) => robots.includes(`User-agent: ${bot}`) && robots.includes('Allow: /'));
  checks.push(score('robots.txt AI crawlers (3+ allowed)', 10, allowedAIBots.length >= 3));

  // 8. Content-first (5 pts) — первый текст > 50 символов
  const firstText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  checks.push(score('Content-first (first text > 50 chars)', 5, firstText.length > 50));

  // 9. Heading descriptiveness (5 pts) — H1 содержит 4+ слов
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
  checks.push(score('Heading descriptiveness (H1 4+ words)', 5, h1Text.split(/\s+/).filter(Boolean).length >= 4));

  // Calculate total
  const total = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);
  const max = checks.reduce((sum, c) => sum + c.weight, 0);

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║           GEO Check (Generative Engine Optimization)         ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  for (const c of checks) {
    const status = c.passed ? '✅ PASS' : '❌ FAIL';
    const bar = c.passed ? `+${c.weight}`.padStart(3) : ` 0 `.padStart(3);
    console.log(`║ ${status}  ${bar}/${String(c.weight).padStart(2)}  ${c.label.padEnd(48)} ║`);
  }
  console.log('╠══════════════════════════════════════════════════════════════╣');
  const statusText = total >= 80 ? '✅ PASSED' : '❌ FAILED (< 80)';
  const pad = 50 - statusText.length;
  console.log(`║  TOTAL: ${String(total).padStart(3)} / ${max}  ${statusText}${' '.repeat(pad)}║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (total < 80) {
    console.error('GEO check failed. Fix the issues above before deploying.\n');
    process.exit(1);
  }
}

main();
