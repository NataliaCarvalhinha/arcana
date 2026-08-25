# Arcana Local Obsidian Bridge

The GitHub Pages app cannot write to a local Obsidian vault directly. The Arcana Local Obsidian Bridge is the local `server.py` process that exposes a small loopback API at `http://127.0.0.1:8765` so the production app can safely push Arcana-managed Markdown into the vault configured on this computer.

## Start The Bridge

From the project folder:

```bash
python3 server.py
```

The bridge serves the local Arcana app and the bridge API on the same loopback port. To show the pairing code:

```bash
python3 server.py --pairing-code
```

The pairing code is stored in `.arcana-local.json`, which is ignored by git. Do not paste it into issue reports, URLs, screenshots, commits, or exported backups.

## Connect From Arcana

1. Open Arcana on GitHub Pages.
2. Go to Settings -> Integracoes -> Obsidian.
3. Use `Conectar bridge local`.
4. Paste the pairing code from the local bridge.
5. Use `Sincronizar tudo para Obsidian` or enable autosync after study sessions.

If the bridge is stopped, unpaired, or has no vault configured, production shows `Bridge local indisponível` and disables direct sync. `Baixar Vault ZIP` remains available and exports the same Markdown projection without requiring a local bridge.

## Local Vault Setup

The vault path is configured only from the local Arcana app served by `server.py`. GitHub Pages may pair with an already configured bridge, but it must not set or change an arbitrary local vault path.

The local config records the vault name/path and bridge token. It is machine-private and excluded from source control and portable backups.

## Bridge API

`GET /api/bridge/status` identifies the bridge with:

```json
{
  "ok": true,
  "bridge": "arcana-obsidian",
  "version": 1,
  "bridgeApiVersion": 1,
  "vaultConnected": true,
  "vaultName": "My Vault",
  "capabilities": ["obsidian-push", "obsidian-open"]
}
```

Arcana verifies the identity before enabling writes. Write requests use `X-Arcana-Bridge-Token`; the token is never sent in query strings.

Allowed browser origins are intentionally narrow:

- `https://nataliacarvalhinha.github.io`
- `http://127.0.0.1:8765`
- `http://localhost:8765`

Other origins are rejected, and bridge responses do not use wildcard CORS for writes.

## Write Safety

The bridge accepts Arcana's normalized Obsidian export payload, the same shape used by the ZIP exporter. IndexedDB remains the source of truth; the bridge does not store Arcana state.

When syncing, the bridge:

- writes only inside the configured vault after resolving paths;
- rejects path traversal and symlink escape attempts;
- writes atomically through temporary files and `os.replace`;
- refuses unmanaged collisions instead of overwriting personal notes;
- tracks stable `arcana_id` metadata for safe renames;
- skips unchanged files by content hash;
- preserves manual Obsidian text outside Arcana-managed generated regions when updating managed notes.

Arcana-managed content is marked with YAML frontmatter and generated-region comments. Manual notes, `.obsidian/`, `Welcome.md`, and other unmanaged files remain outside Arcana control.

## Offline And Pending Sync

Arcana stores pending sync status in IndexedDB. Knowledge extraction confirmations, knowledge edits, and completed study sessions first persist Arcana data, then mark Obsidian sync as pending. If the bridge is available, paired, connected, and autosync is enabled, Arcana pushes after the session; otherwise the pending state remains until the next manual sync.

The service worker must not cache bridge API responses. Bridge calls are made with `cache: "no-store"` against loopback.

## Obsidian Open

When a configured vault name is available, the bridge can expose an `obsidian://open?vault=...` URL for convenience. Opening Obsidian is optional and does not grant write permission; writes still require the pairing token.
