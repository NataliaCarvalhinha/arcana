# Arcana Data Safety

Arcana production data lives in browser storage for the GitHub Pages origin:
`https://nataliacarvalhinha.github.io/arcana/`. Deploys, service-worker cache
updates, and rollbacks change static files only. They must never delete,
replace, or silently reset IndexedDB data.

## Production Checklist

- Run `node --check app.js`, `node --check db.js`,
  `node --check service-worker.js`, `node tests/static-tests.mjs`,
  `node tests/data-safety-tests.mjs`, and `git diff --check`.
- Confirm `service-worker.js` does not access `indexedDB`, `localStorage`, or
  `sessionStorage`.
- Confirm app code does not call `localStorage.clear()` or
  `sessionStorage.clear()`.
- Confirm database code does not call `indexedDB.deleteDatabase()`.
- Only explicit user-confirmed replace imports may clear object stores, and
  those clears must be inside the same transaction that writes replacement data.
- State migrations must validate shape, preserve unknown fields, preserve stable
  IDs, and create a protected pre-migration snapshot before saving migrated
  state.
- If static assets changed, bump the service-worker cache version.
- Confirm portable exports exclude `.arcana-local.json` data, local Obsidian
  vault paths, bridge pairing tokens, and other credentials.
- Confirm the service worker does not cache `/api/bridge/*` or `/api/obsidian/*`
  responses.

## Obsidian Bridge

IndexedDB remains Arcana's source of truth. The local Obsidian bridge is a
machine-local writer for the normalized Arcana Markdown export payload; it does
not store Arcana application state.

Production Arcana may pair with an already configured loopback bridge, but it
must not set an arbitrary vault path from GitHub Pages. Bridge writes require the
pairing token in `X-Arcana-Bridge-Token`, strict origin checks, and vault path
validation. The token must never be sent in a query string.

Full backups may keep Obsidian sync status, pending counts, and last sync
metadata, but they must exclude the absolute vault path, pairing token, bridge
token, credentials, and private local config.

## Recovery

If startup finds unreadable or unsafe state, Arcana shows a recovery panel
instead of creating a fresh profile. Use it to export the raw stored state, retry
startup, or restore a protected snapshot. Full backup imports remain available
from Settings and create a protected snapshot before replacing current data.
