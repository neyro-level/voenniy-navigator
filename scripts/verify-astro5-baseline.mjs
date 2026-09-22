import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));

const requirements = {
  node: '24.21.0',
  pnpm: '11.5.1',
  astroMajor: 5,
  typescriptMajor: 5,
};

function major(version) {
  const match = String(version).match(/\d+/);
  return match ? Number(match[0]) : Number.NaN;
}

const failures = [];
if (process.version.slice(1) !== requirements.node) {
  failures.push(`Node must be ${requirements.node}; received ${process.version.slice(1)}.`);
}
if (packageJson.packageManager !== `pnpm@${requirements.pnpm}`) {
  failures.push(`packageManager must pin pnpm@${requirements.pnpm}.`);
}
if (major(packageJson.dependencies?.astro) !== requirements.astroMajor) {
  failures.push(`Astro must remain on major ${requirements.astroMajor} for this baseline.`);
}
if (major(packageJson.devDependencies?.typescript) !== requirements.typescriptMajor) {
  failures.push(`TypeScript must remain on major ${requirements.typescriptMajor} for this baseline.`);
}

if (failures.length > 0) {
  throw new Error(failures.join('\n'));
}

console.log('Astro 5 baseline: Node 24.21.0, pnpm 11.5.1, TypeScript 5 — PASS');
