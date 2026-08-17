#!/usr/bin/env python3
import io, json, os, re, subprocess, sys, unicodedata, uuid, zipfile
from datetime import datetime
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, unquote, urlencode, urlparse
from pathlib import Path

ROOT=Path(__file__).resolve().parent
BACKUPS=ROOT/"backups"
DATA=ROOT/"data"
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
NOTE_DIRS=("literature","permanent","sessions","quick","archive")
IDEA_TYPES={"permanent","concept","question","insight","quote","reference","next_action"}
NOTE_TYPES=IDEA_TYPES|{"literature","session","quick"}

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
    for line in raw:
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, val=line.split(":",1)
        key=key.strip()
        val=val.strip()
        if val=="":
            meta[key]=None
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
    note["links"]=sorted(set(x.strip() for x in WIKI_LINK_RE.findall(content) if x.strip()))
    note["excerpt"]=re.sub(r"\s+"," ",content).strip()[:220]
    return note

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
