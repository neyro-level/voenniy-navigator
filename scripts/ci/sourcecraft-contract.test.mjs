import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflow = await readFile(new URL('../../.sourcecraft/ci.yaml', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));

test('push and pull request remain explicit zero-trigger sentinels', () => {
  assert.match(workflow, /push:[\s\S]*?paths:\s*\[\]/);
  assert.match(workflow, /pull_request:[\s\S]*?paths:\s*\[\]/);
});

test('STANDARD is exact-head and excludes production build, GEO and SEO suites', () => {
  assert.match(workflow, /merge-standard:[\s\S]*?bash scripts\/ci\/sourcecraft-standard\.sh/);
  assert.equal(packageJson.scripts['verify:standard'], 'astro check');
  assert.doesNotMatch(packageJson.scripts['verify:standard'], /build|geo-check|seo-check|preview/);
});

test('RISKY requires one supported project boundary', () => {
  for (const scope of ['runtime-release', 'seo-geo', 'dependencies']) {
    assert.match(workflow, new RegExp(`- ${scope}`));
    assert.ok(packageJson.scripts[`verify:risk:${scope}`]);
  }
  assert.match(workflow, /RISK_SCOPE:\s*\$\{\{ inputs\.risk_scope \}\}/);
});

test('release remains manual and outside development triggers', () => {
  const triggerBlock = workflow.slice(0, workflow.indexOf('workflows:'));
  assert.doesNotMatch(triggerBlock, /release-single-build/);
  assert.match(workflow, /release-single-build:/);
  for (const artifact of [
    'release.tar.gz.part-00',
    'release.tar.gz.part-01',
    'release.tar.gz.part-02',
    'release.tar.gz.sha256',
    'RELEASE_PARTS.json',
    'RELEASE_EVIDENCE.json',
    'REHEARSAL_RESULT.txt',
  ]) {
    assert.match(workflow, new RegExp(`release-output/${artifact.replaceAll('.', '\\.')}`));
  }
  assert.doesNotMatch(workflow, /(?:^|\s)(?:ssh|scp|rsync)\s/m);
});
