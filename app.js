
const STORAGE_KEY="arcana-v5";
const LEGACY_KEYS=["arcana-activity-hub-v4","arcana-activity-hub-v3","arcana-activity-hub-v2"];
const STARTER_CONTENT_VERSION=2;
const DEFAULT_OBSIDIAN_STATE={available:false,connected:false,vaultName:"",vaultPath:"",lastSyncAt:null,noteCount:0,fichamentoCount:0,attachmentCount:0,flashcardCount:0,conflicts:0,autoSync:"after_session",openUrl:"",error:null};
const DEFAULT_STATE={activeTrack:"default",tracks:[{id:"default",name:"Principal",sigil:"☽",subtitle:"Seu caminho inicial",description:"Uma trilha vazia para começar sem publicar dados pessoais.",weeklyGoal:120}],items:[],playlists:[{id:"main-playlist",youtubePlaylistId:"",name:"Playlist de foco",url:"",enabled:true,createdAt:null,updatedAt:null,lastSyncAt:null,lastSyncError:null,catalogGeneratedAt:null,catalogTitle:null}],activePlaylist:"main-playlist",youtubeQueue:[],youtubeDaily:{},youtubeSettings:{mode:"either",minutes:45,count:3,hideAfterLimit:true},obsidian:structuredClone(DEFAULT_OBSIDIAN_STATE),inbox:[],sessions:[],xp:0,streak:0,lastStudyDate:null,weeklyProgress:{default:0},shortcuts:[{label:"YouTube",url:"https://www.youtube.com/",glyph:"▶"},{label:"GitHub",url:"https://github.com/",glyph:"⌘"},{label:"ChatGPT",url:"https://chatgpt.com/",glyph:"✧"}],lastAutoBackup:null,dailyPlan:{date:null,minutes:60,items:[]},starterContentVersion:0};
const STARTER_TRACKS=[
  {id:"track-electronics",name:"Eletrônica",sigil:"☿",subtitle:"Circuitos · FPGA · RISC-V · Verificação",description:"Trilha técnica de sistemas embarcados, lógica digital, FPGA, arquitetura de computadores, RISC-V, SystemVerilog, UVM e VLSI.",weeklyGoal:240},
  {id:"track-finance",name:"Finanças",sigil:"♃",subtitle:"Planejamento · Mercados · Investimentos · Portfólio",description:"Trilha para construir uma base sólida de finanças pessoais, mercados financeiros, investimentos, portfólio e finanças corporativas.",weeklyGoal:120}
];
const STARTER_COURSES=[
  {id:"course-elec-01",track:"track-electronics",title:"Microcontrollers: Basic Architecture and Design",source:"Coursera",url:"https://www.coursera.org/learn/microcontrollers-basic-architecture-and-design",estimatedMinutes:900,important:true,urgent:false,description:"Arquitetura de MCU, processador, memória, interfaces, desempenho, energia e custo.",catalogOrder:1},
  {id:"course-elec-02",track:"track-electronics",title:"Introduction to FPGA Design for Embedded Systems",source:"Coursera · University of Colorado Boulder",url:"https://www.coursera.org/learn/intro-fpga-design-embedded-systems",estimatedMinutes:900,important:true,urgent:false,description:"Introdução prática a FPGA, arquiteturas, ferramentas e primeiros projetos.",catalogOrder:2},
  {id:"course-elec-03",track:"track-electronics",title:"Hardware Description Languages for FPGA Design",source:"Coursera · University of Colorado Boulder",url:"https://www.coursera.org/learn/fpga-hardware-description-languages",estimatedMinutes:900,important:true,urgent:false,description:"VHDL e Verilog para projeto lógico e FPGA. Base antes de SystemVerilog e UVM.",catalogOrder:3},
  {id:"course-elec-04",track:"track-electronics",title:"FPGA Design for Embedded Systems Specialization",source:"Coursera · University of Colorado Boulder",url:"https://www.coursera.org/specializations/fpga-design",estimatedMinutes:7200,important:true,urgent:false,description:"Trilha principal de FPGA. Usar o progresso deste item como progresso global da especialização.",catalogOrder:4},
  {id:"course-elec-05",track:"track-electronics",title:"Computer Architecture",source:"Coursera · Princeton University",url:"https://www.coursera.org/learn/comparch",estimatedMinutes:1800,important:true,urgent:false,description:"Arquitetura de microprocessadores modernos.",catalogOrder:5},
  {id:"course-elec-06",track:"track-electronics",title:"Introduction to RISC-V (LFD110)",source:"Linux Foundation",url:"https://training.linuxfoundation.org/training/introduction-to-riscv-lfd110/",estimatedMinutes:480,important:true,urgent:false,description:"Introdução à ISA RISC-V, arquitetura, ecossistema e prática inicial.",catalogOrder:6},
  {id:"course-elec-07",track:"track-electronics",title:"Building a RISC-V CPU Core (LFD111x)",source:"Linux Foundation",url:"https://training.linuxfoundation.org/training/building-a-riscv-cpu-core-lfd111x/",estimatedMinutes:960,important:true,urgent:false,description:"Projeto hands-on de um core RISC-V. Fazer depois da base de HDL/FPGA e arquitetura.",catalogOrder:7},
  {id:"course-elec-08",track:"track-electronics",title:"SystemVerilog Tutorials: Hardware Design & Verification",source:"Coursera",url:"https://www.coursera.org/learn/systemverilog-tutorials-hardware-design--verification",estimatedMinutes:720,important:true,urgent:false,description:"SystemVerilog aplicado a RTL e verificação. Preparação para UVM.",catalogOrder:8},
  {id:"course-elec-09",track:"track-electronics",title:"Introduction to the UVM",source:"Siemens Verification Academy",url:"https://verificationacademy.com/topics/uvm-universal-verification-methodology/introduction-to-the-uvm/",estimatedMinutes:720,important:true,urgent:false,description:"Introdução progressiva a Universal Verification Methodology até a construção de um testbench UVM.",catalogOrder:9},
  {id:"course-elec-10",track:"track-electronics",title:"Chip based VLSI design for Industrial Applications",source:"Coursera",url:"https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications",estimatedMinutes:5400,important:true,urgent:false,description:"Etapa complementar de VLSI, chip design, HDL e sistemas baseados em FPGA.",catalogOrder:10},
  {id:"course-fin-01",track:"track-finance",title:"Personal & Family Financial Planning",source:"Coursera · University of Florida",url:"https://www.coursera.org/learn/family-planning",estimatedMinutes:1080,important:true,urgent:false,description:"Base prática de orçamento, fluxo de caixa, crédito, impostos, seguros e planejamento financeiro pessoal.",catalogOrder:1},
  {id:"course-fin-02",track:"track-finance",title:"Financial Markets",source:"Coursera · Yale University",url:"https://www.coursera.org/learn/financial-markets-global",estimatedMinutes:1980,important:true,urgent:false,description:"Mercados financeiros, risco, behavioral finance, securities, seguros e sistema bancário.",catalogOrder:2},
  {id:"course-fin-03",track:"track-finance",title:"Understanding Financial Markets",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/understanding-financial-markets",estimatedMinutes:600,important:true,urgent:false,description:"Instrumentos, mercados e fundamentos do processo de investimento.",catalogOrder:3},
  {id:"course-fin-04",track:"track-finance",title:"Meeting Investors' Goals",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/meeting-investors-goals",estimatedMinutes:600,important:true,urgent:false,description:"Objetivos, restrições, perfil de risco e construção do processo de investimento.",catalogOrder:4},
  {id:"course-fin-05",track:"track-finance",title:"Portfolio and Risk Management",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/portfolio-risk-management",estimatedMinutes:600,important:true,urgent:false,description:"Construção de portfólio, diversificação, risco e avaliação de carteiras.",catalogOrder:5},
  {id:"course-fin-06",track:"track-finance",title:"Securing Investment Returns in the Long Run",source:"Coursera · University of Geneva",url:"https://www.coursera.org/learn/investment-returns-long-run",estimatedMinutes:600,important:true,urgent:false,description:"Investimento ativo e passivo, performance ajustada ao risco, estratégia de longo prazo, sustainable finance e fintech.",catalogOrder:6},
  {id:"course-fin-07",track:"track-finance",title:"Fundamentals of Finance",source:"Coursera · University of Pennsylvania (Wharton)",url:"https://www.coursera.org/learn/finance-fundamentals",estimatedMinutes:600,important:true,urgent:false,description:"Juros simples e compostos, NPV, anuidades, perpetuidades e fundamentos de corporate finance.",catalogOrder:7}
];
const STARTER_PLAYLISTS=[
  {id:"playlist-learning-main",youtubePlaylistId:"PLNur2Ccbfc5k",name:"Playlist de aprendizado",url:"https://www.youtube.com/playlist?list=PLNur2Ccbfc5k",enabled:true,createdAt:"2026-08-17T00:00:00.000Z",updatedAt:"2026-08-17T00:00:00.000Z",lastSyncAt:null,lastSyncError:null,catalogGeneratedAt:null,catalogTitle:null}
];
const ARCANA_PLAYLIST_ISSUE_URL="https://github.com/NataliaCarvalhinha/arcana/issues/new";
let state=structuredClone(DEFAULT_STATE),currentView="home",focusRef=null,timer=0,timerHandle=null,notesRef=null,calendarCursor=new Date(),syncing=false;
let vaultNotes=[],activeVaultNote=null,activeVaultMode="notes",vaultSaveTimer=null,focusNoteId=null,focusSaveTimer=null,currentReviewNote=null;
let youtubeCatalogMeta={version:null,generatedAt:null,lastLoadedAt:null,playlistIds:[],playlistCount:0,videoCount:0,error:null};
let youtubeCatalogPollHandle=null;
let obsidianAutoSyncHandle=null,obsidianSyncInFlight=false;
const NOTE_TYPE_LABELS={literature:"Fichamento",permanent:"Permanente",concept:"Conceito",question:"Pergunta",insight:"Insight",quote:"Citação",reference:"Referência",next_action:"Ação",quick:"Rápida",session:"Sessão"};
const $=id=>document.getElementById(id);
const YOUTUBE_PLAYLIST_ID_RE=/^[A-Za-z0-9_-]{8,}$/;

function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);if(raw)return normalize(JSON.parse(raw));
    for(const key of LEGACY_KEYS){
      const old=localStorage.getItem(key);if(old){const s=migrate(JSON.parse(old));localStorage.setItem(STORAGE_KEY,JSON.stringify(s));return s}
    }
  }catch(e){}
  return structuredClone(DEFAULT_STATE)
}
function normalize(s){
  const d=structuredClone(DEFAULT_STATE);
  s={...d,...s};
  s.tracks=Array.isArray(s.tracks)?s.tracks:d.tracks;
  s.items=Array.isArray(s.items)?s.items:d.items;
  s.playlists=Array.isArray(s.playlists)&&s.playlists.length?s.playlists:d.playlists;
  s.youtubeQueue=Array.isArray(s.youtubeQueue)?s.youtubeQueue:[];
  s.sessions=Array.isArray(s.sessions)?s.sessions:[];
  s.inbox=Array.isArray(s.inbox)?s.inbox:[];
  s.youtubeSettings={...d.youtubeSettings,...(s.youtubeSettings||{})};
  s.obsidian={...structuredClone(DEFAULT_OBSIDIAN_STATE),...(s.obsidian||{})};
  s.dailyPlan=s.dailyPlan||d.dailyPlan;
  s.weeklyProgress=s.weeklyProgress&&typeof s.weeklyProgress==="object"?s.weeklyProgress:{};
  s.starterContentVersion=Math.max(0,Number(s.starterContentVersion)||0);
  s.activeTrack=s.tracks.some(t=>t?.id===s.activeTrack)?s.activeTrack:(s.tracks[0]?.id||null);
  s.playlists=s.playlists.map((playlist,index)=>normalizePlaylistRecord(playlist,index));
  s.activePlaylist=s.playlists.some(p=>p?.id===s.activePlaylist)?s.activePlaylist:(s.playlists[0]?.id||null);
  s.tracks.forEach(t=>{if(t?.id&&!Object.prototype.hasOwnProperty.call(s.weeklyProgress,t.id)){s.weeklyProgress[t.id]=0}});
  s.items.forEach(i=>{i.important=i.important!==false;i.urgent=!!i.urgent;i.modules=Array.isArray(i.modules)?i.modules:[];i.notes=typeof i.notes==="string"?i.notes:"";i.description=typeof i.description==="string"?i.description:"";i.catalogOrder=Number(i.catalogOrder)||0});
  s.youtubeQueue.forEach(v=>{v.catalogManaged=v.catalogManaged!==false;v.activeInCatalog=v.activeInCatalog!==false;v.archivedAt=v.archivedAt||null;const playlistId=youtubePlaylistIdFromUrl(v.youtubePlaylistId);if(playlistId){v.youtubePlaylistId=playlistId}});
  return s
}
function migrate(old){
  const s=structuredClone(DEFAULT_STATE);
  if(old.activeTrack)s.activeTrack=old.activeTrack;if(old.tracks)s.tracks=old.tracks;if(old.items)s.items=old.items;if(old.inbox)s.inbox=old.inbox;if(old.weeklyProgress)s.weeklyProgress=old.weeklyProgress;if(old.shortcuts)s.shortcuts=old.shortcuts;
  if(old.youtubeQueue)s.youtubeQueue=old.youtubeQueue;
  if(old.youtube?.playlistUrl)s.playlists=[{id:"main-playlist",youtubePlaylistId:youtubePlaylistIdFromUrl(old.youtube.playlistUrl)||"",name:old.youtube.playlistName||"Playlist de foco",url:old.youtube.playlistUrl,enabled:true,createdAt:old.youtube.lastSyncAt||null,updatedAt:old.youtube.lastSyncAt||null,lastSyncAt:old.youtube.lastSyncAt||null,lastSyncError:old.youtube.lastSyncError||null,catalogGeneratedAt:null,catalogTitle:null}];
  if(old.youtubeDailyGlobal)s.youtubeDaily=old.youtubeDailyGlobal;
  if(old.youtube)s.youtubeSettings={...s.youtubeSettings,mode:old.youtube.mode||"either",minutes:old.youtube.minutes||45,count:old.youtube.count||3,hideAfterLimit:old.youtube.hideAfterLimit!==false};
  s.items.forEach(i=>{i.important=i.important!==false;i.urgent=!!i.urgent;i.modules=i.modules||[];i.notes=i.notes||""});
  return s
}
function starterCourse(seed){
  return {id:seed.id,kind:"course",track:seed.track,title:seed.title,url:seed.url,source:seed.source,description:seed.description,estimatedMinutes:seed.estimatedMinutes,progress:0,status:"nao_iniciado",important:seed.important!==false,urgent:!!seed.urgent,modules:[],notes:"",catalogOrder:seed.catalogOrder,createdAt:new Date().toISOString()}
}
function mergeStarterCourse(existing,seed){
  const base=starterCourse(seed);
  const merged={...existing,...base};
  merged.progress=Number(existing.progress??base.progress)||0;
  merged.status=existing.status||statusFromProgress(merged.progress);
  merged.modules=Array.isArray(existing.modules)?existing.modules:[...base.modules];
  merged.notes=typeof existing.notes==="string"?existing.notes:base.notes;
  merged.important=existing.important??base.important;
  merged.urgent=existing.urgent??base.urgent;
  merged.createdAt=existing.createdAt||base.createdAt;
  return merged
}
function mergeStarterTrack(existing,seed){
  return {
    ...existing,
    id:seed.id,
    name:existing.name||seed.name,
    sigil:existing.sigil||seed.sigil,
    subtitle:existing.subtitle||seed.subtitle,
    description:existing.description||seed.description,
    weeklyGoal:existing.weeklyGoal??seed.weeklyGoal
  }
}
function mergeStarterPlaylist(existing,seed){
  return {...existing,...seed,lastSyncAt:existing.lastSyncAt??seed.lastSyncAt??null,lastSyncError:existing.lastSyncError??seed.lastSyncError??null}
}
function isDefaultTrackPlaceholder(track){
  return !!track&&track.id==="default"&&track.name==="Principal"&&track.sigil==="☽"&&track.subtitle==="Seu caminho inicial"&&track.description==="Uma trilha vazia para começar sem publicar dados pessoais."&&Number(track.weeklyGoal||0)===120
}
function isDefaultPlaylistPlaceholder(playlist){
  return !!playlist&&playlist.id==="main-playlist"&&playlist.name==="Playlist de foco"&&!playlist.url&&!playlist.lastSyncAt&&!playlist.lastSyncError
}
function canReplaceDefaultTrackPlaceholder(s){
  return s.tracks.length===1&&isDefaultTrackPlaceholder(s.tracks[0])&&!s.items.some(i=>i.track==="default")&&Object.keys(s.weeklyProgress||{}).every(key=>key==="default")&&Number(s.weeklyProgress?.default||0)===0&&(s.activeTrack==="default"||!s.activeTrack)
}
function canReplaceDefaultPlaylistPlaceholder(s){
  return s.playlists.length===1&&isDefaultPlaylistPlaceholder(s.playlists[0])&&!s.youtubeQueue.some(v=>v.playlistId==="main-playlist")&&(s.activePlaylist==="main-playlist"||!s.activePlaylist)
}
function normalizedIdentity(value=""){
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()
}
function starterTrackSeedFor(track){
  return STARTER_TRACKS.find(seed=>track?.id===seed.id||normalizedIdentity(track?.name)===normalizedIdentity(seed.name))||null
}
function mergeDuplicateStarterTrack(existing,duplicate,seed){
  const merged={...duplicate,...existing,id:seed.id};
  for(const key of ["name","sigil","subtitle","description","weeklyGoal"]){
    if((merged[key]===undefined||merged[key]===null||merged[key]==="")&&duplicate[key]!==undefined&&duplicate[key]!==null&&duplicate[key]!==""){
      merged[key]=duplicate[key]
    }
  }
  return mergeStarterTrack(merged,seed)
}
function repairStarterTrackDuplicates(s){
  const tracks=[],indexById=new Map(),idMap=new Map();
  for(const track of s.tracks){
    if(!track?.id){
      continue
    }
    const seed=starterTrackSeedFor(track),canonicalId=seed?.id||track.id;
    if(seed&&track.id!==canonicalId){
      idMap.set(track.id,canonicalId)
    }
    if(indexById.has(canonicalId)){
      const index=indexById.get(canonicalId);
      tracks[index]=seed?mergeDuplicateStarterTrack(tracks[index],track,seed):{...track,...tracks[index],id:canonicalId};
      idMap.set(track.id,canonicalId);
    }else{
      indexById.set(canonicalId,tracks.length);
      tracks.push(seed?mergeStarterTrack({...track,id:canonicalId},seed):{...track,id:canonicalId})
    }
  }
  s.tracks=tracks;
  for(const item of s.items){
    if(idMap.has(item.track)){
      item.track=idMap.get(item.track)
    }
  }
  for(const session of s.sessions){
    if(idMap.has(session.track)){
      session.track=idMap.get(session.track)
    }
  }
  if(Array.isArray(s.dailyPlan?.items)){
    for(const item of s.dailyPlan.items){
      if(idMap.has(item.track)){
        item.track=idMap.get(item.track)
      }
    }
  }
  for(const [from,to] of idMap){
    if(from!==to&&Object.prototype.hasOwnProperty.call(s.weeklyProgress,from)){
      s.weeklyProgress[to]=(Number(s.weeklyProgress[to])||0)+(Number(s.weeklyProgress[from])||0);
      delete s.weeklyProgress[from]
    }
  }
  if(idMap.has(s.activeTrack)){
    s.activeTrack=idMap.get(s.activeTrack)
  }
  return s
}
function applyStarterContentV1(s){
  if(canReplaceDefaultTrackPlaceholder(s)){
    s.tracks=[];
    delete s.weeklyProgress.default;
    s.activeTrack=null
  }
  if(canReplaceDefaultPlaylistPlaceholder(s)){
    s.playlists=[];
    s.activePlaylist=null
  }
  for(const seed of STARTER_TRACKS){
    const index=s.tracks.findIndex(t=>t?.id===seed.id);
    if(index>=0){
      s.tracks[index]=mergeStarterTrack(s.tracks[index],seed)
    }else{
      s.tracks.push({...seed})
    }
    if(!Object.prototype.hasOwnProperty.call(s.weeklyProgress,seed.id)){
      s.weeklyProgress[seed.id]=0
    }
  }
  for(const seed of STARTER_COURSES){
    const index=s.items.findIndex(i=>i?.id===seed.id);
    if(index>=0){
      s.items[index]=mergeStarterCourse(s.items[index],seed)
    }else{
      s.items.push(starterCourse(seed))
    }
  }
  for(const seed of STARTER_PLAYLISTS){
    const index=s.playlists.findIndex(p=>p?.id===seed.id);
    if(index>=0){
      s.playlists[index]=mergeStarterPlaylist(s.playlists[index],seed)
    }else{
      s.playlists.push({...seed})
    }
  }
  if(!s.tracks.some(t=>t?.id===s.activeTrack)){
    s.activeTrack=s.tracks[0]?.id||null
  }
  if(!s.playlists.some(p=>p?.id===s.activePlaylist)){
    s.activePlaylist=STARTER_PLAYLISTS[0]?.id||s.playlists[0]?.id||null
  }
  s.starterContentVersion=1;
  return s
}
function applyStarterContentV2(s){
  repairStarterTrackDuplicates(s);
  if(!s.tracks.some(t=>t?.id===s.activeTrack)){
    s.activeTrack=s.tracks[0]?.id||null
  }
  s.starterContentVersion=2;
  return s
}
function applyStarterContent(input){
  const s=normalize(structuredClone(input));
  let version=s.starterContentVersion;
  if(version<1){
    applyStarterContentV1(s);
    version=1
  }
  if(version<2){
    applyStarterContentV2(s);
    version=2
  }
  s.starterContentVersion=version;
  return normalize(s)
}
function save(render=true,reason="change"){
  let persisted;
  try{
    if(window.ArcanaStorage?.ready){
      persisted=ArcanaStorage.saveState(state)
    }else{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
      persisted=Promise.resolve()
    }
  }catch(e){
    persisted=Promise.reject(e)
  }
  const done=Promise.resolve(persisted).then(()=>{
    if(render){renderAll()}
    scheduleAutoBackup(reason);
    return state
  });
  done.catch(e=>console.warn("[Arcana] save failed",e));
  return done
}
function dayKey(d=new Date()){return d.toLocaleDateString("en-CA")}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function jsArg(v=""){return `'${String(v).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r")}'`}
function fmtMin(m){m=Math.round(Number(m)||0);return m<60?`${m} min`:`${Math.floor(m/60)}h${m%60?` ${m%60}m`:""}`}
function trackById(id){return state.tracks.find(t=>t.id===id)}
function ensureActiveTrack(){
  if(!Array.isArray(state.tracks)){state.tracks=[]}
  if(!state.weeklyProgress||typeof state.weeklyProgress!=="object"){state.weeklyProgress={}}
  for(const t of state.tracks){
    if(t?.id&&!Object.prototype.hasOwnProperty.call(state.weeklyProgress,t.id)){state.weeklyProgress[t.id]=0}
  }
  if(!state.tracks.length){
    state.activeTrack=null;
    return null
  }
  if(!trackById(state.activeTrack)){state.activeTrack=state.tracks[0].id}
  return trackById(state.activeTrack)
}
function track(){return ensureActiveTrack()}
function activePlaylist(){return state.playlists.find(p=>p.id===state.activePlaylist)||state.playlists[0]}
function courseOrderValue(item){const order=Number(item?.catalogOrder);return order>0?order:Number.MAX_SAFE_INTEGER}
function priorityCode(i){return i.important?(i.urgent?"IU":"I"):(i.urgent?"U":"N")}
function priorityLabel(i){return i.important?(i.urgent?"Importante + urgente":"Importante"):(i.urgent?"Urgente":"Baixa prioridade")}
function score(i){const p=priorityCode(i);let s=p==="IU"?100:p==="I"?70:p==="U"?55:20;if(i.status==="em_andamento")s+=15;if((i.estimatedMinutes||999)<=30)s+=6;return s-(i.progress||0)/10}
function itemProgress(i){if(i.kind==="course"&&i.modules?.length){return Math.round(i.modules.filter(m=>m.done).length/i.modules.length*100)}return Number(i.progress||0)}
function statusFromProgress(p){return p>=100?"concluido":p>0?"em_andamento":"nao_iniciado"}
function getDailyYT(){const k=dayKey();if(!state.youtubeDaily[k])state.youtubeDaily[k]={minutes:0,count:0};return state.youtubeDaily[k]}

function isLocalBackend(){return ["localhost","127.0.0.1",""].includes(location.hostname)}
function appBaseUrl(){
  const fallback=`${location.origin||""}${location.pathname||"/"}`;
  return document.baseURI||location.href||fallback
}
function obsidianModeLabel(value){
  if(value==="after_note_save"){
    return "após salvar nota"
  }
  if(value==="after_session"){
    return "após sessão"
  }
  if(value==="every_5_minutes"){
    return "a cada 5 minutos"
  }
  return "manual"
}
function obsidianEnvironmentLabel(){
  return isLocalBackend()?"Arcana Local com sincronização direta disponível":"GitHub Pages/estático com exportação e importação de vault ZIP"
}
function canonicalYoutubePlaylistUrl(playlistId){
  const url=new URL("https://www.youtube.com/playlist");
  url.searchParams.set("list",String(playlistId||"").trim());
  return url.toString()
}
function youtubePlaylistSearchParams(raw){
  const url=new URL("https://www.youtube.com/playlist");
  url.search=String(raw||"").trim().replace(/^\?/,"");
  return url.searchParams
}
function normalizeYoutubePlaylistReference(raw){
  const value=String(raw||"").trim();
  if(!value){
    throw new Error("URL não informada.")
  }
  let playlistId="";
  const looksLikeUrl=value.includes("://")||/^(?:www\.|m\.)?youtube\.com\//i.test(value);
  if(looksLikeUrl){
    const candidate=value.includes("://")?value:`https://${value}`;
    let url;
    try{
      url=new URL(candidate)
    }catch{
      throw new Error("Use uma URL de playlist do YouTube.")
    }
    const host=url.hostname.toLowerCase();
    if(!["youtube.com","www.youtube.com","m.youtube.com"].includes(host)){
      throw new Error("Use uma URL de playlist do YouTube.")
    }
    playlistId=(url.searchParams.get("list")||"").trim()
    if(!playlistId){
      throw new Error("A URL precisa conter o parâmetro list da playlist.")
    }
  }else{
    const directParams=youtubePlaylistSearchParams(value);
    playlistId=(directParams.get("list")||"").trim();
    if(!playlistId){
      const wrappedParams=youtubePlaylistSearchParams(`list=${value}`);
      playlistId=(wrappedParams.get("list")||"").trim()
    }
  }
  if(!playlistId){
    throw new Error("ID de playlist inválido.")
  }
  if(!YOUTUBE_PLAYLIST_ID_RE.test(playlistId)){
    throw new Error("ID de playlist inválido.")
  }
  return {youtubePlaylistId:playlistId,url:canonicalYoutubePlaylistUrl(playlistId)}
}
function normalizeYoutubePlaylistInput(raw){
  return normalizeYoutubePlaylistReference(raw)
}
function youtubePlaylistIdFromUrl(raw){
  if(!raw){
    return ""
  }
  try{
    return normalizeYoutubePlaylistReference(raw).youtubePlaylistId
  }catch{
    return ""
  }
}
function normalizePlaylistRecord(playlist,index=0){
  const input=playlist&&typeof playlist==="object"?playlist:{};
  const now=new Date().toISOString();
  const createdAt=input.createdAt||input.updatedAt||input.lastSyncAt||input.catalogGeneratedAt||now;
  const updatedAt=input.updatedAt||input.createdAt||input.lastSyncAt||input.catalogGeneratedAt||createdAt;
  const fallbackId=String(input.id||`playlist-${index+1}`).trim()||`playlist-${index+1}`;
  const fallbackName=String(input.name||`Playlist ${index+1}`).trim()||`Playlist ${index+1}`;
  let youtubePlaylistId=String(input.youtubePlaylistId||"").trim();
  let url=String(input.url||"").trim();
  let normalizedPlaylist=null;
  if(url){
    try{
      normalizedPlaylist=normalizeYoutubePlaylistReference(url)
    }catch{}
  }
  if(!normalizedPlaylist&&youtubePlaylistId){
    try{
      normalizedPlaylist=normalizeYoutubePlaylistReference(youtubePlaylistId)
    }catch{}
  }
  if(normalizedPlaylist){
    youtubePlaylistId=normalizedPlaylist.youtubePlaylistId;
    url=normalizedPlaylist.url
  }else{
    if(!youtubePlaylistId&&url){
      youtubePlaylistId=youtubePlaylistIdFromUrl(url)
    }
    if(!url&&youtubePlaylistId){
      url=canonicalYoutubePlaylistUrl(youtubePlaylistId)
    }
  }
  return {
    ...input,
    id:fallbackId,
    youtubePlaylistId,
    name:fallbackName,
    url,
    enabled:input.enabled!==false,
    createdAt,
    updatedAt,
    lastSyncAt:input.lastSyncAt||null,
    lastSyncError:input.lastSyncError||null,
    catalogGeneratedAt:input.catalogGeneratedAt||null,
    catalogTitle:input.catalogTitle||null
  }
}
function playlistCatalogId(playlist){
  if(!playlist){
    return ""
  }
  return youtubePlaylistIdFromUrl(playlist.youtubePlaylistId)||youtubePlaylistIdFromUrl(playlist.url)||""
}
function publishedCatalogUrl(){
  return new URL("./data/youtube/catalog.json",appBaseUrl()).toString()
}
function publishedCatalogRequestUrl(force=false){
  const url=new URL(publishedCatalogUrl());
  if(force){
    url.searchParams.set("_arcana",Date.now().toString())
  }
  return url.toString()
}
function playlistPendingCount(playlist){
  return state.youtubeQueue.filter(v=>v.playlistId===playlist?.id&&v.activeInCatalog!==false&&itemProgress(v)<100).length
}
function playlistArchivedCount(playlist){
  return state.youtubeQueue.filter(v=>v.playlistId===playlist?.id&&v.activeInCatalog===false).length
}
function formatCatalogStamp(value){
  if(!value){
    return ""
  }
  const date=new Date(value);
  if(Number.isNaN(date.getTime())){
    return ""
  }
  return date.toLocaleString("pt-BR")
}
function catalogSyncNote(playlist){
  const stamp=formatCatalogStamp(playlist?.catalogGeneratedAt||youtubeCatalogMeta.generatedAt);
  if(!stamp){
    return ""
  }
  return `Catálogo público atualizado em ${stamp}`
}
function catalogPlaylistIds(){
  return Array.isArray(youtubeCatalogMeta.playlistIds)?youtubeCatalogMeta.playlistIds:[]
}
function playlistPublishedInCatalog(playlist){
  const catalogId=playlistCatalogId(playlist);
  return !!catalogId&&catalogPlaylistIds().includes(catalogId)
}
function playlistAwaitingCatalog(playlist){
  if(isLocalBackend()){
    return false
  }
  const catalogId=playlistCatalogId(playlist);
  if(!catalogId||youtubeCatalogMeta.error||!youtubeCatalogMeta.lastLoadedAt){
    return false
  }
  return !playlistPublishedInCatalog(playlist)
}
function playlistStatusSummary(playlist){
  if(!playlist){
    return {tone:"muted",label:"Sem playlist",message:"Nenhuma playlist ativa.",detail:""}
  }
  if(playlist.lastSyncError){
    return {tone:"error",label:"Erro",message:`Erro: ${playlist.lastSyncError}`,detail:"O Arcana preservou a fila local e não descartou seu progresso."}
  }
  if(playlist.enabled===false){
    return {tone:"muted",label:"Pausada",message:"Playlist pausada.",detail:"Ative novamente quando quiser voltar a sincronizar esta fila."}
  }
  if(isLocalBackend()){
    if(playlist.lastSyncAt){
      return {tone:"ok",label:"Local",message:`Sincronizada localmente em ${new Date(playlist.lastSyncAt).toLocaleString("pt-BR")}`,detail:"Este navegador pode atualizar a playlist direto com yt-dlp."}
    }
    return {tone:"local",label:"Local",message:"Pronta para sincronizar com yt-dlp.",detail:"No Arcana Local, a playlist pode ser atualizada imediatamente sem depender do catálogo público."}
  }
  if(playlistAwaitingCatalog(playlist)){
    return {tone:"pending",label:"Aguardando catálogo",message:"Aguardando catálogo público.",detail:"A playlist já foi salva no IndexedDB. Use “Solicitar sincronização” para registrá-la no catálogo público do Arcana."}
  }
  if(playlistPublishedInCatalog(playlist)){
    if(playlist.lastSyncAt){
      return {tone:"ok",label:"Publicada",message:`Sincronizada em ${new Date(playlist.lastSyncAt).toLocaleString("pt-BR")}`,detail:"Os metadados públicos foram aplicados sem apagar seu progresso local."}
    }
    return {tone:"ok",label:"Publicada",message:"Catálogo público disponível para sincronizar.",detail:"Clique em atualizar para trazer os vídeos publicados para esta playlist."}
  }
  if(youtubeCatalogMeta.error&&!playlist.lastSyncAt){
    return {tone:"error",label:"Erro",message:"Catálogo público indisponível agora.",detail:youtubeCatalogMeta.error}
  }
  return {tone:"muted",label:"Local",message:"Ainda não sincronizada.",detail:"Salve uma URL canônica de playlist para conectar esta fila ao catálogo público."}
}
function playlistStatusChip(playlist){
  const status=playlistStatusSummary(playlist);
  return `<span class="status-chip ${status.tone}">${esc(status.label)}</span>`
}
function catalogRequestPayload(playlist){
  const catalogId=playlistCatalogId(playlist);
  if(!catalogId){
    return ""
  }
  return JSON.stringify({
    id:catalogId,
    name:playlist.name,
    url:playlist.url||canonicalYoutubePlaylistUrl(catalogId),
    enabled:playlist.enabled!==false
  },null,2)
}
function catalogRequestIssueUrl(playlist){
  const catalogId=playlistCatalogId(playlist);
  if(!catalogId){
    return ""
  }
  const title=String(playlist?.name||"Nova playlist").trim()||"Nova playlist";
  const canonicalUrl=playlist?.url||canonicalYoutubePlaylistUrl(catalogId);
  const url=new URL(ARCANA_PLAYLIST_ISSUE_URL);
  url.searchParams.set("template","arcana-playlist.yml");
  url.searchParams.set("title",`[Arcana Playlist] ${title}`);
  url.searchParams.set("playlist_name",title);
  url.searchParams.set("youtube_playlist_id",catalogId);
  url.searchParams.set("canonical_url",canonicalUrl);
  return url.toString()
}
function syncPlaylistButtonLabel(playlist){
  if(syncing){
    return "Sincronizando..."
  }
  if(isLocalBackend()){
    return "↻ Sincronizar"
  }
  if(playlistAwaitingCatalog(playlist)){
    return "↻ Verificar novamente"
  }
  if(playlistPublishedInCatalog(playlist)){
    return "↻ Atualizar"
  }
  return "↻ Verificar catálogo"
}
function updatePlaylistCatalogActions(playlist,status){
  const requestBtn=$("requestCatalogBtn");
  const optionsBtn=$("catalogOptionsBtn");
  const issueUrl=catalogRequestIssueUrl(playlist);
  const canRequest=status?.label==="Aguardando catálogo"&&!!issueUrl;
  if(requestBtn){
    requestBtn.href=canRequest?issueUrl:"#";
    requestBtn.style.display=canRequest?"inline-flex":"none";
  }
  if(optionsBtn){
    optionsBtn.style.display=playlist?"inline-flex":"none";
  }
}
function shouldPollYoutubeCatalog(){
  if(isLocalBackend()||currentView!=="youtube"||syncing){
    return false
  }
  if(typeof document.hidden==="boolean"&&document.hidden){
    return false
  }
  return playlistAwaitingCatalog(activePlaylist())
}
function stopYoutubeCatalogPolling(){
  if(youtubeCatalogPollHandle){
    clearInterval(youtubeCatalogPollHandle);
    youtubeCatalogPollHandle=null;
  }
}
function scheduleYoutubeCatalogPolling(){
  stopYoutubeCatalogPolling();
  if(!shouldPollYoutubeCatalog()){
    return
  }
  youtubeCatalogPollHandle=setInterval(()=>{
    if(!shouldPollYoutubeCatalog()){
      stopYoutubeCatalogPolling();
      return
    }
    syncPlaylist().catch(()=>{});
  },60000)
}
function normalizeCatalogVideo(entry,pos){
  if(!entry||typeof entry!=="object"){
    return null
  }
  const id=String(entry.id||entry.videoId||youtubeVideoId(entry.url)||"").trim();
  const title=String(entry.title||"").trim();
  if(!id||!title){
    return null
  }
  const url=String(entry.url||`https://www.youtube.com/watch?v=${id}`).trim();
  return {
    id,
    title,
    url,
    channel:String(entry.channel||"YouTube").trim()||"YouTube",
    duration:Number(entry.duration)||0,
    position:Number(entry.position)||pos+1,
    thumbnail:String(entry.thumbnail||"").trim()
  }
}
function normalizePublishedCatalog(data){
  if(!data||typeof data!=="object"||!Array.isArray(data.playlists)){
    throw new Error("Catálogo público inválido.")
  }
  const playlists=data.playlists.map((playlist,pos)=>{
    if(!playlist||typeof playlist!=="object"){
      return null
    }
    const normalizedSource=playlist.id||playlist.url||"";
    const normalizedPlaylist=normalizeYoutubePlaylistReference(normalizedSource);
    const id=normalizedPlaylist.youtubePlaylistId;
    if(!id){
      throw new Error(`Playlist inválida na posição ${pos+1}.`)
    }
    const canonicalUrl=normalizedPlaylist.url;
    let url=canonicalUrl;
    if(playlist.url){
      try{
        const normalizedUrl=normalizeYoutubePlaylistReference(String(playlist.url).trim());
        url=normalizedUrl.youtubePlaylistId===id?normalizedUrl.url:canonicalUrl
      }catch{
        url=canonicalUrl
      }
    }
    const videos=Array.isArray(playlist.videos)?playlist.videos.map((entry,index)=>normalizeCatalogVideo(entry,index)).filter(Boolean):[];
    return {
      id,
      name:String(playlist.name||playlist.title||`Playlist ${pos+1}`).trim()||`Playlist ${pos+1}`,
      url,
      videos
    }
  }).filter(Boolean);
  return {
    version:Number(data.version)||1,
    generatedAt:data.generatedAt?String(data.generatedAt):null,
    playlists
  }
}
async function fetchPublishedCatalog(force=false){
  const response=await fetch(publishedCatalogRequestUrl(force),{cache:"no-store"});
  const text=await response.text();
  if(!response.ok){
    throw new Error(`Catálogo público indisponível (${response.status}).`)
  }
  let data={};
  try{
    data=text?JSON.parse(text):{}
  }catch{
    throw new Error("Catálogo público retornou JSON inválido.")
  }
  const catalog=normalizePublishedCatalog(data);
  youtubeCatalogMeta={
    version:catalog.version||1,
    generatedAt:catalog.generatedAt||null,
    lastLoadedAt:new Date().toISOString(),
    playlistIds:catalog.playlists.map(playlist=>playlist.id),
    playlistCount:catalog.playlists.length,
    videoCount:catalog.playlists.reduce((total,playlist)=>total+playlist.videos.length,0),
    error:null
  };
  return catalog
}
function catalogPlaylistStateId(catalogPlaylist){
  const slug=String(catalogPlaylist?.id||"playlist").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"playlist";
  return `playlist-${slug}`
}
function ensurePlaylistFromCatalog(catalogPlaylist){
  const catalogId=playlistCatalogId(catalogPlaylist);
  let local=state.playlists.find(p=>playlistCatalogId(p)===catalogId);
  if(local){
    local.url=catalogPlaylist.url||local.url;
    if(!local.name){
      local.name=catalogPlaylist.name
    }
    local.youtubePlaylistId=catalogId;
    local.catalogTitle=catalogPlaylist.name;
    local.updatedAt=new Date().toISOString();
    return local
  }
  const now=new Date().toISOString();
  local={id:catalogPlaylistStateId(catalogPlaylist),youtubePlaylistId:catalogId,name:catalogPlaylist.name,url:catalogPlaylist.url,enabled:true,createdAt:now,updatedAt:now,lastSyncAt:null,lastSyncError:null,catalogGeneratedAt:null,catalogTitle:catalogPlaylist.name};
  state.playlists.push(local);
  if(!state.activePlaylist){
    state.activePlaylist=local.id
  }
  return local
}
function catalogPlaylistToSyncData(playlist,catalog){
  return {
    title:playlist.name,
    playlistId:playlist.id,
    generatedAt:catalog.generatedAt||null,
    items:playlist.videos.map(video=>({
      videoId:video.id,
      title:video.title,
      url:video.url,
      channel:video.channel,
      thumbnail:video.thumbnail,
      durationSeconds:Number(video.duration)||0,
      position:Number(video.position)||0
    }))
  }
}
function applyPublishedCatalog(catalog,{targetPlaylist=null}={}){
  if(targetPlaylist){
    const catalogId=playlistCatalogId(targetPlaylist);
    if(!catalogId){
      throw new Error("Use uma URL de playlist do YouTube com o parâmetro list.")
    }
    const match=catalog.playlists.find(playlist=>playlist.id===catalogId);
    if(!match){
      return 0
    }
    mergePlaylistData(catalogPlaylistToSyncData(match,catalog),targetPlaylist);
    return 1
  }
  let merged=0;
  for(const playlist of catalog.playlists){
    const local=ensurePlaylistFromCatalog(playlist);
    mergePlaylistData(catalogPlaylistToSyncData(playlist,catalog),local);
    merged+=1
  }
  return merged
}
async function refreshPublishedCatalog(force=false){
  const catalog=await fetchPublishedCatalog(force);
  const merged=applyPublishedCatalog(catalog);
  await save(false,"youtube-catalog");
  return merged
}
async function api(path,opts={}){
  const method=(opts.method||"GET").toUpperCase();
  if(window.ArcanaStorage?.ready&&ArcanaStorage.canHandle(path,method)){
    return ArcanaStorage.route(path,opts)
  }
  const r=await fetch(path,{...opts,headers:{"Content-Type":"application/json",...(opts.headers||{})}});
  const text=await r.text();let data={};
  try{data=text?JSON.parse(text):{}}catch{throw new Error(`Resposta inválida (${r.status}).`)}
  if(!r.ok){throw new Error(data.error||`Falha (${r.status})`)}
  return data
}
function applyObsidianStatus(payload={}){
  const next={...structuredClone(DEFAULT_OBSIDIAN_STATE),...state.obsidian,...payload};
  if(!Object.prototype.hasOwnProperty.call(payload,"error")){
    next.error=null
  }
  state.obsidian=next;
  ensureObsidianAutoSyncLoop();
  renderSettings();
  return state.obsidian
}
async function refreshObsidianStatus(){
  if(!isLocalBackend()){
    return applyObsidianStatus({available:false,connected:false})
  }
  try{
    const data=await api("/api/obsidian/status");
    return applyObsidianStatus({available:true,...(data.obsidian||{})})
  }catch(e){
    return applyObsidianStatus({available:false,error:e.message||String(e)})
  }
}
function ensureObsidianAutoSyncLoop(){
  clearInterval(obsidianAutoSyncHandle);
  obsidianAutoSyncHandle=null;
  if(state.obsidian.autoSync==="every_5_minutes"){
    obsidianAutoSyncHandle=setInterval(()=>{queueObsidianAutoSync("every_5_minutes")},300000)
  }
}
async function runObsidianSync(mode="sync",silent=false){
  if(!isLocalBackend()||!state.obsidian.connected||obsidianSyncInFlight){
    return state.obsidian
  }
  obsidianSyncInFlight=true;
  try{
    const data=await api(`/api/obsidian/${mode}`,{method:"POST",body:JSON.stringify({autoSync:state.obsidian.autoSync})});
    applyObsidianStatus({available:true,...(data.obsidian||{})});
    return state.obsidian
  }catch(e){
    applyObsidianStatus({error:e.message||String(e)});
    if(!silent){
      alert(e.message||String(e))
    }
    throw e
  }finally{
    obsidianSyncInFlight=false
  }
}
function queueObsidianAutoSync(reason){
  if(!isLocalBackend()||!state.obsidian.connected){
    return
  }
  const mode=state.obsidian.autoSync||"after_session";
  if(reason==="after_note_save"&&mode!=="after_note_save"){
    return
  }
  if(reason==="after_session"&&mode!=="after_session"){
    return
  }
  if(reason==="every_5_minutes"&&mode!=="every_5_minutes"){
    return
  }
  Promise.resolve().then(()=>runObsidianSync("sync",true)).catch(()=>{})
}
async function connectObsidianVault(){
  if(!isLocalBackend()){
    alert("No GitHub Pages o Arcana só pode exportar e importar um vault ZIP.")
    return
  }
  const suggestion=state.obsidian.vaultPath||"";
  const path=prompt("Caminho absoluto da pasta do seu vault Obsidian",suggestion);
  if(path===null){
    return
  }
  const data=await api("/api/obsidian/connect",{method:"POST",body:JSON.stringify({path:path.trim(),autoSync:state.obsidian.autoSync||"after_session"})});
  applyObsidianStatus({available:true,...(data.obsidian||{})})
}
async function disconnectObsidianVault(){
  if(!confirm("Desconectar o vault Obsidian do Arcana Local?")){
    return
  }
  const data=await api("/api/obsidian/disconnect",{method:"POST",body:JSON.stringify({})});
  applyObsidianStatus({available:true,...(data.obsidian||{})})
}
function openObsidianVault(){
  if(state.obsidian.openUrl){
    location.href=state.obsidian.openUrl
  }
}
async function updateObsidianAutoSync(value){
  state.obsidian.autoSync=value;
  ensureObsidianAutoSyncLoop();
  renderSettings();
  if(isLocalBackend()&&state.obsidian.connected&&state.obsidian.vaultPath){
    const data=await api("/api/obsidian/connect",{method:"POST",body:JSON.stringify({path:state.obsidian.vaultPath,autoSync:value})});
    applyObsidianStatus({available:true,...(data.obsidian||{})})
  }
}
function resourceByScope(id,scope){return scope==="youtube"?state.youtubeQueue.find(x=>x.id===id):state.items.find(x=>x.id===id)}
function noteCount(sourceId){return vaultNotes.filter(n=>n.sourceId===sourceId&&n.status!=="archived").length}
function splitTags(v){return String(v||"").split(/[,\s]+/).map(x=>x.trim().replace(/^#/,"")).filter(Boolean)}
function isoDate(days=0){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function trackOptions(value="all"){return `<option value="all">Todas as trilhas</option>`+state.tracks.map(t=>`<option value="${esc(t.id)}" ${value===t.id?"selected":""}>${esc(t.name)}</option>`).join("")}
function mdToHtml(md=""){
  let html=esc(md).replace(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g,'<span class="wiki-link">$1</span>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/`([^`]+)`/g,"<code>$1</code>");
  html=html.split(/\n{2,}/).map(block=>{
    if(/^###\s+/.test(block))return `<h3>${block.replace(/^###\s+/,"")}</h3>`;
    if(/^##\s+/.test(block))return `<h2>${block.replace(/^##\s+/,"")}</h2>`;
    if(/^#\s+/.test(block))return `<h1>${block.replace(/^#\s+/,"")}</h1>`;
    if(/^[-*]\s+/m.test(block))return `<ul>${block.split("\n").filter(Boolean).map(x=>`<li>${x.replace(/^[-*]\s+/,"").replace(/^\[[ x]\]\s+/,"")}</li>`).join("")}</ul>`;
    return `<p>${block.replace(/\n/g,"<br>")}</p>`
  }).join("");
  return html||"<p class='hint'>Sem conteúdo.</p>"
}
function literatureTemplate(title="Nova fonte",sourceType="book"){
  return `# ${title}\n\n## Dados da fonte\n\n- Tipo: ${sourceType}\n- Autor/canal:\n- URL/ISBN/DOI:\n- Progresso:\n\n## Resumo\n\n\n## Citações\n\n- \n\n## Ideias e conexões\n\n- [[Conceito relacionado]]\n\n## Próximas ações\n\n- [ ] `
}
function noteTemplate(type="quick",title="Nova nota"){
  const head=`# ${title}\n\n`;
  if(type==="permanent")return head+"## Ideia atômica\n\n\n## Por que importa\n\n\n## Conexões\n\n- [[Outra nota]]\n";
  if(type==="question")return head+"## Pergunta\n\n\n## Evidências\n\n\n## Próxima investigação\n\n- [ ] \n";
  if(type==="session")return head+"## Registro\n\n\n## Conceitos\n\n\n## Perguntas\n\n\n## Próximas ações\n\n- [ ] \n";
  return head+"## Nota\n\n\n## Links\n\n- [[Conceito relacionado]]\n"
}
async function loadVaultNotes(){
  try{
    const data=await api("/api/notes?sort=updated");
    vaultNotes=data.notes||[];
    if($("vaultTrackFilter")){$("vaultTrackFilter").innerHTML=trackOptions($("vaultTrackFilter").value||"all")}
    renderVaultHome();renderNotes();renderFichamentos();renderReviews();
  }catch(e){
    ["homeKnowledge","vaultList","fichamentoList","reviewQueue"].forEach(id=>{if($(id))$(id).innerHTML=`<div class="hint">Vault indisponível: ${esc(e.message)}</div>`})
  }
}

function showView(v){
  currentView=v;
  document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
  $(v+"View").classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===v));
  $("pageTitle").textContent={home:"Santuário",tracks:"Trilhas",youtube:"YouTube",library:"Biblioteca",fichamentos:"Fichamentos",notes:"Notas",review:"Revisão",calendar:"Calendário",inbox:"Inbox",settings:"Configurações"}[v]||"Arcana";
  if(["home","fichamentos","notes","review"].includes(v)){
    loadVaultNotes()
  }
  if(v==="youtube"){
    scheduleYoutubeCatalogPolling()
  }else{
    stopYoutubeCatalogPolling()
  }
}
function notice(message){
  let el=$("appNotice");
  if(!el&&document.body){
    el=document.createElement("div");
    el.id="appNotice";
    el.className="app-notice";
    document.body.appendChild(el)
  }
  if(!el){
    return
  }
  el.textContent=message;
  el.classList.add("show");
  clearTimeout(notice._timer);
  notice._timer=setTimeout(()=>el.classList.remove("show"),2600)
}
function missingTarget(){
  notice("Este item não existe mais.");
  loadVaultNotes().catch(()=>{})
}
function activateRow(event,el){
  if(event.key!=="Enter"&&event.key!==" "){
    return
  }
  event.preventDefault();
  el.click()
}
async function navigateTo(view,options={}){
  if(!$(view+"View")){
    missingTarget();
    return
  }
  if(view==="tracks"&&options.trackId){
    if(!trackById(options.trackId)){
      missingTarget();
      renderHomeTracks();
      return
    }
    state.activeTrack=options.trackId;
    await save(false,"navigation");
    renderTracks()
  }
  if(view==="youtube"&&options.playlistId){
    if(!state.playlists.some(p=>p.id===options.playlistId)){
      missingTarget();
      return
    }
    state.activePlaylist=options.playlistId;
    await save(false,"navigation");
    renderYoutube()
  }
  showView(view);
  try{
    if(options.fichamentoId){
      await selectFichamento(options.fichamentoId)
    }else if(options.noteId&&view==="review"){
      await openReviewNote(options.noteId)
    }else if(options.noteId&&view==="fichamentos"){
      await selectFichamento(options.noteId)
    }else if(options.noteId){
      await selectVaultNote(options.noteId)
    }
  }catch(e){
    missingTarget()
  }
}
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>navigateTo(b.dataset.view));

function renderHome(){
  const h=new Date().getHours(),sal=h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";
  $("greeting").textContent=`${sal}. O que vamos invocar hoje?`;
  const level=Math.floor(state.xp/500)+1,$xp=state.xp%500;$("levelNumber").textContent=level;
  const studied=state.sessions.filter(s=>s.date===dayKey()).reduce((a,b)=>a+b.minutes,0);
  $("todaySummary").textContent=`${studied} minutos estudados hoje · ${state.streak} dias de sequência`;
  $("gameStats").innerHTML=[
    ["XP",state.xp],["Sequência",`${state.streak} dias`],["Sessões",state.sessions.length],["Próximo nível",`${500-$xp} XP`]
  ].map(([a,b])=>`<div class="stat"><span>${a}</span><strong>${b}</strong></div>`).join("");
  renderDailyPlan();renderHomeYoutube();renderHomeTracks();renderHomePriority();renderVaultHome()
}
function generatePlan(){
  const mins=Number($("todayMinutes")?.value||state.dailyPlan.minutes||60);
  state.dailyPlan.minutes=mins;state.dailyPlan.date=dayKey();
  let candidates=state.items.filter(i=>itemProgress(i)<100).sort((a,b)=>score(b)-score(a));
  let remaining=mins,chosen=[];
  for(const i of candidates){
    if(remaining<=0)break;
    const chunk=Math.min(remaining,Math.max(15,Math.min(45,Number(i.estimatedMinutes||30))));
    chosen.push({type:"item",id:i.id,minutes:chunk,title:i.title,track:i.track});remaining-=chunk
  }
  const due=vaultNotes.filter(n=>n.reviewAt&&n.reviewAt<=dayKey()&&n.status!=="archived").length;
  if(due&&mins>=30){const rm=Math.min(20,Math.max(10,Math.floor(mins*.25)));chosen.unshift({type:"review",id:"review",minutes:rm,title:`Revisar ${due} nota${due>1?"s":""}`});remaining-=rm}
  const y=todaysYoutube()[0];
  if(y&&mins>=30){const ym=Math.min(Number(y.estimatedMinutes||15),Math.max(10,Math.floor(mins*.3)));chosen.unshift({type:"youtube",id:y.id,minutes:ym,title:y.title})}
  if(chosen.reduce((a,b)=>a+b.minutes,0)>mins){let over=chosen.reduce((a,b)=>a+b.minutes,0)-mins;for(let i=chosen.length-1;i>=0&&over>0;i--){const cut=Math.min(over,Math.max(0,chosen[i].minutes-10));chosen[i].minutes-=cut;over-=cut}}
  state.dailyPlan.items=chosen;save(false);renderDailyPlan()
}
function renderDailyPlan(){
  if(state.dailyPlan.date!==dayKey()){
    generatePlan();
    return
  }
  $("todayMinutes").value=String(state.dailyPlan.minutes||60);
  $("dailyPlan").innerHTML=state.dailyPlan.items.length?state.dailyPlan.items.map((p,n)=>{
    const action=p.type==="review"?"navigateTo('review')":`openFocus(${jsArg(p.id)},${jsArg(p.type)})`;
    return `<div class="plan-item clickable-row" role="button" tabindex="0" onclick="${action}" onkeydown="activateRow(event,this)"><div class="num">${n+1}</div><div class="grow"><strong>${esc(p.title)}</strong><span>${p.minutes} min ${p.track?`· ${esc(trackById(p.track)?.name||"")}`:p.type==="review"?"· Revisão":"· YouTube"}</span></div><button class="mini-btn" onclick="event.stopPropagation();${action}">${p.type==="review"?"Revisar":"Focar"}</button></div>`
  }).join(""):`<div class="hint">Nada pendente para hoje.</div>`
}
function renderHomeYoutube(){
  const v=todaysYoutube()[0];$("homeYoutube").innerHTML=v?videoRow(v,0,true):`<div class="hint">Sem vídeo liberado agora.</div>`
}
function renderHomeTracks(){
  ensureActiveTrack();
  if(!state.tracks.length){
    $("homeTracks").innerHTML=`<div class="hint">Crie sua primeira trilha para organizar cursos e estudos.</div>`;
    return
  }
  $("homeTracks").innerHTML=state.tracks.map(t=>{const arr=state.items.filter(i=>i.track===t.id),avg=arr.length?Math.round(arr.reduce((a,b)=>a+itemProgress(b),0)/arr.length):0;return `<div class="track-row clickable-row" role="button" tabindex="0" onclick="navigateTo('tracks',{trackId:${jsArg(t.id)}})" onkeydown="activateRow(event,this)"><div class="num">${esc(t.sigil||"☽")}</div><div class="grow"><strong>${esc(t.name)}</strong><span>${avg}% concluído</span><div class="progress"><div style="width:${avg}%"></div></div></div></div>`}).join("")
}
function renderHomePriority(){
  const arr=state.items.filter(i=>itemProgress(i)<100).sort((a,b)=>score(b)-score(a)).slice(0,5);
  $("homePriority").innerHTML=arr.length?arr.map(i=>`<div class="plan-item clickable-row" role="button" tabindex="0" onclick="openFocus(${jsArg(i.id)},'item')" onkeydown="activateRow(event,this)"><span class="tag priority-${priorityCode(i)}">${priorityLabel(i)}</span><div class="grow"><strong>${esc(i.title)}</strong><span>${esc(trackById(i.track)?.name||"Sem trilha")}</span></div></div>`).join(""):`<div class="hint">Nada priorizado agora.</div>`
}

function renderTracks(){
  const t=ensureActiveTrack();
  $("trackTabs").innerHTML=state.tracks.map(t=>`<button class="track-tab ${t.id===state.activeTrack?"active":""}" onclick="setTrack('${t.id}')"><strong>${esc(t.sigil||"☽")} ${esc(t.name)}</strong><span>${esc(t.subtitle||"")}</span></button>`).join("");
  if(!t){
    $("trackHero").innerHTML=`<h2>Nova trilha</h2><div class="kicker">Nenhuma trilha ativa</div><p>Crie sua primeira trilha para começar a organizar cursos, fontes e sessões.</p>`;
    $("trackCourses").innerHTML=`<div class="hint">Nenhum curso ainda.</div>`;
    $("trackProfile").innerHTML=`<div class="profile-grid"><div class="profile-stat"><span>Cursos</span><strong>0</strong></div><div class="profile-stat"><span>Concluídos</span><strong>0</strong></div><div class="profile-stat"><span>Progresso</span><strong>0%</strong></div><div class="profile-stat"><span>Meta semanal</span><strong>0m</strong></div></div>`;
    return
  }
  $("trackHero").innerHTML=`<h2>${esc(t.sigil||"☽")} ${esc(t.name)}</h2><div class="kicker">${esc(t.subtitle||"")}</div><p>${esc(t.description||"")}</p>`;
  const courses=state.items.filter(i=>i.track===t.id&&i.kind==="course").sort((a,b)=>courseOrderValue(a)-courseOrderValue(b)||String(a.createdAt||"").localeCompare(String(b.createdAt||""))||a.title.localeCompare(b.title,"pt-BR"));
  $("trackCourses").innerHTML=courses.length?courses.map(i=>courseRow(i)).join(""):`<div class="hint">Nenhum curso ainda.</div>`;
  const avg=courses.length?Math.round(courses.reduce((a,b)=>a+itemProgress(b),0)/courses.length):0,done=courses.filter(i=>itemProgress(i)>=100).length;
  $("trackProfile").innerHTML=`<div class="profile-grid"><div class="profile-stat"><span>Cursos</span><strong>${courses.length}</strong></div><div class="profile-stat"><span>Concluídos</span><strong>${done}</strong></div><div class="profile-stat"><span>Progresso</span><strong>${avg}%</strong></div><div class="profile-stat"><span>Meta semanal</span><strong>${t.weeklyGoal||0}m</strong></div></div>`
}
function courseRow(i){
  const p=itemProgress(i),nc=noteCount(i.id);return `<div class="course-row clickable-row" role="button" tabindex="0" onclick="openFocus(${jsArg(i.id)},'item')" onkeydown="activateRow(event,this)"><div class="grow"><strong>${esc(i.title)}</strong><span>${p}% · ${priorityLabel(i)} · ${nc} notas</span><div class="progress"><div style="width:${p}%"></div></div>${i.modules?.length?`<div class="module-list">${i.modules.map(m=>`<div class="module ${m.done?"done":""}"><span>${m.done?"✓":"○"} ${esc(m.title)}</span><span>${m.minutes||0}m</span></div>`).join("")}</div>`:""}</div><button class="mini-btn" onclick="event.stopPropagation();editItem(${jsArg(i.id)})">Editar</button><button class="mini-btn" onclick="event.stopPropagation();openFichamentoForSource(${jsArg(i.id)},'item')">Fichamento</button><button class="mini-btn" onclick="event.stopPropagation();openNotes(${jsArg(i.id)},'item')">Notas</button></div>`
}
function setTrack(id){if(!trackById(id)){missingTarget();return}state.activeTrack=id;save();renderTracks()}
function setTrackFormError(message=""){const el=$("trackFormError");if(!el){return}el.textContent=message;el.classList.toggle("hidden",!message)}
function setTrackSaving(saving){const btn=$("trackSaveBtn");if(!btn){return}btn.disabled=saving;btn.textContent=saving?"Salvando...":"Salvar"}
function makeTrackId(name,tracks=state.tracks){let base=name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"trilha",nid=base,n=2;while(tracks.some(t=>t.id===nid)){nid=`${base}-${n++}`}return nid}
function openTrackDialog(id=null){const f=$("trackForm"),fields=f.elements;f.reset();setTrackFormError();setTrackSaving(false);fields.id.value="";if(id){const t=trackById(id);if(!t){openTrackDialog();return}$("trackDialogTitle").textContent="Editar trilha";Object.keys(t).forEach(k=>{if(fields[k]){fields[k].value=t[k]??""}});$("deleteTrackBtn").classList.toggle("hidden",state.tracks.length<=1)}else{$("trackDialogTitle").textContent="Nova trilha";fields.sigil.value="☽";fields.weeklyGoal.value=120;$("deleteTrackBtn").classList.add("hidden")}$("trackDialog").showModal()}
async function saveTrack(e){e.preventDefault();const f=e.currentTarget,fields=f.elements,id=fields.id.value,name=fields.name.value.trim(),weeklyGoal=Number(fields.weeklyGoal.value)||0;setTrackFormError();if(!name){setTrackFormError("Informe um nome para salvar a trilha.");fields.name.focus();return}if(weeklyGoal<0){setTrackFormError("A meta semanal não pode ser negativa.");fields.weeklyGoal.focus();return}const previous=structuredClone(state),next=structuredClone(state),payload={name,sigil:fields.sigil.value.trim()||"☽",subtitle:fields.subtitle.value.trim(),description:fields.description.value.trim(),weeklyGoal};if(id){const existing=next.tracks.find(t=>t.id===id);if(!existing){setTrackFormError("Esta trilha não existe mais. Atualize a página e tente novamente.");return}Object.assign(existing,payload)}else{const nid=makeTrackId(name,next.tracks);next.tracks.push({id:nid,...payload});next.activeTrack=nid;next.weeklyProgress=next.weeklyProgress||{};if(!Object.prototype.hasOwnProperty.call(next.weeklyProgress,nid)){next.weeklyProgress[nid]=0}}state=next;setTrackSaving(true);try{await save(false,"track");$("trackDialog").close();renderAll()}catch(err){state=previous;setTrackFormError(`Não consegui salvar a trilha: ${err.message||"erro de armazenamento"}.`)}finally{setTrackSaving(false)}}
function deleteTrack(){const id=$("trackForm").elements.id.value;if(!id||state.tracks.length<=1){return}if(!confirm("Excluir esta trilha e seus itens?")){return}state.tracks=state.tracks.filter(t=>t.id!==id);state.items=state.items.filter(i=>i.track!==id);state.activeTrack=state.tracks[0].id;save();$("trackDialog").close()}

function renderYoutube(){
  $("playlistTabs").innerHTML=state.playlists.map(p=>{
    return `<button class="playlist-tab ${p.id===state.activePlaylist?"active":""}" onclick="setPlaylist('${p.id}')"><strong>${esc(p.name)}</strong><span>${playlistPendingCount(p)} pendentes</span><div class="playlist-status-line">${playlistStatusChip(p)}</div></button>`
  }).join("");
  const p=activePlaylist();$("activePlaylistName").textContent=p?.name||"Sem playlist";
  const status=playlistStatusSummary(p);
  $("playlistSyncStatus").className=`sync-status ${syncing?"pending":status.tone}`;$("playlistSyncStatus").textContent=syncing?"Sincronizando":status.message;
  const syncBtn=$("syncPlaylistBtn");
  if(syncBtn){
    syncBtn.disabled=syncing;
    syncBtn.textContent=syncPlaylistButtonLabel(p)
  }
  updatePlaylistCatalogActions(p,status);
  const archivedCount=playlistArchivedCount(p);
  const panelLines=[];
  if(p?.url){
    panelLines.push(`<div class="hint">${esc(p.url)}</div>`)
  }
  if(p){
    panelLines.push(`<div class="hint">${playlistPendingCount(p)} vídeos ativos na fila${archivedCount?` · ${archivedCount} preservados no histórico local`:""}</div>`)
  }
  if(status.detail){
    panelLines.push(`<div class="hint">${esc(status.detail)}</div>`)
  }
  const catalogNote=catalogSyncNote(p);
  if(catalogNote){
    panelLines.push(`<div class="hint">${esc(catalogNote)}</div>`)
  }else if(youtubeCatalogMeta.error&&!isLocalBackend()){
    panelLines.push(`<div class="hint">Catálogo público indisponível agora: ${esc(youtubeCatalogMeta.error)}</div>`)
  }
  $("activePlaylistPanel").innerHTML=p?panelLines.join(""):"";
  const d=getDailyYT(),s=state.youtubeSettings;$("youtubeBudget").innerHTML=`<div class="budget-big">${budgetText()}</div><p class="hint">${limitReached()?"Limite atingido por hoje.":"Você ainda pode assistir dentro da cota."}</p>`;
  const today=todaysYoutube();$("dailyVideos").innerHTML=limitReached()&&s.hideAfterLimit?`<div class="hint">✦ Cota concluída por hoje.</div>`:today.length?today.map((v,n)=>videoRow(v,n,true)).join(""):`<div class="hint">${p?.lastSyncError?esc(p.lastSyncError):"Nenhum vídeo liberado agora."}</div>`;
  const queue=playlistQueue();$("youtubeQueue").innerHTML=queue.length?queue.slice(0,50).map((v,n)=>videoRow(v,n,false)).join(""):`<div class="hint">Fila vazia.</div>`
  scheduleYoutubeCatalogPolling()
}
function playlistQueue(){const p=activePlaylist();return state.youtubeQueue.filter(v=>v.playlistId===p?.id&&v.activeInCatalog!==false&&itemProgress(v)<100).sort((a,b)=>(a.position||0)-(b.position||0))}
function limitReached(){const d=getDailyYT(),s=state.youtubeSettings;if(s.mode==="none")return false;if(s.mode==="minutes")return d.minutes>=s.minutes;if(s.mode==="count")return d.count>=s.count;return d.minutes>=s.minutes||d.count>=s.count}
function budgetText(){const d=getDailyYT(),s=state.youtubeSettings;if(s.mode==="none")return `${d.count} vídeos · ${fmtMin(d.minutes)}`;if(s.mode==="minutes")return `${d.minutes}/${s.minutes} min`;if(s.mode==="count")return `${d.count}/${s.count} vídeos`;return `${d.minutes}/${s.minutes} min · ${d.count}/${s.count} vídeos`}
function todaysYoutube(){
  const q=playlistQueue(),d=getDailyYT(),s=state.youtubeSettings;
  if(s.hideAfterLimit&&limitReached()){
    return[]
  }
  if(s.mode==="none"){
    return q.slice(0,5)
  }
  const countLeft=Math.max(0,s.count-d.count),minLeft=Math.max(0,s.minutes-d.minutes);let out=[],used=0;
  // Videos without duration are allowed as the next pick, then stop the time-based queue so they are not treated as zero minutes.
  for(const v of q){
    const dur=Number(v.estimatedMinutes||0),hasDur=dur>0;
    if((s.mode==="count"||s.mode==="either")&&out.length>=countLeft){
      break
    }
    if((s.mode==="minutes"||s.mode==="either")&&out.length&&(!hasDur||used+dur>minLeft)){
      break
    }
    out.push(v);used+=hasDur?dur:minLeft
  }
  return out
}
function videoRow(v,n,today){
  const dur=Number(v.estimatedMinutes||0)>0?fmtMin(v.estimatedMinutes):"duração desconhecida";
  return `<div class="video-row clickable-row" role="button" tabindex="0" onclick="openFocus(${jsArg(v.id)},'youtube')" onkeydown="activateRow(event,this)">${v.thumbnail?`<img class="video-thumb" src="${esc(v.thumbnail)}">`:"<div class='num'>▶</div>"}<div class="grow"><strong>${esc(v.title)}</strong><span>${esc(v.channel||"YouTube")} · ${dur} ${today?`· vídeo ${n+1} de hoje`:""} · ${noteCount(v.id)} notas</span></div><button class="mini-btn" onclick="event.stopPropagation();openFocus(${jsArg(v.id)},'youtube')">Assistir</button><button class="mini-btn" onclick="event.stopPropagation();openFichamentoForSource(${jsArg(v.id)},'youtube')">Fichamento</button><button class="mini-btn" onclick="event.stopPropagation();openNotes(${jsArg(v.id)},'youtube')">Notas</button></div>`
}
function setPlaylist(id){if(!state.playlists.some(p=>p.id===id)){missingTarget();return}state.activePlaylist=id;save();renderYoutube()}
function setPlaylistFormError(message=""){const el=$("playlistFormError");if(!el){return}el.textContent=message;el.classList.toggle("hidden",!message)}
function setPlaylistSaving(saving){const btn=$("playlistSaveBtn");if(!btn){return}btn.disabled=saving;btn.textContent=saving?"Salvando...":"Salvar"}
function openPlaylistDialog(id=null){
  const f=$("playlistForm"),fields=f.elements;
  f.reset();
  setPlaylistFormError();
  setPlaylistSaving(false);
  fields.id.value="";
  fields.enabled.checked=true;
  if(id){
    const p=state.playlists.find(x=>x.id===id);
    $("playlistDialogTitle").textContent="Editar playlist";
    fields.id.value=p.id;
    fields.name.value=p.name;
    fields.url.value=p.url;
    fields.enabled.checked=p.enabled!==false;
    $("deletePlaylistBtn").classList.toggle("hidden",state.playlists.length<=1)
  }else{
    $("playlistDialogTitle").textContent="Nova playlist";
    $("deletePlaylistBtn").classList.add("hidden")
  }
  $("playlistDialog").showModal()
}
async function savePlaylist(e){
  e.preventDefault();
  const f=e.currentTarget,fields=f.elements,id=fields.id.value,name=fields.name.value.trim(),rawUrl=fields.url.value.trim(),enabled=fields.enabled.checked;
  setPlaylistFormError();
  if(!name){
    setPlaylistFormError("Informe um nome para salvar a playlist.");
    fields.name.focus();
    return
  }
  let normalizedUrl;
  try{
    normalizedUrl=normalizeYoutubePlaylistInput(rawUrl)
  }catch(err){
    setPlaylistFormError(err.message||"Não consegui entender a URL da playlist.");
    fields.url.focus();
    return
  }
  const previous=structuredClone(state);
  const next=structuredClone(state);
  const now=new Date().toISOString();
  const payload={name,url:normalizedUrl.url,youtubePlaylistId:normalizedUrl.youtubePlaylistId,enabled,updatedAt:now,lastSyncError:null};
  if(id){
    const playlist=next.playlists.find(p=>p.id===id);
    if(!playlist){
      setPlaylistFormError("Esta playlist não existe mais. Atualize a página e tente novamente.");
      return
    }
    Object.assign(playlist,payload)
  }else{
    const nid=crypto.randomUUID();
    next.playlists.push({id:nid,createdAt:now,catalogGeneratedAt:null,catalogTitle:null,lastSyncAt:null,...payload});
    next.activePlaylist=nid
  }
  state=normalize(next);
  setPlaylistSaving(true);
  try{
    await save(false,"playlist");
    $("playlistDialog").close();
    renderAll();
    await syncPlaylist()
  }catch(err){
    state=previous;
    setPlaylistFormError(`Não consegui salvar a playlist: ${err.message||"erro de armazenamento"}.`);
  }finally{
    setPlaylistSaving(false)
  }
}
function deletePlaylist(){const id=$("playlistForm").elements.id.value;if(state.playlists.length<=1){return alert("Mantenha pelo menos uma playlist.")}if(!confirm("Excluir esta playlist e sua fila local?")){return}state.playlists=state.playlists.filter(p=>p.id!==id);state.youtubeQueue=state.youtubeQueue.filter(v=>v.playlistId!==id);state.activePlaylist=state.playlists[0].id;save();$("playlistDialog").close()}
function mergePlaylistData(data,p){
  if(!Array.isArray(data.items)){
    throw new Error("Resposta sem lista de vídeos.")
  }
  const existing=state.youtubeQueue.filter(v=>v.playlistId===p.id);
  const old=new Map(existing.map(v=>[v.videoId||v.url,v]));
  const fresh=data.items.filter(v=>v&&v.title&&(v.videoId||v.url)).map((v,pos)=>{
    const videoId=v.videoId||youtubeVideoId(v.url)||v.id||v.url;
    const o=old.get(videoId)||old.get(v.url);
    const mins=v.durationSeconds?Math.max(1,Math.round(v.durationSeconds/60)):v.estimatedMinutes||o?.estimatedMinutes;
    const position=Math.max(0,(Number(v.position)||pos+1)-1);
    return {
      ...(o||{}),
      id:o?.id||crypto.randomUUID(),
      videoId,
      playlistId:p.id,
      youtubePlaylistId:data.playlistId||o?.youtubePlaylistId||playlistCatalogId(p)||"",
      kind:"youtube",
      title:v.title,
      url:v.url||o?.url||`https://www.youtube.com/watch?v=${videoId}`,
      channel:v.channel||o?.channel||"YouTube",
      thumbnail:v.thumbnail||o?.thumbnail||"",
      estimatedMinutes:mins,
      progress:o?.progress??0,
      status:o?.status||statusFromProgress(o?.progress||0),
      notes:o?.notes||"",
      important:o?.important??true,
      urgent:o?.urgent??false,
      track:o?.track||null,
      createdAt:o?.createdAt||new Date().toISOString(),
      position,
      catalogManaged:true,
      activeInCatalog:true,
      archivedAt:null
    }
  });
  const activeIds=new Set(fresh.map(v=>v.videoId||v.url));
  let carryPosition=fresh.length;
  const retained=existing.filter(v=>!activeIds.has(v.videoId||v.url)).map(v=>{
    if(v.catalogManaged===false){
      return {...v,activeInCatalog:v.activeInCatalog!==false,position:Number(v.position)>=0?Number(v.position):carryPosition++}
    }
    return {...v,activeInCatalog:false,archivedAt:v.archivedAt||new Date().toISOString(),position:Number(v.position)>=0?Number(v.position):carryPosition++}
  });
  state.youtubeQueue=state.youtubeQueue.filter(v=>v.playlistId!==p.id).concat(fresh,retained);
  if(!p.name){
    p.name=data.title||p.name
  }
  p.catalogTitle=data.title||p.catalogTitle||null;
  const canonicalPlaylist=normalizeYoutubePlaylistReference(data.playlistId||p.youtubePlaylistId||p.url||playlistCatalogId(p)||"");
  p.url=canonicalPlaylist.url;
  p.youtubePlaylistId=canonicalPlaylist.youtubePlaylistId;
  p.catalogGeneratedAt=data.generatedAt||p.catalogGeneratedAt||youtubeCatalogMeta.generatedAt||null;
  p.updatedAt=new Date().toISOString();
  p.lastSyncAt=new Date().toISOString();
  p.lastSyncError=null
}
function youtubeVideoId(url){
  try{
    const u=new URL(url);
    if(u.hostname.includes("youtu.be")){return u.pathname.slice(1)}
    return u.searchParams.get("v")||""
  }catch{return ""}
}
function addYoutubeUrlToQueue(url,title="YouTube"){
  const p=activePlaylist(),videoId=youtubeVideoId(url)||url;
  if(!p){return}
  if(state.youtubeQueue.some(v=>v.playlistId===p.id&&(v.videoId===videoId||v.url===url))){return}
  state.youtubeQueue.push({id:crypto.randomUUID(),videoId,playlistId:p.id,youtubePlaylistId:p.youtubePlaylistId||"",kind:"youtube",title,url,channel:"YouTube",thumbnail:"",estimatedMinutes:0,progress:0,status:"nao_iniciado",notes:"",important:true,urgent:false,track:null,createdAt:new Date().toISOString(),position:state.youtubeQueue.filter(v=>v.playlistId===p.id).length,catalogManaged:false,activeInCatalog:true,archivedAt:null})
}
function exportPlaylistFile(){
  const p=activePlaylist();
  if(!p){return}
  const items=state.youtubeQueue.filter(v=>v.playlistId===p.id).sort((a,b)=>(a.position||0)-(b.position||0)).map(v=>({videoId:v.videoId||youtubeVideoId(v.url),title:v.title,url:v.url,channel:v.channel,thumbnail:v.thumbnail,durationSeconds:v.estimatedMinutes?Number(v.estimatedMinutes)*60:null,estimatedMinutes:v.estimatedMinutes}));
  const data={title:p.name,playlistId:p.youtubePlaylistId||"",sourceUrl:p.url||"",exportedAt:new Date().toISOString(),items};
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  a.download=`arcana-playlist-${(p.name||"playlist").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"playlist"}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
async function syncPlaylist(){
  const p=activePlaylist();
  if(syncing){
    return
  }
  if(!p?.url){
    p.lastSyncError="Defina a URL.";
    save(false);
    renderAll();
    return
  }
  syncing=true;renderYoutube();
  try{
    if(isLocalBackend()){
      const r=await fetch(`/api/playlist?url=${encodeURIComponent(p.url)}`),text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch{throw new Error(`Resposta inválida do servidor (${r.status}).`)}if(!r.ok){throw new Error(data.error||`Falha (${r.status})`)}
      mergePlaylistData(data,p);
      await save(false,"youtube-local-sync")
    }else{
      const catalog=await fetchPublishedCatalog(true);
      const merged=applyPublishedCatalog(catalog,{targetPlaylist:p});
      if(!merged){
        p.lastSyncError=null;
        p.updatedAt=new Date().toISOString();
        await save(false,"youtube-awaiting-catalog")
      }else{
        await save(false,"youtube-catalog-sync")
      }
    }
  }catch(e){p.lastSyncError=e.message||String(e);await save(false,"youtube-sync-error")}finally{syncing=false;renderAll()}
}

function renderLibrary(){
  const q=$("searchInput").value.toLowerCase().trim(),tf=$("libraryTypeFilter").value,pf=$("priorityFilter").value;
  const list=state.items.filter(i=>(tf==="all"||i.kind===tf)&&(pf==="all"||priorityCode(i)===pf)&&(!q||[i.title,i.source,i.notes].join(" ").toLowerCase().includes(q)));
  $("libraryGrid").innerHTML=list.length?list.map(i=>libraryCard(i)).join(""):`<div class="hint">Nada encontrado.</div>`
}
function libraryCard(i){const p=itemProgress(i),tr=trackById(i.track);return `<article class="library-item clickable-row" role="button" tabindex="0" onclick="openFocus(${jsArg(i.id)},'item')" onkeydown="activateRow(event,this)"><span class="tag priority-${priorityCode(i)}">${priorityLabel(i)}</span><h3>${esc(i.title)}</h3><div class="meta"><span>${esc(tr?.name||"Sem trilha")}</span><span>${esc(i.source||i.kind)}</span><span>${p}%</span><span>${noteCount(i.id)} notas</span></div><div class="progress"><div style="width:${p}%"></div></div>${i.notes?`<p class="hint">${esc(i.notes).slice(0,180)}</p>`:""}<div class="item-actions"><button class="mini-btn" onclick="event.stopPropagation();openFocus(${jsArg(i.id)},'item')">Focar</button><button class="mini-btn" onclick="event.stopPropagation();editItem(${jsArg(i.id)})">Editar</button><button class="mini-btn" onclick="event.stopPropagation();openFichamentoForSource(${jsArg(i.id)},'item')">Fichamento</button><button class="mini-btn" onclick="event.stopPropagation();openNotes(${jsArg(i.id)},'item')">Notas</button></div></article>`}
function openItemDialog(kind="course",id=null){
  const active=ensureActiveTrack();
  const f=$("itemForm"),fields=f.elements;f.reset();fields.id.value=id||"";fields.track.innerHTML=state.tracks.length?state.tracks.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join(""):`<option value="">Sem trilha</option>`;fields.track.value=active?.id||"";fields.kind.value=kind;renderModuleEditor();
  if(id){const i=state.items.find(x=>x.id===id);if(!i){missingTarget();return}["kind","track","title","url","source","estimatedMinutes","progress","notes"].forEach(k=>{if(fields[k]){fields[k].value=i[k]??""}});fields.important.value=String(i.important!==false);fields.urgent.value=String(!!i.urgent);renderModuleEditor(i.modules||[])}
  $("itemDialog").showModal()
}
function editItem(id){openItemDialog("course",id)}
function renderModuleEditor(modules=[]){const f=$("itemForm"),show=f.elements.kind.value==="course";$("moduleEditor").classList.toggle("hidden",!show);if(show){$("moduleRows").innerHTML=modules.map((m,n)=>moduleInput(m,n)).join("")}}
function moduleInput(m={},n=Date.now()){return `<div class="module-input-row"><input data-module-title value="${esc(m.title||"")}" placeholder="Nome do módulo/aula"><input data-module-minutes type="number" min="0" value="${m.minutes||0}" placeholder="min"><button type="button" class="x" onclick="this.parentElement.remove()">×</button></div>`}
function saveItem(e){e.preventDefault();const f=e.currentTarget,fields=f.elements,id=fields.id.value;let i=id?state.items.find(x=>x.id===id):{id:crypto.randomUUID(),createdAt:new Date().toISOString()};Object.assign(i,{kind:fields.kind.value,track:fields.track.value,title:fields.title.value.trim(),url:fields.url.value.trim(),source:fields.source.value.trim(),important:fields.important.value==="true",urgent:fields.urgent.value==="true",estimatedMinutes:Number(fields.estimatedMinutes.value)||0,progress:Number(fields.progress.value)||0,notes:fields.notes.value});i.status=statusFromProgress(i.progress);if(i.kind==="course"){i.modules=[...document.querySelectorAll("#moduleRows .module-input-row")].map(r=>({title:r.querySelector("[data-module-title]").value.trim(),minutes:Number(r.querySelector("[data-module-minutes]").value)||0,done:false})).filter(m=>m.title)}if(!id){state.items.push(i)}save();$("itemDialog").close()}

function detectInbox(text){
  const t=text.trim(),low=t.toLowerCase();let type="manual";
  if(/youtube\.com|youtu\.be/.test(low))type="youtube";else if(/coursera\.org|udemy\.com|edx\.org/.test(low))type="course";else if(/github\.com/.test(low))type="repo";else if(/substack\.com|newsletter/.test(low))type="newsletter";else if(/spotify\.com.*episode|podcast/.test(low))type="podcast";else if(/\.pdf($|\?)/.test(low))type="reading";else if(/^https?:\/\//.test(low))type="article";
  return {id:crypto.randomUUID(),raw:t,url:/^https?:\/\//.test(t)?t:"",title:/^https?:\/\//.test(t)?t.replace(/^https?:\/\//,"").slice(0,80):t,type,createdAt:new Date().toISOString()}
}
function renderInbox(){$("inboxList").innerHTML=state.inbox.length?state.inbox.map(x=>`<div class="inbox-row"><span class="inbox-type">${x.type}</span><div class="grow"><strong>${esc(x.title)}</strong><span>${esc(x.url||"")}</span></div><button class="mini-btn" onclick="promoteInbox('${x.id}')">Organizar</button><button class="mini-btn danger" onclick="removeInbox('${x.id}')">×</button></div>`).join(""):`<div class="hint">Inbox vazia.</div>`}
function captureInbox(){const v=$("inboxInput").value.trim();if(!v)return;state.inbox.unshift(detectInbox(v));$("inboxInput").value="";save()}
function removeInbox(id){state.inbox=state.inbox.filter(x=>x.id!==id);save()}
function promoteInbox(id){const x=state.inbox.find(a=>a.id===id);if(!x){return}if(x.type==="youtube"){addYoutubeUrlToQueue(x.url,x.title);showView("youtube")}else{openItemDialog(x.type);const fields=$("itemForm").elements;fields.title.value=x.title;fields.url.value=x.url}state.inbox=state.inbox.filter(a=>a.id!==id);save(false)}

async function openNotes(id,scope){
  notesRef={id,scope};const i=resourceByScope(id,scope);if(!i){missingTarget();return}
  $("notesTitle").textContent=i.title||"Notas";
  if(i.vaultNoteId){
    try{const data=await api(`/api/notes/${encodeURIComponent(i.vaultNoteId)}`);$("notesText").value=data.note.content||"";notesRef.noteId=i.vaultNoteId}catch{$("notesText").value=i.notes||noteTemplate("quick",`Notas - ${i.title}`)}
  }else{
    $("notesText").value=i.notes?.startsWith("#")?i.notes:noteTemplate("quick",`Notas - ${i.title}`)
  }
  $("notesDialog").showModal()
}
async function saveNotes(){
  if(!notesRef)return;const i=resourceByScope(notesRef.id,notesRef.scope);if(!i)return;
  const payload={title:`Notas - ${i.title}`,type:"quick",content:$("notesText").value,trackId:i.track||null,sourceType:notesRef.scope==="youtube"?"video":i.kind||"resource",sourceId:i.id,tags:["nota"],source:{title:i.title,url:i.url||"",kind:i.kind||notesRef.scope}};
  try{
    const data=notesRef.noteId?await api(`/api/notes/${encodeURIComponent(notesRef.noteId)}`,{method:"PUT",body:JSON.stringify(payload)}):await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
    i.vaultNoteId=data.note.id;i.notes=(data.note.excerpt||"").slice(0,180);save(false);await loadVaultNotes();$("notesDialog").close();queueObsidianAutoSync("after_note_save")
  }catch(e){alert(e.message)}
}

function findFocus(id,scope){if(scope==="youtube")return state.youtubeQueue.find(i=>i.id===id);return state.items.find(i=>i.id===id)}
async function openFocus(id,scope){
  const i=findFocus(id,scope);if(!i){missingTarget();return}focusRef={id,scope};focusNoteId=i.focusDraftNoteId||null;timer=0;updateTimer();$("focusTitle").textContent=i.title;$("focusOpenLink").href=i.url||"#";let vid=null;try{const u=new URL(i.url);vid=u.hostname.includes("youtu.be")?u.pathname.slice(1):u.searchParams.get("v")}catch{};$("playerWrap").innerHTML=scope==="youtube"&&vid?`<iframe src="https://www.youtube-nocookie.com/embed/${vid}?rel=0" allowfullscreen></iframe>`:`<div class="player-placeholder">Abra o recurso e use o cronômetro para registrar a sessão.</div>`;
  $("focusTimestamp").value="";$("focusSaveState").textContent="Rascunho ainda não salvo.";
  if(focusNoteId){try{const data=await api(`/api/notes/${encodeURIComponent(focusNoteId)}`);$("focusNotesText").value=data.note.content||"";$("focusSaveState").textContent="Rascunho recuperado do vault."}catch{$("focusNotesText").value=noteTemplate("session",`Sessão - ${i.title}`)}}
  else{$("focusNotesText").value=noteTemplate("session",`Sessão - ${i.title}`)}
  $("focusDialog").showModal()
}
function startTimer(){if(timerHandle){return}timerHandle=setInterval(()=>{timer++;updateTimer()},1000);updateTimer()}
function pauseTimer(){if(timerHandle){clearInterval(timerHandle);timerHandle=null;updateTimer()}}
function resetTimer(){pauseTimer();timer=0;updateTimer()}
function updateTimer(){const h=String(Math.floor(timer/3600)).padStart(2,"0"),m=String(Math.floor(timer%3600/60)).padStart(2,"0"),s=String(timer%60).padStart(2,"0"),label=`${h}:${m}:${s}`;$("timerDisplay").textContent=label;if($("timerPauseBtn")){$("timerPauseBtn").disabled=!timerHandle}if($("focusSessionStatus")){$("focusSessionStatus").textContent=timer?`Duração da sessão: ${label}`:"Sessão ainda não iniciada."}}
async function closeFocus(saveDraft=true){clearTimeout(focusSaveTimer);if(saveDraft){await saveFocusDraft(false)}pauseTimer();$("focusDialog").close()}
async function completeFocus(){
  if(!focusRef)return;const i=findFocus(focusRef.id,focusRef.scope);if(!i)return;const mins=Math.max(1,Math.round(timer/60));
  const session={id:crypto.randomUUID(),date:dayKey(),timestamp:new Date().toISOString(),minutes:mins,title:i.title,type:focusRef.scope,track:i.track||null};
  state.sessions.push(session);
  clearTimeout(focusSaveTimer);
  await saveFocusDraft(true,session.id,mins);
  i.focusDraftNoteId=null;focusNoteId=null;
  state.xp+=Math.max(10,mins*2);updateStreak();
  if(focusRef.scope==="youtube"){const d=getDailyYT();d.count++;d.minutes+=i.estimatedMinutes||mins;i.progress=100;i.status="concluido"}else{i.progress=Math.min(100,Number(i.progress||0)+Math.max(5,Math.round(mins/Math.max(1,Number(i.estimatedMinutes||60))*100)));i.status=statusFromProgress(i.progress);if(i.track)state.weeklyProgress[i.track]=(state.weeklyProgress[i.track]||0)+mins}
  await save();await closeFocus(false);queueObsidianAutoSync("after_session")
}
function updateStreak(){const today=dayKey(),y=new Date();y.setDate(y.getDate()-1);const yd=dayKey(y);if(state.lastStudyDate===today)return;if(state.lastStudyDate===yd)state.streak++;else state.streak=1;state.lastStudyDate=today}

async function saveFocusDraft(done=false,sessionId=null,minutes=0){
  if(!focusRef||!$("focusNotesText"))return;const i=findFocus(focusRef.id,focusRef.scope);if(!i)return;
  const payload={title:`Sessão - ${i.title}`,type:"session",content:$("focusNotesText").value,trackId:i.track||null,sourceType:focusRef.scope==="youtube"?"video":i.kind||"resource",sourceId:i.id,sessionId:sessionId||null,tags:done?["sessao","concluida"]:["sessao","rascunho"],source:{title:i.title,url:i.url||"",timestamp:$("focusTimestamp").value||"",minutes}};
  try{
    const data=focusNoteId?await api(`/api/notes/${encodeURIComponent(focusNoteId)}`,{method:"PUT",body:JSON.stringify(payload)}):await api("/api/notes",{method:"POST",body:JSON.stringify(payload)});
    focusNoteId=data.note.id;i.focusDraftNoteId=focusNoteId;$("focusSaveState").textContent=done?"Sessão salva no vault.":"Rascunho salvo no vault.";save(false);loadVaultNotes()
  }catch(e){$("focusSaveState").textContent=`Falha ao salvar: ${e.message}`}
}
function queueFocusSave(){clearTimeout(focusSaveTimer);focusSaveTimer=setTimeout(()=>saveFocusDraft(false),900)}
function insertFocusBlock(kind){
  const map={concept:"## Conceito\n\n",quote:`## Citação ${$("focusTimestamp").value?`(${$("focusTimestamp").value})`:""}\n\n> \n\n`,question:"## Pergunta\n\n- \n\n",action:"## Próximas ações\n\n- [ ] \n\n"};
  const ta=$("focusNotesText"),txt=map[kind]||"";ta.setRangeText("\n\n"+txt,ta.selectionStart,ta.selectionEnd,"end");ta.focus();queueFocusSave()
}

function renderVaultHome(){
  if(!$("homeReviews"))return;
  const due=vaultNotes.filter(n=>n.reviewAt&&n.reviewAt<=dayKey()&&n.status!=="archived");
  $("homeReviews").innerHTML=due.length?due.slice(0,4).map(n=>noteRow(n,"homeReview")).join(""):`<div class="hint">Nada vencido para revisar.</div>`;
  $("homeKnowledge").innerHTML=vaultNotes.length?vaultNotes.filter(n=>n.status!=="archived").slice(0,5).map(n=>noteRow(n,"home")).join(""):`<div class="hint">Crie notas, fichamentos ou sessões de foco para alimentar o vault.</div>`
}
function noteIsFichamento(n){return n.type==="literature"||n.type==="fichamento"}
function noteUpdatedLabel(n){
  const stamp=n.updatedAt||n.createdAt;
  if(!stamp){return ""}
  try{return new Date(stamp).toLocaleString("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}catch{return ""}
}
function noteMeta(n){
  const parts=[NOTE_TYPE_LABELS[n.type]||n.type||"Nota"];
  const tr=trackById(n.trackId);
  const updated=noteUpdatedLabel(n);
  if(tr){parts.push(tr.name)}
  if(updated){parts.push(updated)}
  if(n.reviewAt){parts.push(`revisar ${n.reviewAt.slice(0,10)}`)}
  if(n.links?.length){parts.push(`${n.links.length} link${n.links.length>1?"s":""}`)}
  return parts.join(" · ")
}
function noteRowAction(n,mode="notes"){
  if(mode==="homeReview"){return `navigateTo('review',{noteId:${jsArg(n.id)}})`}
  if(mode==="home"){return noteIsFichamento(n)?`navigateTo('fichamentos',{fichamentoId:${jsArg(n.id)}})`:`navigateTo('notes',{noteId:${jsArg(n.id)}})`}
  if(mode==="fichamentos"){return `selectFichamento(${jsArg(n.id)})`}
  if(mode==="review"){return `openReviewNote(${jsArg(n.id)})`}
  return `selectVaultNote(${jsArg(n.id)})`
}
function noteRow(n,mode="notes"){const action=noteRowAction(n,mode);return `<div class="vault-row clickable-row ${activeVaultNote?.id===n.id?"active":""}" role="button" tabindex="0" onclick="${action}" onkeydown="activateRow(event,this)"><div class="grow"><strong>${esc(n.title)}</strong><span>${esc(noteMeta(n))}</span></div>${n.favorite?"<span class='tag'>★</span>":""}</div>`}
function renderNotes(){
  if(!$("vaultList"))return;
  let list=[...vaultNotes],q=($("vaultSearchInput")?.value||"").toLowerCase().trim(),type=$("vaultTypeFilter")?.value||"all",track=$("vaultTrackFilter")?.value||"all",tag=($("vaultTagFilter")?.value||"").replace(/^#/,""),fav=$("vaultFavoriteFilter")?.value||"all",review=$("vaultReviewFilter")?.value||"all",sort=$("vaultSortFilter")?.value||"updated";
  list=list.filter(n=>(review==="archived"?n.status==="archived":n.status!=="archived")&&(type==="all"||n.type===type)&&(track==="all"||n.trackId===track)&&(!tag||(n.tags||[]).includes(tag))&&(fav==="all"||!!n.favorite)&&(!q||[n.title,n.excerpt,(n.tags||[]).join(" ")].join(" ").toLowerCase().includes(q))&&(review!=="due"||n.reviewAt&&n.reviewAt<=dayKey()));
  if(sort==="alphabetical")list.sort((a,b)=>a.title.localeCompare(b.title));else if(sort==="review")list.sort((a,b)=>(a.reviewAt||"9999").localeCompare(b.reviewAt||"9999"));else if(sort==="created")list.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));else list.sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""));
  $("vaultList").innerHTML=list.length?list.map(n=>noteRow(n,"notes")).join(""):`<div class="hint">Nenhuma nota encontrada.</div>`;
  if(!activeVaultNote){$("vaultEditorPane").innerHTML=`<div class="hint">Selecione uma nota ou crie uma nova.</div>`}
}
function renderFichamentos(){
  if(!$("fichamentoList"))return;
  const q=($("fichamentoSearch")?.value||"").toLowerCase().trim(),st=$("fichamentoSourceType")?.value||"all";
  const list=vaultNotes.filter(n=>n.type==="literature"&&n.status!=="archived"&&(st==="all"||n.sourceType===st)&&(!q||[n.title,n.excerpt,n.sourceType].join(" ").toLowerCase().includes(q)));
  $("fichamentoList").innerHTML=list.length?list.map(n=>noteRow(n,"fichamentos")).join(""):`<div class="hint">Nenhum fichamento ainda.</div>`;
  if(!activeVaultNote&&$("fichamentoEditor")){$("fichamentoEditor").innerHTML=`<div class="hint">Crie ou selecione um fichamento.</div>`}
}
function renderReviews(){
  if(!$("reviewQueue"))return;
  const due=vaultNotes.filter(n=>n.reviewAt&&n.reviewAt<=dayKey()&&n.status!=="archived").sort((a,b)=>(a.reviewAt||"").localeCompare(b.reviewAt||""));
  $("reviewQueue").innerHTML=due.length?due.map(n=>noteRow(n,"review")).join(""):`<div class="hint">Fila limpa. Agende revisões a partir de uma nota.</div>`;
  if(!currentReviewNote){$("reviewActive").innerHTML=`<div class="hint">Selecione uma nota vencida para revisar.</div>`}
}
async function selectVaultNote(id){try{activeVaultMode="notes";if($("fichamentoEditor")){$("fichamentoEditor").innerHTML=`<div class="hint">Selecione um fichamento.</div>`}await loadFullNote(id);renderVaultEditor("vaultEditorPane")}catch(e){missingTarget()}}
async function selectFichamento(id){try{activeVaultMode="fichamentos";if($("vaultEditorPane")){$("vaultEditorPane").innerHTML=`<div class="hint">Selecione uma nota.</div>`}await loadFullNote(id);renderVaultEditor("fichamentoEditor")}catch(e){missingTarget()}}
async function loadFullNote(id){const data=await api(`/api/notes/${encodeURIComponent(id)}`);activeVaultNote=data.note;currentReviewNote=activeVaultMode==="review"?data.note:currentReviewNote}
function renderVaultEditor(targetId){
  const n=activeVaultNote;if(!n)return;
  $(targetId).innerHTML=`<div class="editor-head"><input id="vaultTitle" value="${esc(n.title)}"><select id="vaultType">${Object.entries(NOTE_TYPE_LABELS).map(([k,v])=>`<option value="${k}" ${n.type===k?"selected":""}>${v}</option>`).join("")}</select></div><div class="editor-meta"><select id="vaultTrack">${trackOptions(n.trackId||"all")}</select><input id="vaultTags" value="${esc((n.tags||[]).map(t=>"#"+t).join(" "))}" placeholder="#tags"><input id="vaultReviewAt" type="date" value="${esc((n.reviewAt||"").slice(0,10))}"><label class="check"><input id="vaultFavorite" type="checkbox" ${n.favorite?"checked":""}> Favorita</label></div><textarea id="vaultContent" rows="18">${esc(n.content||"")}</textarea><div class="editor-actions"><button class="mini-btn" onclick="saveActiveVaultNote()">Salvar</button><button class="mini-btn" onclick="previewActiveVaultNote()">Preview</button><button class="mini-btn" onclick="promoteActiveSelection()">Promover ideia</button><button class="mini-btn" onclick="createFlashcardFromActive()">Flashcard</button><button class="mini-btn" onclick="scheduleActiveReview(1)">Amanhã</button><button class="mini-btn" onclick="scheduleActiveReview(7)">7 dias</button><button class="mini-btn danger" onclick="archiveActiveNote()">Arquivar</button></div><div id="vaultWarnings">${n.backlinks?.length?`<div class="hint">Backlinks: ${n.backlinks.map(b=>`[[${esc(b.title)}]]`).join(" ")}</div>`:""}</div><div id="vaultPreview" class="markdown-preview hidden"></div>`;
  ["vaultTitle","vaultType","vaultTrack","vaultTags","vaultReviewAt","vaultFavorite","vaultContent"].forEach(id=>$(id).oninput=()=>{clearTimeout(vaultSaveTimer);vaultSaveTimer=setTimeout(saveActiveVaultNote,900)})
}
function activePayload(){
  const type=$("vaultType").value;
  return {title:$("vaultTitle").value.trim()||"Untitled Note",type,content:$("vaultContent").value,trackId:$("vaultTrack").value==="all"?null:$("vaultTrack").value,tags:splitTags($("vaultTags").value),favorite:$("vaultFavorite").checked,reviewAt:$("vaultReviewAt").value||null,sourceType:activeVaultNote?.sourceType||null,sourceId:activeVaultNote?.sourceId||null,sessionId:activeVaultNote?.sessionId||null,relatedNoteIds:activeVaultNote?.relatedNoteIds||[],source:activeVaultNote?.source||{}}
}
async function saveActiveVaultNote(){
  if(!activeVaultNote)return;
  try{const data=await api(`/api/notes/${encodeURIComponent(activeVaultNote.id)}`,{method:"PUT",body:JSON.stringify(activePayload())});activeVaultNote=data.note;if(data.duplicateCandidates?.length){$("vaultWarnings").innerHTML=`<div class="hint">Possível duplicata: ${data.duplicateCandidates.map(d=>esc(d.title)).join(", ")}</div>`}await loadVaultNotes();queueObsidianAutoSync("after_note_save")}catch(e){alert(e.message)}
}
function previewActiveVaultNote(){const p=$("vaultPreview");p.classList.toggle("hidden");p.innerHTML=mdToHtml($("vaultContent").value)}
async function newVaultNote(type="permanent"){
  const data=await api("/api/notes",{method:"POST",body:JSON.stringify({title:"Nova nota",type,content:noteTemplate(type,"Nova nota"),tags:[],trackId:state.activeTrack})});
  activeVaultNote=data.note;if($("fichamentoEditor")){$("fichamentoEditor").innerHTML=`<div class="hint">Selecione um fichamento.</div>`}showView("notes");renderVaultEditor("vaultEditorPane");await loadVaultNotes()
}
async function newFichamento(source=null){
  const title=source?.title||"Novo fichamento",sourceType=source?.sourceType||"book";
  const data=await api("/api/notes",{method:"POST",body:JSON.stringify({title,type:"literature",content:literatureTemplate(title,sourceType),trackId:source?.track||state.activeTrack,sourceType,sourceId:source?.id||null,tags:["fichamento"],source:source||{}})});
  activeVaultNote=data.note;if($("vaultEditorPane")){$("vaultEditorPane").innerHTML=`<div class="hint">Selecione uma nota.</div>`}showView("fichamentos");renderVaultEditor("fichamentoEditor");await loadVaultNotes()
}
function openFichamentoForSource(id,scope){const i=resourceByScope(id,scope);if(!i){missingTarget();return}newFichamento({id:i.id,title:i.title,url:i.url||"",track:i.track||null,sourceType:scope==="youtube"?"video":i.kind==="course"?"course":i.kind||"resource",channel:i.channel||"",source:i.source||""})}
async function promoteActiveSelection(){
  const ta=document.querySelector(".view.active #vaultContent")||$("notesText");const selected=ta.value.slice(ta.selectionStart,ta.selectionEnd).trim();const title=(selected.split("\n")[0]||prompt("Título da nota permanente")||"Ideia permanente").slice(0,90);
  const data=await api("/api/notes",{method:"POST",body:JSON.stringify({title,type:"permanent",content:noteTemplate("permanent",title)+(selected?`\n\n> ${selected}\n`:""),trackId:activeVaultNote?.trackId||state.activeTrack,relatedNoteIds:activeVaultNote?[activeVaultNote.id]:[],tags:["ideia"]})});
  if(activeVaultNote&&document.querySelector(".view.active #vaultContent")){ta.value+=`\n\nRelacionado: [[${data.note.title}]]\n`;await saveActiveVaultNote()}
  await loadVaultNotes();alert("Ideia promovida para nota permanente.")
}
function promoteDialogNote(){promoteActiveSelection()}
async function createFlashcardFromActive(){
  if(!activeVaultNote)return;const front=prompt("Frente do flashcard",activeVaultNote.title);if(!front)return;const back=prompt("Verso do flashcard","");if(back===null)return;
  await api("/api/flashcards",{method:"POST",body:JSON.stringify({front,back,sourceNoteId:activeVaultNote.id,tags:activeVaultNote.tags||[],reviewAt:isoDate(1)})});alert("Flashcard salvo.")
}
async function scheduleActiveReview(days){if(!$("vaultReviewAt"))return;$("vaultReviewAt").value=isoDate(days);await saveActiveVaultNote()}
async function archiveActiveNote(){if(!activeVaultNote||!confirm("Arquivar esta nota?"))return;const targetId=activeVaultMode==="fichamentos"?"fichamentoEditor":"vaultEditorPane";await api(`/api/notes/${encodeURIComponent(activeVaultNote.id)}`,{method:"DELETE"});activeVaultNote=null;await loadVaultNotes();if($(targetId)){$(targetId).innerHTML=`<div class="hint">Nota arquivada.</div>`}}
async function openReviewNote(id){try{activeVaultMode="review";await loadFullNote(id);currentReviewNote=activeVaultNote;$("reviewActive").innerHTML=`<h2>${esc(currentReviewNote.title)}</h2><div class="markdown-preview">${mdToHtml(currentReviewNote.content||"")}</div><div class="editor-actions"><button class="mini-btn" onclick="reviewAction(1)">Difícil</button><button class="mini-btn" onclick="reviewAction(7)">Bom</button><button class="mini-btn" onclick="reviewAction(30)">Fácil</button><button class="mini-btn danger" onclick="reviewAction(null)">Arquivar</button></div>`}catch(e){missingTarget()}}
async function reviewAction(days){if(!currentReviewNote)return;if(days===null){await api(`/api/notes/${encodeURIComponent(currentReviewNote.id)}`,{method:"DELETE"})}else{await api(`/api/notes/${encodeURIComponent(currentReviewNote.id)}`,{method:"PUT",body:JSON.stringify({...currentReviewNote,reviewAt:isoDate(days),tags:[...(currentReviewNote.tags||[]).filter(t=>t!=="due"),"reviewed"]})});state.xp+=5;save(false)}currentReviewNote=null;await loadVaultNotes()}

function renderCalendar(){
  const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth();$("calendarTitle").textContent=new Date(y,m,1).toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
  const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),heads=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  let html=heads.map(h=>`<div class="cal-head">${h}</div>`).join("");for(let i=0;i<first;i++)html+=`<div class="cal-day empty-day"></div>`;
  for(let d=1;d<=days;d++){const key=dayKey(new Date(y,m,d)),ss=state.sessions.filter(s=>s.date===key),mins=ss.reduce((a,b)=>a+b.minutes,0);html+=`<div class="cal-day"><strong>${d}</strong>${mins?`<div class="cal-min"><span class="cal-dot"></span>${mins} min · ${ss.length} sessões</div>`:""}</div>`}
  $("calendarGrid").innerHTML=html;$("recentSessions").innerHTML=[...state.sessions].reverse().slice(0,12).map(s=>`<div class="session-row"><div class="grow"><strong>${esc(s.title)}</strong><span>${new Date(s.timestamp).toLocaleString("pt-BR")} · ${s.minutes} min</span></div><span class="tag">+${Math.max(10,s.minutes*2)} XP</span></div>`).join("")||`<div class="hint">Nenhuma sessão registrada.</div>`
}

function renderCatalogRequestDialog(){
  const dialogTitle=$("catalogRequestTitle"),help=$("catalogRequestHelp"),json=$("catalogRequestJson"),status=$("catalogRequestStatus");
  const playlist=activePlaylist();
  if(!playlist){
    return
  }
  const payload=catalogRequestPayload(playlist);
  if(dialogTitle){
    dialogTitle.textContent=playlist.name||"Mais opções de catálogo"
  }
  if(json){
    json.value=payload
  }
  if(status){
    status.textContent=""
  }
  if(help){
    if(payload){
      help.innerHTML=`<p class="hint">Fluxo principal: use <strong>Solicitar sincronização</strong> para abrir a issue pré-preenchida no GitHub.</p><p class="hint">Use o JSON abaixo apenas como fallback manual ou avançado.</p><p class="hint">Se precisar, copie a configuração para <code>data/youtube/playlists.json</code>, faça commit e rode o workflow <code>Sync YouTube Catalog</code>.</p>`
    }else{
      help.innerHTML=`<p class="hint">Salve primeiro uma URL canônica de playlist do YouTube para gerar a configuração manual.</p>`
    }
  }
}
function openCatalogRequestDialog(){
  renderCatalogRequestDialog();
  $("catalogRequestDialog").showModal()
}
async function copyCatalogRequestJson(){
  const field=$("catalogRequestJson"),status=$("catalogRequestStatus");
  if(!field||!field.value.trim()){
    if(status){
      status.textContent="Nada para copiar ainda."
    }
    return
  }
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(field.value)
    }else{
      field.focus();
      field.select?.()
    }
    if(status){
      status.textContent="JSON copiado."
    }
  }catch(err){
    if(status){
      status.textContent=err.message||"Não consegui copiar automaticamente."
    }
  }
}
function renderSettings(){
  const f=$("youtubeSettingsForm"),s=state.youtubeSettings;
  if(!f){return}
  const local=isLocalBackend(),connected=!!state.obsidian.connected;
  f.mode.value=s.mode;
  f.minutes.value=s.minutes;
  f.count.value=s.count;
  f.hideAfterLimit.checked=s.hideAfterLimit;
  if($("environmentStatus")){
    $("environmentStatus").textContent=`Ambiente: ${local?"Arcana Local disponível para yt-dlp":"estático/GitHub Pages"} · dados primários em IndexedDB do navegador.`
  }
  if($("youtubeCatalogStatus")){
    const generatedAt=formatCatalogStamp(youtubeCatalogMeta.generatedAt);
    const loadedAt=formatCatalogStamp(youtubeCatalogMeta.lastLoadedAt);
    $("youtubeCatalogStatus").innerHTML=`<p class="hint">${local?"No Arcana Local, as playlists sincronizam direto com yt-dlp.":"No Arcana Online, o catálogo público é a fonte de metadados publicada pelo GitHub Pages."}</p><p class="hint">${youtubeCatalogMeta.error?`Erro do catálogo: ${esc(youtubeCatalogMeta.error)}`:`Catálogo público: ${youtubeCatalogMeta.playlistCount||0} playlists · ${youtubeCatalogMeta.videoCount||0} vídeos${generatedAt?` · gerado em ${esc(generatedAt)}`:""}${loadedAt?` · carregado em ${esc(loadedAt)}`:""}.`}</p>`
  }
  if($("youtubePlaylistDiagnostics")){
    $("youtubePlaylistDiagnostics").innerHTML=state.playlists.map(playlist=>{
      const status=playlistStatusSummary(playlist);
      const catalogId=playlistCatalogId(playlist)||"sem list";
      return `<div class="diag-row"><div class="grow"><strong>${esc(playlist.name)}</strong><span>${esc(catalogId)} · ${esc(playlist.url||"sem URL")}</span></div>${playlistStatusChip(playlist)}<span class="diag-text">${esc(status.message)}</span></div>`
    }).join("")||`<div class="hint">Nenhuma playlist configurada.</div>`
  }
  if($("refreshCatalogBtn")){
    $("refreshCatalogBtn").disabled=local
  }
  $("backupStatus").innerHTML=`<p class="hint">${state.lastAutoBackup?`Último snapshot automático: ${new Date(state.lastAutoBackup).toLocaleString("pt-BR")}`:"Nenhum snapshot automático ainda."}</p>`;
  if($("obsidianEnvironmentStatus")){$("obsidianEnvironmentStatus").textContent=`Ambiente: ${obsidianEnvironmentLabel()}`;}
  if($("obsidianVaultStatus")){$("obsidianVaultStatus").innerHTML=`<p class="hint">${connected?`Vault: ${esc(state.obsidian.vaultName||"sem nome")} · ${esc(state.obsidian.vaultPath||"")}`:"Nenhum vault conectado."}</p><p class="hint">${connected&&state.obsidian.lastSyncAt?`Última sincronização: ${new Date(state.obsidian.lastSyncAt).toLocaleString("pt-BR")}`:local?"Conecte um vault para sincronização bidirecional.":"Use exportação/importação para mover notas entre Arcana Online e Obsidian."}</p>${state.obsidian.error?`<p class="hint">Erro: ${esc(state.obsidian.error)}</p>`:""}`;}
  if($("obsidianStats")){$("obsidianStats").innerHTML=`<div class="profile-grid"><div class="profile-stat"><span>Notas</span><strong>${state.obsidian.noteCount||0}</strong></div><div class="profile-stat"><span>Fichamentos</span><strong>${state.obsidian.fichamentoCount||0}</strong></div><div class="profile-stat"><span>Anexos</span><strong>${state.obsidian.attachmentCount||0}</strong></div><div class="profile-stat"><span>Conflitos</span><strong>${state.obsidian.conflicts||0}</strong></div></div>`;}
  if($("obsidianAutoSync")){$("obsidianAutoSync").value=state.obsidian.autoSync||"after_session";$("obsidianAutoSync").disabled=!local;}
  if($("obsidianAutoSyncNote")){$("obsidianAutoSyncNote").textContent=`Autosync atual: ${obsidianModeLabel(state.obsidian.autoSync)}.`;}
  if($("obsidianConnectBtn")){$("obsidianConnectBtn").disabled=!local;}
  if($("obsidianSyncBtn")){$("obsidianSyncBtn").disabled=!local||!connected;}
  if($("obsidianPullBtn")){$("obsidianPullBtn").disabled=!local||!connected;}
  if($("obsidianPushBtn")){$("obsidianPushBtn").disabled=!local||!connected;}
  if($("obsidianDisconnectBtn")){$("obsidianDisconnectBtn").disabled=!local||!connected;}
  if($("obsidianOpenBtn")){$("obsidianOpenBtn").disabled=!local||!state.obsidian.openUrl;}
  renderSnapshots()
}
async function renderSnapshots(){if(!$("snapshotList")||!window.ArcanaStorage?.ready){return}try{const snaps=await ArcanaStorage.listSnapshots();$("snapshotList").innerHTML=snaps.length?snaps.map(s=>`<option value="${esc(s.id)}">${new Date(s.createdAt).toLocaleString("pt-BR")} · ${esc(s.reason||"auto")}</option>`).join(""):`<option value="">Nenhum snapshot</option>`}catch(e){$("snapshotList").innerHTML=`<option value="">Snapshots indisponíveis</option>`}}
async function autoBackup(reason="auto"){try{if(window.ArcanaStorage?.ready){await ArcanaStorage.snapshot(reason,state);state.lastAutoBackup=new Date().toISOString();await ArcanaStorage.saveState(state)}else{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}renderSettings()}catch(e){console.warn("[Arcana] snapshot failed",e)}}
let backupDebounce=null;function scheduleAutoBackup(reason="change"){clearTimeout(backupDebounce);backupDebounce=setTimeout(()=>autoBackup(reason),1800)}

if(typeof window!=="undefined"){
  window.ArcanaDebug={
    state:()=>structuredClone(state),
    tracks:()=>structuredClone(state.tracks),
    storageState:()=>window.ArcanaStorage?.loadState(DEFAULT_STATE),
    store:name=>window.ArcanaStorage?.list(name)
  }
}

function renderAll(){renderHome();renderTracks();renderYoutube();renderLibrary();renderInbox();renderCalendar();renderSettings();$("sideDate").textContent=new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});$("streakSide").textContent=`${state.streak} dias de sequência`}

async function migrateLocalVaultFromBackend(){
  if(!window.ArcanaStorage?.ready||!isLocalBackend()||localStorage.getItem("arcana-local-vault-migrated-v1")){return}
  try{
    const list=await fetch("/api/notes?sort=updated");
    if(!list.ok){return}
    const data=await list.json();
    for(const summary of data.notes||[]){
      const res=await fetch(`/api/notes/${encodeURIComponent(summary.id)}`);
      if(!res.ok){continue}
      const full=await res.json();
      if(full.note){await ArcanaStorage.route(`/api/notes/${encodeURIComponent(full.note.id)}`,{method:"PUT",body:JSON.stringify(full.note)})}
    }
    localStorage.setItem("arcana-local-vault-migrated-v1","1")
  }catch(e){
    console.info("[Arcana] local Markdown vault bridge skipped",e.message||e)
  }
}

async function importFullBackupFile(file){
  const replace=confirm("OK substitui os dados locais. Cancelar mescla o backup com o vault atual.");
  state=normalize(await ArcanaStorage.importFullBackup(file,replace?"replace":"merge"));
  await ArcanaStorage.saveState(state);
  await loadVaultNotes();
  renderAll()
}

async function importPlaylistFile(file){
  const data=JSON.parse(await file.text());
  const p=activePlaylist();
  mergePlaylistData(data,p);
  save();
}

async function initApp(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(e=>console.info("[Arcana] service worker unavailable",e.message||e))
  }
  try{
    if(window.ArcanaStorage){
      state=applyStarterContent(await ArcanaStorage.init({storageKey:STORAGE_KEY,legacyKeys:LEGACY_KEYS,defaultState:DEFAULT_STATE,normalize,migrate}));
      await ArcanaStorage.saveState(state);
      await migrateLocalVaultFromBackend()
    }else{
      state=applyStarterContent(loadState());
      localStorage.setItem(STORAGE_KEY,JSON.stringify(state))
    }
  }catch(e){
    console.warn("[Arcana] IndexedDB unavailable, falling back to localStorage",e);
    state=applyStarterContent(loadState());
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state))
  }
  renderAll();
  await loadVaultNotes();
  await refreshObsidianStatus();
  if(!isLocalBackend()){
    try{
      await refreshPublishedCatalog(false);
    }catch(e){
      youtubeCatalogMeta={...youtubeCatalogMeta,error:e.message||String(e)};
    }
    renderAll()
  }
  setTimeout(()=>{if(activePlaylist()?.url&&!activePlaylist()?.lastSyncAt&&isLocalBackend()){syncPlaylist()}if(!state.lastAutoBackup){autoBackup("initial")}},700)
}

$("regenPlanBtn").onclick=generatePlan;$("todayMinutes").onchange=generatePlan;
$("newTrackBtn").onclick=()=>openTrackDialog();$("editTrackBtn").onclick=()=>openTrackDialog(state.activeTrack);$("trackForm").onsubmit=saveTrack;$("deleteTrackBtn").onclick=deleteTrack;$("addCourseBtn").onclick=()=>openItemDialog("course");
$("newPlaylistBtn").onclick=()=>openPlaylistDialog();$("editPlaylistBtn").onclick=()=>openPlaylistDialog(state.activePlaylist);$("playlistForm").onsubmit=savePlaylist;$("deletePlaylistBtn").onclick=deletePlaylist;$("syncPlaylistBtn").onclick=syncPlaylist;
$("exportPlaylistBtn").onclick=exportPlaylistFile;
$("catalogOptionsBtn").onclick=openCatalogRequestDialog;
$("copyCatalogRequestBtn").onclick=()=>copyCatalogRequestJson().catch(()=>{});
$("searchInput").oninput=renderLibrary;$("libraryTypeFilter").onchange=renderLibrary;$("priorityFilter").onchange=renderLibrary;
$("captureBtn").onclick=captureInbox;$("inboxInput").onkeydown=e=>{if(e.key==="Enter")captureInbox()};
$("youtubeSettingsForm").onsubmit=e=>{e.preventDefault();const f=e.currentTarget;state.youtubeSettings={mode:f.mode.value,minutes:Number(f.minutes.value)||0,count:Number(f.count.value)||0,hideAfterLimit:f.hideAfterLimit.checked};save()};
$("refreshCatalogBtn").onclick=async()=>{try{await refreshPublishedCatalog(true);renderAll()}catch(err){youtubeCatalogMeta={...youtubeCatalogMeta,error:err.message||String(err)};renderAll();alert(err.message||String(err))}};
$("backupNowBtn").onclick=()=>autoBackup("manual");
$("exportFullBackupBtn").onclick=()=>ArcanaStorage.downloadFullBackup(state);
$("fullBackupImportInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await importFullBackupFile(f)}catch(err){alert(err.message)}e.target.value=""};
$("exportVaultBtn").onclick=()=>ArcanaStorage.downloadVault();
$("vaultImportInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const summary=await ArcanaStorage.importVault(f);await loadVaultNotes();renderAll();if(summary){alert(`Importação concluída: ${summary.importedNotes||0} notas (${summary.arcanaManagedNotes||0} gerenciadas pelo Arcana, ${summary.externalNotes||0} externas) e ${summary.importedFlashcards||0} flashcards.`)}}catch(err){alert(err.message)}e.target.value=""};
$("reindexVaultBtn").onclick=async()=>{try{await api("/api/reindex",{method:"POST"});await loadVaultNotes();alert("Vault reindexado.")}catch(e){alert(e.message)}};
$("restoreSnapshotBtn").onclick=async()=>{const id=$("snapshotList").value;if(!id)return;try{state=normalize(await ArcanaStorage.restoreSnapshot(id));await loadVaultNotes();renderAll()}catch(e){alert(e.message)}};
$("obsidianConnectBtn").onclick=()=>connectObsidianVault().catch(e=>alert(e.message||String(e)));
$("obsidianSyncBtn").onclick=()=>runObsidianSync("sync").catch(()=>{});
if(document.addEventListener){
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
      stopYoutubeCatalogPolling();
    }else{
      scheduleYoutubeCatalogPolling()
    }
  });
}
$("obsidianPullBtn").onclick=()=>runObsidianSync("pull").catch(()=>{});
$("obsidianPushBtn").onclick=()=>runObsidianSync("push").catch(()=>{});
$("obsidianDisconnectBtn").onclick=()=>disconnectObsidianVault().catch(e=>alert(e.message||String(e)));
$("obsidianOpenBtn").onclick=openObsidianVault;
$("obsidianAutoSync").onchange=e=>updateObsidianAutoSync(e.currentTarget.value).catch(err=>alert(err.message||String(err)));
$("playlistImportInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await importPlaylistFile(f)}catch(err){alert(err.message)}e.target.value=""};
$("newNoteBtn").onclick=()=>newVaultNote("permanent");$("newFichamentoBtn").onclick=()=>newFichamento();
["vaultSearchInput","vaultTypeFilter","vaultTrackFilter","vaultTagFilter","vaultFavoriteFilter","vaultReviewFilter","vaultSortFilter"].forEach(id=>{if($(id))$(id).oninput=renderNotes;if($(id))$(id).onchange=renderNotes});
["fichamentoSearch","fichamentoSourceType"].forEach(id=>{if($(id))$(id).oninput=renderFichamentos;if($(id))$(id).onchange=renderFichamentos});
$("prevMonthBtn").onclick=()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()-1,1);renderCalendar()};$("nextMonthBtn").onclick=()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()+1,1);renderCalendar()};
$("addBtn").onclick=()=>openItemDialog("manual");$("itemForm").onsubmit=saveItem;$("itemForm").kind.onchange=()=>renderModuleEditor();$("addModuleBtn").onclick=()=>$("moduleRows").insertAdjacentHTML("beforeend",moduleInput());
$("saveNotesBtn").onclick=saveNotes;$("promoteDialogNoteBtn").onclick=promoteDialogNote;$("focusNotesText").oninput=queueFocusSave;document.querySelectorAll("[data-focus-block]").forEach(b=>b.onclick=()=>insertFocusBlock(b.dataset.focusBlock));$("timerStartBtn").onclick=startTimer;$("timerPauseBtn").onclick=pauseTimer;$("timerResetBtn").onclick=resetTimer;$("closeFocusBtn").onclick=closeFocus;$("focusDoneBtn").onclick=completeFocus;
$("exportBtn").onclick=()=>ArcanaStorage.downloadFullBackup(state);
$("importInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await importFullBackupFile(f)}catch(err){alert(err.message||"Backup inválido")}e.target.value=""};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());

initApp();
