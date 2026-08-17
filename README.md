# Arcana

Arcana is a local-first personal learning grimoire. It can run as a static app on GitHub Pages with no paid services, no auth, no backend account, and no server-side storage.

## Architecture

- `index.html`, `styles.css`, `app.js` are the app shell.
- `db.js` is the browser storage layer. IndexedDB is the primary store.
- `manifest.webmanifest` and `service-worker.js` make the app installable/offline-capable.
- `server.py` is optional Arcana Local support for `yt-dlp` playlist sync and the older file-backed vault endpoints.
- `.github/workflows/pages.yml` deploys the static files to GitHub Pages.

The app migrates old `localStorage` keys into IndexedDB once. Existing `localStorage` data is not deleted automatically.

## Data Model

IndexedDB database: `arcana`

Object stores:

`settings`, `tracks`, `courses`, `modules`, `lessons`, `sources`, `notes`, `fichamentos`, `sessions`, `playlists`, `videos`, `inbox`, `reviews`, `flashcards`, `calendar`, `progress`, `metadata`, `appState`, `backupSnapshots`, `attachments`

The complete app state is stored in `appState/main`. Notes, fichamentos, snapshots, and flashcards are stored separately so the vault can be exported/imported without a server.

## Backups

Use `Configurações -> Exportar backup` to download a full JSON backup containing app state, notes, fichamentos, flashcards, and metadata needed by Arcana.

Use `Importar backup` to restore. The import prompt supports replace or merge.

Arcana also creates local IndexedDB snapshots and keeps the latest 10. Snapshots stay in the current browser profile only, so exported backups are still the portable copy.

## Knowledge Vault

Use `Exportar vault ZIP` to download an `Arcana-Vault/` ZIP with Markdown notes, YAML frontmatter, wiki links, `index.json`, and flashcards JSON.

Use `Importar vault ZIP` to restore a ZIP produced by Arcana. The static importer rejects unsafe paths and supports the uncompressed ZIPs Arcana exports.

When running through `server.py`, Arcana attempts a one-time bridge from the older local Markdown vault into IndexedDB so the static backup/export tools include those notes.

## PWA And Offline

The service worker caches only the static app shell. It does not cache YouTube media or external resources. IndexedDB data remains local to the browser/profile/device.

## YouTube

Automatic playlist sync uses `yt-dlp` and therefore requires Arcana Local:

```bash
./start.sh
```

Then open:

```text
http://127.0.0.1:8765
```

On GitHub Pages, browsers cannot run `yt-dlp`. Static alternatives:

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

The starter app ships empty. Do not commit personal exports, local vault data, cookies, tokens, `.env` files, `data/`, or `backups/`. `.gitignore` is configured for those paths.

GitHub Pages publishes the app code publicly, not your browser IndexedDB data. Any backup ZIP/JSON you commit or upload elsewhere can contain private notes.
