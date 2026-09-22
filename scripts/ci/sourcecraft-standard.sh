#!/usr/bin/env bash
set -euo pipefail

corepack enable
corepack prepare pnpm@11.5.1 --activate
node scripts/verify-sourcecraft-gate.mjs
pnpm install --frozen-lockfile --prefer-offline
pnpm verify:standard
