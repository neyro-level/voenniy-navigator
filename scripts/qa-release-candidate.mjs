/**
 * Consolidated, non-production release-candidate evidence for the static site.
 *
 * Run after build, qa:crawl and qa:images. It records the exact Git SHA with
 * route, sitemap, canonical, robots, llms and image evidence in .tmp/.
 */

import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TMP = path.join(ROOT, '.tmp');
const SITE_URL = 'https://voen-navigator.ru';
const REPORT_PATH = path.join(TMP, 'release-candidate.json');
const EXCLUDED_FROM_SITEMAP = ['/404/', '/thanks/', '/podbor/thanks/', '/podbor/', '/bonus/', '/prezentaciya/'];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`${path.relative(ROOT, file)} is missing; run its prerequisite QA command first.`);
  return JSON.parse(read(file));
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function toRoute(file) {
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  if (relative.endsWith('.html')) return `/${relative.slice(0, -'.html'.length)}/`;
  return `/${relative}`;
}

function htmlFileForRoute(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  const normalized = route.replace(/^\//, '').replace(/\/$/, '');
  const direct = path.join(DIST, `${normalized}.html`);
  return fs.existsSync(direct) ? direct : path.join(DIST, normalized, 'index.html');
}

function canonicalFrom(html) {
  return html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1] ?? '';
}

function main() {
  if (!fs.existsSync(DIST)) throw new Error('dist/ not found. Run pnpm build first.');

  const crawl = readJson(path.join(TMP, 'route-crawl.json'));
  const images = readJson(path.join(TMP, 'image-inventory.json'));
  const errors = [];
  const htmlRoutes = walk(DIST).filter((file) => file.endsWith('.html')).map(toRoute);
  const publicRoutes = htmlRoutes.filter((route) => !/^\/yandex_[a-f0-9]+\/$/i.test(route));
  const sitemapIndex = path.join(DIST, 'sitemap-index.xml');
  const robots = path.join(DIST, 'robots.txt');
  const llms = path.join(DIST, 'llms.txt');

  if (crawl.summary?.errors !== 0) errors.push(`route crawl errors: ${crawl.summary?.errors ?? 'missing summary'}`);
  if (images.summary?.decodeFailures !== 0) errors.push(`image decode failures: ${images.summary?.decodeFailures ?? 'missing summary'}`);
  if (!fs.existsSync(sitemapIndex)) errors.push('missing sitemap-index.xml');
  if (!fs.existsSync(robots)) errors.push('missing robots.txt');
  if (!fs.existsSync(llms)) errors.push('missing llms.txt');

  const sitemapFiles = walk(DIST).filter((file) => /^sitemap-\d+\.xml$/i.test(path.basename(file)));
  const sitemapRoutes = new Set();
  for (const file of sitemapFiles) {
    for (const match of read(file).matchAll(/<loc>(.*?)<\/loc>/g)) sitemapRoutes.add(new URL(match[1]).pathname);
  }
  for (const route of sitemapRoutes) {
    if (!fs.existsSync(htmlFileForRoute(route))) errors.push(`sitemap route is not built: ${route}`);
    if (EXCLUDED_FROM_SITEMAP.some((prefix) => route.startsWith(prefix))) errors.push(`sitemap includes excluded route: ${route}`);
  }

  for (const route of publicRoutes) {
    const html = read(htmlFileForRoute(route));
    const canonical = canonicalFrom(html);
    const expected = `${SITE_URL}${route}`;
    if (canonical !== expected) errors.push(`canonical mismatch: ${route} => ${canonical || 'missing'}`);
  }

  if (fs.existsSync(robots) && !read(robots).includes(`Sitemap: ${SITE_URL}/sitemap-index.xml`)) errors.push('robots.txt does not reference sitemap-index.xml');
  if (fs.existsSync(llms) && !read(llms).includes('Журнал Военный навигатор')) errors.push('llms.txt does not contain the journal section');

  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  const report = {
    schema: 'voen-navigator.release-candidate.v1',
    generatedAt: new Date().toISOString(),
    sha,
    summary: {
      builtHtmlRoutes: htmlRoutes.length,
      publicRoutes: publicRoutes.length,
      sitemapRoutes: sitemapRoutes.size,
      crawl: crawl.summary,
      images: images.summary,
      blockers: errors.length,
    },
    blockers: errors,
  };
  fs.mkdirSync(TMP, { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Release candidate ${sha.slice(0, 12)}: ${publicRoutes.length} public routes, ${sitemapRoutes.size} sitemap routes, ${errors.length} blockers.`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH).replaceAll(path.sep, '/')}`);
  if (errors.length) process.exit(1);
}

main();
