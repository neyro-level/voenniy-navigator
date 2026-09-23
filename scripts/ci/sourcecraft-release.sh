#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if [[ -n "${SOURCECRAFT_COMMIT_SHA:-}" ]]; then
  ACTUAL_SHA="$SOURCECRAFT_COMMIT_SHA"
else
  ACTUAL_SHA="$(git rev-parse HEAD)"
fi
EXPECTED_SHA="${EXPECTED_COMMIT_SHA:-}"
if [[ ! "$EXPECTED_SHA" =~ ^[0-9a-f]{40}$ || "$EXPECTED_SHA" != "$ACTUAL_SHA" ]]; then
  echo "Release refused: expected_commit_sha must equal checked-out full SHA (${ACTUAL_SHA})." >&2
  exit 1
fi
if [[ ! "${GATE_RUN_SLUG:-}" =~ ^[0-9]+$ ]]; then
  echo "Release refused: gate_run_slug must identify an API-verified green Merge Gate." >&2
  exit 1
fi
if [[ ! "${PREVIOUS_RELEASE_SHA:-}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Release refused: previous_release_sha must be a full rollback SHA." >&2
  exit 1
fi
if [[ ! "${PREVIOUS_RELEASE_ID:-}" =~ ^[0-9]{14}-[0-9a-f]{7}$ ]]; then
  echo "Release refused: previous_release_id is invalid." >&2
  exit 1
fi
if [[ ! "${STORE_RELEASE_TAG:-}" =~ ^[a-z0-9][a-z0-9._-]{2,127}$ ]]; then
  echo "Release refused: store_release_tag is invalid." >&2
  exit 1
fi

corepack enable
corepack prepare pnpm@11.5.1 --activate
[[ "$(node -p 'process.versions.node')" == "24.21.0" ]]
[[ "$(pnpm --version)" == "11.5.1" ]]

node --test scripts/ci/sourcecraft-contract.test.mjs scripts/release-evidence.test.mjs
pnpm install --frozen-lockfile --prefer-offline --reporter=append-only

# Build exactly once. Every following proof consumes this immutable dist tree.
pnpm verify:risk:runtime-release
rm -rf .release release-output
node scripts/prepare-release-artifact.mjs
mkdir -p release-output
tar -czf release-output/release.tar.gz dist ".release/voenniy-navigator-${ACTUAL_SHA}"
node scripts/write-release-checksum.mjs release-output/release.tar.gz
split -b 40m -d -a 2 release-output/release.tar.gz release-output/release.tar.gz.part-
node scripts/write-release-parts.mjs release-output release.tar.gz.part- release-output/RELEASE_PARTS.json
test -s release-output/release.tar.gz.part-00
test -s release-output/release.tar.gz.part-01
test -s release-output/release.tar.gz.part-02
test ! -e release-output/release.tar.gz.part-03

REHEARSAL_ROOT="$(mktemp -d)"
trap 'rm -rf "$REHEARSAL_ROOT"' EXIT
mkdir -p "$REHEARSAL_ROOT/releases/$PREVIOUS_RELEASE_ID" "$REHEARSAL_ROOT/releases/candidate-$ACTUAL_SHA"
tar -xzf release-output/release.tar.gz -C "$REHEARSAL_ROOT/releases/candidate-$ACTUAL_SHA"
node scripts/rehearse-static-release.mjs \
  --root "$REHEARSAL_ROOT" \
  --candidate "candidate-$ACTUAL_SHA" \
  --previous "$PREVIOUS_RELEASE_ID" \
  --out release-output/REHEARSAL_RESULT.txt

node scripts/write-release-evidence.mjs \
  --artifact release-output/release.tar.gz \
  --sha "$ACTUAL_SHA" \
  --gate-run "$GATE_RUN_SLUG" \
  --previous-sha "$PREVIOUS_RELEASE_SHA" \
  --previous-release-id "$PREVIOUS_RELEASE_ID" \
  --store-release-tag "$STORE_RELEASE_TAG" \
  --parts release-output/RELEASE_PARTS.json \
  --out release-output/RELEASE_EVIDENCE.json

echo "Static release unit prepared once for ${ACTUAL_SHA}; production not touched."
