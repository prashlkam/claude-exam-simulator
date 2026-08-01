#!/usr/bin/env bash
#
# Azure App Service startup (PLAN.md §12.4).
#
# Migrations run from the app rather than from CI on purpose: the GitHub runner's IP is
# dynamic, so a CI-side migration would need the SQL firewall allowlisted on every
# deploy. The App Service is already covered by "Allow Azure services", so this just
# works. Seeding is upsert-based and therefore a no-op once the banks are loaded.
#
# Startup command in App Service:  bash /home/site/wwwroot/startup.sh

set -euo pipefail

cd "$(dirname "$0")"

echo "[startup] node $(node --version)"

if [ "${RUN_MIGRATIONS_ON_START:-false}" = "true" ]; then
  echo "[startup] applying migrations"

  # The database may be auto-paused (PLAN.md §12.2); a resume takes 30-60s.
  migrated=false
  for attempt in 1 2 3 4 5; do
    if node_modules/.bin/prisma migrate deploy --schema prisma/schema.prisma; then
      migrated=true
      break
    fi
    echo "[startup] migrate deploy failed (attempt ${attempt}/5) — database may be resuming; retrying in 20s"
    sleep 20
  done

  if [ "$migrated" != "true" ]; then
    echo "[startup] ERROR: migrations did not apply after 5 attempts" >&2
    exit 1
  fi

  # Idempotent: creates 540 questions on a fresh database, no-ops thereafter.
  if [ -f generated/questions.json ]; then
    echo "[startup] seeding question banks"
    node_modules/.bin/tsx prisma/seed.ts || {
      echo "[startup] ERROR: seed failed" >&2
      exit 1
    }
  else
    echo "[startup] WARNING: generated/questions.json missing — skipping seed" >&2
  fi
fi

echo "[startup] starting Next.js on port ${PORT:-3000}"
exec node server.js
