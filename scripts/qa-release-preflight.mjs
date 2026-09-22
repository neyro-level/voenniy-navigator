/**
 * Secret-free validation of the release checklist, public config-name inventory
 * and SourceCraft immutable-artifact contract. It never reads environment values.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT, '.tmp', 'release-preflight.json');
const PUBLIC_NAMES = [
  'PUBLIC_YM_COUNTER_ID',
  'PUBLIC_LEADS_API_URL',
  'PUBLIC_PROJECT_ID',
  'PUBLIC_LEADS_SITE_KEY',
  'PUBLIC_SMARTCAPTCHA_CLIENT_KEY',
  'PUBLIC_YANDEX_MAPS_API_KEY',
  'PUBLIC_SITE_URL',
];

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

function main() {
  const envExample = read('.env.example');
  const checklist = read('project-docs/RELEASE_CANDIDATE_CHECKLIST.md');
  const workflow = read('.sourcecraft/ci.yaml');
  const releaseVerifier = read('scripts/verify-sourcecraft-release.mjs');
  const failures = [];

  for (const name of PUBLIC_NAMES) {
    if (!new RegExp(`^${name}=$`, 'm').test(envExample)) failures.push(`.env.example is missing blank ${name}`);
    if (!checklist.includes(`\`${name}\``)) failures.push(`checklist is missing ${name}`);
  }
  for (const required of ['publish-release:', 'expected_main_sha:', 'EXPECTED_MAIN_SHA']) {
    if (!workflow.includes(required)) failures.push(`.sourcecraft/ci.yaml is missing ${required}`);
  }
  for (const required of [
    'PUBLIC_LEADS_SITE_KEY: ${{ secrets.PUBLIC_LEADS_SITE_KEY }}',
    'PUBLIC_SMARTCAPTCHA_CLIENT_KEY: ${{ secrets.VOENNIY_NAVIGATOR_SMARTCAPTCHA_CLIENT_KEY }}',
    'PUBLIC_YANDEX_MAPS_API_KEY: ${{ secrets.PUBLIC_YANDEX_MAPS_API_KEY }}',
    '.release/voenniy-navigator-release.tar.gz',
    '.release/voenniy-navigator-release.tar.gz.sha256',
    '.release/release-manifest.json',
    '.release/release-tree.sha256',
  ]) {
    if (!workflow.includes(required)) failures.push(`release workflow is missing protected public build config: ${required}`);
  }
  for (const forbidden of ['dist/**', '.release/**']) {
    if (workflow.includes(forbidden)) failures.push(`release workflow uses an unsupported glob artifact path: ${forbidden}`);
  }
  if (!releaseVerifier.includes('SOURCECRAFT_COMMIT_SHA')) failures.push('release verifier does not bind the artifact to SourceCraft commit SHA');
  for (const required of [
    'Rollback target — VERIFIED',
    '/var/www/client-sites/voenniy-navigator/releases/',
    'Stable checksum reference:',
    'GitHub mirror: выполнять только после успешного production rollout',
  ]) {
    if (!checklist.includes(required)) failures.push(`checklist is missing release boundary: ${required}`);
  }

  const report = {
    schema: 'voen-navigator.release-preflight.v1',
    generatedAt: new Date().toISOString(),
    publicConfigNames: PUBLIC_NAMES,
    failures,
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Release preflight: ${failures.length} failures; ${PUBLIC_NAMES.length} public config names checked.`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH).replaceAll(path.sep, '/')}`);
  if (failures.length) process.exit(1);
}

main();
