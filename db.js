const ArcanaStorage=(()=>{
  const DB_NAME="arcana";
  const DB_VERSION=1;
  const MIGRATION_VERSION=1;
  const SNAPSHOT_LIMIT=10;
  const stores=["settings","tracks","courses","modules","lessons","sources","notes","fichamentos","sessions","playlists","videos","inbox","reviews","flashcards","calendar","progress","metadata","appState","backupSnapshots","attachments"];
  let db=null;
  let ready=false;

  function log(message,extra){
    console.info(`[Arcana][storage] ${message}`,extra||"")
  }
  function open(){
    if(db){
      return Promise.resolve(db)
    }
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{
        const next=req.result;
        for(const name of stores){
          if(!next.objectStoreNames.contains(name)){
            const opts=name==="metadata"||name==="appState"||name==="settings"?{keyPath:"key"}:{keyPath:"id"};
            next.createObjectStore(name,opts)
          }
        }
      };
      req.onsuccess=()=>{db=req.result;resolve(db)};
      req.onerror=()=>reject(req.error)
    })
  }
  function tx(name,mode="readonly"){
    return db.transaction(name,mode).objectStore(name)
  }
  function req(op){
    return new Promise((resolve,reject)=>{
      op.onsuccess=()=>resolve(op.result);
      op.onerror=()=>reject(op.error)
    })
  }
  async function getMeta(key){
    return (await req(tx("metadata").get(key)))?.value
  }
  async function setMeta(key,value){
    await req(tx("metadata","readwrite").put({key,value}))
  }
  async function loadState(defaultState){
    const found=await req(tx("appState").get("main"));
    return found?.value||structuredClone(defaultState)
  }
  async function saveState(state){
    await req(tx("appState","readwrite").put({key:"main",value:structuredClone(state),updatedAt:new Date().toISOString()}))
  }
  async function list(name){
    if(!stores.includes(name)){
      throw new Error("Store desconhecida")
    }
    return req(tx(name).getAll())
  }
  async function migrateLocalStorage({storageKey,legacyKeys,defaultState,normalize,migrate}){
    const done=await getMeta("localStorageMigrationVersion");
    if(done>=MIGRATION_VERSION){
      log(`localStorage migration already at v${done}`);
      return
    }
    let raw=localStorage.getItem(storageKey);
    let source=storageKey;
    if(!raw){
      for(const key of legacyKeys){
        raw=localStorage.getItem(key);
        source=key;
        if(raw){
          break
        }
      }
    }
    if(raw){
      try{
        const parsed=JSON.parse(raw);
        const migrated=source===storageKey?normalize(parsed):migrate(parsed);
        await saveState(migrated);
        log(`migrated localStorage key ${source} to IndexedDB`,{version:MIGRATION_VERSION});
      }catch(error){
        console.warn("[Arcana][storage] localStorage migration failed",error)
      }
    }else{
      const existing=await req(tx("appState").get("main"));
      if(!existing){
        await saveState(defaultState);
        log("created empty starter state in IndexedDB")
      }
    }
    await setMeta("localStorageMigrationVersion",MIGRATION_VERSION)
  }
  async function init(options){
    await open();
    await migrateLocalStorage(options);
    ready=true;
    return loadState(options.defaultState)
  }

  function now(){return new Date().toISOString()}
  function day(){return new Date().toISOString().slice(0,10)}
  function makeId(prefix){return `${prefix}_${crypto.randomUUID().replace(/-/g,"").slice(0,12)}`}
  function escYaml(value){
    if(value===null||value===undefined){return ""}
    if(Array.isArray(value)){return value.length?`\n${value.map(v=>`  - ${String(v).replace(/\n/g," ")}`).join("\n")}`:" []"}
    if(typeof value==="object"){return JSON.stringify(value)}
    return String(value).replace(/\n/g," ")
  }
  function links(content=""){
    return [...new Set([...String(content).matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)].map(m=>m[1].trim()).filter(Boolean))]
  }
  function excerpt(content=""){
    return String(content).replace(/^---[\s\S]*?---/,"").replace(/\s+/g," ").trim().slice(0,220)
  }
  function noteDefaults(data={}){
    const ts=now();
    return {
      id:data.id||makeId("note"),
      title:data.title||"Untitled Note",
      type:data.type||"quick",
      trackId:data.trackId||null,
      sourceType:data.sourceType||null,
      sourceId:data.sourceId||null,
      sessionId:data.sessionId||null,
      tags:Array.isArray(data.tags)?data.tags:[],
      createdAt:data.createdAt||ts,
      updatedAt:data.updatedAt||ts,
      favorite:!!data.favorite,
      reviewAt:data.reviewAt||null,
      status:data.status||"active",
      relatedNoteIds:Array.isArray(data.relatedNoteIds)?data.relatedNoteIds:[],
      source:data.source||{},
      citations:Array.isArray(data.citations)?data.citations:[],
      readingProgress:data.readingProgress||null,
      content:data.content||""
    }
  }
  function summarize(note){
    return {...note,content:undefined,links:links(note.content),excerpt:excerpt(note.content)}
  }
  async function listNotes(params={}){
    const rows=await req(tx("notes").getAll());
    const summaries=rows.map(summarize);
    const titleMap=new Map();
    for(const note of summaries){
      titleMap.set(note.title.trim().toLowerCase(),note.id)
    }
    const backlinks={};
    for(const note of summaries){
      for(const link of note.links){
        const target=titleMap.get(link.trim().toLowerCase());
        if(target){
          backlinks[target]=backlinks[target]||[];
          backlinks[target].push(note.id)
        }
      }
      for(const target of note.relatedNoteIds||[]){
        backlinks[target]=backlinks[target]||[];
        backlinks[target].push(note.id)
      }
    }
    for(const note of summaries){
      note.backlinkIds=backlinks[note.id]||[]
    }
    const q=(params.q||"").toLowerCase();
    let out=summaries.filter(n=>!q||[n.title,n.excerpt,(n.tags||[]).join(" ")].join(" ").toLowerCase().includes(q));
    if(params.review==="due"){
      out=out.filter(n=>n.reviewAt&&n.reviewAt<=day())
    }
    out.sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""));
    return out
  }
  async function getNote(id){
    const note=await req(tx("notes").get(id));
    if(!note){
      throw new Error("Nota não encontrada")
    }
    const summaries=await listNotes();
    const backlinks=(summaries.find(n=>n.id===id)?.backlinkIds||[]).map(nid=>summaries.find(n=>n.id===nid)).filter(Boolean);
    return {...note,links:links(note.content),excerpt:excerpt(note.content),backlinks}
  }
  async function putNote(data,id=null){
    const existing=id?await req(tx("notes").get(id)):null;
    const note=noteDefaults({...existing,...data,id:id||data.id});
    if(existing){
      note.createdAt=existing.createdAt
    }
    await req(tx("notes","readwrite").put(note));
    const dupes=(await listNotes()).filter(n=>n.id!==note.id&&n.title.trim().toLowerCase()===note.title.trim().toLowerCase());
    return {note:await getNote(note.id),duplicateCandidates:dupes}
  }
  async function archiveNote(id){
    const note=await getNote(id);
    return (await putNote({...note,status:"archived"},id)).note
  }
  async function saveFlashcard(data){
    const ts=now();
    const card={id:data.id||makeId("card"),front:data.front||"",back:data.back||"",sourceNoteId:data.sourceNoteId||null,tags:Array.isArray(data.tags)?data.tags:[],createdAt:data.createdAt||ts,updatedAt:ts,reviewAt:data.reviewAt||null};
    await req(tx("flashcards","readwrite").put(card));
    return card
  }
  async function listFlashcards(){
    return req(tx("flashcards").getAll())
  }
  async function snapshot(reason,state){
    const notes=await req(tx("notes").getAll());
    const flashcards=await listFlashcards();
    const data={version:1,createdAt:now(),reason,state:structuredClone(state),notes,flashcards};
    const json=JSON.stringify(data);
    const snap={id:makeId("snapshot"),createdAt:data.createdAt,reason,size:json.length,data};
    await req(tx("backupSnapshots","readwrite").put(snap));
    const all=(await req(tx("backupSnapshots").getAll())).sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));
    for(const old of all.slice(SNAPSHOT_LIMIT)){
      await req(tx("backupSnapshots","readwrite").delete(old.id))
    }
    return snap
  }
  async function listSnapshots(){
    return (await req(tx("backupSnapshots").getAll())).sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))
  }
  async function restoreSnapshot(id){
    const snap=await req(tx("backupSnapshots").get(id));
    if(!snap){
      throw new Error("Snapshot não encontrado")
    }
    await importFullBackup(snap.data,"replace");
    return snap.data.state
  }
  function download(blob,name){
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=name;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000)
  }
  function crc32(bytes){
    let c=~0;
    for(const b of bytes){
      c^=b;
      for(let k=0;k<8;k++){
        c=(c>>>1)^(0xedb88320&-(c&1))
      }
    }
    return ~c>>>0
  }
  function u16(n){return [n&255,(n>>>8)&255]}
  function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
  function dosDate(date=new Date()){
    return {time:(date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()/2),date:((date.getFullYear()-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate()}
  }
  function makeZip(files){
    const enc=new TextEncoder();
    const local=[];
    const central=[];
    let offset=0;
    for(const file of files){
      if(unsafePath(file.name)){
        throw new Error(`Caminho inseguro no ZIP: ${file.name}`)
      }
      const name=enc.encode(file.name);
      const data=file.bytes||enc.encode(file.text||"");
      const crc=crc32(data);
      const dt=dosDate();
      const head=new Uint8Array([80,75,3,4,...u16(20),...u16(0),...u16(0),...u16(dt.time),...u16(dt.date),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0)]);
      local.push(head,name,data);
      const cent=new Uint8Array([80,75,1,2,...u16(20),...u16(20),...u16(0),...u16(0),...u16(dt.time),...u16(dt.date),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset)]);
      central.push(cent,name);
      offset+=head.length+name.length+data.length
    }
    const centralSize=central.reduce((a,b)=>a+b.length,0);
    const end=new Uint8Array([80,75,5,6,...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(centralSize),...u32(offset),...u16(0)]);
    return new Blob([...local,...central,end],{type:"application/zip"})
  }
  function parseZip(buffer){
    const bytes=new Uint8Array(buffer);
    const dec=new TextDecoder();
    const out=[];
    let i=0;
    while(i<bytes.length-4){
      if(bytes[i]!==80||bytes[i+1]!==75||bytes[i+2]!==3||bytes[i+3]!==4){
        i++;
        continue
      }
      const method=bytes[i+8]|(bytes[i+9]<<8);
      const size=bytes[i+18]|(bytes[i+19]<<8)|(bytes[i+20]<<16)|(bytes[i+21]<<24);
      const nameLen=bytes[i+26]|(bytes[i+27]<<8);
      const extraLen=bytes[i+28]|(bytes[i+29]<<8);
      const name=dec.decode(bytes.slice(i+30,i+30+nameLen));
      if(unsafePath(name)){
        throw new Error(`Caminho inseguro no ZIP: ${name}`)
      }
      if(method!==0){
        throw new Error("ZIP comprimido não suportado neste importador estático. Reexporte pelo Arcana.")
      }
      const start=i+30+nameLen+extraLen;
      out.push({name,bytes:bytes.slice(start,start+size),text:dec.decode(bytes.slice(start,start+size))});
      i=start+size
    }
    return out
  }
  function unsafePath(path){
    return !path||path.startsWith("/")||path.includes("\\")||path.split("/").includes("..")
  }
  function slug(text){
    return String(text||"untitled").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80)||"untitled"
  }
  const OBSIDIAN_ROOT="Arcana Obsidian Vault";
  const OBSIDIAN_FOLDERS=[
    "00 Inbox/.keep",
    "10 Fichamentos/Cursos/.keep",
    "10 Fichamentos/Livros/.keep",
    "10 Fichamentos/Papers/.keep",
    "10 Fichamentos/Artigos/.keep",
    "10 Fichamentos/Videos/.keep",
    "10 Fichamentos/Podcasts/.keep",
    "10 Fichamentos/Outros/.keep",
    "20 Notas Permanentes/.keep",
    "30 Conceitos/.keep",
    "40 Perguntas/.keep",
    "50 Sessões/.keep",
    "60 Fontes/.keep",
    "70 Revisões/.keep",
    "80 Flashcards/.keep",
    "90 Arquivo/.keep",
    "Attachments/.keep",
    "Templates/.keep"
  ];
  function yamlScalar(value){
    if(value===null||value===undefined){
      return '""'
    }
    if(typeof value==="boolean"){
      return value?"true":"false"
    }
    if(typeof value==="number"){
      return String(value)
    }
    const text=String(value).replace(/\r?\n/g," ").trim();
    if(!text){
      return '""'
    }
    if(/[:#\[\]\{\},]|^\s|\s$/.test(text)){
      return JSON.stringify(text)
    }
    return text
  }
  function inlineTags(content=""){
    return [...new Set([...String(content).matchAll(/(^|\s)#([A-Za-z0-9_/-]+)/g)].map(match=>match[2].trim()).filter(Boolean))]
  }
  function mergeTags(primary=[],secondary=[]){
    return [...new Set([...(Array.isArray(primary)?primary:[]),...(Array.isArray(secondary)?secondary:[])].map(tag=>String(tag||"").trim().replace(/^#/,"")).filter(Boolean))]
  }
  function literatureSubfolder(sourceType=""){
    const kind=String(sourceType||"").toLowerCase();
    if(kind==="course"){
      return "Cursos"
    }
    if(kind==="book"||kind==="reading"){
      return "Livros"
    }
    if(kind==="paper"){
      return "Papers"
    }
    if(kind==="article"){
      return "Artigos"
    }
    if(kind==="video"){
      return "Videos"
    }
    if(kind==="podcast"){
      return "Podcasts"
    }
    return "Outros"
  }
  function obsidianFolder(note){
    if(note.status==="archived"){
      return "90 Arquivo"
    }
    if(note.type==="quick"){
      return "00 Inbox"
    }
    if(note.type==="literature"){
      return `10 Fichamentos/${literatureSubfolder(note.sourceType)}`
    }
    if(note.type==="concept"){
      return "30 Conceitos"
    }
    if(note.type==="question"){
      return "40 Perguntas"
    }
    if(note.type==="session"){
      return "50 Sessões"
    }
    if(note.type==="reference"){
      return "60 Fontes"
    }
    return "20 Notas Permanentes"
  }
  function obsidianPathFor(note){
    return `${OBSIDIAN_ROOT}/${obsidianFolder(note)}/${slug(note.title)}-${note.id}.md`
  }
  function obsidianFrontmatter(note){
    const tags=mergeTags(note.tags,inlineTags(note.content));
    const source=note.source&&Object.keys(note.source).length?JSON.stringify(note.source):"{}";
    const lines=[
      "---",
      `arcana_id: ${yamlScalar(note.id)}`,
      "arcana_managed: true",
      `title: ${yamlScalar(note.title)}`,
      `type: ${yamlScalar(note.type)}`,
      `track: ${yamlScalar(note.trackId||"")}`,
      "tags:"
    ];
    if(tags.length){
      for(const tag of tags){
        lines.push(`  - ${yamlScalar(tag)}`)
      }
    }else{
      lines.push("  []")
    }
    lines.push(`source: ${source}`);
    lines.push(`source_type: ${yamlScalar(note.sourceType||"")}`);
    lines.push(`source_id: ${yamlScalar(note.sourceId||"")}`);
    lines.push(`session_id: ${yamlScalar(note.sessionId||"")}`);
    lines.push(`created: ${yamlScalar(note.createdAt||now())}`);
    lines.push(`updated: ${yamlScalar(note.updatedAt||now())}`);
    lines.push(`review_at: ${yamlScalar(note.reviewAt||"")}`);
    lines.push(`status: ${yamlScalar(note.status||"active")}`);
    lines.push(`favorite: ${note.favorite?"true":"false"}`);
    lines.push("---");
    return lines.join("\n")
  }
  function markdownFor(note){
    const content=(note.content||`# ${note.title}\n`).trimStart();
    return `${obsidianFrontmatter(note)}\n\n${content}`
  }
  function parseMarkdown(text){
    const match=String(text).match(/^---\n([\s\S]*?)\n---\n?/);
    const meta={};
    if(match){
      const lines=match[1].split("\n");
      for(let i=0;i<lines.length;i++){
        const m=lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if(!m){continue}
        if(m[2]===""||m[2]==="[]"){
          const arr=[];
          while(lines[i+1]?.startsWith("  - ")){arr.push(lines[++i].slice(4))}
          meta[m[1]]=arr
        }else{
          try{
            meta[m[1]]=JSON.parse(m[2])
          }catch{
            meta[m[1]]=m[2]
          }
        }
      }
    }
    const content=match?String(text).slice(match[0].length):String(text);
    return {meta,content}
  }
  function noteTypeFromPath(name,meta){
    if(meta.type){
      return String(meta.type)
    }
    if(name.includes("/10 Fichamentos/")){
      return "literature"
    }
    if(name.includes("/00 Inbox/")){
      return "quick"
    }
    if(name.includes("/30 Conceitos/")){
      return "concept"
    }
    if(name.includes("/40 Perguntas/")){
      return "question"
    }
    if(name.includes("/50 Sessões/")){
      return "session"
    }
    if(name.includes("/60 Fontes/")){
      return "reference"
    }
    return "permanent"
  }
  function sourceTypeFromPath(name,meta){
    if(meta.source_type||meta.sourceType){
      return meta.source_type||meta.sourceType
    }
    if(name.includes("/10 Fichamentos/Cursos/")){
      return "course"
    }
    if(name.includes("/10 Fichamentos/Livros/")){
      return "book"
    }
    if(name.includes("/10 Fichamentos/Papers/")){
      return "paper"
    }
    if(name.includes("/10 Fichamentos/Artigos/")){
      return "article"
    }
    if(name.includes("/10 Fichamentos/Videos/")){
      return "video"
    }
    if(name.includes("/10 Fichamentos/Podcasts/")){
      return "podcast"
    }
    return null
  }
  function humanTitleFromFilename(name){
    const stem=String(name).split("/").pop().replace(/\.md$/,"").replace(/-[A-Za-z0-9_]+$/,"");
    return stem.replace(/[-_]+/g," ").trim()||"Nota importada"
  }
  function parseSourceMeta(value){
    if(value&&typeof value==="object"){
      return value
    }
    if(typeof value==="string"&&value.trim()){
      try{
        return JSON.parse(value)
      }catch{
        return {label:value}
      }
    }
    return {}
  }
  function shouldSkipImportedEntry(entry,meta){
    if(entry.name.includes("/Templates/")){
      return true
    }
    if(/\/(?:README|Arcana Index)\.md$/i.test(entry.name)){
      return true
    }
    if(meta.arcana_kind&&["index","template","track_index"].includes(String(meta.arcana_kind))){
      return true
    }
    if(entry.name.includes("/80 Flashcards/")){
      return true
    }
    return false
  }
  function obsidianIndexMarkdown(notes){
    const grouped=new Map();
    for(const note of notes){
      const key=obsidianFolder(note);
      if(!grouped.has(key)){
        grouped.set(key,[])
      }
      grouped.get(key).push(note)
    }
    const sections=["---","arcana_kind: index","title: Arcana Index","---","","# Arcana Index","","## Estrutura"];
    for(const folder of [...grouped.keys()].sort()){
      sections.push(`- [[${folder}]]`);
    }
    sections.push("","## Notas");
    for(const folder of [...grouped.keys()].sort()){
      sections.push(``, `### ${folder}`);
      for(const note of grouped.get(folder).sort((a,b)=>String(a.title).localeCompare(String(b.title),"pt-BR"))){
        sections.push(`- [[${note.title}]]`);
      }
    }
    return sections.join("\n")
  }
  function obsidianReadmeMarkdown(){
    return [
      "# Arcana + Obsidian",
      "",
      "Este vault usa Markdown comum e pode ser aberto diretamente no Obsidian.",
      "",
      "- `Arcana Index.md` resume as notas gerenciadas.",
      "- `Attachments/` guarda anexos relativos.",
      "- `Templates/` inclui modelos básicos para notas e fichamentos."
    ].join("\n")
  }
  function trackIndexFiles(notes){
    const groups=new Map();
    for(const note of notes){
      if(!note.trackId){
        continue
      }
      if(!groups.has(note.trackId)){
        groups.set(note.trackId,[])
      }
      groups.get(note.trackId).push(note)
    }
    return [...groups.entries()].map(([trackId,items])=>({
      name:`${OBSIDIAN_ROOT}/60 Fontes/track-${slug(trackId)}.md`,
      text:[
        "---",
        "arcana_kind: track_index",
        `track: ${yamlScalar(trackId)}`,
        "---",
        "",
        `# Track ${trackId}`,
        "",
        ...items.sort((a,b)=>String(a.title).localeCompare(String(b.title),"pt-BR")).map(note=>`- [[${note.title}]]`)
      ].join("\n")
    }))
  }
  async function fullBackup(state){
    return {version:1,createdAt:now(),state:structuredClone(state),notes:await req(tx("notes").getAll()),flashcards:await listFlashcards()}
  }
  async function downloadFullBackup(state){
    const data=await fullBackup(state);
    download(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),`arcana-backup-${day()}.json`)
  }
  async function importFullBackup(data,mode="replace"){
    const payload=data instanceof File?JSON.parse(await data.text()):data;
    if(!payload?.state){
      throw new Error("Backup Arcana inválido")
    }
    if(mode==="replace"){
      for(const name of ["notes","flashcards"]){
        await new Promise((resolve,reject)=>{
          const clear=tx(name,"readwrite").clear();
          clear.onsuccess=resolve;
          clear.onerror=()=>reject(clear.error)
        })
      }
    }
    await saveState(payload.state);
    for(const note of payload.notes||[]){
      await req(tx("notes","readwrite").put(noteDefaults(note)))
    }
    for(const card of payload.flashcards||[]){
      await saveFlashcard(card)
    }
    return payload.state
  }
  async function downloadVault(){
    const notes=await req(tx("notes").getAll());
    const cards=await listFlashcards();
    const files=[];
    const index={version:1,exportedAt:now(),notes:notes.map(summarize),flashcards:cards};
    for(const note of notes){
      files.push({name:obsidianPathFor(note),text:markdownFor(note)})
    }
    for(const file of OBSIDIAN_FOLDERS){
      files.push({name:`${OBSIDIAN_ROOT}/${file}`,text:""})
    }
    files.push({name:`${OBSIDIAN_ROOT}/Arcana Index.md`,text:obsidianIndexMarkdown(notes)});
    files.push({name:`${OBSIDIAN_ROOT}/README.md`,text:obsidianReadmeMarkdown()});
    files.push({name:`${OBSIDIAN_ROOT}/Templates/Permanent Note.md`,text:`---\narcana_kind: template\ntype: permanent\n---\n\n# Nova nota permanente\n\n## Ideia atômica\n\n\n## Conexões\n\n- [[Outra nota]]\n`});
    files.push({name:`${OBSIDIAN_ROOT}/Templates/Fichamento.md`,text:`---\narcana_kind: template\ntype: literature\n---\n\n# Novo fichamento\n\n## Dados da fonte\n\n- Tipo:\n- Autor/canal:\n- URL/ISBN/DOI:\n\n## Resumo\n\n\n## Citações\n\n- \n\n## Ideias e conexões\n\n- [[Conceito relacionado]]\n`});
    files.push({name:`${OBSIDIAN_ROOT}/Templates/Session Note.md`,text:`---\narcana_kind: template\ntype: session\n---\n\n# Sessão\n\n## Registro\n\n\n## Conceitos\n\n\n## Próximas ações\n\n- [ ] \n`});
    files.push(...trackIndexFiles(notes));
    files.push({name:`${OBSIDIAN_ROOT}/index.json`,text:JSON.stringify(index,null,2)});
    files.push({name:`${OBSIDIAN_ROOT}/80 Flashcards/flashcards.json`,text:JSON.stringify(cards,null,2)});
    download(makeZip(files),`arcana-vault-${day()}.zip`)
  }
  async function importVault(file){
    const entries=parseZip(await file.arrayBuffer());
    const md=entries.filter(e=>e.name.endsWith(".md"));
    if(!md.length){
      throw new Error("Vault Obsidian inválido")
    }
    let importedNotes=0;
    let arcanaManagedNotes=0;
    let externalNotes=0;
    for(const entry of md){
      const {meta,content}=parseMarkdown(entry.text);
      if(shouldSkipImportedEntry(entry,meta)){
        continue
      }
      const managed=meta.arcana_managed===true||String(meta.arcana_managed||"").toLowerCase()==="true";
      const tags=mergeTags(Array.isArray(meta.tags)?meta.tags:[],inlineTags(content));
      const noteId=meta.arcana_id||meta.id||undefined;
      await putNote({
        id:noteId,
        title:meta.title||humanTitleFromFilename(entry.name),
        type:noteTypeFromPath(entry.name,meta),
        trackId:meta.track||meta.trackId||null,
        tags,
        createdAt:meta.created||meta.createdAt||undefined,
        updatedAt:meta.updated||meta.updatedAt||undefined,
        reviewAt:meta.review_at||meta.reviewAt||null,
        sourceType:sourceTypeFromPath(entry.name,meta),
        sourceId:meta.source_id||meta.sourceId||null,
        sessionId:meta.session_id||meta.sessionId||null,
        favorite:meta.favorite===true||String(meta.favorite||"").toLowerCase()==="true",
        status:meta.status||(entry.name.includes("/90 Arquivo/")?"archived":"active"),
        source:parseSourceMeta(meta.source),
        content
      },noteId||null);
      importedNotes+=1;
      if(managed){
        arcanaManagedNotes+=1
      }else{
        externalNotes+=1
      }
    }
    let importedFlashcards=0;
    const flash=entries.find(e=>e.name.endsWith("/80 Flashcards/flashcards.json")||e.name.endsWith("/flashcards/flashcards.json"));
    if(flash){
      for(const card of JSON.parse(flash.text)){
        await saveFlashcard(card)
        importedFlashcards+=1
      }
    }
    return {importedNotes,arcanaManagedNotes,externalNotes,importedFlashcards}
  }
  function canHandle(path,method="GET"){
    return path.startsWith("/api/notes")||path.startsWith("/api/flashcards")||path==="/api/reindex"||path==="/api/backup"
  }
  async function route(path,opts={}){
    const method=(opts.method||"GET").toUpperCase();
    const body=opts.body?JSON.parse(opts.body):{};
    const url=new URL(path,location.origin);
    if(url.pathname==="/api/notes"&&method==="GET"){
      return {notes:await listNotes(Object.fromEntries(url.searchParams.entries()))}
    }
    if(url.pathname.startsWith("/api/notes/")){
      const id=decodeURIComponent(url.pathname.split("/").pop());
      if(method==="GET"){return {note:await getNote(id)}}
      if(method==="PUT"){return putNote(body,id)}
      if(method==="DELETE"){return {note:await archiveNote(id)}}
    }
    if(url.pathname==="/api/notes"&&method==="POST"){return putNote(body)}
    if(url.pathname==="/api/flashcards"&&method==="POST"){return {flashcard:await saveFlashcard(body)}}
    if(url.pathname==="/api/reindex"){return {ok:true,notes:await listNotes()}}
    if(url.pathname==="/api/backup"&&method==="POST"){return {ok:true,snapshot:await snapshot("auto",body)}}
    throw new Error("Rota estática não implementada")
  }

  return {init,loadState,saveState,list,snapshot,listSnapshots,restoreSnapshot,downloadFullBackup,importFullBackup,downloadVault,importVault,canHandle,route,get ready(){return ready},log}
})();
if(typeof window!=="undefined"){
  window.ArcanaStorage=ArcanaStorage
}
