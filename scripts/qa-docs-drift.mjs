/**
 * Checks the small set of documents that define the current runtime and
 * delivery contract. Historical worklog entries are intentionally not scanned.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT, '.tmp', 'docs-drift.json');
const files = {
  rootPassport: 'PASSPORT_PROJECTS.md',
  readme: 'README.md',
  passport: 'project-docs/PASSPORT_PROJECTS.md',
  architecture: 'project-docs/SITE_ARCHITECTURE.md',
  serverPlan: 'project-docs/SERVER_MIGRATION_PLAN.md',
  docsReadme: 'project-docs/README.md',
  worklog: 'project-docs/WORKLOG.md',
};

function content(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

function main() {
  const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, content(file)]));
  const failures = [];
  const requireText = (key, text) => {
    if (!source[key].includes(text)) failures.push(`${files[key]} is missing: ${text}`);
  };
  const forbidText = (key, text) => {
    if (source[key].includes(text)) failures.push(`${files[key]} has stale text: ${text}`);
  };

  requireText('rootPassport', 'Astro 7');
  requireText('rootPassport', 'TypeScript 6');
  requireText('rootPassport', 'SourceCraft primary');
  requireText('readme', 'Astro 7');
  requireText('readme', 'TypeScript 6');
  requireText('readme', 'SourceCraft primary');
  requireText('passport', 'Astro 7.3.x');
  requireText('passport', 'TypeScript 6 strict');
  requireText('passport', 'Node.js 24.21.0');
  requireText('passport', 'SourceCraft `integrator-p/voen-navigator`');
  requireText('architecture', 'Canonical primary');
  requireText('architecture', 'GitHub не является источником production deploy');
  requireText('serverPlan', 'ручной SourceCraft release');
  requireText('serverPlan', 'Secret Master');
  requireText('docsReadme', 'SERVER_MIGRATION_PLAN.md');
  requireText('worklog', 'Astro 7 migration and SourceCraft delivery canon');

  for (const key of ['rootPassport', 'readme', 'passport']) forbidText(key, 'Astro 5');
  for (const key of ['passport', 'serverPlan', 'architecture']) forbidText(key, 'via GitHub Actions');
  forbidText('serverPlan', 'GitHub Actions -> SSH/rsync');
  forbidText('serverPlan', 'GitHub Actions secrets');

  for (const match of source.readme.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]+)?\)/g)) {
    const target = path.resolve(ROOT, match[1]);
    if (!fs.existsSync(target)) failures.push(`${files.readme} has a broken documentation link: ${match[1]}`);
  }

  const report = {
    schema: 'voen-navigator.docs-drift.v1',
    generatedAt: new Date().toISOString(),
    files: Object.values(files),
    failures,
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Documentation drift: ${failures.length} failures across ${report.files.length} runtime/delivery documents.`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH).replaceAll(path.sep, '/')}`);
  if (failures.length) process.exit(1);
}

main();
