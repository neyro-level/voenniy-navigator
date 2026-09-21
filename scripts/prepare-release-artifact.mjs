import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteSlug = 'voenniy-navigator';
const distRoot = path.resolve('dist');
const expectedMainSha = process.env.EXPECTED_MAIN_SHA?.trim().toLowerCase();

if (!/^[0-9a-f]{40}$/.test(expectedMainSha ?? '')) {
  throw new Error('EXPECTED_MAIN_SHA must be a full 40-character commit SHA.');
}

async function collectFiles(directory, relative = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const nextRelative = path.posix.join(relative, entry.name);
    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolute, nextRelative));
      continue;
    }

    if (!entry.isFile()) {
      throw new Error(`Release artifact may contain only regular files: ${nextRelative}`);
    }

    const [contents, details] = await Promise.all([readFile(absolute), stat(absolute)]);
    files.push({
      path: nextRelative,
      bytes: details.size,
      sha256: createHash('sha256').update(contents).digest('hex'),
    });
  }

  return files;
}

const files = await collectFiles(distRoot);
if (files.length === 0) {
  throw new Error('dist is empty; refusing to publish an empty static artifact.');
}

const treeSha256 = createHash('sha256')
  .update(files.map((file) => `${file.sha256}  ${file.bytes}  ${file.path}\n`).join(''))
  .digest('hex');
const artifactDirectory = path.join('.release', `${siteSlug}-${expectedMainSha}`);
const manifest = {
  schemaVersion: 1,
  siteSlug,
  sourceCommit: expectedMainSha,
  artifactRoot: 'dist',
  treeSha256,
  files,
};

await mkdir(artifactDirectory, { recursive: true });
await writeFile(
  path.join(artifactDirectory, 'release-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await writeFile(path.join(artifactDirectory, 'release-tree.sha256'), `${treeSha256}  dist-tree\n`);

process.stdout.write(`Release artifact prepared: ${siteSlug}@${expectedMainSha} (${files.length} files)\n`);
