#!/usr/bin/env python3

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlencode, urlparse


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "data" / "youtube" / "playlists.json"
OUTPUT_PATH = ROOT / "data" / "youtube" / "catalog.json"
YT_DLP = shutil.which("yt-dlp") or "yt-dlp"


@dataclass(frozen=True)
class PlaylistConfig:
    id: str
    name: str
    url: str
    enabled: bool


class CatalogSyncError(RuntimeError):
    pass


def read_config() -> list[PlaylistConfig]:
    try:
        raw = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise CatalogSyncError(f"Missing config file: {CONFIG_PATH}") from exc
    except json.JSONDecodeError as exc:
        raise CatalogSyncError(f"Invalid JSON in {CONFIG_PATH}: {exc}") from exc

    playlists_raw = raw.get("playlists")
    if not isinstance(playlists_raw, list):
        raise CatalogSyncError("Expected data/youtube/playlists.json to contain a playlists array.")

    playlists: list[PlaylistConfig] = []
    for index, entry in enumerate(playlists_raw, start=1):
        if not isinstance(entry, dict):
            raise CatalogSyncError(f"Playlist #{index} must be an object.")
        playlist_id = str(entry.get("id") or "").strip()
        name = str(entry.get("name") or "").strip()
        url = str(entry.get("url") or "").strip()
        enabled = bool(entry.get("enabled", True))
        if not playlist_id:
            raise CatalogSyncError(f"Playlist #{index} is missing an id.")
        if not name:
            raise CatalogSyncError(f"Playlist {playlist_id} is missing a name.")
        normalized_id, normalized_url = normalize_playlist(playlist_id, url)
        playlists.append(PlaylistConfig(id=normalized_id, name=name, url=normalized_url, enabled=enabled))
    return playlists


def normalize_playlist(playlist_id: str, url: str) -> tuple[str, str]:
    parsed = urlparse(url or "")
    query_id = (parse_qs(parsed.query).get("list") or [playlist_id])[0].strip()
    normalized_id = query_id or playlist_id.strip()
    if not normalized_id:
        raise CatalogSyncError("Playlist id cannot be empty.")
    normalized_url = "https://www.youtube.com/playlist?" + urlencode({"list": normalized_id})
    return normalized_id, normalized_url


def run_ytdlp(args: list[str]) -> Any:
    command = [YT_DLP, "--skip-download", "--ignore-errors", "--no-warnings", *args]
    try:
        completed = subprocess.run(
            command,
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
            timeout=240,
        )
    except FileNotFoundError as exc:
        raise CatalogSyncError("yt-dlp is not installed or not available on PATH.") from exc
    except subprocess.CalledProcessError as exc:
        stderr = (exc.stderr or exc.stdout or "yt-dlp failed").strip()
        raise CatalogSyncError(stderr[-900:]) from exc
    except subprocess.TimeoutExpired as exc:
        raise CatalogSyncError("yt-dlp timed out while fetching playlist metadata.") from exc

    stdout = (completed.stdout or "").strip()
    if not stdout:
        raise CatalogSyncError("yt-dlp returned no metadata.")
    try:
        return json.loads(stdout)
    except json.JSONDecodeError as exc:
        raise CatalogSyncError("yt-dlp returned invalid JSON.") from exc


def entry_video_id(entry: dict[str, Any]) -> str:
    for key in ("id", "url", "webpage_url", "original_url"):
        value = str(entry.get(key) or "").strip()
        if not value:
            continue
        if len(value) >= 11 and "://" not in value and "/" not in value and "=" not in value:
            return value
        parsed = urlparse(value)
        query = parse_qs(parsed.query)
        candidate = (query.get("v") or [""])[0].strip()
        if candidate:
            return candidate
        if "youtu.be" in parsed.netloc and parsed.path.strip("/"):
            return parsed.path.strip("/")
    return ""


def entry_thumbnail(entry: dict[str, Any]) -> str:
    thumbs = entry.get("thumbnails")
    if isinstance(thumbs, list):
        for thumb in reversed(thumbs):
            if isinstance(thumb, dict) and thumb.get("url"):
                return str(thumb["url"]).strip()
    for key in ("thumbnail",):
        value = str(entry.get(key) or "").strip()
        if value:
            return value
    return ""


def duration_from_string(value: Any) -> int:
    raw = str(value or "").strip()
    if not raw:
        return 0
    parts = raw.split(":")
    if not parts or any(not part.isdigit() for part in parts):
        return 0
    total = 0
    for part in parts:
        total = (total * 60) + int(part)
    return total


def enrich_video(video_id: str) -> dict[str, Any]:
    return run_ytdlp(["--dump-single-json", f"https://www.youtube.com/watch?v={video_id}"])


def extract_playlist(playlist: PlaylistConfig) -> dict[str, Any]:
    data = run_ytdlp(["--flat-playlist", "--dump-single-json", playlist.url])
    entries = data.get("entries")
    if not isinstance(entries, list):
        raise CatalogSyncError(f"Playlist {playlist.id} returned no entries array.")

    videos: list[dict[str, Any]] = []
    for position, entry in enumerate(entries, start=1):
        if not isinstance(entry, dict):
            continue
        video_id = entry_video_id(entry)
        title = str(entry.get("title") or "").strip()
        if not video_id or not title:
            continue
        url = str(entry.get("webpage_url") or entry.get("url") or f"https://www.youtube.com/watch?v={video_id}").strip()
        if "://" not in url:
            url = f"https://www.youtube.com/watch?v={video_id}"
        channel = str(entry.get("channel") or entry.get("uploader") or "YouTube").strip() or "YouTube"
        duration = int(entry.get("duration") or 0) or duration_from_string(entry.get("duration_string"))
        thumbnail = entry_thumbnail(entry) or f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
        if duration <= 0:
            try:
                details = enrich_video(video_id)
            except CatalogSyncError:
                details = {}
            title = str(details.get("title") or title).strip() or title
            channel = str(details.get("channel") or details.get("uploader") or channel or "YouTube").strip() or "YouTube"
            duration = int(details.get("duration") or duration or 0)
            detail_url = str(details.get("webpage_url") or details.get("original_url") or "").strip()
            if detail_url:
                url = detail_url
            thumbnail = entry_thumbnail(details) or thumbnail
        videos.append(
            {
                "id": video_id,
                "title": title,
                "url": url,
                "channel": channel or "YouTube",
                "duration": duration if duration > 0 else 0,
                "position": position,
                "thumbnail": thumbnail,
            }
        )

    if not videos:
        raise CatalogSyncError(f"Playlist {playlist.id} returned zero videos; keeping previous catalog.")

    return {
        "id": playlist.id,
        "name": playlist.name,
        "url": playlist.url,
        "videos": videos,
    }


def build_catalog(playlists: list[PlaylistConfig]) -> dict[str, Any]:
    enabled = [playlist for playlist in playlists if playlist.enabled]
    if not enabled:
        raise CatalogSyncError("No enabled playlists were found in data/youtube/playlists.json.")

    catalog_playlists = [extract_playlist(playlist) for playlist in enabled]
    return {
        "version": 1,
        "generatedAt": None,
        "playlists": catalog_playlists,
    }


def write_catalog(catalog: dict[str, Any]) -> None:
    catalog["generatedAt"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(catalog, ensure_ascii=False, indent=2) + "\n"
    tmp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=OUTPUT_PATH.parent, delete=False) as handle:
            handle.write(payload)
            tmp_path = Path(handle.name)
        tmp_path.replace(OUTPUT_PATH)
    finally:
        if tmp_path and tmp_path.exists():
            tmp_path.unlink(missing_ok=True)


def main() -> int:
    try:
        playlists = read_config()
        catalog = build_catalog(playlists)
        write_catalog(catalog)
    except CatalogSyncError as exc:
        print(f"[sync-youtube] {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
