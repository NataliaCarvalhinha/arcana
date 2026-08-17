import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

for (const file of ["index.html", "app.js", "db.js", "manifest.webmanifest", "service-worker.js", ".github/workflows/pages.yml", ".github/workflows/sync-youtube.yml", ".github/workflows/register-youtube-playlist.yml", ".github/ISSUE_TEMPLATE/arcana-playlist.yml", "data/youtube/playlists.json", "data/youtube/catalog.json", "scripts/sync-youtube.py"]) {
  assert.ok(existsSync(file), `${file} exists`);
}

const index = readFileSync("index.html", "utf8");
assert.ok(index.indexOf("db.js") < index.indexOf("app.js"), "db.js loads before app.js");
assert.match(index, /rel="manifest"/, "manifest linked");

const manifest = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.equal(manifest.display, "standalone");

const app = readFileSync("app.js", "utf8");
const db = readFileSync("db.js", "utf8");
const pagesWorkflow = readFileSync(".github/workflows/pages.yml", "utf8");
const syncWorkflow = readFileSync(".github/workflows/sync-youtube.yml", "utf8");
const registerWorkflow = readFileSync(".github/workflows/register-youtube-playlist.yml", "utf8");
const issueTemplate = readFileSync(".github/ISSUE_TEMPLATE/arcana-playlist.yml", "utf8");
const youtubePlaylists = JSON.parse(readFileSync("data/youtube/playlists.json", "utf8"));
const youtubeCatalog = JSON.parse(readFileSync("data/youtube/catalog.json", "utf8"));
const youtubeSyncScript = readFileSync("scripts/sync-youtube.py", "utf8");
assert.match(app, /ArcanaStorage\.init/, "IndexedDB init is wired");
assert.match(db, /window\.ArcanaStorage=ArcanaStorage/, "IndexedDB storage is exposed to the app");
assert.doesNotMatch(app, /sincronização automática precisa do Arcana Local/, "Pages no longer blocks on the old local-only sync warning");
assert.match(app, /function publishedCatalogUrl/, "published catalog URL helper is present");
assert.match(app, /function publishedCatalogRequestUrl/, "published catalog request helper supports cache busting");
assert.match(app, /async function fetchPublishedCatalog/, "published catalog fetcher is present");
assert.match(app, /function applyPublishedCatalog/, "published catalog merge path is present");
assert.match(app, /function normalizeYoutubePlaylistInput/, "playlist input normalization is present");
assert.match(app, /function playlistStatusSummary/, "playlist status helper is present");
assert.match(app, /function catalogRequestPayload/, "catalog request payload helper is present");
assert.match(app, /function catalogRequestIssueUrl/, "catalog request issue URL helper is present");
assert.match(app, /function scheduleYoutubeCatalogPolling/, "catalog polling helper is present");
assert.match(app, /const DEFAULT_OBSIDIAN_STATE=/, "obsidian state defaults are declared");
assert.match(app, /async function refreshObsidianStatus/, "obsidian status refresh exists");
assert.match(app, /function queueObsidianAutoSync/, "obsidian autosync hook exists");
assert.match(app, /queueObsidianAutoSync\("after_session"\)/, "focus completion triggers obsidian autosync");
assert.match(app, /queueObsidianAutoSync\("after_note_save"\)/, "note saves can trigger obsidian autosync");
assert.match(app, /function exportPlaylistFile/, "playlist JSON export is available");
assert.match(index, /<form id="trackForm" class="modal" novalidate>/, "track form uses app validation");
assert.match(index, /name="sigil" maxlength="12"/, "track sigil accepts the requested label length");
assert.match(index, /id="trackFormError"/, "track form has a visible error region");
assert.match(index, /id="trackSaveBtn" type="submit"/, "track save button submits the tracked form");
assert.match(app, /async function saveTrack/, "track submit handler can await persistence");
assert.match(app, /await save\(false,"track"\)/, "track creation waits for IndexedDB save path");
assert.match(app, /setTrackSaving\(true\)/, "track save shows a saving state");
assert.match(app, /function ensureActiveTrack/, "active track is normalized before render");
assert.match(app, /state\.activeTrack=null/, "empty track state is represented explicitly");
assert.match(app, /Crie sua primeira trilha/, "track screen has a first-track empty state");
assert.match(app, /const STARTER_CONTENT_VERSION=2/, "starter content version is declared");
assert.match(app, /async function navigateTo/, "dashboard navigation is centralized");
assert.match(index, /onclick="navigateTo\('youtube'\)"/, "home YouTube button uses centralized navigation");
assert.match(index, /onclick="navigateTo\('tracks'\)"/, "home tracks button uses centralized navigation");
assert.match(index, /onclick="navigateTo\('review'\)"/, "home review button uses centralized navigation");
assert.match(index, /onclick="navigateTo\('notes'\)"/, "home notes button uses centralized navigation");
assert.match(app, /onkeydown="activateRow\(event,this\)"/, "clickable rows support keyboard activation");
assert.match(app, /event\.stopPropagation\(\);openNotes/, "nested note buttons do not trigger row navigation");
assert.match(app, /function repairStarterTrackDuplicates/, "starter duplicate track repair is available");
assert.match(app, /function applyStarterContentV1/, "starter content uses versioned migration functions");
assert.match(app, /const STARTER_CURRICULUM_VERSION=1/, "starter curriculum version is declared");
assert.match(app, /function applyStarterCurriculumV1/, "starter curriculum uses a versioned migration");
assert.match(app, /sourceTypeForResource/, "module and lesson source metadata is normalized");
assert.match(app, /openFocus\(\$\{jsArg\(lesson\.id\)\},'lesson'\)/, "lessons can open the focus modal");
assert.match(app, /playlist-learning-main/, "starter playlist is present in the catalog");
assert.match(app, /course-elec-01/, "starter electronics catalog is present");
assert.match(app, /course-fin-07/, "starter finance catalog is present");
assert.match(app, /state=applyStarterContent\(await ArcanaStorage\.init/, "starter content is applied during IndexedDB startup");
assert.match(index, /id="obsidianConnectBtn"/, "settings exposes the obsidian connect action");
assert.match(index, /id="obsidianSyncBtn"/, "settings exposes the obsidian sync action");
assert.match(index, /id="obsidianAutoSync"/, "settings exposes autosync selection");
assert.match(index, /id="requestCatalogBtn"/, "YouTube view exposes the catalog request action");
assert.match(index, /id="requestCatalogBtn" class="mini-btn" href="#" target="_blank" rel="noopener noreferrer"/, "catalog request action opens a safe new tab");
assert.match(index, /id="catalogOptionsBtn"/, "YouTube view exposes manual catalog fallback options");
assert.match(index, /id="youtubeCatalogStatus"/, "settings exposes the YouTube catalog summary");
assert.match(index, /id="youtubePlaylistDiagnostics"/, "settings exposes playlist diagnostics");
assert.match(index, /id="refreshCatalogBtn"/, "settings exposes a catalog refresh action");
assert.match(index, /<form id="playlistForm" class="modal" novalidate>/, "playlist form uses app validation");
assert.match(index, /name="enabled" type="checkbox"/, "playlist form exposes the enabled toggle");
assert.match(index, /id="playlistFormError"/, "playlist form has a visible error region");
assert.match(index, /id="playlistSaveBtn" type="submit"/, "playlist save button submits the playlist form");
assert.match(index, /id="catalogRequestDialog"/, "catalog request dialog is present");
assert.match(index, /id="copyCatalogRequestBtn"/, "catalog request dialog exposes copy action");
assert.doesNotMatch(app, /state\.dailyPlan\.date!==dayKey\(\)\|\|!state\.dailyPlan\.items\.length/, "empty daily plans do not recursively regenerate");
assert.doesNotMatch(app, /\$\("trackForm"\)\.id\.value|const f=e\.currentTarget,id=f\.id\.value/, "track flow does not read colliding form properties");
assert.match(db, /async function list\(name\)/, "storage exposes a store inspection helper");
assert.match(db, /tracks","courses","modules"/, "IndexedDB schema still contains domain stores");
assert.match(db, /arcana_managed: true/, "obsidian vault export marks managed notes");
assert.match(db, /Arcana Obsidian Vault/, "obsidian vault export uses the dedicated vault root");
assert.equal(youtubePlaylists.playlists[0].id, "PLNur2Ccbfc5k");
assert.equal(youtubePlaylists.playlists[0].enabled, true);
assert.equal(youtubeCatalog.version, 1);
assert.ok(Array.isArray(youtubeCatalog.playlists), "public catalog uses the expected root structure");
assert.match(syncWorkflow, /workflow_dispatch:/, "catalog workflow supports manual runs");
assert.match(syncWorkflow, /cron: "17 4 \* \* \*"/, "catalog workflow is scheduled");
assert.match(syncWorkflow, /contents: write/, "catalog workflow can push updates");
assert.match(syncWorkflow, /pages: write/, "catalog workflow can publish Pages artifacts directly");
assert.match(syncWorkflow, /id-token: write/, "catalog workflow can authenticate the Pages deployment");
assert.match(syncWorkflow, /python scripts\/sync-youtube\.py/, "catalog workflow executes the sync script");
assert.match(syncWorkflow, /actions\/upload-pages-artifact@v3/, "catalog workflow uploads a Pages artifact after syncing");
assert.match(syncWorkflow, /actions\/deploy-pages@v4/, "catalog workflow deploys Pages after syncing");
assert.match(pagesWorkflow, /paths-ignore:/, "generic Pages deploy ignores catalog-only automation commits");
assert.match(pagesWorkflow, /data\/youtube\/catalog\.json/, "generic Pages deploy ignores public catalog updates");
assert.match(pagesWorkflow, /data\/youtube\/playlists\.json/, "generic Pages deploy ignores playlist registration updates");
assert.match(registerWorkflow, /issues:/, "playlist registration workflow listens to issues");
assert.match(registerWorkflow, /arcana-playlist/, "playlist registration workflow filters the Arcana label");
assert.match(registerWorkflow, /NataliaCarvalhinha/, "playlist registration workflow restricts registration to the owner");
assert.match(registerWorkflow, /python scripts\/sync-youtube\.py/, "playlist registration workflow reuses the sync script directly");
assert.match(registerWorkflow, /actions\/deploy-pages@v4/, "playlist registration workflow deploys Pages in the same workflow");
assert.match(issueTemplate, /title: "\[Arcana Playlist\] "/, "issue template seeds the Arcana playlist title");
assert.match(issueTemplate, /id: playlist_name/, "issue template captures the playlist name");
assert.match(issueTemplate, /id: youtube_playlist_id/, "issue template captures the playlist id");
assert.match(issueTemplate, /id: canonical_url/, "issue template captures the canonical URL");
assert.match(issueTemplate, /arcana-playlist/, "issue template auto-applies the Arcana playlist label");
assert.match(youtubeSyncScript, /--flat-playlist/, "sync script fetches playlist metadata without downloads");
assert.match(youtubeSyncScript, /returned zero videos; keeping previous catalog/, "sync script avoids overwriting the catalog with empty results");

const worker = readFileSync("service-worker.js", "utf8");
assert.match(worker, /caches\.open/, "service worker caches app shell");
assert.match(worker, /arcana-shell-v8/, "service worker cache version invalidates old app shell");
assert.match(worker, /YOUTUBE_CATALOG_RE/, "service worker special-cases the public YouTube catalog");
assert.match(worker, /function catalogCacheRequest/, "service worker normalizes catalog cache keys");
assert.match(worker, /cache\.put\(catalogCacheRequest\(url\),copy\)/, "service worker stores the catalog without cache-busting query params");
assert.match(worker, /caches\.match\(catalogCacheRequest\(url\)\)/, "service worker falls back to the normalized cached catalog offline");
assert.ok(!/youtube\.com|youtu\.be/.test(worker), "service worker does not cache YouTube");

function makeElement(id) {
  return {
    id,
    innerHTML: "",
    textContent: "",
    value: "",
    disabled: false,
    checked: false,
    className: "",
    dataset: {},
    style: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; }
    },
    focus() { this.focused = true; },
    select() { this.selected = true; },
    showModal() { this.open = true; },
    close() { this.closed = true; this.open = false; },
    reset() {
      for (const field of Object.values(this.elements || {})) {
        if ("value" in field) {
          field.value = "";
        }
        if ("checked" in field) {
          field.checked = false;
        }
      }
    }
  };
}

const elements = new Map();
const ids = ["pageTitle", "homeView", "tracksView", "youtubeView", "libraryView", "fichamentosView", "notesView", "reviewView", "calendarView", "inboxView", "settingsView", "trackForm", "trackDialog", "trackDialogTitle", "trackFormError", "trackSaveBtn", "deleteTrackBtn", "trackTabs", "trackHero", "trackCourses", "trackProfile", "homeTracks", "homeKnowledge", "homeReviews", "homePriority", "homeYoutube", "dailyPlan", "todayMinutes", "itemForm", "itemDialog", "moduleEditor", "moduleRows", "playlistForm", "playlistDialog", "playlistDialogTitle", "playlistFormError", "playlistSaveBtn", "deletePlaylistBtn", "playlistTabs", "activePlaylistName", "playlistSyncStatus", "syncPlaylistBtn", "requestCatalogBtn", "catalogOptionsBtn", "activePlaylistPanel", "youtubeBudget", "dailyVideos", "youtubeQueue", "youtubeSettingsForm", "environmentStatus", "youtubeCatalogStatus", "youtubePlaylistDiagnostics", "refreshCatalogBtn", "backupStatus", "obsidianEnvironmentStatus", "obsidianVaultStatus", "obsidianStats", "obsidianAutoSync", "obsidianAutoSyncNote", "obsidianConnectBtn", "obsidianSyncBtn", "obsidianPullBtn", "obsidianPushBtn", "obsidianDisconnectBtn", "obsidianOpenBtn", "snapshotList", "catalogRequestDialog", "catalogRequestTitle", "catalogRequestHelp", "catalogRequestJson", "catalogRequestStatus", "copyCatalogRequestBtn", "vaultList", "vaultEditorPane", "fichamentoList", "fichamentoEditor", "reviewQueue", "reviewActive"];
for (const id of ids) {
  elements.set(id, makeElement(id));
}
elements.get("trackForm").elements = {
  id: makeElement("trackId"),
  name: makeElement("trackName"),
  sigil: makeElement("trackSigil"),
  subtitle: makeElement("trackSubtitle"),
  description: makeElement("trackDescription"),
  weeklyGoal: makeElement("trackWeeklyGoal")
};
elements.get("itemForm").elements = {
  id: makeElement("itemId"),
  track: makeElement("itemTrack"),
  kind: makeElement("itemKind"),
  title: makeElement("itemTitle"),
  url: makeElement("itemUrl"),
  source: makeElement("itemSource"),
  important: makeElement("itemImportant"),
  urgent: makeElement("itemUrgent"),
  estimatedMinutes: makeElement("itemEstimatedMinutes"),
  progress: makeElement("itemProgress"),
  notes: makeElement("itemNotes")
};
elements.get("playlistForm").elements = {
  id: makeElement("playlistId"),
  name: makeElement("playlistName"),
  url: makeElement("playlistUrl"),
  enabled: makeElement("playlistEnabled")
};
elements.get("youtubeSettingsForm").mode = makeElement("youtubeMode");
elements.get("youtubeSettingsForm").minutes = makeElement("youtubeMinutes");
elements.get("youtubeSettingsForm").count = makeElement("youtubeCount");
elements.get("youtubeSettingsForm").hideAfterLimit = makeElement("youtubeHideAfterLimit");

const savedStates = [];
const context = {
  console,
  structuredClone,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  URL,
  location: { hostname: "", origin: "https://example.test", href: "https://example.test/arcana/index.html", pathname: "/arcana/index.html" },
  navigator: {},
  localStorage: { getItem() { return null; }, setItem() {} },
  alert(message) { throw new Error(`Unexpected alert: ${message}`); },
  confirm() { return true; },
  prompt() { return ""; },
  fetch() { throw new Error("Unexpected fetch in static tests"); },
  crypto: { randomUUID: () => `uuid-${savedStates.length}-${Math.random().toString(16).slice(2)}` },
  document: {
    baseURI: "https://example.test/arcana/index.html",
    hidden: false,
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, makeElement(id));
      }
      return elements.get(id);
    },
    querySelectorAll(selector) {
      if (selector === "#moduleRows .module-input-row" || selector === ".nav-btn" || selector === ".view") {
        return [];
      }
      return [];
    },
    querySelector() { return null; },
    createElement: makeElement,
    addEventListener() {}
  }
};
context.window = context;
context.__notes = [];
context.ArcanaStorage = {
  ready: true,
  canHandle(path) {
    return path.startsWith("/api/notes");
  },
  async saveState(value) {
    savedStates.push(structuredClone(value));
  },
  async loadState(defaultState) {
    return structuredClone(savedStates.at(-1) || defaultState);
  },
  async list(name) {
    if (name === "appState") {
      return savedStates.length ? [{ key: "main", value: structuredClone(savedStates.at(-1)) }] : [];
    }
    return [];
  },
  async route(path) {
    if (path === "/api/notes?sort=updated") {
      return { notes: structuredClone(context.__notes) };
    }
    const match = path.match(/^\/api\/notes\/([^/]+)$/);
    if (match) {
      const note = context.__notes.find(n => n.id === decodeURIComponent(match[1]));
      if (!note) {
        throw new Error("not found");
      }
      return { note: structuredClone(note) };
    }
    throw new Error(`Unexpected route: ${path}`);
  }
};

vm.createContext(context);
vm.runInContext(app.slice(0, app.indexOf("async function initApp")), context, { filename: "app.js" });

await vm.runInContext(`(async()=>{
  scheduleAutoBackup=()=>{};
  renderAll=()=>{renderDailyPlan();renderHomeTracks();renderTracks();};
  const seededFresh=applyStarterContent(structuredClone(DEFAULT_STATE));
  if(seededFresh.starterContentVersion!==2){throw new Error("starter content version was not stored")}
  if(seededFresh.starterCurriculumVersion!==1){throw new Error("starter curriculum version was not stored")}
  if(seededFresh.tracks.length!==2){throw new Error("fresh seed should replace placeholders with exactly two starter tracks")}
  if(seededFresh.tracks.map(t=>t.id).join(",")!=="track-electronics,track-finance"){throw new Error("starter tracks did not keep the expected order")}
  if(seededFresh.items.filter(i=>i.kind==="course").length!==17){throw new Error("fresh seed should create exactly 17 starter courses")}
  if(seededFresh.items.filter(i=>i.kind==="course"&&i.starterManaged).length!==17){throw new Error("all starter courses should carry official curriculum metadata")}
  if(seededFresh.items.filter(i=>i.kind==="course").some(i=>!Array.isArray(i.modules)||!i.modules.length)){throw new Error("all starter courses should include module structures")}
  const seededModuleCount=seededFresh.items.filter(i=>i.kind==="course").reduce((sum,course)=>sum+course.modules.length,0);
  if(seededModuleCount<96){throw new Error("starter curricula should include the expected module coverage")}
  const familyPlanning=seededFresh.items.find(i=>i.id==="course-fin-01");
  if(familyPlanning.modules.length!==9||familyPlanning.modules[0].title!=="Understanding Personal Finance"){throw new Error("family planning curriculum should use official module titles")}
  const portfolioRisk=seededFresh.items.find(i=>i.id==="course-fin-05");
  if(portfolioRisk.modules.map(m=>m.title).join("|")!=="General Introduction and Key Concepts|Modern Portfolio Theory and Beyond|Asset Allocation|Risk Management"){throw new Error("portfolio risk curriculum should use official module titles")}
  const financeFundamentals=seededFresh.items.find(i=>i.id==="course-fin-07");
  if(financeFundamentals.modules.length!==5||financeFundamentals.modules.at(-1).title!=="Module 5"){throw new Error("finance fundamentals curriculum should preserve the official module labels")}
  const fpgaSpecialization=seededFresh.items.find(i=>i.id==="course-elec-04");
  if(fpgaSpecialization.programType!=="specialization"||fpgaSpecialization.childCourseIds.join(",")!=="course-elec-02,course-elec-03"){throw new Error("FPGA specialization should reference its starter child courses")}
  if(!fpgaSpecialization.childCourses.some(child=>child.title.includes("Softcore"))||!fpgaSpecialization.childCourses.some(child=>child.title.includes("Capstone"))){throw new Error("FPGA specialization should include non-duplicated child course references")}
  if(!seededFresh.items.find(i=>i.id==="course-fin-05").modules.some(m=>m.id==="module-fin-05-01")){throw new Error("official modules should use stable ids")}
  if(!seededFresh.items.find(i=>i.id==="course-elec-08").modules[0].lessons.some(l=>l.id==="lesson-elec-08-01-01")){throw new Error("official lessons should use stable ids")}
  if(seededFresh.playlists.length!==1||seededFresh.playlists[0].id!=="playlist-learning-main"){throw new Error("fresh seed should replace the placeholder playlist")}
  if(seededFresh.activeTrack!=="track-electronics"){throw new Error("fresh seed should activate electronics first")}
  if(seededFresh.activePlaylist!=="playlist-learning-main"){throw new Error("fresh seed should activate the learning playlist")}

  const seededTwice=structuredClone(seededFresh);
  seededTwice.starterContentVersion=0;
  seededTwice.starterCurriculumVersion=0;
  const rerunSeed=applyStarterContent(seededTwice);
  if(rerunSeed.tracks.filter(t=>t.id==="track-electronics").length!==1||rerunSeed.tracks.filter(t=>t.id==="track-finance").length!==1){throw new Error("rerunning the seed duplicated starter tracks")}
  if(rerunSeed.items.filter(i=>i.id.startsWith("course-elec-")).length!==10||rerunSeed.items.filter(i=>i.id.startsWith("course-fin-")).length!==7){throw new Error("rerunning the seed duplicated starter courses")}
  if(rerunSeed.playlists.filter(p=>p.id==="playlist-learning-main").length!==1){throw new Error("rerunning the seed duplicated the starter playlist")}

  const existingProfile=normalize({...structuredClone(DEFAULT_STATE),tracks:[{id:"frances",name:"Francês",sigil:"F",subtitle:"Idioma",description:"Curso pessoal",weeklyGoal:90}],activeTrack:"frances",items:[],playlists:[{id:"playlist-custom",name:"Outra playlist",url:"https://www.youtube.com/playlist?list=PLcustom123",youtubePlaylistId:"PLcustom123",lastSyncAt:null,lastSyncError:null}],activePlaylist:"playlist-custom",youtubeQueue:[],weeklyProgress:{frances:12},starterContentVersion:0});
  const mergedProfile=applyStarterContent(existingProfile);
  if(mergedProfile.tracks.map(t=>t.id).join(",")!=="frances,track-electronics,track-finance"){throw new Error("starter tracks should append after existing custom tracks")}
  if(mergedProfile.activeTrack!=="frances"){throw new Error("existing active track should be preserved")}
  if(mergedProfile.activePlaylist!=="playlist-custom"){throw new Error("existing active playlist should be preserved")}

  const preservedState=applyStarterContent(structuredClone(DEFAULT_STATE));
  const preservedCourse=preservedState.items.find(i=>i.id==="course-elec-01");
  preservedCourse.progress=35;
  preservedCourse.status="em_andamento";
  preservedCourse.modules=[{id:"module-elec-01-01",title:"Rascunho antigo",minutes:30,progress:35,status:"em_andamento",notes:"Notas do módulo",completedAt:"2026-08-02T00:00:00.000Z",sessions:[{id:"session-module"}],fichamentos:["fic-1"]},{id:"custom-module-preserved",title:"Módulo pessoal",minutes:30,done:true,custom:true}];
  preservedCourse.notes="Notas preservadas";
  preservedCourse.important=false;
  preservedCourse.urgent=true;
  preservedCourse.createdAt="2026-08-01T00:00:00.000Z";
  preservedState.youtubeSettings.minutes=20;
  preservedState.playlists.unshift({id:"playlist-alt",name:"Outra playlist",url:"https://www.youtube.com/playlist?list=PLalt12345",youtubePlaylistId:"PLalt12345",lastSyncAt:null,lastSyncError:null});
  preservedState.activePlaylist="playlist-alt";
  preservedState.starterContentVersion=0;
  preservedState.starterCurriculumVersion=0;
  const preservedRerun=applyStarterContent(preservedState);
  const rerunCourse=preservedRerun.items.find(i=>i.id==="course-elec-01");
  if(rerunCourse.progress!==35||rerunCourse.status!=="em_andamento"){throw new Error("starter rerun should preserve course progress and status")}
  if(rerunCourse.modules.length!==6){throw new Error("starter rerun should merge official modules without deleting user modules")}
  const rerunOfficialModule=rerunCourse.modules.find(m=>m.id==="module-elec-01-01");
  if(rerunOfficialModule.title!=="MCU Background and Analysis"||rerunOfficialModule.progress!==35||rerunOfficialModule.notes!=="Notas do módulo"||rerunOfficialModule.completedAt!=="2026-08-02T00:00:00.000Z"||rerunOfficialModule.sessions.length!==1||rerunOfficialModule.fichamentos.length!==1){throw new Error("starter rerun should update official module text while preserving module progress, notes, sessions, and fichamentos")}
  if(!rerunCourse.modules.some(m=>m.id==="custom-module-preserved"&&m.title==="Módulo pessoal")){throw new Error("starter rerun should preserve user-created modules")}
  if(rerunCourse.notes!=="Notas preservadas"||rerunCourse.important!==false||rerunCourse.urgent!==true){throw new Error("starter rerun should preserve user course fields")}
  if(rerunCourse.createdAt!=="2026-08-01T00:00:00.000Z"){throw new Error("starter rerun should preserve createdAt")}
  if(preservedRerun.youtubeSettings.minutes!==20){throw new Error("starter rerun should preserve YouTube settings")}
  if(preservedRerun.activePlaylist!=="playlist-alt"){throw new Error("starter rerun should not override the selected playlist")}

  state=structuredClone(seededFresh);
  renderAll();
  generatePlan();
  if(!$("homeTracks").innerHTML.includes("Eletrônica")||!$("homeTracks").innerHTML.includes("Finanças")){throw new Error("seeded tracks did not render in the Sanctuary")}
  if(!$("trackTabs").innerHTML.includes("Eletrônica")||!$("trackCourses").innerHTML.includes("Microcontrollers: Basic Architecture and Design")){throw new Error("seeded track catalog did not render")}
  if(!state.dailyPlan.items.length||$("dailyPlan").innerHTML.includes("Nada pendente")){throw new Error("seeded courses did not generate a daily plan")}
  if(!state.dailyPlan.items.some(p=>p.type==="module"||p.type==="lesson")){throw new Error("daily plan should target the next unfinished module or lesson")}
  state=structuredClone(seededFresh);
  state.activeTrack="track-electronics";
  expandedCourseId="course-elec-08";
  renderTracks();
  if(!$("trackCourses").innerHTML.includes("module-elec-08-01")||!$("trackCourses").innerHTML.includes("lesson-elec-08-01-01")){throw new Error("expanded courses should render module and lesson ids for navigation")}
  if(resourceByScope("module-elec-08-01","module").sourceType!=="module"){throw new Error("module resources should be addressable by scope")}
  if(resourceByScope("lesson-elec-08-01-01","lesson").sourceType!=="lesson"){throw new Error("lesson resources should be addressable by scope")}
  const elec08=state.items.find(i=>i.id==="course-elec-08");
  elec08.modules[0].lessons[0].progress=100;
  elec08.modules[0].lessons[0].done=true;
  if(moduleProgress(elec08.modules[0])!==20||itemProgress(elec08)<=0){throw new Error("course progress should derive from lesson and module progress")}
  const elec02=state.items.find(i=>i.id==="course-elec-02");
  const elec03=state.items.find(i=>i.id==="course-elec-03");
  elec02.modules.forEach(module=>{module.progress=100;module.done=true;module.status="concluido"});
  elec03.modules.forEach(module=>{module.progress=0;module.done=false;module.status="nao_iniciado"});
  const specProgress=itemProgress(state.items.find(i=>i.id==="course-elec-04"));
  if(specProgress<=0||specProgress>=100){throw new Error("specialization progress should derive from child course references")}
  await ArcanaStorage.saveState(state);
  const storedSeed=await ArcanaStorage.loadState(DEFAULT_STATE);
  if(storedSeed.starterContentVersion!==2||storedSeed.starterCurriculumVersion!==1||storedSeed.items.filter(i=>i.kind==="course").length!==17){throw new Error("seeded starter content did not persist through the canonical storage path")}

  if(!$("homeTracks").innerHTML.includes("navigateTo('tracks',{trackId:'track-finance'})")){throw new Error("home track rows should navigate with stable track ids")}
  await navigateTo("tracks",{trackId:"track-finance"});
  if(currentView!=="tracks"||state.activeTrack!=="track-finance"){throw new Error("track row navigation did not select and open the requested track")}
  state.youtubeQueue.push({id:"queue-nav-1",videoId:"nav-1",playlistId:"playlist-learning-main",youtubePlaylistId:"PLNur2Ccbfc5k",kind:"youtube",title:"Video de teste",url:"https://www.youtube.com/watch?v=nav-1",channel:"Canal",thumbnail:"",estimatedMinutes:10,progress:0,status:"nao_iniciado",notes:"",important:true,urgent:false,track:null,createdAt:new Date().toISOString(),position:0,catalogManaged:false,activeInCatalog:true,archivedAt:null});
  await navigateTo("youtube",{playlistId:"playlist-learning-main"});
  if(currentView!=="youtube"||state.activePlaylist!=="playlist-learning-main"){throw new Error("YouTube navigation did not select the requested playlist")}
  if(!$("youtubeQueue").innerHTML.includes("clickable-row")||!$("youtubeQueue").innerHTML.includes("event.stopPropagation();openNotes")){throw new Error("YouTube rows should be clickable while nested actions stay isolated")}

  const duplicateState=applyStarterContent(normalize({
    ...structuredClone(DEFAULT_STATE),
    tracks:[
      {id:"track-electronics",name:"Eletrônica",sigil:"E",subtitle:"A",description:"A",weeklyGoal:120},
      {id:"dupe-elec",name:"Eletronica",sigil:"E2",subtitle:"B",description:"B",weeklyGoal:180},
      {id:"track-finance",name:"Finanças",sigil:"F",subtitle:"A",description:"A",weeklyGoal:90},
      {id:"dupe-fin",name:"Financas",sigil:"F2",subtitle:"B",description:"B",weeklyGoal:150}
    ],
    items:[{id:"custom-course",kind:"course",track:"dupe-elec",title:"Curso custom",progress:25,estimatedMinutes:30,status:"em_andamento",createdAt:"2026-08-17T00:00:00.000Z"}],
    sessions:[{id:"session-custom",date:dayKey(),timestamp:"2026-08-17T10:00:00.000Z",minutes:20,title:"Sessão",type:"item",track:"dupe-fin"}],
    dailyPlan:{date:dayKey(),minutes:60,items:[{type:"item",id:"custom-course",minutes:20,title:"Curso custom",track:"dupe-elec"}]},
    weeklyProgress:{"track-electronics":10,"dupe-elec":15,"track-finance":5,"dupe-fin":7},
    activeTrack:"dupe-fin",
    starterContentVersion:1
  }));
  if(duplicateState.tracks.filter(t=>t.id==="track-electronics").length!==1||duplicateState.tracks.filter(t=>t.id==="track-finance").length!==1){throw new Error("starter duplicate repair should keep one stable track per starter identity")}
  if(duplicateState.tracks.some(t=>t.id==="dupe-elec"||t.id==="dupe-fin")){throw new Error("starter duplicate repair should remove duplicate starter tracks")}
  if(duplicateState.items.find(i=>i.id==="custom-course").track!=="track-electronics"){throw new Error("starter duplicate repair should repoint items to stable track ids")}
  if(duplicateState.sessions.find(s=>s.id==="session-custom").track!=="track-finance"){throw new Error("starter duplicate repair should repoint sessions to stable track ids")}
  if(duplicateState.dailyPlan.items[0].track!=="track-electronics"){throw new Error("starter duplicate repair should repoint daily plan entries")}
  if(duplicateState.weeklyProgress["track-electronics"]!==25||duplicateState.weeklyProgress["track-finance"]!==12){throw new Error("starter duplicate repair should merge weekly progress")}
  if(duplicateState.activeTrack!=="track-finance"){throw new Error("starter duplicate repair should preserve active track through the stable id")}

  globalThis.__notes=[
    {id:"note-perm",title:"Ideia permanente",type:"permanent",trackId:"track-finance",updatedAt:"2026-08-17T10:00:00.000Z",createdAt:"2026-08-17T09:00:00.000Z",links:[{title:"Fonte"}],status:"active",content:"# Ideia permanente"},
    {id:"fic-1",title:"Livro de mercados",type:"literature",sourceType:"book",trackId:"track-finance",updatedAt:"2026-08-17T09:00:00.000Z",createdAt:"2026-08-17T08:00:00.000Z",links:[{},{title:"Outra"}],status:"active",content:"# Livro de mercados"},
    {id:"review-1",title:"Revisar pergunta",type:"question",trackId:"track-electronics",updatedAt:"2026-08-17T08:00:00.000Z",createdAt:"2026-08-17T07:00:00.000Z",reviewAt:dayKey(),status:"active",content:"# Revisar pergunta"}
  ];
  vaultNotes=structuredClone(globalThis.__notes);
  renderVaultHome();
  if(!$("homeKnowledge").innerHTML.includes("navigateTo('notes',{noteId:'note-perm'})")){throw new Error("recent permanent notes should navigate to the notes view by stable id")}
  if(!$("homeKnowledge").innerHTML.includes("navigateTo('fichamentos',{fichamentoId:'fic-1'})")){throw new Error("recent fichamentos should navigate to the fichamentos view by stable id")}
  if(!$("homeKnowledge").innerHTML.includes("Finanças")||!$("homeKnowledge").innerHTML.includes("2 links")){throw new Error("recent notes should render type, track, updated time, and links metadata")}
  if(!$("homeReviews").innerHTML.includes("navigateTo('review',{noteId:'review-1'})")){throw new Error("home review rows should navigate to review by stable id")}
  await navigateTo("notes",{noteId:"note-perm"});
  if(currentView!=="notes"||activeVaultNote?.id!=="note-perm"||!$("vaultEditorPane").innerHTML.includes("Ideia permanente")){throw new Error("recent note navigation did not open the exact note: view="+currentView+", active="+(activeVaultNote?.id||"none")+", editor="+$("vaultEditorPane").innerHTML.slice(0,80))}
  await navigateTo("fichamentos",{fichamentoId:"fic-1"});
  if(currentView!=="fichamentos"||activeVaultNote?.id!=="fic-1"||!$("fichamentoEditor").innerHTML.includes("Livro de mercados")){throw new Error("recent fichamento navigation did not open the exact fichamento")}
  await navigateTo("review",{noteId:"review-1"});
  if(currentView!=="review"||currentReviewNote?.id!=="review-1"||!$("reviewActive").innerHTML.includes("Revisar pergunta")){throw new Error("review navigation did not open the exact due note")}

  const catalogSample=normalizePublishedCatalog({
    version:1,
    generatedAt:"2026-08-17T04:17:00Z",
    playlists:[
      {
        id:"PL12345678",
        name:"Catalogada",
        url:"https://www.youtube.com/playlist?list=PL12345678&si=ruido",
        videos:[
          {id:"vid-b",title:"Video B",url:"https://www.youtube.com/watch?v=vid-b",channel:"Canal B",duration:900,position:1,thumbnail:"thumb-b"},
          {id:"vid-a",title:"Video A",url:"https://www.youtube.com/watch?v=vid-a",channel:"Canal A",duration:0,position:2,thumbnail:"thumb-a"}
        ]
      }
    ]
  });
  if(catalogSample.playlists[0].videos[0].id!=="vid-b"){throw new Error("published catalog normalization should preserve playlist order")}
  if(catalogSample.playlists[0].url!=="https://www.youtube.com/playlist?list=PL12345678"){throw new Error("published catalog normalization should canonicalize playlist URLs")}
  if(publishedCatalogUrl()!=="https://example.test/arcana/data/youtube/catalog.json"){throw new Error("published catalog URL should respect the GitHub Pages base path")}
  if(!publishedCatalogRequestUrl(true).startsWith("https://example.test/arcana/data/youtube/catalog.json?_arcana=")){throw new Error("forced catalog requests should bypass stale caches")}
  const normalizedPlaylistInput=normalizeYoutubePlaylistInput("youtube.com/playlist?list=PL12345678&si=ruido");
  if(normalizedPlaylistInput.youtubePlaylistId!=="PL12345678"||normalizedPlaylistInput.url!=="https://www.youtube.com/playlist?list=PL12345678"){throw new Error("playlist input normalization should keep only the stable list id")}
  const normalizedPlaylistAlt=normalizeYoutubePlaylistInput("https://m.youtube.com/playlist?utm_source=test&list=PL12345678");
  if(normalizedPlaylistAlt.youtubePlaylistId!=="PL12345678"||normalizedPlaylistAlt.url!=="https://www.youtube.com/playlist?list=PL12345678"){throw new Error("playlist input normalization should canonicalize alternate YouTube hosts and extra params")}
  if(youtubePlaylistIdFromUrl("PL12345678&si=ruido")!=="PL12345678"){throw new Error("playlist id normalization should repair polluted stored ids")}

  state=normalize({
    ...structuredClone(DEFAULT_STATE),
    playlists:[{id:"playlist-local",name:"Catalogada",url:"https://www.youtube.com/playlist?list=PL12345678",youtubePlaylistId:"PL12345678",lastSyncAt:null,lastSyncError:null}],
    activePlaylist:"playlist-local",
    youtubeQueue:[
      {id:"queue-a",videoId:"vid-a",playlistId:"playlist-local",youtubePlaylistId:"PL12345678",kind:"youtube",title:"Video A antigo",url:"https://www.youtube.com/watch?v=vid-a",channel:"Canal A",thumbnail:"old-thumb",estimatedMinutes:12,progress:40,status:"em_andamento",notes:"preservar",important:true,urgent:false,favorite:true,track:null,createdAt:"2026-08-16T00:00:00.000Z",position:0,catalogManaged:true,activeInCatalog:true,archivedAt:null},
      {id:"queue-removed",videoId:"vid-removed",playlistId:"playlist-local",youtubePlaylistId:"PL12345678",kind:"youtube",title:"Video removido",url:"https://www.youtube.com/watch?v=vid-removed",channel:"Canal X",thumbnail:"thumb-x",estimatedMinutes:15,progress:100,status:"concluido",notes:"histórico",important:true,urgent:false,track:null,createdAt:"2026-08-15T00:00:00.000Z",position:1,catalogManaged:true,activeInCatalog:true,archivedAt:null},
      {id:"queue-manual",videoId:"vid-manual",playlistId:"playlist-local",youtubePlaylistId:"PL12345678",kind:"youtube",title:"Manual",url:"https://www.youtube.com/watch?v=vid-manual",channel:"YouTube",thumbnail:"",estimatedMinutes:8,progress:0,status:"nao_iniciado",notes:"manual",important:true,urgent:false,track:null,createdAt:"2026-08-14T00:00:00.000Z",position:2,catalogManaged:false,activeInCatalog:true,archivedAt:null}
    ],
    youtubeDaily:{},
    youtubeSettings:{mode:"either",minutes:45,count:3,hideAfterLimit:true}
  });
  const localPlaylist=activePlaylist();
  mergePlaylistData(catalogPlaylistToSyncData(catalogSample.playlists[0],catalogSample),localPlaylist);
  const mergedA=state.youtubeQueue.find(v=>v.videoId==="vid-a");
  const mergedRemoved=state.youtubeQueue.find(v=>v.videoId==="vid-removed");
  const mergedManual=state.youtubeQueue.find(v=>v.videoId==="vid-manual");
  if(mergedA.progress!==40||mergedA.notes!=="preservar"){throw new Error("playlist merge should preserve progress and notes by stable video id")}
  if(mergedA.estimatedMinutes!==12){throw new Error("playlist merge should preserve a known duration when the catalog duration is missing")}
  if(mergedA.favorite!==true){throw new Error("playlist merge should preserve local-only metadata while public fields refresh")}
  if(mergedRemoved.activeInCatalog!==false||!mergedRemoved.archivedAt){throw new Error("videos removed from the remote playlist should stay locally archived")}
  if(mergedManual.activeInCatalog!==true||mergedManual.catalogManaged!==false){throw new Error("manual videos should stay visible after catalog sync")}
  if(localPlaylist.catalogGeneratedAt!=="2026-08-17T04:17:00Z"){throw new Error("catalog timestamp should be stored on the playlist")}
  const mergedQueue=playlistQueue().map(v=>v.videoId).join(",");
  if(mergedQueue!=="vid-b,vid-a,vid-manual"){throw new Error("playlist queue should respect catalog order and keep manual additions after synced videos")}
  const todays=todaysYoutube().map(v=>v.videoId).join(",");
  if(todays!=="vid-b,vid-a,vid-manual"){throw new Error("daily YouTube selection should still respect count and duration limits")}

  state=normalize({
    ...structuredClone(DEFAULT_STATE),
    playlists:[{id:"playlist-local",name:"Primeira",url:"https://www.youtube.com/playlist?list=PL11111111",youtubePlaylistId:"PL11111111",lastSyncAt:null,lastSyncError:null}],
    activePlaylist:"playlist-local",
    youtubeQueue:[]
  });
  const multiCatalog=normalizePublishedCatalog({
    version:1,
    generatedAt:"2026-08-17T05:00:00Z",
    playlists:[
      {id:"PL11111111",name:"Primeira",url:"https://www.youtube.com/playlist?list=PL11111111",videos:[{id:"v1",title:"V1",url:"https://www.youtube.com/watch?v=v1",channel:"C1",duration:600,position:1,thumbnail:"t1"}]},
      {id:"PL22222222",name:"Segunda",url:"https://www.youtube.com/playlist?list=PL22222222",videos:[{id:"v2",title:"V2",url:"https://www.youtube.com/watch?v=v2",channel:"C2",duration:300,position:1,thumbnail:"t2"}]}
    ]
  });
  if(applyPublishedCatalog(multiCatalog)!==2){throw new Error("published catalog application should merge every published playlist")}
  if(state.playlists.length!==2||!state.playlists.some(p=>playlistCatalogId(p)==="PL22222222")){throw new Error("published catalog sync should create local playlist records for new remote playlists")}
  if(state.youtubeQueue.filter(v=>v.activeInCatalog!==false).map(v=>v.videoId).sort().join(",")!=="v1,v2"){throw new Error("published catalog sync should merge videos from multiple playlists")}

  state=normalize({
    ...structuredClone(DEFAULT_STATE),
    playlists:[{id:"playlist-repaired",name:"Reparada",url:"https://youtube.com/playlist?list=PLY2z-v4ZkvrY&si=jkRVSlrBKu2p0zSm",youtubePlaylistId:"PLY2z-v4ZkvrY&si=jkRVSlrBKu2p0zSm",progress:25,notes:"preservar",settings:{mode:"foco"},createdAt:"2026-08-16T10:00:00.000Z",updatedAt:"2026-08-16T11:00:00.000Z",lastSyncAt:null,lastSyncError:null}],
    activePlaylist:"playlist-repaired",
    youtubeQueue:[{id:"queue-repaired",videoId:"vid-r",playlistId:"playlist-repaired",youtubePlaylistId:"PLY2z-v4ZkvrY&si=jkRVSlrBKu2p0zSm",kind:"youtube",title:"Video R",url:"https://www.youtube.com/watch?v=vid-r",channel:"Canal R",thumbnail:"thumb-r",estimatedMinutes:9,progress:15,status:"em_andamento",notes:"ok",important:true,urgent:false,track:null,createdAt:"2026-08-16T12:00:00.000Z",position:0,catalogManaged:true,activeInCatalog:true,archivedAt:null}],
    youtubeDaily:{today:["vid-r"]}
  });
  const repairedPlaylist=activePlaylist();
  if(repairedPlaylist.youtubePlaylistId!=="PLY2z-v4ZkvrY"||repairedPlaylist.url!=="https://www.youtube.com/playlist?list=PLY2z-v4ZkvrY"){throw new Error("startup normalization should repair polluted playlist ids and URLs")}
  if(repairedPlaylist.createdAt!=="2026-08-16T10:00:00.000Z"||repairedPlaylist.updatedAt!=="2026-08-16T11:00:00.000Z"){throw new Error("startup normalization should preserve playlist timestamps")}
  if(state.youtubeQueue[0].youtubePlaylistId!=="PLY2z-v4ZkvrY"){throw new Error("startup normalization should also repair playlist ids stored on queue items")}
  if(state.youtubeDaily.today[0]!=="vid-r"){throw new Error("startup normalization should preserve daily state")}

  location.hostname="pages.example";
  youtubeCatalogMeta.version=1;
  youtubeCatalogMeta.generatedAt="2026-08-17T05:00:00Z";
  youtubeCatalogMeta.lastLoadedAt="2026-08-17T05:05:00Z";
  youtubeCatalogMeta.playlistIds=["PL11111111","PL22222222"];
  youtubeCatalogMeta.playlistCount=2;
  youtubeCatalogMeta.videoCount=2;
  youtubeCatalogMeta.error=null;
  state=normalize({...structuredClone(DEFAULT_STATE),playlists:[{id:"playlist-awaiting",name:"Nova playlist",url:"https://www.youtube.com/playlist?list=PL99999999",youtubePlaylistId:"PL99999999",lastSyncAt:null,lastSyncError:null}],activePlaylist:"playlist-awaiting",youtubeQueue:[]});
  if(applyPublishedCatalog(multiCatalog,{targetPlaylist:activePlaylist()})!==0){throw new Error("targeted catalog sync should return zero when a playlist is still missing from the published catalog")}
  const awaitingStatus=playlistStatusSummary(activePlaylist());
  if(awaitingStatus.tone!=="pending"||awaitingStatus.label!=="Aguardando catálogo"){throw new Error("missing published playlists should surface the awaiting catalog status")}
  const requestPayload=catalogRequestPayload(activePlaylist());
  if(!requestPayload.includes('"id": "PL99999999"')||!requestPayload.includes('"url": "https://www.youtube.com/playlist?list=PL99999999"')){throw new Error("catalog request payload should be copy-ready with the canonical playlist URL")}
  renderYoutube();
  const issueUrl=new URL("https://github.com/NataliaCarvalhinha/arcana/issues/new");
  issueUrl.searchParams.set("template","arcana-playlist.yml");
  issueUrl.searchParams.set("title","[Arcana Playlist] Nova playlist");
  issueUrl.searchParams.set("playlist_name","Nova playlist");
  issueUrl.searchParams.set("youtube_playlist_id","PL99999999");
  issueUrl.searchParams.set("canonical_url","https://www.youtube.com/playlist?list=PL99999999");
  if($("requestCatalogBtn").href!==issueUrl.toString()){throw new Error("awaiting playlists should expose a prefilled GitHub issue URL")}
  if($("requestCatalogBtn").style.display!=="inline-flex"){throw new Error("awaiting playlists should show the synchronization request action")}
  if($("syncPlaylistBtn").textContent!=="↻ Verificar novamente"){throw new Error("awaiting playlists should offer a verify-again action")}
  if($("playlistTabs").innerHTML.includes("Aguardando catálogo</span><span>Aguardando catálogo")){throw new Error("playlist tabs should not duplicate the status label beside the badge")}
  location.hostname="";

  state=normalize({...structuredClone(DEFAULT_STATE),activeTrack:null,tracks:[],items:[],weeklyProgress:{},dailyPlan:{date:null,minutes:60,items:[]}});
  vaultNotes=[];
  renderDailyPlan();
  renderTracks();
  if(state.activeTrack!==null){throw new Error("empty state should not invent an active track")}
  if(!$("dailyPlan").innerHTML.includes("Nada pendente")){throw new Error("empty daily plan did not render")}
  if(!$("trackHero").innerHTML.includes("Nova trilha")){throw new Error("first-track empty state did not render")}

  let fields=$("trackForm").elements;
  fields.id.value="";
  fields.name.value="Tarot";
  fields.sigil.value="T";
  fields.subtitle.value="Arcanos";
  fields.description.value="Estudo inicial";
  fields.weeklyGoal.value="90";
  await saveTrack({preventDefault(){},currentTarget:$("trackForm")});
  if(state.tracks.length!==1){throw new Error("first track was not added")}
  if(state.activeTrack!=="tarot"){throw new Error("first track was not activated")}
  if(state.weeklyProgress.tarot!==0){throw new Error("first track progress was not initialized")}
  if(!$("trackTabs").innerHTML.includes("Tarot")||!$("trackHero").innerHTML.includes("Tarot")){throw new Error("first track did not render")}

  __savedState=await ArcanaStorage.loadState(DEFAULT_STATE);
  state=normalize(structuredClone(__savedState));
  renderTracks();
  if(state.tracks.length!==1||state.activeTrack!=="tarot"){throw new Error("rehydration did not preserve first track")}

  fields=$("trackForm").elements;
  fields.id.value="";
  fields.name.value="Astrologia";
  fields.sigil.value="A";
  fields.subtitle.value="";
  fields.description.value="";
  fields.weeklyGoal.value="120";
  await saveTrack({preventDefault(){},currentTarget:$("trackForm")});
  if(state.tracks.length!==2){throw new Error("second track was not added")}
  if(state.activeTrack!=="astrologia"){throw new Error("second track was not activated")}
  setTrack("tarot");
  if(state.activeTrack!=="tarot"){throw new Error("active track switch failed")}

  openItemDialog("course");
  fields=$("itemForm").elements;
  fields.title.value="Curso de Tarot";
  fields.url.value="";
  fields.source.value="Livro";
  fields.important.value="true";
  fields.urgent.value="false";
  fields.estimatedMinutes.value="45";
  fields.progress.value="0";
  fields.notes.value="Primeiro curso";
  saveItem({preventDefault(){},currentTarget:$("itemForm")});
  await Promise.resolve();
  const course=state.items.find(i=>i.kind==="course"&&i.title==="Curso de Tarot");
  if(!course){throw new Error("course was not created")}
  if(course.track!=="tarot"){throw new Error("course was not linked to the active track")}
  if(!ArcanaDebug.tracks().some(t=>t.id==="tarot")){throw new Error("debug tracks helper did not expose saved tracks")}
})()`, context);

assert.ok(savedStates.some(s => s.tracks?.some(t => t.id === "tarot")), "IndexedDB save receives first track in appState");
assert.ok(savedStates.some(s => s.tracks?.some(t => t.id === "astrologia")), "IndexedDB save receives second track in appState");
assert.ok(savedStates.at(-1).items?.some(i => i.kind === "course" && i.track === "tarot"), "course creation persists with active track");
assert.ok(savedStates.some(s => s.starterContentVersion === 2 && s.tracks?.some(t => t.id === "track-electronics") && s.playlists?.some(p => p.id === "playlist-learning-main")), "starter content persists through IndexedDB appState");

console.log("static and track regression checks passed");
