import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const sha = 'a'.repeat(40);
const previousSha = 'b'.repeat(40);

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'voen-release-evidence-'));
  const artifact = join(root, 'release.tar.gz');
  const out = join(root, 'RELEASE_EVIDENCE.json');
  const parts = join(root, 'RELEASE_PARTS.json');
  writeFileSync(artifact, 'immutable-release-fixture');
  const checksum = createHash('sha256').update(readFileSync(artifact)).digest('hex');
  writeFileSync(`${artifact}.sha256`, `${checksum}  release.tar.gz\n`);
  writeFileSync(parts, `${JSON.stringify({
    parts: [0, 1, 2].map((index) => ({
      file: `release.tar.gz.part-0${index}`,
      bytes: 1,
      sha256: 'c'.repeat(64),
    })),
  })}\n`);
  return { artifact, checksum, out, parts };
}

test('evidence binds exact SHA, gate, checksum, durable store and rollback release', () => {
  const data = fixture();
  execFileSync(process.execPath, [
    'scripts/write-release-evidence.mjs', '--artifact', data.artifact, '--sha', sha,
    '--gate-run', '7', '--previous-sha', previousSha,
    '--previous-release-id', '20260708141134-cc5bc7f',
    '--store-release-tag', `rehearsal-${sha}`, '--parts', data.parts, '--out', data.out,
  ]);
  const evidence = JSON.parse(readFileSync(data.out, 'utf8'));
  assert.equal(evidence.source.sha, sha);
  assert.equal(evidence.gate.runSlug, '7');
  assert.equal(evidence.artifact.sha256, data.checksum);
  assert.equal(evidence.rollback.previousReleaseId, '20260708141134-cc5bc7f');
  assert.equal(evidence.buildConfiguration.productionReady, false);
  assert.deepEqual(evidence.production, { authorized: false, deployed: false });
});

test('evidence fails closed on checksum drift', () => {
  const data = fixture();
  writeFileSync(`${data.artifact}.sha256`, `${'0'.repeat(64)}  release.tar.gz\n`);
  const result = spawnSync(process.execPath, [
    'scripts/write-release-evidence.mjs', '--artifact', data.artifact, '--sha', sha,
    '--gate-run', '7', '--previous-sha', previousSha,
    '--previous-release-id', '20260708141134-cc5bc7f',
    '--store-release-tag', `rehearsal-${sha}`, '--parts', data.parts, '--out', data.out,
  ], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /checksum sidecar does not match/u);
});
