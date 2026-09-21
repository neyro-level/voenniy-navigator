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

if (refName !== 'main') {
  throw new Error(`Release workflow must run from main, received ${JSON.stringify(refName)}.`);
}

if (expected !== actual) {
  throw new Error('Expected main SHA does not match SOURCECRAFT_COMMIT_SHA. Refusing to package a different commit.');
}

process.stdout.write(`Exact main release source verified: ${actual}\n`);
