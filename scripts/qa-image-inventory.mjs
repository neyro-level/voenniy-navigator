/**
 * Decode project and generated image assets, then report rendered references.
 *
 * Run after `pnpm build` and `pnpm qa:crawl`.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const REPORT_PATH = process.env.QA_IMAGE_REPORT_PATH || path.join(ROOT, '.tmp', 'image-inventory.json');
const CRAWL_PATH = path.join(ROOT, '.tmp', 'route-crawl.json');
const IMAGE_RE = /\.(?:avif|webp|png|jpe?g|gif|svg|ico)$/i;
const IGNORED_DIRECTORIES = new Set(['.git', '.astro', '.tmp', 'dist', 'node_modules', 'graphify-out']);

function walk(directory, { ignore = new Set() } = {}) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return ignore.has(entry.name) ? [] : walk(entryPath, { ignore });
    }
    return [entryPath];
  });
}

function relative(file, root = ROOT) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function decodeIco(file, root) {
  const item = { file: relative(file, root), format: 'ico' };
  const buffer = fs.readFileSync(file);
  if (buffer.length < 22 || buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) {
    return { ...item, decoded: false, error: 'invalid ICO header' };
  }
  const count = buffer.readUInt16LE(4);
  const entries = [];
  for (let index = 0; index < count; index += 1) {
    const offset = 6 + index * 16;
    if (offset + 16 > buffer.length) continue;
    const width = buffer[offset] || 256;
    const height = buffer[offset + 1] || 256;
    const size = buffer.readUInt32LE(offset + 8);
    const imageOffset = buffer.readUInt32LE(offset + 12);
    if (width && height && size && imageOffset + size <= buffer.length) entries.push({ width, height });
  }
  if (!entries.length) return { ...item, decoded: false, error: 'ICO has no readable image entry' };
  const largest = entries.sort((a, b) => b.width * b.height - a.width * a.height)[0];
  return { ...item, ...largest, decoded: true, decoder: 'ico-container' };
}

async function decode(file, root) {
  if (file.toLowerCase().endsWith('.ico')) return decodeIco(file, root);
  const item = { file: relative(file, root) };
  try {
    const { info } = await sharp(file, { animated: true, failOn: 'error' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    item.width = info.width;
    item.height = info.height;
    item.format = info.format;
    item.decoded = Boolean(info.width && info.height);
    if (!item.decoded) item.error = 'zero dimensions after decode';
  } catch (error) {
    item.decoded = false;
    item.error = error instanceof Error ? error.message : String(error);
  }
  return item;
}

function getRenderedReferences() {
  if (!fs.existsSync(CRAWL_PATH)) return new Set();
  const report = JSON.parse(fs.readFileSync(CRAWL_PATH, 'utf8'));
  return new Set((report.assets ?? [])
    .map((asset) => asset.target?.replace(/^\//, ''))
    .filter((value) => value && IMAGE_RE.test(value)));
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run `pnpm build` before `pnpm qa:images`.');
    process.exit(1);
  }

  const repositoryFiles = walk(ROOT, { ignore: IGNORED_DIRECTORIES }).filter((file) => IMAGE_RE.test(file)).sort();
  const renderedFiles = walk(DIST).filter((file) => IMAGE_RE.test(file)).sort();
  const renderedReferences = getRenderedReferences();
  const [repository, rendered] = await Promise.all([
    Promise.all(repositoryFiles.map((file) => decode(file, ROOT))),
    Promise.all(renderedFiles.map((file) => decode(file, DIST))),
  ]);

  const unreferencedPublicAssets = repository
    .filter((item) => item.file.startsWith('public/'))
    .filter((item) => !renderedReferences.has(item.file.slice('public/'.length)))
    .map((item) => item.file);
  const sourceManagedAssets = repository
    .filter((item) => item.file.startsWith('src/'))
    .map((item) => item.file);
  const failures = [...repository, ...rendered].filter((item) => !item.decoded);

  const report = {
    schema: 'voen-navigator.image-inventory.v1',
    generatedAt: new Date().toISOString(),
    summary: {
      repositoryImages: repository.length,
      renderedImages: rendered.length,
      renderedReferences: renderedReferences.size,
      decodeFailures: failures.length,
      unreferencedPublicAssets: unreferencedPublicAssets.length,
      sourceManagedAssets: sourceManagedAssets.length,
    },
    repository,
    rendered,
    renderedReferences: [...renderedReferences].sort(),
    unreferencedPublicAssets,
    sourceManagedAssets,
    failures,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Image inventory: ${repository.length} repository images, ${rendered.length} generated images, ${failures.length} decode failures.`);
  console.log(`Report: ${relative(REPORT_PATH)}`);

  if (failures.length) {
    failures.forEach((item) => console.error(`- ${item.file}: ${item.error}`));
    process.exit(1);
  }
}

main();
