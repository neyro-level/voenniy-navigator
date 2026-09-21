const expected = process.env.EXPECTED_COMMIT_SHA;
const actual = process.env.SOURCECRAFT_COMMIT_SHA;
const fullSha = /^[a-f0-9]{40}$/i;

if (!fullSha.test(expected ?? '')) {
  throw new Error('EXPECTED_COMMIT_SHA must be a full 40-character SHA.');
}

if (!fullSha.test(actual ?? '')) {
  throw new Error('SOURCECRAFT_COMMIT_SHA must be a full 40-character SHA.');
}

if (expected !== actual) {
  throw new Error('SourceCraft run commit differs from expected PR head SHA.');
}

console.log(`Exact-head gate verified: ${actual}`);
