/**
 * GEO (Generative Engine Optimization) check script.
 *
 * Run after `pnpm build`. The script validates that the AI/SEO layer reflects
 * the live structure: commercial pages, journal archive, categories, articles,
 * llms.txt, robots.txt and baseline schema/meta contracts.
 *
 * Usage: node scripts/geo-check.mjs
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://voen-navigator.ru';
const REQUIRED_BOTS = ['ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'GPTBot', 'Google-Extended'];
const SITEMAP_EXCLUDED = ['/thanks/', '/podbor/thanks/', '/404/', '/podbor/', '/bonus/', '/prezentaciya/'];
const UTILITY_HTML_ROUTE_RE = /^\/yandex_[a-f0-9]+\/$/i;
const PRIORITY_ROUTES = [
  '/',
  '/voennaya-ipoteka-krasnodar/',
  '/voennaya-ipoteka-krym/',
  '/kalkulyator-voennoy-ipoteki/',
  '/usloviya-voennoy-ipoteki/',
  '/semeynaya-voennaya-ipoteka/',
  '/journal/',
];
const JOURNAL_ARTICLE_RE = /^\/journal\/(?!category\/|\d+\/)[^/]+\/$/;
const JOURNAL_CATEGORY_RE = /^\/journal\/category\/[^/]+\/(?:\d+\/)?$/;
const JOURNAL_ARCHIVE_RE = /^\/journal\/(?:\d+\/)?$/;
const COMMERCIAL_ROUTE_RE =
  /^\/(?:voennaya-ipoteka-krasnodar|voennaya-ipoteka-krym|kalkulyator-voennoy-ipoteki|usloviya-voennoy-ipoteki|semeynaya-voennaya-ipoteka)\/$/;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function read(file) {
  return fs.readFileSync(file, 'utf-8');
}

function toRoute(file) {
  const rel = path.relative(DIST, file).replaceAll(path.sep, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  if (rel.endsWith('.html')) return `/${rel.slice(0, -'.html'.length)}/`;
  return `/${rel}`;
}

function routeToHtmlPath(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  const directHtmlPath = path.join(DIST, `${route.replace(/^\//, '').replace(/\/$/, '')}.html`);
  if (fs.existsSync(directHtmlPath)) return directHtmlPath;
  return path.join(DIST, route.replace(/^\//, ''), 'index.html');
}

function routeExists(route) {
  return fs.existsSync(routeToHtmlPath(route));
}

function getAttrTag(html, tagName, attrName, attrValue) {
  const re = new RegExp(`<${tagName}\\b(?=[^>]*\\b${attrName}=["']${attrValue}["'])[^>]*>`, 'i');
  return html.match(re)?.[0] ?? '';
}

function getAttr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1] ?? '';
}

function getMetaContent(html, name) {
  return getAttr(getAttrTag(html, 'meta', 'name', name), 'content');
}

function getPropertyContent(html, property) {
  return getAttr(getAttrTag(html, 'meta', 'property', property), 'content');
}

function getCanonical(html) {
  return getAttr(getAttrTag(html, 'link', 'rel', 'canonical'), 'href');
}

function getTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
}

function getH1Count(html) {
  return (html.match(/<h1\b/gi) ?? []).length;
}

function getRobots(html) {
  return getMetaContent(html, 'robots').toLowerCase();
}

function collectSchemaTypes(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaTypes(item, found));
    return found;
  }
  if (typeof value['@type'] === 'string') found.push(value['@type']);
  Object.values(value).forEach((item) => collectSchemaTypes(item, found));
  return found;
}

function parseJsonLd(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1].trim());
      collectSchemaTypes(parsed, types);
    } catch {
      return { valid: false, types: [] };
    }
  }

  return { valid: scripts.length > 0, types };
}

function sitemapRoutes() {
  const sitemapFiles = walk(DIST).filter((file) => /sitemap.*\.xml$/i.test(path.basename(file)));
  const routes = new Set();

  for (const file of sitemapFiles) {
    for (const match of read(file).matchAll(/<loc>(.*?)<\/loc>/g)) {
      try {
        routes.add(new URL(match[1]).pathname);
      } catch {}
    }
  }

  return routes;
}

function score(label, weight, passed, detail = '') {
  return { label, weight, passed, detail };
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run `pnpm build` before `pnpm geo-check`.');
    process.exit(1);
  }

  const htmlFiles = walk(DIST).filter((file) => file.endsWith('.html'));
  const routes = htmlFiles.map((file) => toRoute(file)).filter((route) => !UTILITY_HTML_ROUTE_RE.test(route));
  const sitemap = sitemapRoutes();
  const llmsPath = path.join(DIST, 'llms.txt');
  const robotsPath = path.join(DIST, 'robots.txt');
  const llms = fs.existsSync(llmsPath) ? read(llmsPath) : '';
  const robots = fs.existsSync(robotsPath) ? read(robotsPath) : '';
  const articleRoutes = routes.filter((route) => JOURNAL_ARTICLE_RE.test(route));
  const categoryRoutes = routes.filter((route) => JOURNAL_CATEGORY_RE.test(route));
  const commercialRoutes = routes.filter((route) => COMMERCIAL_ROUTE_RE.test(route));

  const metaFailures = [];
  const schemaFailures = [];
  const articleSchemaFailures = [];
  const collectionSchemaFailures = [];
  const commercialOrgFailures = [];
  const sitemapFailures = [];

  for (const route of routes) {
    if (route.startsWith('/404/')) continue;
    const html = read(routeToHtmlPath(route));
    const title = getTitle(html);
    const description = getMetaContent(html, 'description');
    const canonical = getCanonical(html);
    const robotsMeta = getRobots(html);
    const ogTitle = getPropertyContent(html, 'og:title');
    const ogDescription = getPropertyContent(html, 'og:description');
    const ogUrl = getPropertyContent(html, 'og:url');
    const ogImage = getPropertyContent(html, 'og:image');

    if (!title || !description || !canonical || !robotsMeta || !ogTitle || !ogDescription || !ogUrl || !ogImage || getH1Count(html) !== 1) {
      metaFailures.push(route);
    }

    const parsed = parseJsonLd(html);
    if (!parsed.valid || parsed.types.length === 0) {
      schemaFailures.push(route);
      continue;
    }

    if (!parsed.types.includes('WebSite')) {
      schemaFailures.push(route);
    }

    if (COMMERCIAL_ROUTE_RE.test(route) && !parsed.types.includes('Organization')) {
      commercialOrgFailures.push(route);
    }

    if (JOURNAL_ARTICLE_RE.test(route) && !parsed.types.includes('BlogPosting')) {
      articleSchemaFailures.push(route);
    }

    if ((JOURNAL_ARCHIVE_RE.test(route) || JOURNAL_CATEGORY_RE.test(route)) && !parsed.types.includes('CollectionPage')) {
      collectionSchemaFailures.push(route);
    }

    if (!sitemap.has(route) && !SITEMAP_EXCLUDED.some((prefix) => route.startsWith(prefix))) {
      sitemapFailures.push(route);
    }
  }

  const checks = [];

  checks.push(
    score(
      'Priority routes built',
      15,
      PRIORITY_ROUTES.every((route) => routeExists(route)),
      PRIORITY_ROUTES.filter((route) => !routeExists(route)).join(', ')
    )
  );

  checks.push(
    score(
      'Meta coverage on indexable pages',
      20,
      metaFailures.length === 0,
      metaFailures.slice(0, 6).join(', ')
    )
  );

  checks.push(
    score(
      'JSON-LD baseline on all pages',
      10,
      schemaFailures.length === 0,
      schemaFailures.slice(0, 6).join(', ')
    )
  );

  checks.push(
    score(
      'Commercial pages include Organization schema',
      10,
      commercialOrgFailures.length === 0 && commercialRoutes.length >= 5,
      commercialOrgFailures.slice(0, 6).join(', ')
    )
  );

  checks.push(
    score(
      'Journal articles include BlogPosting schema',
      10,
      articleSchemaFailures.length === 0 && articleRoutes.length >= 18,
      articleSchemaFailures.slice(0, 6).join(', ')
    )
  );

  checks.push(
    score(
      'Journal archive/categories include CollectionPage schema',
      10,
      collectionSchemaFailures.length === 0 && categoryRoutes.length >= 7,
      collectionSchemaFailures.slice(0, 6).join(', ')
    )
  );

  const llmsHasCommercialSection =
    llms.includes('## Commercial Pages') &&
    commercialRoutes.every((route) => llms.includes(`${SITE_URL}${route}`));
  const llmsHasJournalStructure =
    llms.includes('## Journal Structure') &&
    categoryRoutes.every((route) => llms.includes(`${SITE_URL}${route}`));
  const llmsHasArticles =
    llms.includes('## Journal Articles') &&
    articleRoutes.every((route) => llms.includes(`${SITE_URL}${route}`));

  checks.push(
    score(
      'llms.txt reflects commercial + journal structure',
      15,
      Boolean(llms) && llmsHasCommercialSection && llmsHasJournalStructure && llmsHasArticles,
      'Проверьте секции Commercial Pages / Journal Structure / Journal Articles'
    )
  );

  const robotsHasBots =
    Boolean(robots) &&
    REQUIRED_BOTS.every((bot) => robots.includes(`User-agent: ${bot}`) && robots.includes('Allow: /')) &&
    robots.includes(`Sitemap: ${SITE_URL}/sitemap-index.xml`);

  checks.push(
    score(
      'robots.txt keeps AI policy and sitemap',
      5,
      robotsHasBots
    )
  );

  checks.push(
    score(
      'Indexable routes are present in sitemap',
      5,
      sitemapFailures.length === 0,
      sitemapFailures.slice(0, 6).join(', ')
    )
  );

  const total = checks.reduce((sum, item) => sum + (item.passed ? item.weight : 0), 0);
  const max = checks.reduce((sum, item) => sum + item.weight, 0);

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║        GEO Check (AI + SEO structure verification)          ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  for (const item of checks) {
    const status = item.passed ? '✅ PASS' : '❌ FAIL';
    const bar = item.passed ? `+${item.weight}`.padStart(3) : ` 0 `.padStart(3);
    console.log(`║ ${status}  ${bar}/${String(item.weight).padStart(2)}  ${item.label.padEnd(44)} ║`);
    if (!item.passed && item.detail) {
      console.log(`║      ${item.detail.slice(0, 56).padEnd(56)}║`);
    }
  }
  console.log('╠══════════════════════════════════════════════════════════════╣');
  const statusText = total >= 85 ? '✅ PASSED' : '❌ FAILED (< 85)';
  const pad = 50 - statusText.length;
  console.log(`║  TOTAL: ${String(total).padStart(3)} / ${max}  ${statusText}${' '.repeat(pad)}║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (total < 85) {
    console.error('GEO check failed. Fix the issues above before deploying.\n');
    process.exit(1);
  }
}

main();
