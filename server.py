#!/usr/bin/env python3
import io, json, os, re, subprocess, sys, unicodedata, uuid, zipfile
from datetime import datetime
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, quote, unquote, urlencode, urlparse
from pathlib import Path

ROOT=Path(__file__).resolve().parent
BACKUPS=ROOT/"backups"
DATA=ROOT/"data"
LOCAL_CONFIG_PATH=ROOT/".arcana-local.json"
NOTE_ROOT=DATA/"notes"
SOURCE_ROOT=DATA/"sources"
FLASHCARD_ROOT=DATA/"flashcards"
REVIEW_ROOT=DATA/"reviews"
ATTACHMENT_ROOT=DATA/"attachments"
INDEX_PATH=DATA/"index.json"
HOST="127.0.0.1"
PORT=int(os.environ.get("ARCANA_PORT","8765"))
PLAYLIST_ID_RE=re.compile(r"^[A-Za-z0-9_-]{8,}$")
SAFE_ID_RE=re.compile(r"^[A-Za-z0-9_-]+$")
WIKI_LINK_RE=re.compile(r"\[\[([^\]\|#]+)(?:[|#][^\]]*)?\]\]")
INLINE_TAG_RE=re.compile(r"(^|\s)#([A-Za-z0-9_/-]+)")
NOTE_DIRS=("literature","permanent","sessions","quick","archive")
IDEA_TYPES={"permanent","concept","question","insight","quote","reference","next_action"}
NOTE_TYPES=IDEA_TYPES|{"literature","session","quick"}
OBSIDIAN_AUTO_SYNC={"manual","after_note_save","after_session","every_5_minutes"}
OBSIDIAN_DIRS=(
    "00 Inbox",
    "10 Fichamentos/Cursos",
    "10 Fichamentos/Livros",
    "10 Fichamentos/Papers",
    "10 Fichamentos/Artigos",
    "10 Fichamentos/Videos",
    "10 Fichamentos/Podcasts",
    "10 Fichamentos/Outros",
    "20 Notas Permanentes",
    "30 Conceitos",
    "40 Perguntas",
    "50 Sessões",
    "60 Fontes",
    "70 Revisões",
    "80 Flashcards",
    "90 Arquivo",
    "Attachments",
    "Templates",
)

class PlaylistInputError(ValueError):
    pass

def log(message, error=False):
    prefix="[Arcana][YouTube]"
    stream=sys.stderr if error else sys.stdout
    print(f"{prefix} {message}", file=stream, flush=True)

def ytdlp():
    p=ROOT/".venv"/"bin"/"yt-dlp"
    return [str(p)] if p.exists() else [sys.executable,"-m","yt_dlp"]

def normalize_playlist_url(raw):
    raw=(raw or "").strip()
    if not raw:
        raise PlaylistInputError("URL não informada.")
    if "://" not in raw:
        raw="https://"+raw

    parsed=urlparse(raw)
    host=parsed.netloc.lower().split("@")[-1].split(":")[0]
    if host not in {"youtube.com","www.youtube.com","m.youtube.com"}:
        raise PlaylistInputError("Use uma URL de playlist do YouTube.")

    playlist_id=(parse_qs(parsed.query).get("list") or [""])[0].strip()
    if not playlist_id:
        raise PlaylistInputError("A URL precisa conter o parâmetro list da playlist.")
    if not PLAYLIST_ID_RE.match(playlist_id):
        raise PlaylistInputError("ID de playlist inválido.")

    clean="https://www.youtube.com/playlist?"+urlencode({"list":playlist_id})
    return playlist_id, clean

def json_loads_stdout(stdout):
    text=stdout.strip()
    if not text:
        raise RuntimeError("O yt-dlp não retornou dados da playlist.")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start=text.find("{")
        end=text.rfind("}")
        if start>=0 and end>start:
            return json.loads(text[start:end+1])
        raise RuntimeError("Resposta inválida do yt-dlp.")

def run_ytdlp(args, timeout=180):
    cmd=ytdlp()+args
    try:
        p=subprocess.run(cmd,cwd=ROOT,capture_output=True,text=True,timeout=timeout)
    except subprocess.TimeoutExpired:
        raise RuntimeError("A sincronização demorou demais.")
    except FileNotFoundError:
        raise RuntimeError("yt-dlp não encontrado. Rode ./start.sh para preparar o ambiente.")
    if p.stderr.strip():
        log(p.stderr.strip()[-1200:], error=p.returncode!=0)
    if p.returncode!=0 and not p.stdout.strip():
        raise RuntimeError((p.stderr or "Falha ao ler playlist.")[-700:])
    return p

def yt_dlp_version():
    try:
        p=subprocess.run(ytdlp()+["--version"],cwd=ROOT,capture_output=True,text=True,timeout=20)
    except Exception:
        return ""
    if p.returncode!=0:
        return ""
    return p.stdout.strip()

def entry_thumbnail(entry):
    thumbs=entry.get("thumbnails") or []
    if thumbs:
        thumb=thumbs[-1] or {}
        return thumb.get("url") or entry.get("thumbnail") or ""
    return entry.get("thumbnail") or ""

def entry_video_id(entry):
    vid=entry.get("id") or ""
    if vid:
        return str(vid)
    url=entry.get("url") or entry.get("webpage_url") or ""
    try:
        parsed=urlparse(str(url))
        if "youtu.be" in parsed.netloc:
            return parsed.path.strip("/")
        if "youtube.com" in parsed.netloc:
            return (parse_qs(parsed.query).get("v") or [""])[0]
    except Exception:
        return ""
    return ""

def sync_playlist(url):
    playlist_id, clean_url=normalize_playlist_url(url)
    version=yt_dlp_version()
    log(f"Sync requested: {playlist_id}")
    log(f"yt-dlp version: {version or 'indisponível'}")
    p=run_ytdlp(["--flat-playlist","--dump-single-json","--skip-download","--ignore-errors",clean_url])
    data=json_loads_stdout(p.stdout)
    out=[]
    for e in data.get("entries") or []:
        if not e:
            continue
        vid=entry_video_id(e)
        title=e.get("title") or e.get("fulltitle")
        if not vid or not title:
            continue
        url2=e.get("webpage_url") or e.get("url")
        if not url2 or not str(url2).startswith("http"):
            url2=f"https://www.youtube.com/watch?v={vid}"
        dur=e.get("duration")
        try:
            dur=int(round(float(dur))) if dur is not None else None
        except Exception:
            dur=None
        out.append({"videoId":str(vid),"title":str(title),"url":str(url2),"channel":e.get("channel") or e.get("uploader") or "YouTube","thumbnail":entry_thumbnail(e),"durationSeconds":dur})
    log(f"Extracted {len(out)} valid videos from {playlist_id}")
    return {"title":data.get("title") or "Playlist","playlistId":playlist_id,"items":out}

def youtube_diagnostics():
    version=yt_dlp_version()
    return {"ok":bool(version),"ytDlpAvailable":bool(version),"ytDlpVersion":version,"python":sys.version.split()[0],"server":"Arcana v5"}

def now_iso():
    return datetime.now().astimezone().isoformat(timespec="seconds")

def ensure_vault():
    for p in [NOTE_ROOT/"literature",NOTE_ROOT/"permanent",NOTE_ROOT/"sessions",NOTE_ROOT/"quick",NOTE_ROOT/"archive",SOURCE_ROOT,ATTACHMENT_ROOT,FLASHCARD_ROOT,REVIEW_ROOT]:
        p.mkdir(parents=True,exist_ok=True)
    if not INDEX_PATH.exists():
        write_index({"notes":{},"sources":{},"flashcards":{},"tags":{},"backlinks":{},"graph":{"nodes":[],"edges":[]},"rebuiltAt":now_iso()})

def atomic_write(path, text):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    with tmp.open("w",encoding="utf-8",newline="\n") as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp,path)

def atomic_write_bytes(path, data):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    with tmp.open("wb") as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp,path)

def slugify(text, fallback="note"):
    text=unicodedata.normalize("NFKD",str(text or "")).encode("ascii","ignore").decode("ascii")
    text=re.sub(r"[^a-zA-Z0-9]+","-",text).strip("-").lower()
    return text or fallback

def yaml_scalar(value):
    if value is None:
        return '""'
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    text=str(value).replace("\r", " ").replace("\n", " ").strip()
    if not text:
        return '""'
    if re.search(r'[:#\[\]\{\},]|^\s|\s$', text):
        return json.dumps(text, ensure_ascii=False)
    return text

def note_folder(note_type, status=None):
    if status=="archived":
        return NOTE_ROOT/"archive"
    if note_type=="literature":
        return NOTE_ROOT/"literature"
    if note_type=="session":
        return NOTE_ROOT/"sessions"
    if note_type=="quick":
        return NOTE_ROOT/"quick"
    return NOTE_ROOT/"permanent"

def rel(path):
    return path.relative_to(DATA).as_posix()

def parse_frontmatter(text):
    if not text.startswith("---\n"):
        return {}, text
    end=text.find("\n---",4)
    if end<0:
        return {}, text
    raw=text[4:end].strip().splitlines()
    meta={}
    i=0
    while i<len(raw):
        line=raw[i]
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            i+=1
            continue
        key, val=line.split(":",1)
        key=key.strip()
        val=val.strip()
        if val in {"", "[]"}:
            items=[]
            while i+1<len(raw) and raw[i+1].startswith("  - "):
                i+=1
                items.append(raw[i][4:].strip().strip("\"'"))
            meta[key]=items
            i+=1
            continue
        try:
            meta[key]=json.loads(val)
        except Exception:
            if val.lower()=="true":
                meta[key]=True
            elif val.lower()=="false":
                meta[key]=False
            elif val.lower()=="null":
                meta[key]=None
            else:
                meta[key]=val.strip("\"'")
        i+=1
    body=text[end+4:]
    if body.startswith("\n"):
        body=body[1:]
    return meta, body

def dump_frontmatter(meta, content):
    keys=["id","title","type","trackId","sourceType","sourceId","sessionId","tags","createdAt","updatedAt","favorite","reviewAt","status","relatedNoteIds","source","citations","readingProgress"]
    lines=["---"]
    for k in keys:
        v=meta.get(k)
        if v is None:
            lines.append(f"{k}: null")
        else:
            lines.append(f"{k}: {json.dumps(v,ensure_ascii=False)}")
    lines.append("---")
    return "\n".join(lines).rstrip()+"\n\n"+(content or "").lstrip()

def default_note(data=None):
    data=data or {}
    t=data.get("type") or "quick"
    if t not in NOTE_TYPES:
        t="quick"
    title=(data.get("title") or "Untitled Note").strip()
    ts=now_iso()
    return {
        "id":data.get("id") or f"note_{uuid.uuid4().hex[:8]}",
        "title":title,
        "type":t,
        "content":data.get("content") or "",
        "tags":data.get("tags") if isinstance(data.get("tags"),list) else [],
        "trackId":data.get("trackId"),
        "sourceType":data.get("sourceType"),
        "sourceId":data.get("sourceId"),
        "sessionId":data.get("sessionId"),
        "createdAt":data.get("createdAt") or ts,
        "updatedAt":data.get("updatedAt") or ts,
        "favorite":bool(data.get("favorite",False)),
        "reviewAt":data.get("reviewAt"),
        "status":data.get("status") or "active",
        "relatedNoteIds":data.get("relatedNoteIds") if isinstance(data.get("relatedNoteIds"),list) else [],
        "source":data.get("source") if isinstance(data.get("source"),dict) else {},
        "citations":data.get("citations") if isinstance(data.get("citations"),list) else [],
        "readingProgress":data.get("readingProgress") if isinstance(data.get("readingProgress"),dict) else {}
    }

def unique_note_path(title, note_type, status=None, current=None):
    folder=note_folder(note_type,status)
    base=slugify(title)
    path=folder/f"{base}.md"
    if current and path.resolve()==current.resolve():
        return path
    n=2
    while path.exists() and (not current or path.resolve()!=current.resolve()):
        path=folder/f"{base}-{n}.md"
        n+=1
    return path

def read_note_file(path):
    text=path.read_text(encoding="utf-8")
    meta, content=parse_frontmatter(text)
    note=default_note({**meta,"content":content})
    note["file"]=rel(path)
    note["tags"]=sorted(set((note.get("tags") or [])+[x[1].strip() for x in INLINE_TAG_RE.findall(content) if x[1].strip()]))
    note["links"]=sorted(set(x.strip() for x in WIKI_LINK_RE.findall(content) if x.strip()))
    note["excerpt"]=re.sub(r"\s+"," ",content).strip()[:220]
    return note

def load_local_config():
    default={"obsidian":{"connected":False,"vaultPath":"","vaultName":"","lastSyncAt":None,"autoSync":"after_session","tracked":{},"conflicts":[]}}
    if not LOCAL_CONFIG_PATH.exists():
        return default
    try:
        data=json.loads(LOCAL_CONFIG_PATH.read_text(encoding="utf-8"))
    except Exception:
        return default
    obs={**default["obsidian"],**(data.get("obsidian") if isinstance(data.get("obsidian"),dict) else {})}
    if obs.get("autoSync") not in OBSIDIAN_AUTO_SYNC:
        obs["autoSync"]="after_session"
    if not isinstance(obs.get("tracked"),dict):
        obs["tracked"]={}
    if not isinstance(obs.get("conflicts"),list):
        obs["conflicts"]=[]
    return {"obsidian":obs}

def save_local_config(config):
    atomic_write(LOCAL_CONFIG_PATH,json.dumps(config,ensure_ascii=False,indent=2))

def obsidian_config():
    return load_local_config()["obsidian"]

def update_obsidian_config(**updates):
    config=load_local_config()
    current={**config["obsidian"],**updates}
    if current.get("autoSync") not in OBSIDIAN_AUTO_SYNC:
        current["autoSync"]="after_session"
    if not isinstance(current.get("tracked"),dict):
        current["tracked"]={}
    if not isinstance(current.get("conflicts"),list):
        current["conflicts"]=[]
    config["obsidian"]=current
    save_local_config(config)
    return current

def resolve_vault_path(raw_path):
    raw=(raw_path or "").strip()
    if not raw:
        raise ValueError("Informe o caminho da pasta do vault.")
    path=Path(os.path.expanduser(raw))
    if not path.is_absolute():
        path=(ROOT/path)
    return path.resolve()

def ensure_within(root, candidate):
    root=root.resolve()
    path=candidate.resolve()
    if path==root or root in path.parents:
        return path
    raise ValueError("Caminho fora do vault configurado.")

def obsidian_literature_folder(source_type=None):
    kind=str(source_type or "").lower()
    if kind=="course":
        return "Cursos"
    if kind in {"book","reading"}:
        return "Livros"
    if kind=="paper":
        return "Papers"
    if kind=="article":
        return "Artigos"
    if kind=="video":
        return "Videos"
    if kind=="podcast":
        return "Podcasts"
    return "Outros"

def obsidian_note_folder(note):
    if note.get("status")=="archived":
        return "90 Arquivo"
    note_type=note.get("type")
    if note_type=="quick":
        return "00 Inbox"
    if note_type=="literature":
        return f"10 Fichamentos/{obsidian_literature_folder(note.get('sourceType'))}"
    if note_type=="concept":
        return "30 Conceitos"
    if note_type=="question":
        return "40 Perguntas"
    if note_type=="session":
        return "50 Sessões"
    if note_type=="reference":
        return "60 Fontes"
    return "20 Notas Permanentes"

def obsidian_note_relative_path(note):
    return Path(obsidian_note_folder(note))/f"{slugify(note.get('title') or 'note')}-{note['id']}.md"

def dump_obsidian_markdown(note):
    tags=sorted(set((note.get("tags") or [])+[x[1].strip() for x in INLINE_TAG_RE.findall(note.get("content") or "") if x[1].strip()]))
    source=note.get("source") if isinstance(note.get("source"),dict) else {}
    lines=[
        "---",
        f"arcana_id: {yaml_scalar(note.get('id'))}",
        "arcana_managed: true",
        f"title: {yaml_scalar(note.get('title'))}",
        f"type: {yaml_scalar(note.get('type'))}",
        f"track: {yaml_scalar(note.get('trackId') or '')}",
        "tags:",
    ]
    if tags:
        for tag in tags:
            lines.append(f"  - {yaml_scalar(tag)}")
    else:
        lines.append("  []")
    lines.extend([
        f"source: {json.dumps(source, ensure_ascii=False)}",
        f"source_type: {yaml_scalar(note.get('sourceType') or '')}",
        f"source_id: {yaml_scalar(note.get('sourceId') or '')}",
        f"session_id: {yaml_scalar(note.get('sessionId') or '')}",
        f"created: {yaml_scalar(note.get('createdAt'))}",
        f"updated: {yaml_scalar(note.get('updatedAt'))}",
        f"review_at: {yaml_scalar(note.get('reviewAt') or '')}",
        f"status: {yaml_scalar(note.get('status') or 'active')}",
        f"favorite: {'true' if note.get('favorite') else 'false'}",
        "---",
        "",
        (note.get("content") or f"# {note.get('title') or 'Nota'}").lstrip(),
    ])
    return "\n".join(lines).rstrip()+"\n"

def obsidian_title_from_content(content, fallback):
    first=(content or "").strip().splitlines()
    if first and first[0].startswith("# "):
        return first[0][2:].strip() or fallback
    return fallback

def should_skip_obsidian_file(path, meta):
    rel=path.as_posix()
    if "/Templates/" in rel:
        return True
    if path.name in {"Arcana Index.md","README.md"}:
        return True
    if str(meta.get("arcana_kind") or "") in {"index","template","track_index"}:
        return True
    if "/80 Flashcards/" in rel:
        return True
    return False

def obsidian_note_type_from_path(path, meta):
    if meta.get("type") in NOTE_TYPES:
        return meta["type"]
    rel=path.as_posix()
    if "/10 Fichamentos/" in rel:
        return "literature"
    if "/00 Inbox/" in rel:
        return "quick"
    if "/30 Conceitos/" in rel:
        return "concept"
    if "/40 Perguntas/" in rel:
        return "question"
    if "/50 Sessões/" in rel:
        return "session"
    if "/60 Fontes/" in rel:
        return "reference"
    return "permanent"

def obsidian_source_type_from_path(path, meta):
    if meta.get("source_type") or meta.get("sourceType"):
        return meta.get("source_type") or meta.get("sourceType")
    rel=path.as_posix()
    if "/10 Fichamentos/Cursos/" in rel:
        return "course"
    if "/10 Fichamentos/Livros/" in rel:
        return "book"
    if "/10 Fichamentos/Papers/" in rel:
        return "paper"
    if "/10 Fichamentos/Artigos/" in rel:
        return "article"
    if "/10 Fichamentos/Videos/" in rel:
        return "video"
    if "/10 Fichamentos/Podcasts/" in rel:
        return "podcast"
    return None

def parse_source_field(value):
    if isinstance(value, dict):
        return value
    if isinstance(value, str) and value.strip():
        try:
            return json.loads(value)
        except Exception:
            return {"label":value}
    return {}

def import_obsidian_note(path, vault_root, tracked_paths=None):
    tracked_paths=tracked_paths or {}
    text=path.read_text(encoding="utf-8")
    meta, content=parse_frontmatter(text)
    if should_skip_obsidian_file(path.relative_to(vault_root), meta):
        return None
    title=meta.get("title") or obsidian_title_from_content(content, path.stem.rsplit("-",1)[0].replace("-", " "))
    inline_tags=[match[1].strip() for match in INLINE_TAG_RE.findall(content) if match[1].strip()]
    note_id=meta.get("arcana_id") or meta.get("id") or tracked_paths.get(path.relative_to(vault_root).as_posix())
    note={
        "id":note_id,
        "title":title.strip() or "Nota importada",
        "type":obsidian_note_type_from_path(path.relative_to(vault_root), meta),
        "content":content,
        "tags":sorted(set((meta.get("tags") if isinstance(meta.get("tags"),list) else [])+inline_tags)),
        "trackId":meta.get("track") or meta.get("trackId"),
        "sourceType":obsidian_source_type_from_path(path.relative_to(vault_root), meta),
        "sourceId":meta.get("source_id") or meta.get("sourceId"),
        "sessionId":meta.get("session_id") or meta.get("sessionId"),
        "createdAt":meta.get("created") or meta.get("createdAt") or datetime.fromtimestamp(path.stat().st_mtime).astimezone().isoformat(timespec="seconds"),
        "updatedAt":meta.get("updated") or meta.get("updatedAt") or datetime.fromtimestamp(path.stat().st_mtime).astimezone().isoformat(timespec="seconds"),
        "favorite":bool(meta.get("favorite", False)),
        "reviewAt":meta.get("review_at") or meta.get("reviewAt"),
        "status":meta.get("status") or ("archived" if "90 Arquivo" in path.parts else "active"),
        "source":parse_source_field(meta.get("source")),
    }
    return default_note(note)

def iter_arcana_notes():
    notes=[]
    ensure_vault()
    for folder in NOTE_DIRS:
        for path in sorted((NOTE_ROOT/folder).glob("*.md")):
            try:
                notes.append(read_note_file(path))
            except Exception:
                pass
    return notes

def ensure_obsidian_vault_structure(vault_root, notes=None):
    vault_root.mkdir(parents=True, exist_ok=True)
    for rel_dir in OBSIDIAN_DIRS:
        (vault_root/rel_dir).mkdir(parents=True, exist_ok=True)
    notes=notes or iter_arcana_notes()
    atomic_write(ensure_within(vault_root, vault_root/"Arcana Index.md"), obsidian_index_markdown(notes))
    atomic_write(ensure_within(vault_root, vault_root/"README.md"), "\n".join([
        "# Arcana + Obsidian",
        "",
        "Vault gerado pelo Arcana em Markdown padrão e compatível com Obsidian.",
        "",
        "- `Arcana Index.md` resume as notas gerenciadas.",
        "- `Templates/` inclui modelos iniciais.",
        "- `Attachments/` é reservado para anexos relativos.",
    ]))
    atomic_write(ensure_within(vault_root, vault_root/"Templates/Permanent Note.md"), "---\narcana_kind: template\ntype: permanent\n---\n\n# Nova nota permanente\n\n## Ideia atômica\n\n\n## Conexões\n\n- [[Outra nota]]\n")
    atomic_write(ensure_within(vault_root, vault_root/"Templates/Fichamento.md"), "---\narcana_kind: template\ntype: literature\n---\n\n# Novo fichamento\n\n## Dados da fonte\n\n- Tipo:\n- Autor/canal:\n- URL/ISBN/DOI:\n\n## Resumo\n\n\n## Citações\n\n- \n")
    atomic_write(ensure_within(vault_root, vault_root/"Templates/Session Note.md"), "---\narcana_kind: template\ntype: session\n---\n\n# Sessão\n\n## Registro\n\n\n## Conceitos\n\n\n## Próximas ações\n\n- [ ] \n")
    tracks={}
    for note in notes:
        if note.get("trackId"):
            tracks.setdefault(note["trackId"], []).append(note)
    for track_id, items in tracks.items():
        atomic_write(ensure_within(vault_root, vault_root/"60 Fontes"/f"track-{slugify(track_id)}.md"), "\n".join([
            "---",
            "arcana_kind: track_index",
            f"track: {yaml_scalar(track_id)}",
            "---",
            "",
            f"# Track {track_id}",
            "",
            *[f"- [[{note['title']}]]" for note in sorted(items, key=lambda item:(item.get('title') or '').lower())],
        ]))

def obsidian_index_markdown(notes):
    grouped={}
    for note in notes:
        grouped.setdefault(obsidian_note_folder(note), []).append(note)
    lines=["---","arcana_kind: index","title: Arcana Index","---","","# Arcana Index","","## Estrutura"]
    for folder in sorted(grouped):
        lines.append(f"- [[{folder}]]")
    lines.extend(["","## Notas"])
    for folder in sorted(grouped):
        lines.extend(["",f"### {folder}"])
        for note in sorted(grouped[folder], key=lambda item:(item.get("title") or "").lower()):
            lines.append(f"- [[{note['title']}]]")
    return "\n".join(lines).rstrip()+"\n"

def obsidian_status_payload(obs=None):
    obs=obs or obsidian_config()
    payload={
        "available":True,
        "connected":bool(obs.get("connected") and obs.get("vaultPath")),
        "vaultName":obs.get("vaultName") or "",
        "vaultPath":obs.get("vaultPath") or "",
        "lastSyncAt":obs.get("lastSyncAt"),
        "autoSync":obs.get("autoSync") or "after_session",
        "noteCount":0,
        "fichamentoCount":0,
        "attachmentCount":0,
        "flashcardCount":0,
        "conflicts":len(obs.get("conflicts") or []),
        "openUrl":"",
    }
    if not payload["connected"]:
        return payload
    vault_root=resolve_vault_path(obs["vaultPath"])
    payload["vaultName"]=vault_root.name
    payload["openUrl"]=f"obsidian://open?vault={quote(vault_root.name)}&file={quote('Arcana Index')}"
    if vault_root.exists():
        notes=[]
        for path in vault_root.rglob("*.md"):
            rel=path.relative_to(vault_root)
            meta,_=parse_frontmatter(path.read_text(encoding="utf-8"))
            if should_skip_obsidian_file(rel, meta):
                continue
            notes.append(path)
        payload["noteCount"]=len(notes)
        payload["fichamentoCount"]=len([path for path in notes if "10 Fichamentos" in path.as_posix()])
        payload["attachmentCount"]=len([path for path in (vault_root/"Attachments").rglob("*") if path.is_file()])
        payload["flashcardCount"]=len([path for path in (vault_root/"80 Flashcards").glob("*.md")])
    return payload

def write_flashcards_to_obsidian(vault_root):
    cards=load_flashcards_meta()
    flash_dir=ensure_within(vault_root, vault_root/"80 Flashcards")
    flash_dir.mkdir(parents=True, exist_ok=True)
    for card in cards.values():
        path=ensure_within(vault_root, flash_dir/f"{slugify(card.get('front') or 'flashcard', 'flashcard')}-{card['id']}.md")
        content="\n".join([
            "---",
            f"arcana_id: {yaml_scalar(card.get('id'))}",
            "arcana_kind: flashcard",
            f"created: {yaml_scalar(card.get('createdAt'))}",
            f"updated: {yaml_scalar(card.get('updatedAt'))}",
            "---",
            "",
            f"# {card.get('front') or 'Flashcard'}",
            "",
            "## Back",
            "",
            card.get("excerpt") or "",
        ])
        atomic_write(path, content.rstrip()+"\n")

def push_obsidian_vault():
    obs=obsidian_config()
    if not obs.get("connected") or not obs.get("vaultPath"):
        raise ValueError("Conecte um vault Obsidian primeiro.")
    vault_root=resolve_vault_path(obs["vaultPath"])
    notes=iter_arcana_notes()
    ensure_obsidian_vault_structure(vault_root, notes)
    tracked={**obs.get("tracked", {})}
    conflicts=[]
    for note in notes:
        target_rel=obsidian_note_relative_path(note).as_posix()
        target=ensure_within(vault_root, vault_root/target_rel)
        previous=tracked.get(note["id"], {})
        old_rel=previous.get("vaultRelativePath")
        old_path=ensure_within(vault_root, vault_root/old_rel) if old_rel else None
        current_vault_mtime=old_path.stat().st_mtime_ns if old_path and old_path.exists() else None
        arcana_changed=note.get("updatedAt")!=previous.get("lastArcanaUpdated")
        vault_changed=current_vault_mtime is not None and previous.get("lastVaultMtime") not in {None, current_vault_mtime}
        if previous and arcana_changed and vault_changed:
            conflicts.append({"noteId":note["id"],"title":note["title"],"file":old_rel or target_rel,"reason":"Arcana e vault mudaram desde a última sincronização."})
            continue
        atomic_write(target, dump_obsidian_markdown(note))
        if old_path and old_path.exists() and old_path.resolve()!=target.resolve():
            try:
                old_path.unlink()
            except Exception:
                pass
        tracked[note["id"]]={"vaultRelativePath":target_rel,"lastArcanaUpdated":note.get("updatedAt"),"lastVaultMtime":target.stat().st_mtime_ns}
    write_flashcards_to_obsidian(vault_root)
    obs=update_obsidian_config(vaultPath=str(vault_root),vaultName=vault_root.name,connected=True,lastSyncAt=now_iso(),tracked=tracked,conflicts=conflicts)
    return obsidian_status_payload(obs)

def pull_obsidian_vault():
    obs=obsidian_config()
    if not obs.get("connected") or not obs.get("vaultPath"):
        raise ValueError("Conecte um vault Obsidian primeiro.")
    vault_root=resolve_vault_path(obs["vaultPath"])
    if not vault_root.exists():
        raise FileNotFoundError("O vault configurado não existe mais.")
    tracked={**obs.get("tracked", {})}
    tracked_paths={state.get("vaultRelativePath"):note_id for note_id,state in tracked.items() if state.get("vaultRelativePath")}
    conflicts=[]
    imported=0
    for path in sorted(vault_root.rglob("*.md")):
        rel=path.relative_to(vault_root).as_posix()
        note=import_obsidian_note(path, vault_root, tracked_paths)
        if not note:
            continue
        existing=tracked.get(note["id"] or "", {})
        try:
            current=read_note_file(note_path_by_id(note["id"])) if note.get("id") else None
        except Exception:
            current=None
        arcana_changed=bool(current and existing and current.get("updatedAt")!=existing.get("lastArcanaUpdated"))
        vault_changed=bool(existing and existing.get("lastVaultMtime") not in {None, path.stat().st_mtime_ns})
        if existing and current and arcana_changed and vault_changed:
            conflicts.append({"noteId":current["id"],"title":current["title"],"file":rel,"reason":"Arcana e vault mudaram desde a última sincronização."})
            continue
        saved,_=save_note(note, note.get("id"))
        tracked[saved["id"]]={"vaultRelativePath":rel,"lastArcanaUpdated":saved.get("updatedAt"),"lastVaultMtime":path.stat().st_mtime_ns}
        imported+=1
    obs=update_obsidian_config(vaultPath=str(vault_root),vaultName=vault_root.name,connected=True,lastSyncAt=now_iso(),tracked=tracked,conflicts=conflicts)
    status=obsidian_status_payload(obs)
    status["importedNotes"]=imported
    return status

def sync_obsidian_vault():
    pull_obsidian_vault()
    return push_obsidian_vault()

def load_index():
    ensure_vault()
    try:
        return json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    except Exception:
        return rebuild_index()

def write_index(index):
    atomic_write(INDEX_PATH,json.dumps(index,ensure_ascii=False,indent=2))

def note_path_by_id(note_id):
    if not SAFE_ID_RE.match(note_id or ""):
        raise ValueError("ID inválido.")
    idx=load_index()
    item=(idx.get("notes") or {}).get(note_id)
    if not item:
        raise FileNotFoundError("Nota não encontrada.")
    path=(DATA/item["file"]).resolve()
    if not str(path).startswith(str(DATA.resolve())) or path.suffix!=".md":
        raise ValueError("Caminho inválido.")
    return path

def summarize_note(note):
    return {k:note.get(k) for k in ["id","title","type","trackId","sourceType","sourceId","sessionId","tags","createdAt","updatedAt","favorite","reviewAt","status","relatedNoteIds","file","links","excerpt"]}

def rebuild_index():
    ensure_vault()
    notes={}
    tags={}
    titles={}
    for folder in NOTE_DIRS:
        for path in sorted((NOTE_ROOT/folder).glob("*.md")):
            try:
                note=read_note_file(path)
            except Exception:
                continue
            notes[note["id"]]=summarize_note(note)
            titles.setdefault(note["title"].strip().lower(),[]).append(note["id"])
            for tag in note.get("tags") or []:
                tags[tag]=tags.get(tag,0)+1
    backlinks={nid:[] for nid in notes}
    edges=[]
    for nid,note in notes.items():
        for target in note.get("links") or []:
            for tid in titles.get(target.strip().lower(),[]):
                backlinks.setdefault(tid,[]).append(nid)
                edges.append({"from":nid,"to":tid,"type":"wiki"})
        for tid in note.get("relatedNoteIds") or []:
            if tid in notes:
                backlinks.setdefault(tid,[]).append(nid)
                edges.append({"from":nid,"to":tid,"type":"related"})
        if note.get("sourceId"):
            edges.append({"from":nid,"to":note["sourceId"],"type":"note_source"})
        if note.get("trackId"):
            edges.append({"from":nid,"to":note["trackId"],"type":"note_track"})
    graph={"nodes":[{"id":nid,"label":n["title"],"type":"note","noteType":n["type"]} for nid,n in notes.items()],"edges":edges}
    index={"notes":notes,"sources":load_sources_meta(),"flashcards":load_flashcards_meta(),"tags":tags,"backlinks":backlinks,"graph":graph,"rebuiltAt":now_iso()}
    write_index(index)
    return index

def save_note(data, note_id=None):
    ensure_vault()
    existing_path=None
    existing=None
    if note_id:
        existing_path=note_path_by_id(note_id)
        existing=read_note_file(existing_path)
    note=default_note({**(existing or {}),**(data or {})})
    if note_id:
        note["id"]=note_id
    note["updatedAt"]=now_iso()
    if existing and existing.get("createdAt"):
        note["createdAt"]=existing["createdAt"]
    target=existing_path if existing_path else unique_note_path(note["title"],note["type"],note["status"])
    if existing_path and (note_folder(note["type"],note["status"]).resolve()!=existing_path.parent.resolve() or slugify(note["title"]) not in existing_path.stem):
        target=unique_note_path(note["title"],note["type"],note["status"],existing_path)
    meta={k:v for k,v in note.items() if k not in {"content","file","links","excerpt"}}
    atomic_write(target,dump_frontmatter(meta,note.get("content") or ""))
    if existing_path and target!=existing_path and existing_path.exists():
        try:
            existing_path.unlink()
        except Exception:
            pass
    idx=rebuild_index()
    return read_note_file(target), duplicate_titles(note["title"],note["id"],idx)

def duplicate_titles(title, note_id=None, idx=None):
    idx=idx or load_index()
    needle=(title or "").strip().lower()
    out=[]
    for nid,n in (idx.get("notes") or {}).items():
        if nid!=note_id and n.get("title","").strip().lower()==needle:
            out.append({"id":nid,"title":n.get("title"),"type":n.get("type"),"file":n.get("file")})
    return out

def search_notes(params):
    idx=load_index()
    q=(params.get("q") or params.get("query") or [""])[0].strip().lower()
    typ=(params.get("type") or [""])[0]
    track=(params.get("trackId") or [""])[0]
    tag=(params.get("tag") or [""])[0].lstrip("#")
    fav=(params.get("favorite") or [""])[0]
    review=(params.get("review") or [""])[0]
    sort=(params.get("sort") or ["updated"])[0]
    today=datetime.now().date()
    out=[]
    for nid,meta in (idx.get("notes") or {}).items():
        if meta.get("status")=="archived" and review!="archived":
            continue
        if typ and typ!="all" and meta.get("type")!=typ:
            continue
        if track and track!="all" and meta.get("trackId")!=track:
            continue
        if tag and tag not in (meta.get("tags") or []):
            continue
        if fav=="true" and not meta.get("favorite"):
            continue
        if review=="due":
            ra=meta.get("reviewAt")
            if not ra:
                continue
            try:
                if datetime.fromisoformat(ra[:10]).date()>today:
                    continue
            except Exception:
                continue
        hay=" ".join([meta.get("title") or "",meta.get("excerpt") or ""," ".join(meta.get("tags") or []),meta.get("sourceType") or "",meta.get("trackId") or ""]).lower()
        if q and q not in hay:
            try:
                note=read_note_file(DATA/meta["file"])
                hay=(hay+" "+(note.get("content") or "")).lower()
            except Exception:
                pass
            if q not in hay:
                continue
        out.append(meta)
    if sort=="created":
        out.sort(key=lambda n:n.get("createdAt") or "",reverse=True)
    elif sort=="alphabetical":
        out.sort(key=lambda n:(n.get("title") or "").lower())
    elif sort=="review":
        out.sort(key=lambda n:n.get("reviewAt") or "9999")
    else:
        out.sort(key=lambda n:n.get("updatedAt") or "",reverse=True)
    return out

def load_sources_meta():
    out={}
    if not SOURCE_ROOT.exists():
        return out
    for path in SOURCE_ROOT.glob("*.json"):
        try:
            data=json.loads(path.read_text(encoding="utf-8"))
            out[data.get("id") or path.stem]=data
        except Exception:
            pass
    return out

def save_source(data, source_id=None):
    ensure_vault()
    sid=source_id or data.get("id") or f"source_{uuid.uuid4().hex[:8]}"
    if not SAFE_ID_RE.match(sid):
        raise ValueError("ID inválido.")
    data={**data,"id":sid,"updatedAt":now_iso(),"createdAt":data.get("createdAt") or now_iso()}
    atomic_write(SOURCE_ROOT/f"{sid}.json",json.dumps(data,ensure_ascii=False,indent=2))
    rebuild_index()
    return data

def load_flashcards_meta():
    out={}
    if not FLASHCARD_ROOT.exists():
        return out
    for path in FLASHCARD_ROOT.glob("*.md"):
        try:
            meta,content=parse_frontmatter(path.read_text(encoding="utf-8"))
            out[meta.get("id") or path.stem]={**meta,"file":rel(path),"excerpt":re.sub(r"\s+"," ",content).strip()[:180]}
        except Exception:
            pass
    return out

def save_flashcard(data, card_id=None):
    ensure_vault()
    cid=card_id or data.get("id") or f"card_{uuid.uuid4().hex[:8]}"
    if not SAFE_ID_RE.match(cid):
        raise ValueError("ID inválido.")
    ts=now_iso()
    meta={"id":cid,"front":data.get("front") or "","back":data.get("back") or "","sourceNoteId":data.get("sourceNoteId"),"tags":data.get("tags") if isinstance(data.get("tags"),list) else [],"createdAt":data.get("createdAt") or ts,"updatedAt":ts,"reviewAt":data.get("reviewAt")}
    content=f"# {meta['front']}\n\n## Back\n\n{meta['back']}\n"
    path=FLASHCARD_ROOT/f"{slugify(meta['front'],'flashcard')}.md"
    if card_id:
        old=(load_flashcards_meta().get(card_id) or {}).get("file")
        path=DATA/old if old else path
    atomic_write(path,dump_frontmatter(meta,content))
    rebuild_index()
    return {**meta,"file":rel(path)}

def read_json_body(handler):
    length=int(handler.headers.get("Content-Length","0"))
    raw=handler.rfile.read(length) if length else b"{}"
    return json.loads(raw or b"{}")

def vault_zip_bytes():
    ensure_vault()
    rebuild_index()
    bio=io.BytesIO()
    with zipfile.ZipFile(bio,"w",zipfile.ZIP_DEFLATED) as z:
        for path in DATA.rglob("*"):
            if path.is_file():
                z.write(path,path.relative_to(ROOT).as_posix())
    return bio.getvalue()

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw): super().__init__(*a,directory=str(ROOT),**kw)
    def do_GET(self):
        p=urlparse(self.path)
        try:
            if p.path=="/api/notes":
                return self.json({"notes":search_notes(parse_qs(p.query))})
            if p.path.startswith("/api/notes/"):
                note_id=unquote(p.path.rsplit("/",1)[-1])
                note=read_note_file(note_path_by_id(note_id))
                idx=load_index()
                note["backlinks"]=[(idx.get("notes") or {}).get(nid) for nid in (idx.get("backlinks") or {}).get(note_id,[]) if (idx.get("notes") or {}).get(nid)]
                return self.json({"note":note})
            if p.path=="/api/search":
                return self.json({"notes":search_notes(parse_qs(p.query))})
            if p.path=="/api/tags":
                return self.json({"tags":load_index().get("tags",{})})
            if p.path=="/api/reviews":
                q=parse_qs(p.query)
                q["review"]=["due"]
                return self.json({"notes":search_notes(q)})
            if p.path=="/api/vault/graph":
                return self.json(load_index().get("graph",{"nodes":[],"edges":[]}))
            if p.path=="/api/vault/export":
                data=vault_zip_bytes()
                self.send_response(200)
                self.send_header("Content-Type","application/zip")
                self.send_header("Content-Disposition",f'attachment; filename="arcana-vault-{datetime.now().strftime("%Y%m%d-%H%M%S")}.zip"')
                self.send_header("Cache-Control","no-store")
                self.send_header("Content-Length",str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
            if p.path=="/api/sources":
                return self.json({"sources":list(load_sources_meta().values())})
            if p.path=="/api/flashcards":
                return self.json({"flashcards":list(load_flashcards_meta().values())})
            if p.path=="/api/obsidian/status":
                return self.json({"obsidian":obsidian_status_payload()})
            if p.path=="/api/obsidian/conflicts":
                obs=obsidian_config()
                return self.json({"conflicts":obs.get("conflicts") or []})
        except FileNotFoundError as e:
            return self.json({"error":str(e)},404)
        except Exception as e:
            return self.json({"error":str(e)},500)
        if p.path=="/api/playlist":
            url=(parse_qs(p.query).get("url") or [""])[0].strip()
            try:
                return self.json(sync_playlist(url))
            except PlaylistInputError as e:
                log(str(e), error=True)
                return self.json({"error":str(e)},400)
            except Exception as e:
                log(str(e), error=True)
                return self.json({"error":str(e)},500)
        if p.path=="/api/diagnostics/youtube":
            return self.json(youtube_diagnostics())
        if p.path=="/health":return self.json({"ok":True})
        return super().do_GET()
    def do_POST(self):
        p=urlparse(self.path)
        try:
            if p.path=="/api/notes":
                data=read_json_body(self)
                note,dupes=save_note(data)
                return self.json({"note":note,"duplicateCandidates":dupes},201)
            if p.path=="/api/reindex":
                return self.json(rebuild_index())
            if p.path=="/api/sources":
                return self.json({"source":save_source(read_json_body(self))},201)
            if p.path=="/api/flashcards":
                return self.json({"flashcard":save_flashcard(read_json_body(self))},201)
            if p.path=="/api/obsidian/connect":
                data=read_json_body(self)
                vault_root=resolve_vault_path(data.get("path"))
                auto_sync=data.get("autoSync") if data.get("autoSync") in OBSIDIAN_AUTO_SYNC else "after_session"
                ensure_obsidian_vault_structure(vault_root)
                obs=update_obsidian_config(connected=True,vaultPath=str(vault_root),vaultName=vault_root.name,lastSyncAt=obsidian_config().get("lastSyncAt"),autoSync=auto_sync)
                return self.json({"obsidian":obsidian_status_payload(obs)},201)
            if p.path=="/api/obsidian/sync":
                return self.json({"obsidian":sync_obsidian_vault()})
            if p.path=="/api/obsidian/pull":
                return self.json({"obsidian":pull_obsidian_vault()})
            if p.path=="/api/obsidian/push":
                return self.json({"obsidian":push_obsidian_vault()})
            if p.path=="/api/obsidian/disconnect":
                current=obsidian_config()
                obs=update_obsidian_config(connected=False,vaultPath="",vaultName="",tracked={},conflicts=[],lastSyncAt=current.get("lastSyncAt"))
                return self.json({"obsidian":obsidian_status_payload(obs)})
        except Exception as e:
            return self.json({"error":str(e)},400)
        if p.path=="/api/backup":
            try:
                length=int(self.headers.get("Content-Length","0"))
                raw=self.rfile.read(length)
                data=json.loads(raw)
                BACKUPS.mkdir(exist_ok=True)
                stamp=datetime.now().strftime("%Y%m%d-%H%M%S")
                path=BACKUPS/f"arcana-auto-{stamp}.json"
                atomic_write(path,json.dumps(data,ensure_ascii=False,indent=2))
                ensure_vault()
                if INDEX_PATH.exists():
                    atomic_write(BACKUPS/f"arcana-vault-index-{stamp}.json",INDEX_PATH.read_text(encoding="utf-8"))
                files=sorted(BACKUPS.glob("arcana-auto-*.json"),key=lambda x:x.stat().st_mtime,reverse=True)
                for old in files[30:]:
                    try: old.unlink()
                    except: pass
                return self.json({"ok":True,"file":path.name})
            except Exception as e:return self.json({"error":str(e)},500)
        return self.json({"error":"not found"},404)
    def do_PUT(self):
        p=urlparse(self.path)
        try:
            if p.path.startswith("/api/notes/"):
                note_id=unquote(p.path.rsplit("/",1)[-1])
                note,dupes=save_note(read_json_body(self),note_id)
                return self.json({"note":note,"duplicateCandidates":dupes})
            if p.path.startswith("/api/sources/"):
                source_id=unquote(p.path.rsplit("/",1)[-1])
                return self.json({"source":save_source(read_json_body(self),source_id)})
            if p.path.startswith("/api/flashcards/"):
                card_id=unquote(p.path.rsplit("/",1)[-1])
                return self.json({"flashcard":save_flashcard(read_json_body(self),card_id)})
        except FileNotFoundError as e:
            return self.json({"error":str(e)},404)
        except Exception as e:
            return self.json({"error":str(e)},400)
        return self.json({"error":"not found"},404)
    def do_DELETE(self):
        p=urlparse(self.path)
        try:
            if p.path.startswith("/api/notes/"):
                note_id=unquote(p.path.rsplit("/",1)[-1])
                note=read_note_file(note_path_by_id(note_id))
                note["status"]="archived"
                saved,_=save_note(note,note_id)
                return self.json({"note":saved})
        except FileNotFoundError as e:
            return self.json({"error":str(e)},404)
        except Exception as e:
            return self.json({"error":str(e)},400)
        return self.json({"error":"not found"},404)
    def json(self,obj,status=200):
        b=json.dumps(obj,ensure_ascii=False).encode()
        self.send_response(status);self.send_header("Content-Type","application/json; charset=utf-8");self.send_header("Cache-Control","no-store");self.send_header("Content-Length",str(len(b)));self.end_headers();self.wfile.write(b)

if __name__=="__main__":
    ensure_vault()
    print(f"Arcana v5 em http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
