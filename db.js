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
      courseId:data.courseId||null,
      moduleId:data.moduleId||null,
      lessonId:data.lessonId||null,
      sourceType:data.sourceType||null,
      sourceId:data.sourceId||null,
      sourceTitle:data.sourceTitle||data.source?.title||"",
      sessionId:data.sessionId||null,
      durationMinutes:Number(data.durationMinutes||0)||0,
      tags:Array.isArray(data.tags)?data.tags:[],
      createdAt:data.createdAt||ts,
      updatedAt:data.updatedAt||ts,
      favorite:!!data.favorite,
      reviewAt:data.reviewAt||null,
      status:data.status||"active",
      relatedNoteIds:Array.isArray(data.relatedNoteIds)?data.relatedNoteIds:[],
      source:data.source||{},
      blocks:Array.isArray(data.blocks)?data.blocks:[],
      questionStatus:data.questionStatus||data.question_status||null,
      promotedNoteIds:Array.isArray(data.promotedNoteIds)?data.promotedNoteIds:[],
      citations:Array.isArray(data.citations)?data.citations:[],
      readingProgress:data.readingProgress||null,
      content:data.content||""
    }
  }
  function summarize(note){
    const blockText=Array.isArray(note.blocks)?note.blocks.map(block=>[block.title,block.content].join(" ")).join("\n"):"";
    return {...note,content:undefined,links:links([note.content,blockText].join("\n")),excerpt:excerpt([note.content,blockText].join("\n"))}
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
  const OBSIDIAN_FOLDERS=[
    "00 Inbox/",
    "10 Fichamentos/Cursos/",
    "10 Fichamentos/Livros/",
    "10 Fichamentos/Papers/",
    "10 Fichamentos/Artigos/",
    "10 Fichamentos/Videos/",
    "10 Fichamentos/Podcasts/",
    "10 Fichamentos/Outros/",
    "20 Notas Permanentes/",
    "30 Conceitos/",
    "40 Perguntas/",
    "50 Sessões/",
    "60 Fontes/",
    "70 Revisões/",
    "80 Flashcards/",
    "90 Arquivo/",
    "Attachments/",
    "Tracks/",
    "Courses/"
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
  function obsidianSafeFilename(title,fallback="Arcana"){
    const text=String(title||fallback).normalize("NFC").replace(/[\u0000-\u001f\u007f/\\]+/g," ").replace(/[<>:"|?*]+/g," ").replace(/\s+/g," ").trim().replace(/[. ]+$/,"");
    return (text||fallback).slice(0,120)
  }
  function obsidianLink(title){
    return `[[${String(title||"Sem titulo").replace(/[\[\]]/g,"")}]]`
  }
  function obsidianPathFor(note){
    return `${obsidianFolder(note)}/${obsidianSafeFilename(note.title||"Nota")}.md`
  }
  function arcanaFrontmatter(meta){
    const lines=["---","arcana_managed: true",`arcana_id: ${yamlScalar(meta.arcana_id)}`];
    for(const key of ["type","title","track","track_id","course","course_id","module","module_id","lesson","lesson_id","source","source_type","source_id","session_id","date","duration_minutes","question_status","created","updated","review_at","status","favorite"]){
      if(Object.prototype.hasOwnProperty.call(meta,key)){
        lines.push(`${key}: ${yamlScalar(meta[key])}`)
      }
    }
    const tags=Array.isArray(meta.tags)?meta.tags:[];
    lines.push("tags:");
    if(tags.length){
      for(const tag of [...new Set(tags.map(item=>String(item||"").trim().replace(/^#/,"")).filter(Boolean))].sort()){
        lines.push(`  - ${yamlScalar(tag)}`)
      }
    }else{
      lines.push("  []")
    }
    lines.push("---");
    return lines.join("\n")
  }
  function obsidianFile(name,text,arcanaId,type,updated=""){
    if(unsafePath(name)){
      throw new Error(`Caminho Obsidian inseguro: ${name}`)
    }
    return {name,text:`${String(text).trimEnd()}\n`,arcanaId,type,updated}
  }
  function buildObsidianLookups(payload){
    const state=payload?.state||{};
    const tracks=new Map((Array.isArray(state.tracks)?state.tracks:[]).filter(item=>item?.id).map(item=>[String(item.id),item]));
    const courses=new Map();
    const modules=new Map();
    const lessons=new Map();
    const courseByLesson=new Map();
    const moduleByLesson=new Map();
    for(const item of Array.isArray(state.items)?state.items:[]){
      if(!item||!(item.kind==="course"||Array.isArray(item.modules))){
        continue
      }
      if(item.id){
        courses.set(String(item.id),item)
      }
      for(const module of item.modules||[]){
        if(module?.id){
          modules.set(String(module.id),module)
        }
        for(const lesson of module?.lessons||[]){
          if(lesson?.id){
            lessons.set(String(lesson.id),lesson);
            courseByLesson.set(String(lesson.id),String(item.id));
            if(module?.id){
              moduleByLesson.set(String(lesson.id),String(module.id))
            }
          }
        }
      }
    }
    return {tracks,courses,modules,lessons,courseByLesson,moduleByLesson}
  }
  function enrichObsidianNote(note,lookups){
    const source=note.source&&typeof note.source==="object"?note.source:{};
    const sourceId=note.sourceId||source.lessonId||source.moduleId||source.courseId;
    const course=lookups.courses.get(String(source.courseId||note.courseId||lookups.courseByLesson.get(String(sourceId))||""))||null;
    const module=lookups.modules.get(String(source.moduleId||note.moduleId||lookups.moduleByLesson.get(String(sourceId))||""))||null;
    const lesson=lookups.lessons.get(String(source.lessonId||note.lessonId||sourceId||""))||null;
    const track=lookups.tracks.get(String(note.trackId||(course?.trackId)||""))||null;
    return {...note,sourceId,_course:course,_module:module,_lesson:lesson,_track:track}
  }
  function obsidianFrontmatterForNote(note){
    const blockContent=Array.isArray(note.blocks)?note.blocks.map(block=>[block.title,block.content].join(" ")).join("\n"):"";
    const tags=mergeTags(note.tags,inlineTags([note.content,blockContent].join("\n")));
    return arcanaFrontmatter({
      arcana_id:note.id,
      type:note.type||"permanent",
      title:note.title||"Nota",
      track:note._track?.name||"",
      track_id:note.trackId||note._track?.id||"",
      course:note._course?.title||"",
      course_id:note._course?.id||"",
      module:note._module?.title||"",
      module_id:note._module?.id||"",
      lesson:note._lesson?.title||"",
      lesson_id:note._lesson?.id||"",
      source:note.sourceTitle||note.source?.title||"",
      source_type:note.sourceType||"",
      source_id:note.sourceId||"",
      session_id:note.sessionId||"",
      date:note.createdAt?String(note.createdAt).slice(0,10):"",
      duration_minutes:Number(note.durationMinutes||note.source?.minutes||0)||0,
      question_status:note.questionStatus||"",
      created:note.createdAt||"",
      updated:note.updatedAt||"",
      review_at:note.reviewAt||"",
      status:note.status||"active",
      favorite:!!note.favorite,
      tags
    })
  }
  function noteBlocks(note,type){
    return (Array.isArray(note.blocks)?note.blocks:[]).filter(block=>block?.type===type&&String([block.title,block.content].join("")).trim())
  }
  function blockTitle(block){
    return String(block.title||String(block.content||"").split(/\r?\n/).map(line=>line.trim()).find(Boolean)||"Nota").trim()
  }
  function indented(text){
    return String(text||"").trim().split(/\r?\n/).map(line=>`  ${line}`).join("\n")
  }
  function section(lines,title,body){
    const items=Array.isArray(body)?body.filter(item=>String(item||"").trim()):[body].filter(item=>String(item||"").trim());
    if(items.length){
      lines.push("",`## ${title}`,"",...items)
    }
  }
  function contextLines(note){
    const lines=[];
    if(note._track){lines.push(`- Trilha: ${obsidianLink(note._track.name)}`)}
    if(note._course){lines.push(`- Curso: ${obsidianLink(note._course.title)}`)}
    if(note._module){lines.push(`- Módulo: ${note._module.title||""}`)}
    if(note._lesson){lines.push(`- Aula: ${note._lesson.title||""}`)}
    return lines
  }
  function markdownForSession(note){
    const lines=[`# ${note.title||"Sessão"}`];
    section(lines,"Contexto",contextLines(note));
    const duration=Number(note.durationMinutes||note.source?.minutes||0)||0;
    section(lines,"Sessão",[note.createdAt?`- Data: ${String(note.createdAt).slice(0,10)}`:"",duration?`- Duração: ${duration} min`:""]);
    section(lines,"O que aprendi",String(note.content||"").trim());
    section(lines,"Conceitos",noteBlocks(note,"concept").map(block=>`- ${obsidianLink(blockTitle(block))}${block.content?`\n${indented(block.content)}`:""}`));
    section(lines,"Perguntas",noteBlocks(note,"question").map(block=>`- ${obsidianLink(blockTitle(block))}${block.content?`\n${indented(block.content)}`:""}`));
    section(lines,"Insights",noteBlocks(note,"insight").map(block=>`- ${obsidianLink(blockTitle(block))}${block.content?`\n${indented(block.content)}`:""}`));
    section(lines,"Citações",noteBlocks(note,"quote").map(block=>`${block.title?`- ${block.title}\n`:""}> ${String(block.content||"").trim().replace(/\n/g,"\n> ")}`));
    section(lines,"Exemplos",noteBlocks(note,"example").map(block=>`- ${blockTitle(block)}${block.content?`\n${indented(block.content)}`:""}`));
    section(lines,"Fórmulas e comandos",noteBlocks(note,"formula").map(block=>`- ${blockTitle(block)}${block.content?`\n\n\`\`\`\n${String(block.content).trim()}\n\`\`\``:""}`));
    section(lines,"Próximos passos",noteBlocks(note,"next_action").map(block=>`- [ ] ${blockTitle(block)}${block.content?`\n${indented(block.content)}`:""}`));
    section(lines,"Notas livres",noteBlocks(note,"free").map(block=>`- ${blockTitle(block)}${block.content?`\n${indented(block.content)}`:""}`));
    return `${obsidianFrontmatterForNote(note)}\n\n${lines.join("\n").trimEnd()}\n`
  }
  function markdownForQuestion(note){
    const lines=[`# ${note.title||"Pergunta"}`];
    section(lines,"Contexto",contextLines(note));
    if(String(note.content||"").trim()){
      section(lines,"Pergunta",String(note.content||"").trim())
    }
    section(lines,"Status",`- ${note.questionStatus||"open"}`);
    return `${obsidianFrontmatterForNote(note)}\n\n${lines.join("\n").trimEnd()}\n`
  }
  function markdownFor(note){
    if(note.type==="session"){
      return markdownForSession(note)
    }
    if(note.type==="question"){
      return markdownForQuestion(note)
    }
    const body=[`# ${note.title||"Nota"}`];
    if(note._course||note._module||note._lesson){
      body.push("","## Contexto");
      if(note._course){body.push(`- Curso: ${obsidianLink(note._course.title)}`)}
      if(note._module){body.push(`- Módulo: ${note._module.title||""}`)}
      if(note._lesson){body.push(`- Aula: ${note._lesson.title||""}`)}
    }
    if(note.sourceType||note.sourceId){
      body.push("","## Fonte",`- Tipo: ${note.sourceType||"fonte"}`,`- ID: ${note.sourceId||""}`)
    }
    if(String(note.content||"").trim()){
      body.push("","## Nota","",String(note.content||"").trim())
    }
    return `${obsidianFrontmatterForNote(note)}\n\n${body.join("\n").trimEnd()}\n`
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
    if(/\/?(?:README|README - Arcana|Arcana Index)\.md$/i.test(entry.name)){
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
  function obsidianIndexMarkdown(notes,courses=[],tracks=[]){
    const grouped=new Map();
    for(const note of notes){
      const key=obsidianFolder(note);
      if(!grouped.has(key)){
        grouped.set(key,[])
      }
      grouped.get(key).push(note)
    }
    const sections=[arcanaFrontmatter({arcana_id:"arcana-index",type:"index",title:"Arcana Index",status:"active",tags:["arcana/index"]}),"","# Arcana Index","","## Estrutura"];
    for(const folder of OBSIDIAN_FOLDERS){
      sections.push(`- \`${folder}\``);
    }
    sections.push("","## Trilhas");
    for(const track of tracks){
      sections.push(`- ${obsidianLink(track.name||track.title||"Trilha")}`);
    }
    sections.push("","## Cursos");
    for(const course of courses){
      sections.push(`- ${obsidianLink(course.title||course.name||"Curso")}`);
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
      arcanaFrontmatter({arcana_id:"arcana-readme",type:"readme",title:"README - Arcana",status:"active",tags:["arcana/readme"]}),
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
      "Phase 1 e somente Arcana -> Markdown -> Obsidian. Importacao direta do Obsidian para o Arcana ainda nao faz parte desta fase."
    ].join("\n")
  }
  function obsidianCourseMarkdown(course,lookups){
    const track=lookups.tracks.get(String(course.trackId||""));
    const title=course.title||course.name||"Curso";
    const meta={arcana_id:course.id,type:"course",title,track:track?.name||"",track_id:course.trackId||"",course:title,course_id:course.id||"",created:course.createdAt||"",updated:course.updatedAt||"",status:course.status||"active",tags:["arcana/course"]};
    const lines=[`# ${title}`,"","## Modulos"];
    for(const module of course.modules||[]){
      lines.push("",`### ${module.title||"Modulo"}`);
      for(const lesson of module.lessons||[]){
        const done=lesson?.done?"x":" ";
        const url=lesson?.url?` - ${lesson.url}`:"";
        lines.push(`- [${done}] ${lesson?.title||"Licao"}${url}`)
      }
    }
    return `${arcanaFrontmatter(meta)}\n\n${lines.join("\n").trimEnd()}\n`
  }
  function obsidianTrackMarkdown(track,courses,notes){
    const title=track.name||track.title||"Trilha";
    const meta={arcana_id:track.id,type:"track",title,track:title,track_id:track.id||"",created:track.createdAt||"",updated:track.updatedAt||"",status:"active",tags:["arcana/track"]};
    const current=courses.find(course=>Number(course.progress||0)<100)||courses[0]||null;
    const recent=items=>items.slice().sort((a,b)=>String(b.updatedAt||b.createdAt||"").localeCompare(String(a.updatedAt||a.createdAt||""))).slice(0,8);
    const lines=[`# ${title}`];
    section(lines,"Curso atual",current?[`- ${obsidianLink(current.title||current.name)}`]:[]);
    section(lines,"Cursos",courses.map(course=>`- ${obsidianLink(course.title||course.name)}`));
    section(lines,"Fichamentos recentes",recent(notes.filter(note=>note.type==="literature")).map(note=>`- ${obsidianLink(note.title)}`));
    section(lines,"Notas permanentes",recent(notes.filter(note=>note.type==="permanent"||note.type==="concept")).map(note=>`- ${obsidianLink(note.title)}`));
    section(lines,"Perguntas abertas",recent(notes.filter(note=>note.type==="question"&&(note.questionStatus||"open")==="open")).map(note=>`- ${obsidianLink(note.title)}`));
    section(lines,"Sessões recentes",recent(notes.filter(note=>note.type==="session")).map(note=>`- ${obsidianLink(note.title)}`));
    return `${arcanaFrontmatter(meta)}\n\n${lines.join("\n").trimEnd()}\n`
  }
  function obsidianSourceFiles(notes){
    const out=new Map();
    for(const note of notes){
      const source=note.source&&typeof note.source==="object"?note.source:{};
      const sourceId=note.sourceId||source.id||source.lessonId||source.moduleId||source.courseId;
      const url=source.url||source.canonicalUrl||"";
      if(!sourceId&&!url){
        continue
      }
      const id=`source-${sourceId||slug(url,"fonte")}`;
      if(out.has(id)){
        continue
      }
      const title=source.title||note.sourceTitle||sourceId||url||"Fonte Arcana";
      const meta={arcana_id:id,type:"source",title,source:title,source_type:note.sourceType||source.type||"source",source_id:sourceId||"",created:note.createdAt||"",updated:note.updatedAt||"",status:"active",tags:["arcana/source"]};
      const lines=[`# ${title}`,"","## Metadados"];
      if(url){lines.push(`- URL: ${url}`)}
      if(source.channel){lines.push(`- Canal: ${source.channel}`)}
      if(source.timestamp){lines.push(`- Timestamp: ${source.timestamp}`)}
      lines.push("","## Notas relacionadas",`- ${obsidianLink(note.title)}`);
      out.set(id,obsidianFile(`60 Fontes/${obsidianSafeFilename(title)}.md`,`${arcanaFrontmatter(meta)}\n\n${lines.join("\n")}`,id,"source",meta.updated))
    }
    return [...out.values()]
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
  async function obsidianPayload(state={}){
    const notes=await req(tx("notes").getAll());
    const flashcards=await listFlashcards();
    return {state:structuredClone(state),notes,fichamentos:notes.filter(note=>note.type==="literature"),flashcards}
  }
  function renderObsidianVault(payload={}){
    const lookups=buildObsidianLookups(payload);
    const notes=[];
    for(const raw of payload.notes||[]){
      if(raw?.id){
        notes.push(enrichObsidianNote(noteDefaults(raw),lookups))
      }
    }
    for(const raw of payload.fichamentos||[]){
      if(raw?.id&&!notes.some(note=>note.id===raw.id)){
        notes.push(enrichObsidianNote(noteDefaults({...raw,type:raw.type||"literature"}),lookups))
      }
    }
    const state=payload.state||{};
    const courses=(Array.isArray(state.items)?state.items:[]).filter(item=>item?.id&&(item.kind==="course"||Array.isArray(item.modules)));
    const tracks=Array.isArray(state.tracks)?state.tracks.filter(track=>track?.id):[];
    const files=OBSIDIAN_FOLDERS.map(name=>({name,text:""}));
    for(const note of notes.sort((a,b)=>`${obsidianFolder(a)} ${a.title||""}`.localeCompare(`${obsidianFolder(b)} ${b.title||""}`,"pt-BR"))){
      files.push(obsidianFile(obsidianPathFor(note),markdownFor(note),note.id,note.type||"note",note.updatedAt||""))
    }
    for(const course of courses){
      files.push(obsidianFile(`Courses/${obsidianSafeFilename(course.title||course.name||"Curso")}.md`,obsidianCourseMarkdown(course,lookups),course.id,"course",course.updatedAt||""))
    }
    for(const track of tracks){
      const trackCourses=courses.filter(course=>course.trackId===track.id);
      const trackNotes=notes.filter(note=>note.trackId===track.id);
      files.push(obsidianFile(`Tracks/${obsidianSafeFilename(track.name||track.title||"Trilha")}.md`,obsidianTrackMarkdown(track,trackCourses,trackNotes),track.id,"track",track.updatedAt||""))
    }
    for(const card of payload.flashcards||[]){
      if(!card?.id){
        continue
      }
      const title=card.front||"Flashcard";
      const meta={arcana_id:card.id,type:"flashcard",title,source_id:card.sourceNoteId||"",created:card.createdAt||"",updated:card.updatedAt||"",review_at:card.reviewAt||"",status:"active",tags:Array.isArray(card.tags)?card.tags:[]};
      files.push(obsidianFile(`80 Flashcards/${obsidianSafeFilename(title,"Flashcard")}.md`,`${arcanaFrontmatter(meta)}\n\n# ${title}\n\n## Verso\n\n${card.back||""}`,card.id,"flashcard",card.updatedAt||""))
    }
    files.push(...obsidianSourceFiles(notes));
    files.push(obsidianFile("Arcana Index.md",obsidianIndexMarkdown(notes,courses,tracks),"arcana-index","index",""));
    files.push(obsidianFile("README - Arcana.md",obsidianReadmeMarkdown(),"arcana-readme","readme",""));
    const used=new Map();
    return files.map(file=>{
      if(!used.has(file.name)){
        used.set(file.name,file.arcanaId||"");
        return file
      }
      if(used.get(file.name)===file.arcanaId){
        return null
      }
      const parts=file.name.split("/");
      const leaf=parts.pop();
      const dot=leaf.lastIndexOf(".");
      const stem=dot>=0?leaf.slice(0,dot):leaf;
      const ext=dot>=0?leaf.slice(dot):".md";
      let n=2;
      let candidate="";
      do{
        candidate=[...parts,`${stem} - ${n}${ext}`].join("/");
        n+=1
      }while(used.has(candidate));
      used.set(candidate,file.arcanaId||"");
      return {...file,name:candidate}
    }).filter(Boolean)
  }
  async function downloadObsidianVault(state={}){
    download(makeZip(renderObsidianVault(await obsidianPayload(state))),`Arcana-Obsidian-Vault-${day()}.zip`)
  }
  async function downloadVault(state={}){
    await downloadObsidianVault(state)
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

  return {init,loadState,saveState,list,snapshot,listSnapshots,restoreSnapshot,downloadFullBackup,importFullBackup,obsidianPayload,renderObsidianVault,downloadObsidianVault,downloadVault,importVault,canHandle,route,get ready(){return ready},log}
})();
if(typeof window!=="undefined"){
  window.ArcanaStorage=ArcanaStorage
}
