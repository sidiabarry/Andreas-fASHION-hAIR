#!/usr/bin/env bash
# Macht einen Git-Worktree in ~1 s arbeitsfähig (für Agenten und Menschen).
#   bash scripts/wt-prepare.sh        → im Worktree ausführen
# - node_modules: Hardlink-Kopie aus dem Haupt-Checkout (kein Platzbedarf, keine Downloads).
#   Kein Symlink: Turbopack bricht bei node_modules außerhalb des Projektordners ab.
# - .env.local wird kopiert, falls vorhanden (nie eingecheckt).
# - Routentypen erzeugen (sonst schlägt `tsc` mit fehlendem PageProps fehl).
# - Gibt einen eigenen Port aus, damit parallele Dev-Server sich nicht stören.
set -euo pipefail
here="$(git rev-parse --show-toplevel)"
main="$(cd "$(git rev-parse --path-format=absolute --git-common-dir)/.." && pwd)"
cd "$here"

if [ ! -d node_modules ]; then
  if [ "$here" != "$main" ] && [ -d "$main/node_modules" ] && cp -al "$main/node_modules" node_modules 2>/dev/null; then
    echo "node_modules: Hardlinks aus $main"
  else
    rm -rf node_modules; npm ci --no-audit --no-fund --silent && echo "node_modules: npm ci"
  fi
fi
[ -f "$main/.env.local" ] && [ ! -f .env.local ] && cp "$main/.env.local" .env.local && echo ".env.local kopiert"
npx next typegen >/dev/null 2>&1 || true
mkdir -p "$here/.coordination/findings"

port=$(( 3600 + $(printf '%s' "$here" | cksum | cut -d' ' -f1) % 300 ))
echo "PORT=$port  (Start: AFH_DEMO=1 npx next dev -p $port)"
echo "COORD=$here/.coordination  (im eigenen Worktree; Orchestrator liest von dort)"
