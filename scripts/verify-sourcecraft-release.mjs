import { execFileSync } from 'node:child_process';

const SHA_PATTERN = /^[0-9a-f]{40}$/i;

function requireSha(name) {
  const value = process.env[name]?.trim();
  if (!value || !SHA_PATTERN.test(value)) {
    throw new Error(`${name} must be a full 40-character commit SHA.`);
  }
  return value.toLowerCase();
}

const expected = requireSha('EXPECTED_MAIN_SHA');
const actual = requireSha('SOURCECRAFT_COMMIT_SHA');
const refName = process.env.SOURCECRAFT_COMMIT_REF_NAME?.trim();

if (refName && refName !== 'main') {
  throw new Error(`Release workflow must run from main, received ${JSON.stringify(refName)}.`);
}

if (expected !== actual) {
  throw new Error('Expected main SHA does not match SOURCECRAFT_COMMIT_SHA. Refusing to package a different commit.');
}

const remoteMainLine = execFileSync('git', ['ls-remote', 'origin', 'refs/heads/main'], {
  encoding: 'utf8',
}).trim();
const remoteMain = remoteMainLine.split(/\s+/)[0]?.toLowerCase();
if (!remoteMain || !SHA_PATTERN.test(remoteMain)) {
  throw new Error('Cannot resolve the canonical origin/main SHA. Refusing to package an unverified commit.');
}
if (remoteMain !== actual) {
  throw new Error('SOURCECRAFT_COMMIT_SHA is not the current canonical origin/main SHA. Refusing to package a stale commit.');
}

process.stdout.write(`Exact main release source verified: ${actual}\n`);
