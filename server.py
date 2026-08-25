#!/usr/bin/env python3
import hashlib, hmac, io, json, os, re, secrets, subprocess, sys, unicodedata, uuid, zipfile
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
OBSIDIAN_AUTO_SYNC={"manual","after_session"}
BRIDGE_NAME="arcana-obsidian"
BRIDGE_VERSION=1
BRIDGE_API_VERSION=1
BRIDGE_TOKEN_HEADER="X-Arcana-Bridge-Token"
BRIDGE_ALLOWED_ORIGINS={"https://nataliacarvalhinha.github.io","http://127.0.0.1:8765","http://localhost:8765"}
BRIDGE_LOCAL_ORIGINS={"http://127.0.0.1:8765","http://localhost:8765"}
BRIDGE_WRITE_PATHS={"/api/obsidian/connect","/api/obsidian/push","/api/obsidian/sync","/api/obsidian/reindex-preview","/api/obsidian/disconnect"}
MAX_JSON_BODY_BYTES=int(os.environ.get("ARCANA_MAX_JSON_BYTES","5242880"))
ARCANA_GENERATED_START="<!-- ARCANA:START generated -->"
ARCANA_GENERATED_END="<!-- ARCANA:END generated -->"
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
    "Tracks",
    "Courses",
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
    try:
        dir_fd=os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except OSError:
        pass

def atomic_write_bytes(path, data):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    with tmp.open("wb") as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp,path)
    try:
        dir_fd=os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except OSError:
        pass

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
    keys=["id","title","type","trackId","courseId","moduleId","lessonId","sourceType","sourceId","sourceTitle","sessionId","durationMinutes","tags","createdAt","updatedAt","favorite","reviewAt","status","relatedNoteIds","source","blocks","questionStatus","promotedNoteIds","citations","readingProgress"]
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
        "courseId":data.get("courseId"),
        "moduleId":data.get("moduleId"),
        "lessonId":data.get("lessonId"),
        "sourceType":data.get("sourceType"),
        "sourceId":data.get("sourceId"),
        "sourceTitle":data.get("sourceTitle") or ((data.get("source") or {}).get("title") if isinstance(data.get("source"),dict) else ""),
        "sessionId":data.get("sessionId"),
        "durationMinutes":int(data.get("durationMinutes") or 0),
        "createdAt":data.get("createdAt") or ts,
        "updatedAt":data.get("updatedAt") or ts,
        "favorite":bool(data.get("favorite",False)),
        "reviewAt":data.get("reviewAt"),
        "status":data.get("status") or "active",
        "relatedNoteIds":data.get("relatedNoteIds") if isinstance(data.get("relatedNoteIds"),list) else [],
        "source":data.get("source") if isinstance(data.get("source"),dict) else {},
        "blocks":data.get("blocks") if isinstance(data.get("blocks"),list) else [],
        "questionStatus":data.get("questionStatus") or data.get("question_status"),
        "promotedNoteIds":data.get("promotedNoteIds") if isinstance(data.get("promotedNoteIds"),list) else [],
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
    default={"obsidian":{"connected":False,"vaultPath":"","vaultName":"","lastSyncAt":None,"autoSync":"manual","tracked":{},"conflicts":[],"lastPush":{}},"bridge":{"name":BRIDGE_NAME,"version":BRIDGE_VERSION,"token":"","createdAt":None}}
    if not LOCAL_CONFIG_PATH.exists():
        return default
    try:
        data=json.loads(LOCAL_CONFIG_PATH.read_text(encoding="utf-8"))
    except Exception:
        return default
    obs={**default["obsidian"],**(data.get("obsidian") if isinstance(data.get("obsidian"),dict) else {})}
    bridge={**default["bridge"],**(data.get("bridge") if isinstance(data.get("bridge"),dict) else {})}
    if obs.get("autoSync") not in OBSIDIAN_AUTO_SYNC:
        obs["autoSync"]="manual"
    if not isinstance(obs.get("tracked"),dict):
        obs["tracked"]={}
    if not isinstance(obs.get("conflicts"),list):
        obs["conflicts"]=[]
    if not isinstance(obs.get("lastPush"),dict):
        obs["lastPush"]={}
    if not isinstance(bridge.get("token"),str):
        bridge["token"]=""
    bridge["name"]=BRIDGE_NAME
    bridge["version"]=BRIDGE_VERSION
    return {"obsidian":obs,"bridge":bridge}

def save_local_config(config):
    atomic_write(LOCAL_CONFIG_PATH,json.dumps(config,ensure_ascii=False,indent=2))

def obsidian_config():
    return load_local_config()["obsidian"]

def bridge_config():
    return load_local_config()["bridge"]

def ensure_bridge_token():
    config=load_local_config()
    bridge=config["bridge"]
    if not bridge.get("token"):
        bridge["token"]=secrets.token_urlsafe(32)
        bridge["createdAt"]=now_iso()
        config["bridge"]=bridge
        save_local_config(config)
    return bridge["token"]

def bridge_token_valid(token):
    expected=ensure_bridge_token()
    return bool(token) and hmac.compare_digest(str(token), expected)

def bridge_origin_allowed(origin):
    return not origin or origin in BRIDGE_ALLOWED_ORIGINS

def bridge_origin_local(origin):
    return not origin or origin in BRIDGE_LOCAL_ORIGINS

def update_obsidian_config(**updates):
    config=load_local_config()
    current={**config["obsidian"],**updates}
    if current.get("autoSync") not in OBSIDIAN_AUTO_SYNC:
        current["autoSync"]="manual"
    if not isinstance(current.get("tracked"),dict):
        current["tracked"]={}
    if not isinstance(current.get("conflicts"),list):
        current["conflicts"]=[]
    if not isinstance(current.get("lastPush"),dict):
        current["lastPush"]={}
    config["obsidian"]=current
    save_local_config(config)
    return current

def resolve_vault_path(raw_path):
    raw=(raw_path or "").strip()
    if not raw:
        raise ValueError("Informe o caminho da pasta do vault.")
    if "\x00" in raw:
        raise ValueError("Caminho inválido.")
    path=Path(os.path.expanduser(raw))
    if not path.is_absolute():
        path=(ROOT/path)
    return path.resolve()

def validate_vault_root(raw_path):
    path=resolve_vault_path(raw_path)
    if not path.exists():
        raise FileNotFoundError("A pasta do vault não existe.")
    if not path.is_dir():
        raise ValueError("O caminho informado não é uma pasta.")
    if not os.access(path, os.W_OK):
        raise PermissionError("A pasta do vault não está gravável.")
    return path

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

def obsidian_safe_filename(title, fallback="Arcana"):
    text=unicodedata.normalize("NFC", str(title or fallback))
    text=re.sub(r"[\x00-\x1f\x7f/\\]+", " ", text)
    text=re.sub(r'[<>:"|?*]+', " ", text)
    text=re.sub(r"\s+", " ", text).strip(" .")
    return (text or fallback)[:120]

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
    title=obsidian_safe_filename(note.get("title") or "Nota")
    return Path(obsidian_note_folder(note))/f"{title}.md"

def obsidian_link(title):
    return f"[[{str(title or 'Sem titulo').replace(']', '').replace('[', '')}]]"

def arcana_frontmatter(meta):
    lines=["---","arcana_managed: true",f"arcana_id: {yaml_scalar(meta.get('arcana_id'))}"]
    for key in ["type","title","track","track_id","course","course_id","module","module_id","lesson","lesson_id","source","source_type","source_id","session_id","date","duration_minutes","question_status","created","updated","review_at","status","favorite"]:
        if key in meta:
            lines.append(f"{key}: {yaml_scalar(meta.get(key))}")
    tags=meta.get("tags") if isinstance(meta.get("tags"),list) else []
    lines.append("tags:")
    if tags:
        for tag in sorted(set(str(tag).strip().lstrip("#") for tag in tags if str(tag).strip())):
            lines.append(f"  - {yaml_scalar(tag)}")
    else:
        lines.append("  []")
    lines.append("---")
    return "\n".join(lines)

def split_markdown_frontmatter(text):
    if text.startswith("---\n"):
        end=text.find("\n---",4)
        if end>=0:
            tail_start=end+4
            if tail_start<len(text) and text[tail_start:tail_start+1]=="\n":
                tail_start+=1
            return text[:end+4].rstrip(), text[tail_start:].lstrip("\n")
    return "", text

def wrap_generated_region(text):
    frontmatter, body=split_markdown_frontmatter(text.rstrip()+"\n")
    generated=f"{ARCANA_GENERATED_START}\n{body.rstrip()}\n{ARCANA_GENERATED_END}\n"
    if frontmatter:
        return f"{frontmatter}\n\n{generated}"
    return generated

def replace_frontmatter(existing_text, generated_text):
    generated_frontmatter, generated_body=split_markdown_frontmatter(generated_text)
    if not generated_frontmatter:
        return generated_text
    existing_frontmatter, existing_body=split_markdown_frontmatter(existing_text)
    if existing_frontmatter:
        return f"{generated_frontmatter}\n\n{existing_body.lstrip()}"
    return f"{generated_frontmatter}\n\n{existing_text.lstrip()}"

def merge_arcana_managed_text(existing_text, generated_text):
    if existing_text is None:
        return generated_text
    existing_with_fm=replace_frontmatter(existing_text, generated_text)
    start=existing_with_fm.find(ARCANA_GENERATED_START)
    end=existing_with_fm.find(ARCANA_GENERATED_END)
    if start<0 or end<start:
        return generated_text
    end+=len(ARCANA_GENERATED_END)
    generated_start=generated_text.find(ARCANA_GENERATED_START)
    generated_end=generated_text.find(ARCANA_GENERATED_END)
    if generated_start<0 or generated_end<generated_start:
        return generated_text
    generated_end+=len(ARCANA_GENERATED_END)
    return (existing_with_fm[:start]+generated_text[generated_start:generated_end]+existing_with_fm[end:]).rstrip()+"\n"

def obsidian_content_hash(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def obsidian_file(rel_path, text, arcana_id, kind, updated=""):
    if unsafe_obsidian_relpath(rel_path):
        raise ValueError(f"Caminho Obsidian inseguro: {rel_path}")
    return {"path":rel_path,"text":wrap_generated_region(text),"arcana_id":arcana_id,"type":kind,"updated":updated}

def unsafe_obsidian_relpath(rel_path):
    parts=Path(str(rel_path)).parts
    return (not rel_path or str(rel_path).startswith("/") or "\\" in str(rel_path) or ".." in parts or any("\x00" in part for part in parts))

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

def obsidian_enriched_note(note, lookups):
    source=note.get("source") if isinstance(note.get("source"),dict) else {}
    source_id=note.get("sourceId") or source.get("lessonId") or source.get("moduleId") or source.get("courseId")
    course=lookups["courses"].get(source.get("courseId") or note.get("courseId") or (lookups["course_by_lesson"].get(source_id) if source_id else ""))
    module=lookups["modules"].get(source.get("moduleId") or note.get("moduleId") or (lookups["module_by_lesson"].get(source_id) if source_id else ""))
    lesson=lookups["lessons"].get(source.get("lessonId") or note.get("lessonId") or source_id)
    track=lookups["tracks"].get(note.get("trackId") or (course or {}).get("trackId"))
    return {**note,"sourceId":source_id or note.get("sourceId"),"_course":course,"_module":module,"_lesson":lesson,"_track":track}

def note_blocks(note, block_type):
    return [block for block in note.get("blocks") or [] if block.get("type")==block_type and (str(block.get("title") or "")+str(block.get("content") or "")).strip()]

def block_title(block):
    content=str(block.get("content") or "")
    first=next((line.strip() for line in content.splitlines() if line.strip()), "")
    return (block.get("title") or first or "Nota").strip()

def indented(text):
    return "\n".join(f"  {line}" for line in str(text or "").strip().splitlines())

def add_section(lines, title, body):
    items=[item for item in (body if isinstance(body,list) else [body]) if str(item or "").strip()]
    if items:
        lines.extend(["",f"## {title}","",*items])

def note_context_lines(note):
    lines=[]
    if note.get("_track"):
        lines.append(f"- Trilha: {obsidian_link(note['_track'].get('name'))}")
    if note.get("_course"):
        lines.append(f"- Curso: {obsidian_link(note['_course'].get('title'))}")
    if note.get("_module"):
        lines.append(f"- Módulo: {note['_module'].get('title') or ''}")
    if note.get("_lesson"):
        lines.append(f"- Aula: {note['_lesson'].get('title') or ''}")
    return lines

def obsidian_note_frontmatter(note, tags):
    course=note.get("_course") or {}
    module=note.get("_module") or {}
    lesson=note.get("_lesson") or {}
    track=note.get("_track") or {}
    return {
        "arcana_id":note.get("id"),
        "type":note.get("type") or "permanent",
        "title":note.get("title") or "Nota",
        "track":track.get("name") or "",
        "track_id":note.get("trackId") or track.get("id") or "",
        "course":course.get("title") or "",
        "course_id":course.get("id") or "",
        "module":module.get("title") or "",
        "module_id":module.get("id") or "",
        "lesson":lesson.get("title") or "",
        "lesson_id":lesson.get("id") or "",
        "source":note.get("sourceTitle") or ((note.get("source") or {}).get("title") if isinstance(note.get("source"),dict) else ""),
        "source_type":note.get("sourceType") or "",
        "source_id":note.get("sourceId") or "",
        "session_id":note.get("sessionId") or "",
        "date":str(note.get("createdAt") or "")[:10],
        "duration_minutes":int(note.get("durationMinutes") or (note.get("source") or {}).get("minutes") or 0) if isinstance(note.get("source"),dict) else int(note.get("durationMinutes") or 0),
        "question_status":note.get("questionStatus") or "",
        "created":note.get("createdAt") or "",
        "updated":note.get("updatedAt") or "",
        "review_at":note.get("reviewAt") or "",
        "status":note.get("status") or "active",
        "favorite":bool(note.get("favorite")),
        "tags":tags,
    }

def obsidian_session_markdown(note, tags):
    meta=obsidian_note_frontmatter(note,tags)
    lines=[f"# {note.get('title') or 'Sessão'}"]
    add_section(lines,"Contexto",note_context_lines(note))
    duration=int(note.get("durationMinutes") or (note.get("source") or {}).get("minutes") or 0) if isinstance(note.get("source"),dict) else int(note.get("durationMinutes") or 0)
    add_section(lines,"Sessão",[f"- Data: {str(note.get('createdAt') or '')[:10]}" if note.get("createdAt") else "",f"- Duração: {duration} min" if duration else ""])
    add_section(lines,"O que aprendi",(note.get("content") or "").strip())
    add_section(lines,"Conceitos",[f"- {obsidian_link(block_title(block))}"+(f"\n{indented(block.get('content'))}" if block.get("content") else "") for block in note_blocks(note,"concept")])
    add_section(lines,"Perguntas",[f"- {obsidian_link(block_title(block))}"+(f"\n{indented(block.get('content'))}" if block.get("content") else "") for block in note_blocks(note,"question")])
    add_section(lines,"Insights",[f"- {obsidian_link(block_title(block))}"+(f"\n{indented(block.get('content'))}" if block.get("content") else "") for block in note_blocks(note,"insight")])
    add_section(lines,"Citações",[(f"- {block.get('title')}\n" if block.get("title") else "")+"> "+str(block.get("content") or "").strip().replace("\n","\n> ") for block in note_blocks(note,"quote")])
    add_section(lines,"Exemplos",[f"- {block_title(block)}"+(f"\n{indented(block.get('content'))}" if block.get("content") else "") for block in note_blocks(note,"example")])
    add_section(lines,"Fórmulas e comandos",[f"- {block_title(block)}"+(f"\n\n```\n{str(block.get('content')).strip()}\n```" if block.get("content") else "") for block in note_blocks(note,"formula")])
    add_section(lines,"Próximos passos",[f"- [ ] {block_title(block)}"+(f"\n{indented(block.get('content'))}" if block.get("content") else "") for block in note_blocks(note,"next_action")])
    add_section(lines,"Notas livres",[f"- {block_title(block)}"+(f"\n{indented(block.get('content'))}" if block.get("content") else "") for block in note_blocks(note,"free")])
    return f"{arcana_frontmatter(meta)}\n\n"+"\n".join(lines).rstrip()+"\n"

def obsidian_question_markdown(note, tags):
    meta=obsidian_note_frontmatter(note,tags)
    lines=[f"# {note.get('title') or 'Pergunta'}"]
    add_section(lines,"Contexto",note_context_lines(note))
    add_section(lines,"Pergunta",(note.get("content") or "").strip())
    add_section(lines,"Status",f"- {note.get('questionStatus') or 'open'}")
    return f"{arcana_frontmatter(meta)}\n\n"+"\n".join(lines).rstrip()+"\n"

def obsidian_note_markdown(note):
    block_text="\n".join(" ".join([str(block.get("title") or ""),str(block.get("content") or "")]) for block in note.get("blocks") or [])
    tags=sorted(set((note.get("tags") or [])+[x[1].strip() for x in INLINE_TAG_RE.findall((note.get("content") or "")+"\n"+block_text) if x[1].strip()]))
    if note.get("type")=="session":
        return obsidian_session_markdown(note,tags)
    if note.get("type")=="question":
        return obsidian_question_markdown(note,tags)
    meta=obsidian_note_frontmatter(note,tags)
    body=[f"# {note.get('title') or 'Nota'}"]
    context=note_context_lines(note)
    if context:
        body.extend(["","## Contexto",*context])
    if note.get("sourceType") or note.get("sourceId"):
        body.extend(["","## Fonte",f"- Tipo: {note.get('sourceType') or 'fonte'}",f"- ID: {note.get('sourceId') or ''}"])
    content=(note.get("content") or "").strip()
    if content:
        body.extend(["","## Nota","",content])
    return f"{arcana_frontmatter(meta)}\n\n"+"\n".join(body).rstrip()+"\n"

def build_obsidian_lookups(payload):
    state=payload.get("state") if isinstance(payload.get("state"),dict) else {}
    tracks={str(t.get("id")):t for t in state.get("tracks",[]) if isinstance(t,dict) and t.get("id")}
    courses={}
    modules={}
    lessons={}
    course_by_lesson={}
    module_by_lesson={}
    for item in state.get("items",[]) if isinstance(state.get("items"),list) else []:
        if not isinstance(item,dict):
            continue
        if item.get("kind")=="course" or item.get("modules"):
            courses[item.get("id")]=item
            for module in item.get("modules") or []:
                if not isinstance(module,dict):
                    continue
                modules[module.get("id")]=module
                for lesson in module.get("lessons") or []:
                    if isinstance(lesson,dict) and lesson.get("id"):
                        lessons[lesson["id"]]=lesson
                        course_by_lesson[lesson["id"]]=item.get("id")
                        module_by_lesson[lesson["id"]]=module.get("id")
    return {"tracks":tracks,"courses":courses,"modules":modules,"lessons":lessons,"course_by_lesson":course_by_lesson,"module_by_lesson":module_by_lesson}

def obsidian_course_markdown(course, lookups):
    track=lookups["tracks"].get(course.get("trackId"))
    meta={"arcana_id":course.get("id"),"type":"course","title":course.get("title") or course.get("name") or "Curso","track":(track or {}).get("name") or "","track_id":course.get("trackId") or "","course":course.get("title") or course.get("name") or "","course_id":course.get("id") or "","created":course.get("createdAt") or "","updated":course.get("updatedAt") or "","status":course.get("status") or "active","tags":["arcana/course"]}
    lines=[f"# {meta['title']}","","## Modulos"]
    for module in course.get("modules") or []:
        lines.extend(["",f"### {module.get('title') or 'Modulo'}"])
        for lesson in module.get("lessons") or []:
            title=lesson.get("title") if isinstance(lesson,dict) else str(lesson)
            done="x" if isinstance(lesson,dict) and lesson.get("done") else " "
            url=(lesson.get("url") if isinstance(lesson,dict) else "") or ""
            suffix=f" - {url}" if url else ""
            lines.append(f"- [{done}] {title}{suffix}")
    return f"{arcana_frontmatter(meta)}\n\n"+"\n".join(lines).rstrip()+"\n"

def obsidian_track_markdown(track, courses, notes):
    title=track.get("name") or track.get("title") or "Trilha"
    meta={"arcana_id":track.get("id"),"type":"track","title":title,"track":title,"track_id":track.get("id") or "","created":track.get("createdAt") or "","updated":track.get("updatedAt") or "","status":"active","tags":["arcana/track"]}
    current=next((course for course in courses if int(course.get("progress") or 0)<100), courses[0] if courses else None)
    recent=lambda items: sorted(items,key=lambda item:str(item.get("updatedAt") or item.get("createdAt") or ""),reverse=True)[:8]
    lines=[f"# {title}"]
    add_section(lines,"Curso atual",[f"- {obsidian_link(current.get('title') or current.get('name'))}"] if current else [])
    add_section(lines,"Cursos",[f"- {obsidian_link(course.get('title') or course.get('name'))}" for course in courses])
    add_section(lines,"Fichamentos recentes",[f"- {obsidian_link(note.get('title'))}" for note in recent([note for note in notes if note.get("type")=="literature"])])
    add_section(lines,"Notas permanentes",[f"- {obsidian_link(note.get('title'))}" for note in recent([note for note in notes if note.get("type") in {"permanent","concept"}])])
    add_section(lines,"Perguntas abertas",[f"- {obsidian_link(note.get('title'))}" for note in recent([note for note in notes if note.get("type")=="question" and (note.get("questionStatus") or "open")=="open"])])
    add_section(lines,"Sessões recentes",[f"- {obsidian_link(note.get('title'))}" for note in recent([note for note in notes if note.get("type")=="session"])])
    return f"{arcana_frontmatter(meta)}\n\n"+"\n".join(lines).rstrip()+"\n"

def obsidian_source_files(notes):
    out={}
    for note in notes:
        source=note.get("source") if isinstance(note.get("source"),dict) else {}
        source_id=note.get("sourceId") or source.get("id") or source.get("lessonId") or source.get("moduleId") or source.get("courseId")
        url=source.get("url") or source.get("canonicalUrl") or ""
        title=source.get("title") or note.get("sourceTitle") or ""
        if not source_id and not url:
            continue
        sid=f"source-{source_id or slugify(url, 'fonte')}"
        if sid in out:
            continue
        label=title or source_id or url or "Fonte Arcana"
        meta={"arcana_id":sid,"type":"source","title":label,"source":label,"source_type":note.get("sourceType") or source.get("type") or "source","source_id":source_id or "","created":note.get("createdAt") or "","updated":note.get("updatedAt") or "","status":"active","tags":["arcana/source"]}
        lines=[f"# {label}","","## Metadados"]
        if url:
            lines.append(f"- URL: {url}")
        if source.get("channel"):
            lines.append(f"- Canal: {source.get('channel')}")
        if source.get("timestamp"):
            lines.append(f"- Timestamp: {source.get('timestamp')}")
        lines.extend(["","## Notas relacionadas",f"- {obsidian_link(note.get('title'))}"])
        out[sid]=obsidian_file((Path("60 Fontes")/f"{obsidian_safe_filename(label)}.md").as_posix(), f"{arcana_frontmatter(meta)}\n\n"+"\n".join(lines), sid, "source", meta["updated"])
    return list(out.values())

def render_obsidian_export(payload):
    payload=payload if isinstance(payload,dict) else {}
    lookups=build_obsidian_lookups(payload)
    files=[]
    notes=[]
    for raw in payload.get("notes") or []:
        if isinstance(raw,dict) and raw.get("id"):
            notes.append(obsidian_enriched_note(default_note(raw), lookups))
    for raw in payload.get("fichamentos") or []:
        if isinstance(raw,dict) and raw.get("id") and not any(n.get("id")==raw.get("id") for n in notes):
            notes.append(obsidian_enriched_note(default_note({**raw,"type":raw.get("type") or "literature"}), lookups))
    for note in sorted(notes, key=lambda item:(obsidian_note_folder(item), item.get("title") or "", item.get("id") or "")):
        rel_path=obsidian_note_relative_path(note).as_posix()
        files.append(obsidian_file(rel_path, obsidian_note_markdown(note), note["id"], note.get("type") or "note", note.get("updatedAt") or ""))
    state=payload.get("state") if isinstance(payload.get("state"),dict) else {}
    courses=[item for item in state.get("items",[]) if isinstance(item,dict) and (item.get("kind")=="course" or item.get("modules"))]
    for course in courses:
        if not course.get("id"):
            continue
        rel_path=(Path("Courses")/f"{obsidian_safe_filename(course.get('title') or course.get('name') or 'Curso')}.md").as_posix()
        files.append(obsidian_file(rel_path, obsidian_course_markdown(course, lookups), course.get("id"), "course", course.get("updatedAt") or ""))
    for track in state.get("tracks",[]) if isinstance(state.get("tracks"),list) else []:
        if not isinstance(track,dict) or not track.get("id"):
            continue
        track_courses=[course for course in courses if course.get("trackId")==track.get("id")]
        track_notes=[note for note in notes if note.get("trackId")==track.get("id")]
        rel_path=(Path("Tracks")/f"{obsidian_safe_filename(track.get('name') or track.get('title') or 'Trilha')}.md").as_posix()
        files.append(obsidian_file(rel_path, obsidian_track_markdown(track, track_courses, track_notes), track.get("id"), "track", track.get("updatedAt") or ""))
    for card in payload.get("flashcards") or []:
        if not isinstance(card,dict) or not card.get("id"):
            continue
        title=card.get("front") or "Flashcard"
        meta={"arcana_id":card.get("id"),"type":"flashcard","title":title,"source_id":card.get("sourceNoteId") or "","created":card.get("createdAt") or "","updated":card.get("updatedAt") or "","review_at":card.get("reviewAt") or "","status":"active","tags":card.get("tags") if isinstance(card.get("tags"),list) else []}
        body=f"# {title}\n\n## Verso\n\n{card.get('back') or ''}"
        files.append(obsidian_file((Path("80 Flashcards")/f"{obsidian_safe_filename(title, 'Flashcard')}.md").as_posix(), f"{arcana_frontmatter(meta)}\n\n{body}", card["id"], "flashcard", card.get("updatedAt") or ""))
    files.extend(obsidian_source_files(notes))
    files.append(obsidian_file("Arcana Index.md", obsidian_index_markdown(notes, courses, state.get("tracks") or []), "arcana-index", "index", ""))
    files.append(obsidian_file("README - Arcana.md", obsidian_readme_markdown(), "arcana-readme", "readme", ""))
    return dedupe_obsidian_files(files)

def dedupe_obsidian_files(files):
    used={}
    out=[]
    for file in files:
        rel=file["path"]
        if rel in used and used[rel]!=file["arcana_id"]:
            stem=Path(rel).stem
            suffix=Path(rel).suffix
            parent=Path(rel).parent
            n=2
            while True:
                candidate=(parent/f"{stem} - {n}{suffix}").as_posix()
                if candidate not in used:
                    rel=candidate
                    break
                n+=1
            file={**file,"path":rel}
        used[rel]=file["arcana_id"]
        out.append(file)
    return out

def ensure_obsidian_vault_structure(vault_root):
    for rel_dir in OBSIDIAN_DIRS:
        ensure_within(vault_root, vault_root/rel_dir).mkdir(parents=True, exist_ok=True)

def obsidian_index_markdown(notes, courses=None, tracks=None):
    courses=courses or []
    tracks=tracks or []
    grouped={}
    for note in notes:
        grouped.setdefault(obsidian_note_folder(note), []).append(note)
    meta={"arcana_id":"arcana-index","type":"index","title":"Arcana Index","status":"active","tags":["arcana/index"]}
    lines=[arcana_frontmatter(meta),"","# Arcana Index","","## Estrutura"]
    for rel_dir in OBSIDIAN_DIRS:
        lines.append(f"- `{rel_dir}/`")
    lines.extend(["","## Trilhas"])
    for track in tracks:
        if isinstance(track,dict):
            lines.append(f"- {obsidian_link(track.get('name') or track.get('title'))}")
    lines.extend(["","## Cursos"])
    for course in courses:
        lines.append(f"- {obsidian_link(course.get('title') or course.get('name'))}")
    lines.extend(["","## Notas"])
    for folder in sorted(grouped):
        lines.extend(["",f"### {folder}"])
        for note in sorted(grouped[folder], key=lambda item:(item.get("title") or "").lower()):
            lines.append(f"- {obsidian_link(note.get('title'))}")
    return "\n".join(lines).rstrip()+"\n"

def obsidian_readme_markdown():
    meta={"arcana_id":"arcana-readme","type":"readme","title":"README - Arcana","status":"active","tags":["arcana/readme"]}
    lines=[
        arcana_frontmatter(meta),
        "",
        "# Arcana + Obsidian",
        "",
        "Este vault contem arquivos gerados pelo Arcana Bridge Phase 1.",
        "",
        "## Regra de seguranca",
        "",
        "O Arcana so atualiza arquivos com `arcana_managed: true` e `arcana_id` correspondente. Arquivos seus, `Welcome.md` e `.obsidian/` permanecem fora do controle do Arcana.",
        "",
        "## Direcao",
        "",
        "Phase 1 e somente Arcana -> Markdown -> Obsidian. Importacao direta do Obsidian para o Arcana ainda nao faz parte desta fase.",
    ]
    return "\n".join(lines).rstrip()+"\n"

def scan_obsidian_managed(vault_root):
    managed={}
    by_path={}
    for path in vault_root.rglob("*.md"):
        if ".obsidian" in path.relative_to(vault_root).parts:
            continue
        try:
            try:
                meta,_=parse_frontmatter(path.read_text(encoding="utf-8"))
            except Exception:
                continue
        except Exception:
            continue
        is_managed=meta.get("arcana_managed") is True or str(meta.get("arcana_managed") or "").lower()=="true"
        arcana_id=str(meta.get("arcana_id") or "")
        rel_path=path.relative_to(vault_root).as_posix()
        by_path[rel_path]={"path":path,"meta":meta,"managed":is_managed,"arcana_id":arcana_id}
        if is_managed and arcana_id:
            managed[arcana_id]=path
    return managed, by_path

def alternate_obsidian_path(vault_root, rel_path, by_path):
    path=Path(rel_path)
    stem=path.stem
    suffix=path.suffix or ".md"
    parent=path.parent
    n=2
    while True:
        candidate=(parent/f"{stem} - Arcana {n}{suffix}").as_posix()
        if candidate not in by_path and not (vault_root/candidate).exists():
            return candidate
        n+=1

def write_obsidian_export(vault_root, files):
    ensure_obsidian_vault_structure(vault_root)
    managed, by_path=scan_obsidian_managed(vault_root)
    stats={"ok":True,"created":0,"updated":0,"unchanged":0,"errors":[],"warnings":[],"files":[]}
    tracked={}
    for file in files:
        try:
            rel_path=file["path"]
            arcana_id=str(file["arcana_id"])
            existing=managed.get(arcana_id)
            desired_rel=rel_path
            if existing:
                target=existing
                desired_rel=existing.relative_to(vault_root).as_posix()
                wanted=ensure_within(vault_root, vault_root/rel_path)
                wanted_collision=by_path.get(rel_path)
                if wanted.resolve()!=existing.resolve() and (not wanted_collision or (wanted_collision["managed"] and wanted_collision["arcana_id"]==arcana_id)):
                    target=wanted
                    desired_rel=rel_path
            else:
                target=ensure_within(vault_root, vault_root/desired_rel)
                collision=by_path.get(desired_rel)
                if collision and (not collision["managed"] or collision["arcana_id"]!=arcana_id):
                    desired_rel=alternate_obsidian_path(vault_root, desired_rel, by_path)
                    target=ensure_within(vault_root, vault_root/desired_rel)
                    stats["warnings"].append({"file":rel_path,"writtenAs":desired_rel,"reason":"collision_with_unmanaged_or_other_arcana_id"})
            previous_text=target.read_text(encoding="utf-8") if target.exists() else None
            next_text=merge_arcana_managed_text(previous_text,file["text"]) if previous_text is not None else file["text"]
            if previous_text==next_text:
                stats["unchanged"]+=1
            else:
                existed=target.exists()
                atomic_write(target, next_text)
                if existed:
                    stats["updated"]+=1
                else:
                    stats["created"]+=1
            if existing and existing.exists() and existing.resolve()!=target.resolve():
                meta,_=parse_frontmatter(existing.read_text(encoding="utf-8"))
                if (meta.get("arcana_managed") is True or str(meta.get("arcana_managed") or "").lower()=="true") and str(meta.get("arcana_id") or "")==arcana_id:
                    existing.unlink()
            tracked[arcana_id]={"vaultRelativePath":desired_rel,"lastArcanaUpdated":file.get("updated") or "","lastVaultMtime":target.stat().st_mtime_ns,"contentHash":obsidian_content_hash(next_text)}
            stats["files"].append(desired_rel)
            by_path[desired_rel]={"path":target,"meta":{"arcana_id":arcana_id,"arcana_managed":True},"managed":True,"arcana_id":arcana_id}
            managed[arcana_id]=target
        except Exception as exc:
            stats["ok"]=False
            stats["errors"].append({"file":file.get("path"),"error":str(exc)})
    return stats, tracked

def obsidian_status_payload(obs=None):
    obs=obs or obsidian_config()
    payload={
        "available":True,
        "connected":bool(obs.get("connected") and obs.get("vaultPath")),
        "vaultName":obs.get("vaultName") or "",
        "vaultPath":obs.get("vaultPath") or "",
        "lastSyncAt":obs.get("lastSyncAt"),
        "autoSync":obs.get("autoSync") or "manual",
        "noteCount":0,
        "fichamentoCount":0,
        "attachmentCount":0,
        "flashcardCount":0,
        "conflicts":len(obs.get("conflicts") or []),
        "lastPush":obs.get("lastPush") or {},
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
            if ".obsidian" in path.relative_to(vault_root).parts:
                continue
            rel=path.relative_to(vault_root)
            meta,_=parse_frontmatter(path.read_text(encoding="utf-8"))
            managed=meta.get("arcana_managed") is True or str(meta.get("arcana_managed") or "").lower()=="true"
            if managed:
                notes.append((path,meta))
        payload["noteCount"]=len(notes)
        payload["fichamentoCount"]=len([path for path,_ in notes if "10 Fichamentos" in path.as_posix()])
        payload["attachmentCount"]=len([path for path in (vault_root/"Attachments").rglob("*") if path.is_file()])
        payload["flashcardCount"]=len([path for path,meta in notes if meta.get("type")=="flashcard" or "80 Flashcards" in path.as_posix()])
    return payload

def obsidian_status_for_origin(origin, obs=None):
    payload=obsidian_status_payload(obs)
    if not bridge_origin_local(origin):
        payload["vaultPath"]=""
    return payload

def bridge_status_payload(token=""):
    obs=obsidian_config()
    connected=bool(obs.get("connected") and obs.get("vaultPath"))
    vault_name=obs.get("vaultName") or ""
    open_url=""
    if connected:
        try:
            vault_root=resolve_vault_path(obs["vaultPath"])
            connected=vault_root.exists() and vault_root.is_dir()
            vault_name=vault_root.name
            open_url=f"obsidian://open?vault={quote(vault_name)}&file={quote('Arcana Index')}"
        except Exception:
            connected=False
    paired=bridge_token_valid(token)
    return {
        "ok":True,
        "bridge":BRIDGE_NAME,
        "version":BRIDGE_VERSION,
        "bridgeApiVersion":BRIDGE_API_VERSION,
        "vaultConnected":connected,
        "vaultName":vault_name if connected else "",
        "capabilities":["obsidian-push","obsidian-open"],
        "pairingRequired":True,
        "paired":paired,
        "obsidian":{
            "available":True,
            "connected":connected,
            "vaultName":vault_name if connected else "",
            "vaultPath":"",
            "lastSyncAt":obs.get("lastSyncAt"),
            "autoSync":obs.get("autoSync") or "manual",
            "conflicts":len(obs.get("conflicts") or []),
            "lastPush":obs.get("lastPush") or {},
            "openUrl":open_url,
        },
    }

def obsidian_reindex_preview():
    obs=obsidian_config()
    if not obs.get("connected") or not obs.get("vaultPath"):
        raise ValueError("Conecte um vault Obsidian primeiro.")
    vault_root=resolve_vault_path(obs["vaultPath"])
    managed,_=scan_obsidian_managed(vault_root)
    folders={}
    for path in managed.values():
        folder=path.relative_to(vault_root).parent.as_posix()
        folders[folder]=folders.get(folder,0)+1
    return {"ok":True,"managedFiles":len(managed),"folders":folders,"phase":"arcana_to_obsidian_only"}

def push_obsidian_vault(payload=None):
    obs=obsidian_config()
    if not obs.get("connected") or not obs.get("vaultPath"):
        raise ValueError("Conecte um vault Obsidian primeiro.")
    vault_root=resolve_vault_path(obs["vaultPath"])
    if not vault_root.exists():
        raise FileNotFoundError("O vault configurado não existe mais.")
    files=render_obsidian_export(payload or {})
    result, tracked=write_obsidian_export(vault_root, files)
    obs=update_obsidian_config(vaultPath=str(vault_root),vaultName=vault_root.name,connected=True,lastSyncAt=now_iso(),tracked={**obs.get("tracked",{}),**tracked},conflicts=result["warnings"],lastPush={k:result[k] for k in ["ok","created","updated","unchanged","errors","warnings"]})
    status=obsidian_status_payload(obs)
    return {**result,"obsidian":status}

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
    if length>MAX_JSON_BODY_BYTES:
        raise ValueError("Payload muito grande.")
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
    def bridge_api_path(self, path):
        return path.startswith("/api/bridge") or path.startswith("/api/obsidian")
    def bridge_origin(self):
        return self.headers.get("Origin","")
    def send_bridge_cors(self):
        origin=self.bridge_origin()
        if origin and bridge_origin_allowed(origin):
            self.send_header("Access-Control-Allow-Origin",origin)
            self.send_header("Vary","Origin")
            self.send_header("Access-Control-Allow-Credentials","false")
    def require_bridge_origin(self):
        origin=self.bridge_origin()
        if bridge_origin_allowed(origin):
            return True
        return self.json({"error":"Origem não autorizada pelo Arcana Bridge."},403)
    def require_local_origin(self):
        origin=self.bridge_origin()
        if bridge_origin_local(origin):
            return True
        return self.json({"error":"Esta ação só pode ser feita no Arcana Local."},403)
    def require_bridge_token(self):
        token=self.headers.get(BRIDGE_TOKEN_HEADER,"")
        if bridge_token_valid(token):
            return True
        return self.json({"error":"Pairing code inválido ou ausente."},401)
    def do_OPTIONS(self):
        p=urlparse(self.path)
        if not self.bridge_api_path(p.path):
            self.send_response(404)
            self.end_headers()
            return
        origin=self.bridge_origin()
        if not bridge_origin_allowed(origin):
            self.send_response(403)
            self.end_headers()
            return
        self.send_response(204)
        self.send_bridge_cors()
        self.send_header("Access-Control-Allow-Methods","GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers",f"Content-Type, {BRIDGE_TOKEN_HEADER}")
        self.send_header("Access-Control-Max-Age","600")
        if self.headers.get("Access-Control-Request-Private-Network","").lower()=="true":
            self.send_header("Access-Control-Allow-Private-Network","true")
        self.end_headers()
    def do_GET(self):
        p=urlparse(self.path)
        try:
            if p.path=="/api/bridge/status":
                if not self.require_bridge_origin():
                    return
                return self.json(bridge_status_payload(self.headers.get(BRIDGE_TOKEN_HEADER,"")))
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
                self.send_header("Content-Disposition",f'attachment; filename="Arcana-Obsidian-Vault-{datetime.now().strftime("%Y-%m-%d")}.zip"')
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
                if not self.require_bridge_origin():
                    return
                return self.json({"obsidian":obsidian_status_for_origin(self.bridge_origin())})
            if p.path=="/api/obsidian/conflicts":
                if not self.require_bridge_origin():
                    return
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
            if p.path.startswith("/api/obsidian"):
                if not self.require_bridge_origin():
                    return
                if p.path=="/api/obsidian/connect" and not self.require_local_origin():
                    return
                if p.path in BRIDGE_WRITE_PATHS and not self.require_bridge_token():
                    return
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
                vault_root=validate_vault_root(data.get("vaultPath") or data.get("path"))
                auto_sync=data.get("autoSync") if data.get("autoSync") in OBSIDIAN_AUTO_SYNC else "manual"
                obs=update_obsidian_config(connected=True,vaultPath=str(vault_root),vaultName=vault_root.name,lastSyncAt=obsidian_config().get("lastSyncAt"),autoSync=auto_sync)
                return self.json({"obsidian":obsidian_status_for_origin(self.bridge_origin(),obs)},201)
            if p.path=="/api/obsidian/reindex-preview":
                return self.json(obsidian_reindex_preview())
            if p.path=="/api/obsidian/sync":
                data=read_json_body(self)
                result=push_obsidian_vault(data.get("payload") or data)
                result["obsidian"]=obsidian_status_for_origin(self.bridge_origin())
                return self.json(result)
            if p.path=="/api/obsidian/pull":
                return self.json({"error":"Obsidian -> Arcana não faz parte da Phase 1."},405)
            if p.path=="/api/obsidian/push":
                data=read_json_body(self)
                result=push_obsidian_vault(data.get("payload") or data)
                result["obsidian"]=obsidian_status_for_origin(self.bridge_origin())
                return self.json(result)
            if p.path=="/api/obsidian/disconnect":
                current=obsidian_config()
                obs=update_obsidian_config(connected=False,vaultPath="",vaultName="",tracked={},conflicts=[],lastSyncAt=current.get("lastSyncAt"),lastPush=current.get("lastPush") or {})
                return self.json({"obsidian":obsidian_status_for_origin(self.bridge_origin(),obs)})
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
        self.send_response(status);self.send_header("Content-Type","application/json; charset=utf-8");self.send_header("Cache-Control","no-store");self.send_header("Content-Length",str(len(b)))
        if self.bridge_api_path(urlparse(self.path).path):
            self.send_bridge_cors()
        self.end_headers();self.wfile.write(b)

if __name__=="__main__":
    ensure_vault()
    if "--pairing-code" in sys.argv:
        print(ensure_bridge_token())
        sys.exit(0)
    ensure_bridge_token()
    print(f"Arcana v5 em http://{HOST}:{PORT}")
    print("Arcana Obsidian Bridge ativo em /api/bridge/status. Pairing code: python3 server.py --pairing-code")
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
