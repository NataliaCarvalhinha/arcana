import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

for (const file of ["index.html", "app.js", "db.js", "manifest.webmanifest", "service-worker.js", ".github/workflows/pages.yml"]) {
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
assert.match(app, /ArcanaStorage\.init/, "IndexedDB init is wired");
assert.match(db, /window\.ArcanaStorage=ArcanaStorage/, "IndexedDB storage is exposed to the app");
assert.match(app, /sincronização automática precisa do Arcana Local/, "static YouTube limitation is explicit");
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
assert.doesNotMatch(app, /state\.dailyPlan\.date!==dayKey\(\)\|\|!state\.dailyPlan\.items\.length/, "empty daily plans do not recursively regenerate");
assert.doesNotMatch(app, /\$\("trackForm"\)\.id\.value|const f=e\.currentTarget,id=f\.id\.value/, "track flow does not read colliding form properties");
assert.match(db, /async function list\(name\)/, "storage exposes a store inspection helper");
assert.match(db, /tracks","courses","modules"/, "IndexedDB schema still contains domain stores");

const worker = readFileSync("service-worker.js", "utf8");
assert.match(worker, /caches\.open/, "service worker caches app shell");
assert.match(worker, /arcana-shell-v3/, "service worker cache version invalidates old app shell");
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
const ids = ["trackForm", "trackDialog", "trackDialogTitle", "trackFormError", "trackSaveBtn", "deleteTrackBtn", "trackTabs", "trackHero", "trackCourses", "trackProfile", "homeTracks", "dailyPlan", "todayMinutes", "itemForm", "itemDialog", "moduleEditor", "moduleRows"];
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

const savedStates = [];
const context = {
  console,
  structuredClone,
  setTimeout,
  clearTimeout,
  location: { hostname: "", origin: "https://example.test" },
  navigator: {},
  localStorage: { getItem() { return null; }, setItem() {} },
  alert(message) { throw new Error(`Unexpected alert: ${message}`); },
  confirm() { return true; },
  prompt() { return ""; },
  crypto: { randomUUID: () => `uuid-${savedStates.length}-${Math.random().toString(16).slice(2)}` },
  document: {
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
    createElement: makeElement
  }
};
context.window = context;
context.ArcanaStorage = {
  ready: true,
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
  }
};

vm.createContext(context);
vm.runInContext(app.slice(0, app.indexOf("async function initApp")), context, { filename: "app.js" });

await vm.runInContext(`(async()=>{
  scheduleAutoBackup=()=>{};
  renderAll=()=>{renderDailyPlan();renderHomeTracks();renderTracks();};
  state=normalize({...structuredClone(DEFAULT_STATE),activeTrack:null,tracks:[],items:[],weeklyProgress:{},dailyPlan:{date:null,minutes:60,items:[]}});
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

console.log("static and track regression checks passed");
