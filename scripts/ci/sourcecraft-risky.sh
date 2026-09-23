#!/usr/bin/env bash
set -euo pipefail

corepack enable
corepack prepare pnpm@11.5.1 --activate
node scripts/verify-sourcecraft-gate.mjs
pnpm install --frozen-lockfile --prefer-offline

case "${RISK_SCOPE:-}" in
  runtime-release)
    pnpm verify:risk:runtime-release
    ;;
  seo-geo)
    pnpm verify:risk:seo-geo
    ;;
  dependencies)
    pnpm verify:risk:dependencies
    ;;
  *)
    echo "Unsupported RISK_SCOPE: ${RISK_SCOPE:-<empty>}" >&2
    exit 2
    ;;
esac
