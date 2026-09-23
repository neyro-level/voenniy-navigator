/**
 * Inventory every rendered route, local link and rendered local asset.
 *
 * Run after `pnpm build`. The JSON report is intentionally written outside
 * tracked source files so that QA evidence is reproducible but not committed.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const REPORT_PATH = process.env.QA_REPORT_PATH || path.join(ROOT, '.tmp', 'route-crawl.json');
const SITE_ORIGIN = 'https://voen-navigator.ru';
const ASSET_RE = /\.(?:avif|webp|png|jpe?g|gif|svg|ico|pdf|txt|xml|css|js|mjs|map|woff2?|ttf|otf)$/i;
const URL_ATTR_RE = /\b(?:href|src|poster|action)=(["'])(.*?)\1/gi;
const SRCSET_RE = /\bsrcset=(["'])(.*?)\1/gi;

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function routeForHtml(file) {
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative.replace(/\.html$/, '')}/`;
}

function targetExists(pathname) {
  const normalized = pathname.replace(/^\//, '');
  if (ASSET_RE.test(pathname)) return fs.existsSync(path.join(DIST, normalized));
  if (pathname === '/') return fs.existsSync(path.join(DIST, 'index.html'));
  return fs.existsSync(path.join(DIST, normalized, 'index.html')) ||
    fs.existsSync(path.join(DIST, `${normalized.replace(/\/$/, '')}.html`));
}

function collectUrls(html) {
  const values = [];
  for (const match of html.matchAll(URL_ATTR_RE)) values.push(match[2]);
  for (const match of html.matchAll(SRCSET_RE)) {
    for (const candidate of match[2].split(',')) {
      const value = candidate.trim().split(/\s+/)[0];
      if (value) values.push(value);
    }
  }
  return values;
}

function localTarget(rawValue, route) {
  if (!rawValue || rawValue.startsWith('#') || rawValue.startsWith('data:') || rawValue.startsWith('blob:') ||
      rawValue.startsWith('mailto:') || rawValue.startsWith('tel:') || rawValue.startsWith('javascript:')) return null;

  let url;
  try {
    url = new URL(rawValue, `${SITE_ORIGIN}${route}`);
  } catch {
    return { raw: rawValue, error: 'malformed URL' };
  }
  if (url.origin !== SITE_ORIGIN) return null;
  return { raw: rawValue, pathname: decodeURIComponent(url.pathname) };
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run `pnpm build` before `pnpm qa:crawl`.');
    process.exit(1);
  }

  const pages = walk(DIST).filter((file) => file.endsWith('.html')).sort();
  const routes = [];
  const links = [];
  const assets = [];
  const errors = [];

  for (const page of pages) {
    const route = routeForHtml(page);
    const html = fs.readFileSync(page, 'utf8');
    const pageLinks = [];
    const pageAssets = [];

    for (const rawValue of collectUrls(html)) {
      const target = localTarget(rawValue, route);
      if (!target) continue;
      if (target.error) {
        errors.push({ route, value: rawValue, reason: target.error });
        continue;
      }
      const entry = { from: route, value: rawValue, target: target.pathname };
      if (!targetExists(target.pathname)) {
        errors.push({ ...entry, reason: 'target is absent from dist' });
      }
      if (ASSET_RE.test(target.pathname)) {
        pageAssets.push(entry);
        assets.push(entry);
      } else {
        pageLinks.push(entry);
        links.push(entry);
      }
    }

    routes.push({ route, file: path.relative(DIST, page).replaceAll(path.sep, '/'), links: pageLinks.length, assets: pageAssets.length });
  }

  const report = {
    schema: 'voen-navigator.route-crawl.v1',
    generatedAt: new Date().toISOString(),
    dist: 'dist',
    summary: { routes: routes.length, localLinks: links.length, localAssets: assets.length, errors: errors.length },
    routes,
    links,
    assets,
    errors,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Route crawl: ${routes.length} routes, ${links.length} local links, ${assets.length} local assets, ${errors.length} errors.`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH).replaceAll(path.sep, '/')}`);

  if (errors.length) {
    errors.slice(0, 20).forEach((entry) => console.error(`- ${entry.from}: ${entry.value} (${entry.reason})`));
    process.exit(1);
  }
}

main();
