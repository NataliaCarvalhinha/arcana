# Arcana

Arcana is a local-first personal learning grimoire. It can run as a static app on GitHub Pages with no paid services, no auth, no backend account, and no server-side storage.

## Architecture

- `index.html`, `styles.css`, `app.js` are the app shell.
- `db.js` is the browser storage layer. IndexedDB is the primary store.
- `manifest.webmanifest` and `service-worker.js` make the app installable/offline-capable.
- `server.py` is optional Arcana Local support for `yt-dlp` playlist sync and the older file-backed vault endpoints.
- `.github/workflows/pages.yml` deploys the static files to GitHub Pages.
- Activity history is centralized in `appState.activityLog`, the local ledger used by study, YouTube, review, hobby, routine, and journal surfaces.

The app migrates old `localStorage` keys into IndexedDB once. Existing `localStorage` data is not deleted automatically.

## Data Model

IndexedDB database: `arcana`

Object stores:

`settings`, `tracks`, `courses`, `modules`, `lessons`, `sources`, `notes`, `fichamentos`, `sessions`, `playlists`, `videos`, `inbox`, `reviews`, `flashcards`, `calendar`, `progress`, `metadata`, `appState`, `backupSnapshots`, `attachments`

The complete app state is stored in `appState/main`. Notes, fichamentos, snapshots, and flashcards are stored separately so the vault can be exported/imported without a server.

`appState.activityLog` is the source of truth for actual activity history. Legacy `sessions` are retained for compatibility and migrated/backfilled into `activityLog` exactly once by `activityLogVersion`. Entries are keyed by stable `source + sourceRecordId` so Focus Circle completions, YouTube completions, hobby sessions, reviews, and manual Registrar records can upsert without duplicates.

Daily Journal and weekly analytics read from `activityLog`; Weekly Routine, free-time planning, hobbies, `weeklyGoals`, and `dailyCheckins` live in `appState` and remain local to the browser profile.

## External Calendars

Arcana can read Google Calendar directly from the browser with the Google read-only Calendar scope. It remains GitHub Pages compatible: there is no backend secret, no refresh token storage, and the access token lives only in the current browser session.

For Toki, sync Toki into Google Calendar first, then connect Google Calendar in `Configuracoes -> Calendario -> Integracao externa`. Arcana imports selected calendars as local busy blocks for free-time planning and calendar display. Event titles and locations are private by default and are cached only if the settings toggle is enabled.

See `docs/calendar-integration.md` for provider details, privacy behavior, and planning rules.

## Backups

Use `Configurações -> Exportar backup` to download a full JSON backup containing app state, notes, fichamentos, flashcards, and metadata needed by Arcana.

Use `Importar backup` to restore. The import prompt supports replace or merge.

Arcana also creates local IndexedDB snapshots and keeps the latest 10. Snapshots stay in the current browser profile only, so exported backups are still the portable copy.

## Knowledge Vault

Use `Exportar Vault para Obsidian` to download `Arcana-Obsidian-Vault-YYYY-MM-DD.zip` with Markdown notes, YAML frontmatter, wiki links, course/module/lesson context, source notes, indexes, and flashcards.

Use `Importar Vault` to restore a ZIP produced by Arcana or to import generic Markdown. The static importer rejects unsafe paths. Direct Obsidian -> Arcana reverse sync is not part of Phase 1.

When running through `server.py`, Settings -> Integracoes -> Obsidian exposes the Obsidian Bridge Phase 1:

- `Conectar Vault` stores the local vault path in `.arcana-local.json`, which is ignored by git.
- `Sincronizar para Obsidian` writes Arcana-managed Markdown directly into that vault.
- Arcana creates the root folders expected by the bridge, including `10 Fichamentos/`, `60 Fontes/`, `80 Flashcards/`, `Tracks/`, `Courses/`, `Arcana Index.md`, and `README - Arcana.md`.
- Arcana only updates files marked with `arcana_managed: true` and the matching stable `arcana_id`. Existing Obsidian files, `Welcome.md`, and `.obsidian/` are preserved.
- No deletion sync runs in Phase 1. Archived Arcana notes are written under `90 Arquivo/`.

Attachments are reserved in `Attachments/`; current browser/local note records do not expose binary attachment blobs for export yet.

## PWA And Offline

The service worker caches the static app shell and keeps the latest successful `data/youtube/catalog.json` response available offline. It does not cache YouTube media or other external resources. IndexedDB data remains local to the browser/profile/device.

## YouTube

Arcana supports two playlist sync modes:

- `Arcana Local`: direct `yt-dlp` sync through `server.py`
- `GitHub Pages`: a public static catalog generated ahead of time by GitHub Actions

### Arcana Local

Automatic playlist sync through the local backend still works with `yt-dlp`:

```bash
./start.sh
```

Then open:

```text
http://127.0.0.1:8765
```

### GitHub Pages Catalog Sync

Browsers on GitHub Pages still cannot run `yt-dlp` directly, so Arcana reads a pre-generated public catalog from `data/youtube/catalog.json`.

Configuration lives in:

- `data/youtube/playlists.json`
- `scripts/sync-youtube.py`
- `.github/workflows/sync-youtube.yml`

The workflow runs daily and can also be triggered manually. It uses `yt-dlp` metadata only, writes public playlist/video metadata to `catalog.json`, and commits that file only when it changes.

Important:

- `data/youtube/catalog.json` is public on GitHub Pages
- keep only public playlist metadata there
- do not place notes, progress, exports, or private vault data under `data/youtube/`

Arcana merges catalog updates into IndexedDB by stable video id, so local progress, notes, and history survive later catalog refreshes.

### Manual Fallbacks

You can still:

- use `Exportar JSON` in the YouTube view to save the active queue;
- import a playlist JSON exported from Arcana Local or another compatible `yt-dlp` JSON flow;
- capture individual YouTube links through Inbox and organize them into the active queue.

Existing playlist progress is preserved when imported/synced again.

## GitHub Pages

1. Create a GitHub repository.
2. Commit this folder.
3. Push to the `main` branch.
4. In GitHub, open `Settings -> Pages`.
5. Select `GitHub Actions` as the source.
6. Push again or run `Deploy Arcana to GitHub Pages` manually.

The URL pattern is:

```text
https://<your-user>.github.io/<repository-name>/
```

## Privacy

The starter app ships empty. Do not commit personal exports, local vault data, cookies, tokens, `.env` files, or `backups/`. The `data/youtube/` folder is now intended for public playlist catalog files only; keep private data elsewhere.

GitHub Pages publishes the app code publicly, not your browser IndexedDB data. Any backup ZIP/JSON you commit or upload elsewhere can contain private notes.
