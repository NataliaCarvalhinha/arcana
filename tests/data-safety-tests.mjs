import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

const sandbox = { console, structuredClone };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync("data-safety.js", "utf8"), sandbox, { filename: "data-safety.js" });

const safety = sandbox.ArcanaDataSafety;
assert.ok(safety, "ArcanaDataSafety is exposed");
assert.equal(safety.DATA_SCHEMA_VERSION, 1);
assert.equal(safety.STARTER_CONTENT_VERSION, 2);

function baseState() {
  return {
    dataSchemaVersion: 1,
    starterContentVersion: 2,
    starterCurriculumVersion: 1,
    tracks: [{ id: "track-1", name: "Track" }],
    items: [{ id: "course-1", kind: "course", track: "track-1", title: "Course" }],
    playlists: [{ id: "playlist-1", name: "Playlist" }],
    youtubeQueue: [{ id: "video-1", title: "Video" }],
    sessions: [{ id: "session-1", minutes: 25 }],
    activityLog: [{ id: "activity-1", durationMinutes: 25 }],
    routineBlocks: [{ id: "routine-1", title: "Routine" }],
    hobbies: [{ id: "hobby-1", name: "Hobby" }],
    obsidian: { conflicts: [] },
    externalCalendars: { google: { events: [{ id: "event-1" }] } },
    dailyPlan: { items: [] },
    planningPreferences: {},
    unknownFutureField: { preserved: true }
  };
}

const migrated = safety.prepareStateMigration(
  { ...baseState(), dataSchemaVersion: 0, starterContentVersion: 0 },
  {
    normalize: state => ({ ...state, normalized: true }),
    applyStarterContent: state => ({ ...state, starterContentVersion: 2 }),
    starterCurriculumVersion: 1,
    now: () => "2026-08-23T00:00:00.000Z"
  }
);
assert.equal(migrated.status, safety.STATUSES.VALID_DATA);
assert.equal(migrated.migrated, true);
assert.equal(migrated.state.dataSchemaVersion, 1);
assert.equal(migrated.state.normalized, true);
assert.deepEqual(migrated.state.unknownFutureField, { preserved: true });
assert.equal(migrated.state.migrationMeta.lastMigrationStatus, "ok");

const stable = baseState();
const idempotent = safety.prepareStateMigration(stable, {
  normalize: state => state,
  applyStarterContent: state => state,
  starterCurriculumVersion: 1
});
assert.equal(idempotent.migrated, false);
assert.deepEqual(idempotent.state, stable);

assert.throws(
  () => safety.prepareStateMigration(baseState(), {
    normalize: state => state,
    applyStarterContent: state => ({ ...state, items: [] }),
    starterCurriculumVersion: 1
  }),
  /Suspicious courses loss/
);
assert.throws(() => safety.prepareStateMigration(null), /empty or unreadable/);
assert.throws(() => safety.prepareStateMigration([]), /empty or unreadable/);

const env = safety.detectEnvironment({
  hostname: "nataliacarvalhinha.github.io",
  origin: "https://nataliacarvalhinha.github.io",
  pathname: "/arcana/"
});
assert.equal(env.production, true);
assert.equal(env.label, "Production");

const app = readFileSync("app.js", "utf8");
const db = readFileSync("db.js", "utf8");
const worker = readFileSync("service-worker.js", "utf8");
const pages = readFileSync(".github/workflows/pages.yml", "utf8");
assert.doesNotMatch(db, /indexedDB\.deleteDatabase/, "database code must not delete IndexedDB");
assert.doesNotMatch(app, /localStorage\.clear|sessionStorage\.clear/, "app must not clear all browser storage");
assert.doesNotMatch(worker, /indexedDB|localStorage|sessionStorage/, "service worker must not touch user storage");
assert.match(db, /pre-migration/, "storage creates protected pre-migration snapshots");
assert.match(db, /pre-import-replace/, "replace import snapshots current state first");
assert.match(app, /before-routine-excel-import/, "routine Excel import snapshots current state before applying");
assert.match(db, /transactionDone/, "replace import waits for the atomic transaction");
assert.match(db, /Explicit user-confirmed replace import/, "destructive import path is documented");
assert.match(app, /showStartupRecovery/, "startup failures show recovery UI");
assert.match(app, /downloadRawState/, "raw state export is available");
assert.doesNotMatch(app, /falling back to localStorage/, "startup must not silently fall back to fresh localStorage");
assert.match(pages, /node tests\/data-safety-tests\.mjs/, "Pages deployment runs data safety tests");
