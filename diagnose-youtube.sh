#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${ARCANA_URL:-http://127.0.0.1:8765}"
PLAYLIST_URL="${1:-https://youtube.com/playlist?list=PLNur2Ccbfc5k&si=NshejZYaJ3tQjxPF}"
PYTHON="${PYTHON:-.venv/bin/python}"

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

pass() {
  printf 'PASS %s\n' "$1"
}

fail() {
  printf 'FAIL %s\n' "$1"
  exit 1
}

curl -fsS "$BASE_URL/health" >"$tmp" || fail "server health endpoint is unavailable at $BASE_URL"
"$PYTHON" - "$tmp" <<'PY' || fail "health endpoint did not return ok=true"
import json, sys
data=json.load(open(sys.argv[1], encoding="utf-8"))
raise SystemExit(0 if data.get("ok") is True else 1)
PY
pass "server is reachable"

curl -fsS "$BASE_URL/api/diagnostics/youtube" >"$tmp" || fail "YouTube diagnostics endpoint failed"
"$PYTHON" - "$tmp" <<'PY' || fail "yt-dlp is not available to the server"
import json, sys
data=json.load(open(sys.argv[1], encoding="utf-8"))
print(f"yt-dlp {data.get('ytDlpVersion') or 'unknown'} / python {data.get('python') or 'unknown'}")
raise SystemExit(0 if data.get("ok") and data.get("ytDlpAvailable") else 1)
PY
pass "yt-dlp is available"

curl -fsSG --data-urlencode "url=$PLAYLIST_URL" "$BASE_URL/api/playlist" >"$tmp" || fail "playlist sync endpoint failed"
"$PYTHON" - "$tmp" <<'PY' || fail "playlist returned no videos"
import json, sys
data=json.load(open(sys.argv[1], encoding="utf-8"))
items=data.get("items") or []
print(f"playlistId={data.get('playlistId') or ''}")
print(f"title={data.get('title') or ''}")
print(f"items={len(items)}")
if items:
    first=items[0]
    print(f"first={first.get('title') or ''}")
raise SystemExit(0 if items else 1)
PY
pass "playlist returned videos"
