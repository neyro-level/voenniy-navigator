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

const sourcecraftToken = process.env.SOURCECRAFT_TOKEN?.trim();
if (!sourcecraftToken) {
  throw new Error('SOURCECRAFT_TOKEN is required to verify canonical main through the SourceCraft API.');
}
const response = await fetch(
  'https://api.sourcecraft.tech/repos/integrator-p/voen-navigator/branches?filter=main&page_size=20',
  { headers: { Authorization: `Bearer ${sourcecraftToken}` } },
);
if (!response.ok) {
  throw new Error(`SourceCraft branch verification failed with HTTP ${response.status}.`);
}
const payload = await response.json();
const remoteMain = payload.branches?.find((branch) => branch.name === 'main')?.commit?.hash?.toLowerCase();
if (!remoteMain || !SHA_PATTERN.test(remoteMain)) {
  throw new Error('Cannot resolve the canonical SourceCraft main SHA. Refusing to package an unverified commit.');
}
if (remoteMain !== actual) {
  throw new Error('SOURCECRAFT_COMMIT_SHA is not the current canonical origin/main SHA. Refusing to package a stale commit.');
}

process.stdout.write(`Exact main release source verified: ${actual}\n`);
