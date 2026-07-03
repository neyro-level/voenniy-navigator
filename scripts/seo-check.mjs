/**
 * Technical SEO check for built Astro output.
 *
 * Run after `pnpm build`. The script checks critical production SEO contracts:
 * meta/canonical/OG, JSON-LD validity, sitemap/noindex consistency,
 * internal links, robots/llms and favicon assets.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://voen-navigator.ru';

const ASSET_RE = /\.(avif|webp|png|jpe?g|gif|svg|ico|pdf|txt|xml|css|js|woff2?)$/i;
const PLACEHOLDERS = ['example.com', 'localhost:', '[TODO]', '[DOMAIN]', '[CLIENT]', '[SLUG]'];
const SITEMAP_EXCLUDED = ['/thanks/', '/podbor/thanks/', '/404/', '/podbor/', '/bonus/', '/prezentaciya/'];
const REQUIRED_ICON_LINKS = [
  'href="/favicon.ico"',
  'href="/favicon.svg"',
  'href="/favicon-32.png"',
  'href="/favicon-16.png"',
  'href="/apple-touch-icon.png"',
];
const REQUIRED_ICON_FILES = [
  'favicon.ico',
  'favicon.svg',
  'favicon-32.png',
  'favicon-16.png',
  'apple-touch-icon.png',
];
const UTILITY_HTML_ROUTE_RE = /^\/yandex_[a-f0-9]+\/$/i;

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

function stripTags(value) {
  return value.replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

function hasNoindex(html) {
  return getRobots(html).includes('noindex');
}

function routeToHtmlPath(route) {
  const clean = route.split('#')[0].split('?')[0];
  if (clean === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, clean.replace(/^\//, ''), 'index.html');
}

function routeExists(route) {
  const clean = route.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(DIST, 'index.html'));
  if (ASSET_RE.test(clean)) return fs.existsSync(path.join(DIST, clean.replace(/^\//, '')));
  return fs.existsSync(routeToHtmlPath(clean)) || fs.existsSync(path.join(DIST, `${clean.replace(/^\//, '').replace(/\/$/, '')}.html`));
}

function toLocalSitePath(value) {
  if (!value || value.startsWith('#') || value.startsWith('data:') || value.startsWith('blob:')) return '';
  try {
    const url = new URL(value, SITE_URL);
    if (url.origin !== SITE_URL) return '';
    return url.pathname;
  } catch {
    return value.startsWith('/') ? value.split('#')[0].split('?')[0] : '';
  }
}

function assetExists(value) {
  const localPath = toLocalSitePath(value);
  if (!localPath || !ASSET_RE.test(localPath)) return true;
  return fs.existsSync(path.join(DIST, localPath.replace(/^\//, '')));
}

function sitemapRoutes() {
  const sitemapFiles = walk(DIST).filter((file) => /sitemap.*\.xml$/i.test(path.basename(file)));
  const routes = new Set();
  for (const file of sitemapFiles) {
    const xml = read(file);
    for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      try {
        routes.add(new URL(match[1]).pathname);
      } catch {}
    }
  }
  return routes;
}

function schemaTypes(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  if (Array.isArray(value)) {
    value.forEach((item) => schemaTypes(item, found));
    return found;
  }
  if (typeof value['@type'] === 'string') found.push(value['@type']);
  Object.values(value).forEach((item) => schemaTypes(item, found));
  return found;
}

function parseJsonLd(html, route, blockers) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!scripts.length) {
    blockers.push(`${route}: missing JSON-LD`);
    return [];
  }

  const types = [];
  scripts.forEach((script, index) => {
    const raw = script[1].trim();
    try {
      const parsed = JSON.parse(raw);
      schemaTypes(parsed, types);
    } catch (error) {
      blockers.push(`${route}: invalid JSON-LD script #${index + 1}: ${error.message}`);
    }
  });
  return types;
}

function checkPage(file, sitemap, blockers, warnings) {
  const html = read(file);
  const route = toRoute(file);
  const text = stripTags(html);
  const title = getTitle(html);
  const description = getMetaContent(html, 'description');
  const canonical = getCanonical(html);
  const ogTitle = getPropertyContent(html, 'og:title');
  const ogDescription = getPropertyContent(html, 'og:description');
  const ogUrl = getPropertyContent(html, 'og:url');
  const ogImage = getPropertyContent(html, 'og:image');
  const robots = getRobots(html);
  const noindex = hasNoindex(html);

  if (!html.includes('<html lang="ru"')) blockers.push(`${route}: missing lang="ru"`);
  if (!html.includes('name="viewport"')) blockers.push(`${route}: missing viewport`);
  if (!title) blockers.push(`${route}: missing title`);
  if (!description) blockers.push(`${route}: missing description`);
  if (!canonical || !canonical.startsWith(`${SITE_URL}/`)) blockers.push(`${route}: canonical must be absolute ${SITE_URL}`);
  if (!robots) blockers.push(`${route}: missing robots meta`);
  if (!ogTitle || !ogDescription || !ogUrl || !ogImage) blockers.push(`${route}: incomplete Open Graph tags`);
  if (ogImage && !ogImage.startsWith(`${SITE_URL}/`) && !ogImage.startsWith('/')) blockers.push(`${route}: og:image must be local or absolute site URL`);
  if (getH1Count(html) !== 1) blockers.push(`${route}: expected exactly one H1, got ${getH1Count(html)}`);
  if (text.length < 120 && !route.includes('/404/')) warnings.push(`${route}: very short visible text`);
  if (title.length > 75) warnings.push(`${route}: title is long (${title.length} chars)`);
  if (description.length > 180) warnings.push(`${route}: description is long (${description.length} chars)`);

  const types = parseJsonLd(html, route, blockers);
  const isJournalIndexRoute = /^\/journal\/(?:\d+\/)?$/.test(route);
  if (!types.includes('WebSite')) blockers.push(`${route}: missing WebSite schema`);
  if (route.startsWith('/journal/') && !isJournalIndexRoute && !route.startsWith('/journal/category/') && !types.includes('BlogPosting')) {
    blockers.push(`${route}: journal article must include BlogPosting schema`);
  }
  if ((isJournalIndexRoute || route.startsWith('/journal/category/')) && !types.includes('CollectionPage')) {
    blockers.push(`${route}: journal archive/category must include CollectionPage schema`);
  }

  const hasVisibleFAQ = html.includes('https://schema.org/FAQPage');
  const hasFAQSchema = types.includes('FAQPage');
  if (hasVisibleFAQ !== hasFAQSchema) blockers.push(`${route}: FAQ markup/schema mismatch`);
  if (types.includes('SearchAction')) blockers.push(`${route}: SearchAction schema exists but site has no search`);

  if (noindex && sitemap.has(route)) blockers.push(`${route}: noindex page is present in sitemap`);
  if (!noindex && !route.includes('/404/') && !SITEMAP_EXCLUDED.some((prefix) => route.startsWith(prefix)) && !sitemap.has(route)) {
    warnings.push(`${route}: indexable page is not present in sitemap`);
  }
}

function checkInternalLinks(file, blockers) {
  const html = read(file);
  const route = toRoute(file);
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      href.startsWith('data:')
    ) {
      continue;
    }
    if (!href.startsWith('/')) continue;
    if (!routeExists(href)) blockers.push(`${route}: broken internal href ${href}`);
  }
}

function checkMediaSources(file, blockers) {
  const html = read(file);
  const route = toRoute(file);
  const sources = new Set();

  for (const match of html.matchAll(/\b(?:src|poster)=["']([^"']+)["']/gi)) {
    sources.add(match[1]);
  }

  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    match[1].split(',').forEach((candidate) => {
      const source = candidate.trim().split(/\s+/)[0];
      if (source) sources.add(source);
    });
  }

  for (const source of sources) {
    const localPath = toLocalSitePath(source);
    if (localPath && ASSET_RE.test(localPath) && !assetExists(localPath)) {
      blockers.push(`${route}: missing media asset ${localPath}`);
    }
  }
}

function checkGlobalFiles(blockers) {
  const robotsPath = path.join(DIST, 'robots.txt');
  const llmsPath = path.join(DIST, 'llms.txt');
  const indexPath = path.join(DIST, 'index.html');

  if (!fs.existsSync(robotsPath)) blockers.push('missing robots.txt');
  if (!fs.existsSync(llmsPath)) blockers.push('missing llms.txt');
  if (fs.existsSync(robotsPath)) {
    const robots = read(robotsPath);
    if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap-index.xml`)) blockers.push('robots.txt missing sitemap-index.xml');
    for (const bot of ['ChatGPT-User', 'PerplexityBot', 'ClaudeBot']) {
      if (!robots.includes(`User-agent: ${bot}`)) blockers.push(`robots.txt missing AI bot ${bot}`);
    }
  }
  if (fs.existsSync(llmsPath) && !read(llmsPath).includes('Журнал Военный навигатор')) {
    blockers.push('llms.txt missing journal link');
  }
  if (fs.existsSync(indexPath)) {
    const html = read(indexPath);
    for (const link of REQUIRED_ICON_LINKS) {
      if (!html.includes(link)) blockers.push(`head missing icon link ${link}`);
    }
  }
  for (const file of REQUIRED_ICON_FILES) {
    if (!fs.existsSync(path.join(DIST, file))) blockers.push(`missing favicon asset ${file}`);
  }
}

function checkSitemap(sitemap, blockers) {
  if (!sitemap.size) blockers.push('sitemap is empty or missing');
  for (const route of sitemap) {
    if (!routeExists(route)) blockers.push(`sitemap route does not exist: ${route}`);
    if (SITEMAP_EXCLUDED.some((prefix) => route.startsWith(prefix))) {
      blockers.push(`sitemap contains excluded route: ${route}`);
    }
  }
  if (sitemap.has('/blog/')) blockers.push('sitemap must not contain /blog/');
}

function checkPlaceholders(blockers) {
  for (const file of walk(DIST).filter((item) => /\.(html|txt|xml|css)$/i.test(item))) {
    const content = read(file);
    for (const pattern of PLACEHOLDERS) {
      if (content.includes(pattern)) {
        blockers.push(`${path.relative(DIST, file).replaceAll(path.sep, '/')}: placeholder found: ${pattern}`);
      }
    }
  }
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run `pnpm build` before `pnpm seo-check`.');
    process.exit(1);
  }

  const blockers = [];
  const warnings = [];
  const htmlFiles = walk(DIST).filter((file) => file.endsWith('.html'));
  const seoHtmlFiles = htmlFiles.filter((file) => !UTILITY_HTML_ROUTE_RE.test(toRoute(file)));
  const sitemap = sitemapRoutes();

  checkGlobalFiles(blockers);
  checkSitemap(sitemap, blockers);
  checkPlaceholders(blockers);

  for (const file of seoHtmlFiles) {
    checkPage(file, sitemap, blockers, warnings);
    checkInternalLinks(file, blockers);
    checkMediaSources(file, blockers);
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                 SEO Check (AMS technical gate)              ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║ Pages checked: ${String(seoHtmlFiles.length).padEnd(45)}║`);
  console.log(`║ Sitemap URLs:  ${String(sitemap.size).padEnd(45)}║`);
  console.log(`║ Blockers:      ${String(blockers.length).padEnd(45)}║`);
  console.log(`║ Warnings:      ${String(warnings.length).padEnd(45)}║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (warnings.length) {
    console.log('Warnings:');
    warnings.forEach((warning) => console.log(`- ${warning}`));
    console.log('');
  }

  if (blockers.length) {
    console.error('Blockers:');
    blockers.forEach((blocker) => console.error(`- ${blocker}`));
    console.error('\nSEO check failed. Fix blockers before deploying.\n');
    process.exit(1);
  }

  console.log('✅ SEO check passed. Technical SEO baseline is clean.\n');
}

main();
