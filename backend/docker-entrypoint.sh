#!/bin/sh
# Container start: bring the schema up to date, seed a fresh database once, then serve the API.
set -e

node schema.js

if node -e "require('./db').sql.query(\"SELECT 1 FROM users WHERE user_id = 'USR-102'\").then((r) => process.exit(r.length ? 0 : 1), () => process.exit(1))"; then
  echo "Database already seeded."
else
  if [ ! -f "${DATASETS_DIR:-/datasets}/outlets.csv" ]; then
    echo "ERROR: the competition datasets are missing."
    echo "Copy the CSV files (outlets.csv, vehicles.csv, calendar.csv, ...) into ./datasets next to docker-compose.yml and run 'docker compose up' again."
    exit 1
  fi
  echo "Fresh database: seeding datasets, accounts and a realistic delivery day..."
  node seed.js
fi

exec node index.js
