import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

for (const file of ["index.html", "app.js", "db.js", "data-safety.js", "routine-excel.js", "manifest.webmanifest", "service-worker.js", ".github/workflows/pages.yml", ".github/workflows/sync-youtube.yml", ".github/workflows/register-youtube-playlist.yml", ".github/ISSUE_TEMPLATE/arcana-playlist.yml", "data/youtube/playlists.json", "data/youtube/catalog.json", "scripts/sync-youtube.py", "tests/data-safety-tests.mjs", "tests/routine-excel-tests.mjs", "docs/data-safety.md", "docs/routine-excel.md"]) {
  assert.ok(existsSync(file), `${file} exists`);
}

const index = readFileSync("index.html", "utf8");
assert.ok(index.indexOf("data-safety.js") < index.indexOf("db.js"), "data-safety.js loads before db.js");
assert.ok(index.indexOf("db.js") < index.indexOf("routine-excel.js"), "db.js loads before routine-excel.js");
assert.ok(index.indexOf("routine-excel.js") < index.indexOf("app.js"), "routine-excel.js loads before app.js");
assert.match(index, /rel="manifest"/, "manifest linked");

const manifest = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.equal(manifest.display, "standalone");

const app = readFileSync("app.js", "utf8");
const db = readFileSync("db.js", "utf8");
const dataSafety = readFileSync("data-safety.js", "utf8");
const routineExcel = readFileSync("routine-excel.js", "utf8");
const styles = readFileSync("styles.css", "utf8");
const pagesWorkflow = readFileSync(".github/workflows/pages.yml", "utf8");
const syncWorkflow = readFileSync(".github/workflows/sync-youtube.yml", "utf8");
const registerWorkflow = readFileSync(".github/workflows/register-youtube-playlist.yml", "utf8");
const issueTemplate = readFileSync(".github/ISSUE_TEMPLATE/arcana-playlist.yml", "utf8");
const youtubePlaylists = JSON.parse(readFileSync("data/youtube/playlists.json", "utf8"));
const youtubeCatalog = JSON.parse(readFileSync("data/youtube/catalog.json", "utf8"));
const youtubeSyncScript = readFileSync("scripts/sync-youtube.py", "utf8");
assert.match(app, /ArcanaStorage\.init/, "IndexedDB init is wired");
assert.match(db, /window\.ArcanaStorage=ArcanaStorage/, "IndexedDB storage is exposed to the app");
assert.match(dataSafety, /ArcanaDataSafety/, "data safety module is exposed");
assert.match(dataSafety, /prepareStateMigration/, "data safety module owns guarded migrations");
assert.match(app, /function showStartupRecovery/, "startup data failures render recovery UI");
assert.match(app, /function preparePersistedState/, "app state startup uses guarded preparation");
assert.match(app, /createDefaultState:createFreshDefaultState/, "fresh defaults are only created through the explicit fresh-state path");
assert.match(index, /id="exportRawStateBtn"/, "settings exposes raw state export");
assert.match(index, /id="snapshotRecoveryInfo"/, "settings explains snapshot recovery availability");
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
assert.doesNotMatch(app, /queueObsidianAutoSync\("after_note_save"\)/, "note saves do not trigger direct obsidian sync in phase one");
assert.match(app, /ArcanaStorage\.downloadObsidianVault\(state\)/, "online vault export uses the obsidian zip exporter");
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
assert.match(index, /onclick="navigateTo\('knowledge'\)"/, "home knowledge button uses centralized navigation");
assert.match(app, /onkeydown="activateRow\(event,this\)"/, "clickable rows support keyboard activation");
assert.match(app, /event\.stopPropagation\(\);openNotes/, "nested note buttons do not trigger row navigation");
assert.match(app, /function repairStarterTrackDuplicates/, "starter duplicate track repair is available");
assert.match(app, /function applyStarterContentV1/, "starter content uses versioned migration functions");
assert.match(app, /const STARTER_CURRICULUM_VERSION=1/, "starter curriculum version is declared");
assert.match(app, /function applyStarterCurriculumV1/, "starter curriculum uses a versioned migration");
assert.match(app, /sourceTypeForResource/, "module and lesson source metadata is normalized");
assert.match(app, /openFocus\(\$\{jsArg\(lesson\.id\)\},'lesson'\)/, "lessons can open the focus modal");
assert.match(index, /data-view="knowledge"/, "primary navigation exposes the Knowledge hub");
assert.match(index, /id="knowledgeView"/, "Knowledge hub view is present");
assert.match(index, /data-knowledge-tab="fichamentos"/, "Knowledge hub exposes fichamento tab");
assert.match(index, /data-knowledge-tab="reviews"/, "Knowledge hub exposes review tab");
assert.match(index, /id="globalSearchDialog"/, "global search dialog is present");
assert.match(index, /id="captureDialog"/, "universal capture dialog is present");
assert.match(index, /class="mobile-nav"/, "mobile bottom navigation is present");
assert.match(index, /id="nextRitual"/, "Sanctuary exposes the next ritual surface");
assert.match(index, /class="sanctuary-page"/, "Sanctuary home uses the ritual page composition");
assert.match(index, /id="sanctuaryDate"/, "Sanctuary intro exposes the current date");
assert.doesNotMatch(index, /id="exportBtn"/, "Sanctuary header omits the old backup export control");
assert.doesNotMatch(index, /id="importInput"/, "Sanctuary header omits the old backup import control");
assert.match(index, /id="exportFullBackupBtn"/, "backup export remains available in Settings");
assert.match(index, /id="fullBackupImportInput"/, "backup import remains available in Settings");
assert.match(app, /function renderKnowledge/, "Knowledge hub renderer is present");
assert.match(app, /function openKnowledgeObject/, "Knowledge objects open through a unified action");
assert.match(app, /function buildSearchResults/, "global search result builder is present");
assert.match(app, /function openGlobalSearch/, "global search opener is present");
assert.match(app, /function captureUniversal/, "universal capture handler is present");
assert.match(app, /function renderNextRitual/, "Sanctuary next ritual renderer is present");
assert.match(app, /trocar ritual/, "Sanctuary replan action is a subtle tertiary ritual switch");
assert.match(app, /EM FOCO/, "Today plan marks the current ritual without adding duplicate buttons");
assert.doesNotMatch(app, /today-row clickable-row[\s\S]{0,260}<button class="mini-btn" onclick="event\.stopPropagation\(\);\$\{action\}">Continuar<\/button>/, "Today plan rows do not duplicate the primary Continue action");
assert.match(app, /function continueResource/, "universal continue action is present");
assert.match(app, /function continueTrack/, "track continue action is present");
assert.match(app, /function currentModuleLabel/, "course rows expose the current module summary");
assert.match(app, /class="course-title" title="\$\{esc\(i\.title\)\}"/, "course titles keep accessible full text");
assert.match(app, /active&&lessons\.length/, "only the active module renders lesson rows by default");
assert.match(app, /class="mini-btn primary-action"/, "main continue buttons use the primary action size");
assert.match(app, /role="menu"/, "secondary row actions are grouped in a semantic menu");
assert.match(app, /closest\("button,a,summary,details\.row-menu"\)/, "row-menu interactions do not toggle course rows");
assert.match(app, /data-knowledge-id/, "Knowledge cards use stable object ids");
assert.match(app, /data-search-id/, "search results use stable object ids");
assert.match(app, /ctrlKey\|\|e\.metaKey/, "global search has a Ctrl/Cmd+K shortcut");
assert.match(app, /playlist-learning-main/, "starter playlist is present in the catalog");
assert.match(app, /course-elec-01/, "starter electronics catalog is present");
assert.match(app, /course-fin-07/, "starter finance catalog is present");
assert.match(app, /prepareState:preparePersistedState/, "IndexedDB startup delegates migrations to the guarded state preparer");
assert.match(index, /id="obsidianConnectBtn"/, "settings exposes the obsidian connect action");
assert.match(index, /id="obsidianSyncBtn"/, "settings exposes the obsidian sync action");
assert.match(index, /id="obsidianAutoSync"/, "settings exposes autosync selection");
assert.doesNotMatch(index, /id="obsidianPullBtn"|id="obsidianPushBtn"/, "phase one does not expose direct reverse sync controls");
assert.match(app, /class ExternalCalendarProvider/, "external calendar provider abstraction is present");
assert.match(app, /class GoogleCalendarProvider extends ExternalCalendarProvider/, "Google calendar provider implements the provider abstraction");
assert.match(app, /https:\/\/www\.googleapis\.com\/auth\/calendar\.readonly/, "Google Calendar uses the read-only scope");
assert.match(app, /google\.accounts\.oauth2\.initTokenClient/, "Google Calendar uses the browser token model");
assert.match(app, /sessionStorage\.setItem\(googleCalendarTokenStorageKey\(\)/, "Google Calendar access token is session-scoped");
assert.doesNotMatch(app, /refresh_token|refreshToken/, "Arcana does not request or store refresh tokens");
assert.match(app, /nextPageToken/, "Google Calendar sync follows paginated API responses");
assert.match(app, /pageToken/, "Google Calendar pagination passes page tokens");
assert.match(index, /id="calendarIntegrationForm"/, "settings exposes external calendar integration");
assert.match(index, /Toki com Arcana via sincroniza/, "settings explains the Toki-through-Google flow");
assert.match(index, /data-calendar-filter="external"/, "calendar view exposes external source filters");
assert.match(index, /id="calendarConflictNotice"/, "Sanctuary exposes calendar conflict warning surface");
assert.match(db, /function sanitizeStateForPortableExport/, "portable exports sanitize OAuth-shaped calendar fields");
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
assert.match(app, /function activeCourseForTrack/, "learning paths expose one active course per track");
assert.match(app, /function courseSequenceState/, "course sequence state controls locked course progression");
assert.match(app, /function moduleSequenceState/, "module sequence state controls locked module progression");
assert.match(app, /function lessonSequenceState/, "lesson sequence state controls locked lesson progression");
assert.match(app, /function getActiveLearningTarget/, "daily plan resolves one active target per track");
assert.match(app, /confirm\(lockedFocusMessage\(id,scope\)\)/, "locked focus requires explicit manual override");
assert.match(app, /courseId:source\.courseId/, "focus and vault payloads preserve exact curriculum ids");
assert.match(app, /progression:"sequential"/, "tracks default to sequential progression");
assert.doesNotMatch(app, /\$\("trackForm"\)\.id\.value|const f=e\.currentTarget,id=f\.id\.value/, "track flow does not read colliding form properties");
assert.match(db, /async function list\(name\)/, "storage exposes a store inspection helper");
assert.match(db, /tracks","courses","modules"/, "IndexedDB schema still contains domain stores");
assert.match(db, /arcana_managed: true/, "obsidian vault export marks managed notes");
assert.match(db, /Arcana-Obsidian-Vault/, "obsidian vault export uses the requested filename");
assert.match(db, /README - Arcana\.md/, "obsidian vault export includes the Arcana readme");
assert.match(db, /Courses\//, "obsidian vault export includes course notes");
assert.match(db, /Tracks\//, "obsidian vault export includes track notes");
assert.doesNotMatch(db, /Arcana Obsidian Vault/, "obsidian vault export does not nest files inside a legacy root folder");
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
assert.match(worker, /arcana-shell-v20/, "service worker cache version invalidates old app shell");
assert.match(worker, /data-safety\.js/, "service worker caches the data safety module");
assert.match(worker, /routine-excel\.js/, "service worker caches the routine Excel module");
assert.match(worker, /YOUTUBE_CATALOG_RE/, "service worker special-cases the public YouTube catalog");
assert.match(worker, /function catalogCacheRequest/, "service worker normalizes catalog cache keys");
assert.match(worker, /cache\.put\(catalogCacheRequest\(url\),copy\)/, "service worker stores the catalog without cache-busting query params");
assert.match(worker, /caches\.match\(catalogCacheRequest\(url\)\)/, "service worker falls back to the normalized cached catalog offline");
assert.ok(!/youtube\.com|youtu\.be/.test(worker), "service worker does not cache YouTube");

assert.match(styles, /--control-height-sm:40px/, "small control height token is defined");
assert.match(styles, /--control-height-md:42px/, "medium control height token is defined");
assert.match(styles, /--control-hit-area:42px/, "touch hit-area token is defined");
assert.match(styles, /\.gold-btn\{background-color:var\(--gold-button-fallback\)\}/, "gold buttons expose a solid high-contrast fallback behind the gradient");
assert.match(styles, /#addBtn,#newTrackBtn,.mobile-capture-btn\{background-color:var\(--gold-button-bg\);background-image:linear-gradient\(180deg,#f5dfa0,var\(--gold-button-bg\)\);color:var\(--gold-button-fg\)/, "capture and track buttons have explicit high-contrast colors");
assert.match(styles, /\.primary-action\{min-height:var\(--control-height-md\)/, "primary action buttons use the medium control height");
assert.match(styles, /\.row-menu summary\{[^}]*min-width:var\(--control-hit-area\);min-height:var\(--control-hit-area\)/, "row menu summary has a full touch target");
assert.match(styles, /\.sidebar\{[^}]*width:100%;min-width:0/, "sidebar fits within its grid column");
assert.match(styles, /\.sidebar nav,\.nav-support\{width:100%;min-width:0\}/, "sidebar nav and support sections cannot exceed the sidebar content box");
assert.match(styles, /\.sidebar \.nav-btn\{width:100%;min-width:40px\}/, "sidebar support buttons keep at least a 40px hit width");
assert.match(styles, /\.brand\{width:100%;justify-content:center;padding-inline:0\}/, "collapsed sidebar brand removes extra inline padding");
assert.match(styles, /#regenPlanBtn\{width:var\(--control-height-sm\);min-width:var\(--control-height-sm\);height:var\(--control-height-sm\);padding:0\}/, "regenerate plan button has a 40px square hitbox");
assert.match(styles, /button:focus-visible,a:focus-visible,summary:focus-visible/, "keyboard focus is visible on controls and menus");
assert.match(styles, /\.course-title,.module-title,.lesson-title[\s\S]*-webkit-line-clamp:2/, "course and curriculum titles are line-clamped with wrapping");
assert.match(index, /<label class="snapshot-label" for="snapshotList">Snapshots<\/label><select id="snapshotList">/, "snapshot selector has a visible associated label");
assert.match(styles, /\.next-ritual-card\{[^}]*text-align:center/, "next ritual is centered as the home focal point");
assert.match(styles, /\.sanctuary-page\{[^}]*width:min\(1120px,100%\)/, "Sanctuary flow has a constrained reading width");
assert.match(app, /function renderHomePriority\(\)\{[\s\S]*slice\(0,3\)[\s\S]*priority-preview-row/, "Sanctuary priority panel keeps a short clickable-row preview");
assert.doesNotMatch(app, /function renderHomePriority\(\)\{[\s\S]*?<button class="mini-btn primary-action"[\s\S]*?function renderTracks/, "Sanctuary priority panel does not duplicate row actions with nested buttons");
assert.match(app, /routineBlocks/, "weekly routine blocks are part of app state");
assert.match(app, /function getFreeWindows/, "free-time window calculation is present");
assert.match(app, /function planActivitiesIntoWindows/, "adaptive daily planning is present");
assert.match(app, /function renderRoutine/, "routine screen renderer is present");
assert.match(app, /function renderHobbies/, "hobby screen renderer is present");
assert.match(app, /function routineBlockWeekdays/, "routine blocks support multi-day import semantics");
assert.match(app, /function buildRoutineExcelWorkbookData/, "routine Excel export builder is present");
assert.match(app, /function buildRoutineExcelImportPreview/, "routine Excel import preview is present");
assert.match(app, /function parseExcelClock/, "routine Excel importer parses Excel time values");
assert.match(app, /function parseExcelDays/, "routine Excel importer normalizes Portuguese weekdays");
assert.match(app, /ArcanaStorage\.snapshot\("before-routine-excel-import"/, "routine Excel import snapshots before applying");
assert.match(routineExcel, /createWorkbookBlob/, "routine Excel module writes XLSX workbooks");
assert.match(routineExcel, /parseWorkbookFile/, "routine Excel module reads XLSX workbooks");
assert.doesNotMatch(routineExcel, /<f>/, "routine Excel writer does not emit formula cells");
assert.match(index, /id="routineView"/, "weekly routine view is present");
assert.match(index, /id="hobbiesView"/, "hobbies view is present");
assert.match(index, /id="planningSettingsForm"/, "planning preferences form is present");
assert.match(index, /id="routineTemplateBtn"/, "routine view exposes Excel template download");
assert.match(index, /id="routineImportInput"/, "routine view exposes Excel import");
assert.match(index, /id="routineExportBtn"/, "routine view exposes current Excel export");
assert.match(index, /id="settingsRoutineTemplateBtn"/, "settings exposes Excel template download");
assert.match(index, /id="settingsRoutineImportInput"/, "settings exposes Excel import");
assert.match(index, /id="settingsRoutineExportBtn"/, "settings exposes current Excel export");
assert.match(index, /id="routineImportDialog"/, "routine Excel import preview dialog is present");
assert.match(app, /const ACTIVITY_LOG_VERSION=1/, "activity log schema is versioned");
assert.match(app, /function upsertActivityLogEntry/, "activity log upsert is present");
assert.match(app, /function parseQuickRegistration/, "universal registrar parser is present");
assert.match(app, /activityMinutesForDate\(dayKey\(\)\)/, "Sanctuary daily progress derives from the activity log");
assert.match(index, /id="registerDialog"/, "universal registrar dialog is present");
assert.match(index, /id="journalTimeline"/, "daily journal timeline is present");
assert.match(index, /id="weeklyAnalytics"/, "weekly analytics panel is present");

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
    click() { this.clicked = true; },
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

function makeSelect(id, values = []) {
  const el = makeElement(id);
  el.options = values.map(value => ({ value: String(value), selected: false }));
  Object.defineProperty(el, "selectedOptions", {
    get() {
      return this.options.filter(option => option.selected);
    }
  });
  return el;
}

const elements = new Map();
const ids = ["pageTitle", "homeView", "tracksView", "youtubeView", "libraryView", "fichamentosView", "notesView", "reviewView", "knowledgeView", "knowledgeTabs", "knowledgeSearch", "knowledgeList", "calendarView", "routineView", "hobbiesView", "inboxView", "settingsView", "trackForm", "trackDialog", "trackDialogTitle", "trackFormError", "trackSaveBtn", "deleteTrackBtn", "trackTabs", "trackHero", "trackCourses", "trackProfile", "homeTracks", "homeKnowledge", "homeReviews", "homePriority", "homeYoutube", "nextRitual", "todayRows", "todayProgress", "dailyPlan", "dailyPlanDetails", "todayMinutes", "sanctuaryDate", "freeTimeSummary", "calendarConflictNotice", "routineViewMode", "routineChangeNotice", "routineTodayTimeline", "routineWeek", "routineList", "newRoutineBtn", "routineTemplateBtn", "routineImportInput", "routineExportBtn", "settingsRoutineTemplateBtn", "settingsRoutineImportInput", "settingsRoutineExportBtn", "routineImportDialog", "routineImportTitle", "routineImportFileName", "routineImportSummary", "routineImportErrors", "routineImportChanges", "cancelRoutineImportBtn", "applyRoutineImportBtn", "hobbyList", "newHobbyBtn", "planningSettingsForm", "planningStatus", "calendarIntegrationForm", "googleCalendarStatus", "googleCalendarList", "googleCalendarConnectBtn", "googleCalendarSyncBtn", "googleCalendarDisconnectBtn", "routineDialog", "routineForm", "routineDialogTitle", "routineFormError", "routineSaveBtn", "deleteRoutineBtn", "duplicateRoutineBtn", "hobbyDialog", "hobbyForm", "hobbyDialogTitle", "hobbyFormError", "hobbySaveBtn", "deleteHobbyBtn", "itemForm", "itemDialog", "moduleEditor", "moduleRows", "playlistForm", "playlistDialog", "playlistDialogTitle", "playlistFormError", "playlistSaveBtn", "deletePlaylistBtn", "playlistTabs", "activePlaylistName", "playlistSyncStatus", "syncPlaylistBtn", "requestCatalogBtn", "catalogOptionsBtn", "activePlaylistPanel", "youtubeBudget", "dailyVideos", "youtubeQueue", "calendarLegend", "externalCalendarSummary", "externalCalendarEvents", "syncCalendarBtn", "youtubeSettingsForm", "environmentStatus", "dataSafetyStatus", "youtubeCatalogStatus", "youtubePlaylistDiagnostics", "refreshCatalogBtn", "backupStatus", "exportRawStateBtn", "snapshotRecoveryInfo", "obsidianEnvironmentStatus", "obsidianVaultStatus", "obsidianStats", "obsidianAutoSync", "obsidianAutoSyncNote", "obsidianConnectBtn", "obsidianSyncBtn", "obsidianDisconnectBtn", "obsidianOpenBtn", "snapshotList", "catalogRequestDialog", "catalogRequestTitle", "catalogRequestHelp", "catalogRequestJson", "catalogRequestStatus", "copyCatalogRequestBtn", "vaultList", "vaultEditorPane", "fichamentoList", "fichamentoEditor", "reviewQueue", "reviewActive", "globalSearchBtn", "globalSearchDialog", "globalSearchInput", "globalSearchResults", "captureDialog", "captureQuickInput", "captureStatus", "toastHost", "registerBtn", "timeNowBtn", "timeNowDialog", "timeNowOptions", "timeNowSuggestion", "registerDialog", "registerForm", "registerQuickInput", "registerParseBtn", "registerPreview", "registerTypeSelect", "registerTrackSelect", "registerCourseSelect", "registerModuleSelect", "registerLessonSelect", "registerHobbySelect", "registerStatus", "journalDate", "journalPrevBtn", "journalNextBtn", "journalTimeline", "weeklyAnalytics"];
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
elements.get("planningSettingsForm").elements = {
  dayStart: makeElement("planningDayStart"),
  dayEnd: makeElement("planningDayEnd"),
  minimumSessionMinutes: makeElement("planningMinimumSessionMinutes"),
  preferredSessionMinutes: makeElement("planningPreferredSessionMinutes"),
  planningBufferMinutes: makeElement("planningBufferMinutes"),
  useOnlyStudyBlocks: makeElement("planningUseOnlyStudyBlocks"),
  allowHobbySuggestions: makeElement("planningAllowHobbySuggestions")
};
elements.get("calendarIntegrationForm").elements = {
  clientId: makeElement("googleCalendarClientId"),
  storeEventTitles: makeElement("calendarStoreEventTitles"),
  allDayBlocksPlanning: makeElement("calendarAllDayBlocksPlanning"),
  defaultTravelBeforeMinutes: makeElement("calendarDefaultTravelBeforeMinutes"),
  defaultTravelAfterMinutes: makeElement("calendarDefaultTravelAfterMinutes")
};
elements.get("routineForm").elements = {
  id: makeElement("routineId"),
  title: makeElement("routineTitle"),
  category: makeElement("routineCategory"),
  weekday: makeElement("routineWeekday"),
  startTime: makeElement("routineStartTime"),
  endTime: makeElement("routineEndTime"),
  travelBeforeMinutes: makeElement("routineTravelBeforeMinutes"),
  travelAfterMinutes: makeElement("routineTravelAfterMinutes"),
  location: makeElement("routineLocation"),
  address: makeElement("routineAddress"),
  recurrence: makeElement("routineRecurrence"),
  colorKey: makeElement("routineColorKey"),
  notes: makeElement("routineNotes"),
  fixed: makeElement("routineFixed"),
  active: makeElement("routineActive")
};
elements.get("hobbyForm").elements = {
  id: makeElement("hobbyId"),
  name: makeElement("hobbyName"),
  icon: makeElement("hobbyIcon"),
  description: makeElement("hobbyDescription"),
  preferredMinutes: makeElement("hobbyPreferredMinutes"),
  minimumMinutes: makeElement("hobbyMinimumMinutes"),
  frequencyPerWeek: makeElement("hobbyFrequencyPerWeek"),
  preferredDays: makeSelect("hobbyPreferredDays", [1, 2, 3, 4, 5, 6, 7]),
  preferredTimes: makeElement("hobbyPreferredTimes"),
  location: makeElement("hobbyLocation"),
  notes: makeElement("hobbyNotes"),
  tags: makeElement("hobbyTags"),
  active: makeElement("hobbyActive")
};
elements.set("registerTypeSelect", makeSelect("registerTypeSelect", ["study", "youtube", "review", "hobby", "sport", "journaling", "appointment", "routine", "other"]));
elements.set("registerTrackSelect", makeSelect("registerTrackSelect"));
elements.set("registerHobbySelect", makeSelect("registerHobbySelect"));
elements.set("registerCourseSelect", makeSelect("registerCourseSelect"));
elements.set("registerModuleSelect", makeSelect("registerModuleSelect"));
elements.set("registerLessonSelect", makeSelect("registerLessonSelect"));
elements.get("registerForm").elements = {
  type: elements.get("registerTypeSelect"),
  title: makeElement("registerTitle"),
  date: makeElement("registerDate"),
  time: makeElement("registerTime"),
  durationMinutes: makeElement("registerDurationMinutes"),
  trackId: elements.get("registerTrackSelect"),
  hobbyId: elements.get("registerHobbySelect"),
  courseId: elements.get("registerCourseSelect"),
  moduleId: elements.get("registerModuleSelect"),
  lessonId: elements.get("registerLessonSelect"),
  studyResult: makeElement("registerStudyResult"),
  notes: makeElement("registerNotes")
};
elements.get("registerForm").elements.studyResult.value = "session_only";

const savedStates = [];
const snapshots = [];
const context = {
  console,
  structuredClone,
  Blob,
  TextEncoder,
  TextDecoder,
  Response,
  DecompressionStream: typeof DecompressionStream === "undefined" ? undefined : DecompressionStream,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  URL,
  location: { hostname: "", origin: "https://example.test", href: "https://example.test/arcana/index.html", pathname: "/arcana/index.html" },
  navigator: {},
  localStorage: { getItem() { return null; }, setItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
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
context.__snapshots = snapshots;
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
  async snapshot(reason, value, metadata) {
    snapshots.push({ reason, value: structuredClone(value), metadata: structuredClone(metadata || {}) });
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
vm.runInContext(dataSafety, context, { filename: "data-safety.js" });
vm.runInContext(routineExcel, context, { filename: "routine-excel.js" });
vm.runInContext(app.slice(0, app.indexOf("async function initApp")), context, { filename: "app.js" });

await vm.runInContext(`(async()=>{
  scheduleAutoBackup=()=>{};
  renderAll=()=>{renderDailyPlan();renderHomeTracks();renderTracks();};
  const fixedPlanDate=new Date("2026-08-17T10:00:00.000Z");
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

  const legacyLogState=normalize({...structuredClone(DEFAULT_STATE),activityLogVersion:0,sessions:[{id:"legacy-session",date:"2026-08-17",timestamp:"2026-08-17T10:00:00.000Z",minutes:25,title:"Legacy Study",type:"manual",track:"default"}]});
  if(legacyLogState.activityLog.length!==1){throw new Error("legacy sessions should backfill the activity log once")}
  const rerunLogState=normalize(legacyLogState);
  if(rerunLogState.activityLog.length!==1){throw new Error("activity log migration should not duplicate entries")}
  state=normalize({...structuredClone(DEFAULT_STATE),activityLog:[],activityLogVersion:ACTIVITY_LOG_VERSION});
  upsertActivityLogEntry({type:"study",title:"Manual",startedAt:"2026-08-17T10:00:00.000Z",durationMinutes:10,source:"session",sourceRecordId:"dup"});
  upsertActivityLogEntry({type:"study",title:"Manual Update",startedAt:"2026-08-17T10:00:00.000Z",durationMinutes:20,source:"session",sourceRecordId:"dup"});
  if(state.activityLog.length!==1||state.activityLog[0].durationMinutes!==20){throw new Error("activity log upsert should replace duplicate source records")}
  const parsed=parseQuickRegistration("estudei FPGA 45 min");
  if(parsed.type!=="study"||parsed.durationMinutes!==45){throw new Error("registrar parser should infer study duration")}

  const excelWorkbook={sheets:{
    Rotina:{rows:[ROUTINE_EXCEL_HEADERS.routine,
      ["work-1","Trabalho profundo","Trabalho","Seg, Qua",0.375,"10:30","Casa","Rua",5,10,"Semanal","Sim",""],
      ["sport-1","Corrida","Esporte","Sábado","07:00","08:00","","",0,0,"Weekly","Não",""]
    ]},
    Hobbies:{rows:[ROUTINE_EXCEL_HEADERS.hobbies,
      ["hobby-existing","Tarot","☽",45,15,2,"Ter, Qui","18:00-22:00","Sim","cartas"]
    ]},
    Configuração:{rows:[ROUTINE_EXCEL_HEADERS.config,
      ["Início do dia","06:30"],
      ["Permitir sugestões de hobbies","Sim"]
    ]}
  }};
  state=normalize({
    ...structuredClone(DEFAULT_STATE),
    routineBlocks:[],
    hobbies:[{id:"hobby-existing",name:"Tarot",icon:"☽",description:"preserve",preferredMinutes:20,minimumMinutes:10,frequencyPerWeek:1,preferredDays:[],preferredTimes:["evening"],lastDoneAt:"2026-08-20",sessions:[{id:"s1"}],active:true,location:"Casa",notes:"old",tags:["x"]}],
    planningPreferences:{...DEFAULT_PLANNING_PREFERENCES}
  });
  const preview=buildRoutineExcelImportPreview(excelWorkbook,state,"fixture.xlsx");
  if(preview.errors.length){throw new Error("routine Excel fixture should validate: "+preview.errors.join("; "))}
  if(preview.sections.routine.created!==2||preview.sections.routine.disabled!==1){throw new Error("routine Excel should create two blocks and count one disabled row")}
  if(preview.sections.hobbies.updated!==1){throw new Error("routine Excel should update the existing hobby by stable ID")}
  const work=preview.nextState.routineBlocks.find(block=>block.id==="work-1");
  if(work.startTime!=="09:00"||work.endTime!=="10:30"||work.weekdays.join(",")!=="1,3"){throw new Error("routine Excel should parse numeric times and Portuguese weekdays")}
  const sport=preview.nextState.routineBlocks.find(block=>block.id==="sport-1");
  if(sport.active!==false){throw new Error("Ativo=Não should disable routine rows without deleting them")}
  const hobby=preview.nextState.hobbies.find(item=>item.id==="hobby-existing");
  if(hobby.lastDoneAt!=="2026-08-20"||hobby.sessions.length!==1||hobby.preferredTimes[0]!=="18:00-22:00"){throw new Error("hobby import should preserve activity history and accept preferred time ranges")}
  if(preview.nextState.planningPreferences.dayStart!=="06:30"||preview.nextState.planningPreferences.allowHobbySuggestions!==true){throw new Error("configuration sheet should update planning preferences only")}
  state=preview.nextState;
  const reimport=buildRoutineExcelImportPreview(excelWorkbook,state,"fixture.xlsx");
  if(reimport.sections.routine.created!==0||reimport.sections.routine.updated!==0||reimport.sections.routine.unchanged!==2){throw new Error("same-file routine reimport should be unchanged")}
  const missingRowPreview=buildRoutineExcelImportPreview({sheets:{Rotina:{rows:[ROUTINE_EXCEL_HEADERS.routine,["work-1","Trabalho profundo","Trabalho","Seg, Qua","09:00","10:30","Casa","Rua",5,10,"Semanal","Sim",""]]}}},state,"missing.xlsx");
  if(!missingRowPreview.nextState.routineBlocks.some(block=>block.id==="sport-1")){throw new Error("missing Excel rows must not delete existing routine blocks")}
  const invalid=buildRoutineExcelImportPreview({sheets:{Rotina:{rows:[ROUTINE_EXCEL_HEADERS.routine,
    ["dup","A","Trabalho","Seg","25:00","26:00","","",0,0,"Semanal","Sim",""],
    ["dup","B","Trabalho","Ter","09:00","10:00","","",0,0,"Semanal","Sim",""]
  ]}}},state,"bad.xlsx");
  if(!invalid.errors.length||invalid.nextState){throw new Error("invalid routine Excel imports should block apply before mutating state")}
  const applyPreview=buildRoutineExcelImportPreview({sheets:{Rotina:{rows:[ROUTINE_EXCEL_HEADERS.routine,["new-apply","Aplicar","Estudo","Dom","11:00","12:00","","",0,0,"Semanal","Sim",""]]}}},state,"apply.xlsx");
  await applyRoutineExcelImportPreview(applyPreview);
  if(!globalThis.__snapshots.some(snapshot=>snapshot.reason==="before-routine-excel-import")){throw new Error("routine Excel apply should snapshot the original state before mutation")}
  if(!state.routineBlocks.some(block=>block.id==="new-apply")){throw new Error("routine Excel apply should persist the previewed state")}
  const exported=buildRoutineExcelWorkbookData();
  const parsedWorkbook=await ArcanaRoutineExcel.parseWorkbookBuffer(await ArcanaRoutineExcel.createWorkbookBlob(exported).arrayBuffer());
  const roundTrip=buildRoutineExcelImportPreview(parsedWorkbook,state,"roundtrip.xlsx");
  if(roundTrip.errors.length||routineImportTotal(roundTrip,"created")||routineImportTotal(roundTrip,"updated")){throw new Error("exported routine workbook should reimport unchanged")}

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
  renderHomeTracks();
  renderTracks();
  const fixedPlan=planActivitiesIntoWindows(fixedPlanDate,{minutes:60,now:fixedPlanDate});
  state.dailyPlan={...state.dailyPlan,date:dayKey(fixedPlanDate),minutes:60,items:fixedPlan.items,freeWindows:fixedPlan.freeWindows,availableMinutes:fixedPlan.availableMinutes,notices:fixedPlan.notices};
  if(!$("homeTracks").innerHTML.includes("Eletrônica")||!$("homeTracks").innerHTML.includes("Finanças")){throw new Error("seeded tracks did not render in the Sanctuary")}
  if(!$("trackTabs").innerHTML.includes("Eletrônica")||!$("trackCourses").innerHTML.includes("Microcontrollers: Basic Architecture and Design")){throw new Error("seeded track catalog did not render")}
  if(!state.dailyPlan.items.length){throw new Error("seeded courses did not generate a daily plan")}
  if(!state.dailyPlan.items.some(p=>p.type==="module"||p.type==="lesson")){throw new Error("daily plan should target the next unfinished module or lesson")}
  const planCourseTracks=new Set();
  for(const entry of state.dailyPlan.items){
    if(entry.type==="review"||entry.type==="youtube"){
      continue
    }
    const resource=resourceByScope(entry.id,entry.type);
    const course=entry.type==="item"?resource:state.items.find(item=>item.id===resource?.courseId);
    if(course?.kind==="course"&&course.track){
      if(planCourseTracks.has(course.track)){throw new Error("daily plan should not schedule two courses from the same track")}
      planCourseTracks.add(course.track)
    }
  }
  if(!planCourseTracks.has("track-electronics")||!planCourseTracks.has("track-finance")){throw new Error("daily plan should schedule one active course from each available track")}
  if(activeCourseForTrack("track-electronics").id!=="course-elec-01"){throw new Error("first unfinished electronics course should be active")}
  if(activeCourseForTrack("track-finance").id!=="course-fin-01"){throw new Error("first unfinished finance course should be active")}
  const learningPlan=state.dailyPlan.items.filter(entry=>entry.type!=="review"&&entry.type!=="youtube");
  if(!learningPlan.every(entry=>entry.trackId&&entry.courseId)){throw new Error("daily plan learning entries should carry track and course ids")}
  if(!learningPlan.some(entry=>entry.trackId==="track-finance"&&entry.courseId==="course-fin-01")){throw new Error("daily plan should schedule the active finance course")}
  if(learningPlan.some(entry=>entry.trackId==="track-finance"&&entry.courseId==="course-fin-02")){throw new Error("daily plan should not skip to Financial Markets before finance planning is complete")}
  const financeTarget=getActiveLearningTarget(trackById("track-finance"));
  if(financeTarget.courseId!=="course-fin-01"||!financeTarget.moduleId){throw new Error("finance target should resolve into the first unfinished course/module")}
  const futureFinance=state.items.find(i=>i.id==="course-fin-02");
  futureFinance.progress=20;futureFinance.status="em_andamento";futureFinance.important=true;futureFinance.urgent=true;
  if(courseSequenceState(futureFinance)!=="locked"){throw new Error("out-of-order historical progress should stay locked until earlier courses complete")}
  generatePlan();
  if(state.dailyPlan.items.some(entry=>entry.trackId==="track-finance"&&entry.courseId==="course-fin-02")){throw new Error("urgent future finance progress should not override the active sequential course")}
  if(futureFinance.progress!==20){throw new Error("out-of-order progress should be preserved")}
  if(courseSequenceState(state.items.find(i=>i.id==="course-elec-02"))!=="locked"){throw new Error("later courses in a track should start locked")}
  const planningDate=new Date();
  planningDate.setDate(planningDate.getDate()+1);
  planningDate.setHours(0,0,0,0);
  const planningWeekday=weekdayKeyForDate(planningDate);
  const planningNow=new Date(planningDate.getFullYear(),planningDate.getMonth(),planningDate.getDate(),0,0);
  state=normalize({
    ...structuredClone(DEFAULT_STATE),
    tracks:[{id:"track-a",name:"A",sigil:"A",subtitle:"",description:"",weeklyGoal:60,progression:"sequential"}],
    activeTrack:"track-a",
    items:[{id:"course-a",kind:"course",track:"track-a",title:"Curso A",estimatedMinutes:50,progress:0,status:"nao_iniciado",important:true,urgent:false,modules:[],createdAt:new Date().toISOString()}],
    routineBlocks:[
      {id:"work",title:"Trabalho",weekday:planningWeekday,category:"work",startTime:"09:00",endTime:"17:00",travelBeforeMinutes:30,travelAfterMinutes:30,active:true,fixed:true},
      {id:"study",title:"Estudo",weekday:planningWeekday,category:"study",startTime:"18:00",endTime:"19:00",travelBeforeMinutes:0,travelAfterMinutes:0,active:true,fixed:true}
    ],
    hobbies:[{id:"hobby-a",name:"Tarot",icon:"T",frequencyPerWeek:1,minimumMinutes:10,preferredMinutes:20,preferredDays:[planningWeekday],preferredTimes:["evening"],sessions:[],active:true}],
    planningPreferences:{...DEFAULT_PLANNING_PREFERENCES,dayStart:"08:00",dayEnd:"20:00",minimumSessionMinutes:15,preferredSessionMinutes:30,planningBufferMinutes:0,useOnlyStudyBlocks:false,allowHobbySuggestions:true},
    playlists:[{id:"p",name:"Playlist",url:"https://www.youtube.com/playlist?list=PL12345678",youtubePlaylistId:"PL12345678",lastSyncAt:null,lastSyncError:null}],
    activePlaylist:"p",
    youtubeQueue:[{id:"yt-a",videoId:"yt-a",playlistId:"p",youtubePlaylistId:"PL12345678",kind:"youtube",title:"Video A",url:"https://www.youtube.com/watch?v=yt-a",channel:"Canal",thumbnail:"",estimatedMinutes:15,progress:0,status:"nao_iniciado",notes:"",important:true,urgent:false,track:null,createdAt:new Date().toISOString(),position:0,catalogManaged:false,activeInCatalog:true,archivedAt:null}]
  });
  let windows=getFreeWindows(planningDate,{now:planningNow});
  if(!windows.some(window=>window.start===480&&window.end===510)||!windows.some(window=>window.start===1050&&window.end===1200)){throw new Error("routine free windows should subtract fixed work and commute blocks")}
  state.planningPreferences.useOnlyStudyBlocks=true;
  windows=getFreeWindows(planningDate,{now:planningNow});
  if(windows.length!==1||windows[0].start!==1080||windows[0].end!==1140){throw new Error("study-block planning should use only explicit study windows")}
  const studyOnlyPlan=planActivitiesIntoWindows(planningDate,{minutes:60,now:planningNow});
  if(studyOnlyPlan.items[0]?.type==="hobby"){throw new Error("study-only windows should reserve focus time before hobby suggestions")}
  state.planningPreferences.useOnlyStudyBlocks=false;
  state.planningPreferences.allowHobbySuggestions=false;
  let adaptivePlan=planActivitiesIntoWindows(planningDate,{minutes:90,now:planningNow});
  if(adaptivePlan.items.some(item=>item.type==="hobby")){throw new Error("disabled hobby suggestions should stay out of the daily plan")}
  state.tracks=[];
  state.items=[];
  state.planningPreferences.allowHobbySuggestions=true;
  adaptivePlan=planActivitiesIntoWindows(planningDate,{minutes:30,now:planningNow});
  if(!adaptivePlan.items.some(item=>item.type==="hobby")){throw new Error("enabled hobby suggestions should fill suitable free windows")}
  state.youtubeQueue=[
    {...state.youtubeQueue[0],id:"yt-first",videoId:"yt-first",title:"Primeiro",progress:100,status:"concluido",position:0},
    {...state.youtubeQueue[0],id:"yt-next",videoId:"yt-next",title:"Segundo",progress:0,status:"nao_iniciado",position:1},
    {...state.youtubeQueue[0],id:"yt-later",videoId:"yt-later",title:"Terceiro",progress:0,status:"nao_iniciado",position:2}
  ];
  state.youtubeSettings={mode:"count",minutes:60,count:3,hideAfterLimit:false};
  const youtubeCandidates=buildPlanningCandidates(planningDate).filter(item=>item.type==="youtube");
  if(youtubeCandidates.length!==1||youtubeCandidates[0].id!=="yt-next"){throw new Error("adaptive planning should offer only the strict next YouTube video")}
  const externalDay=dayKey(planningDate);
  const nextPlanningDate=new Date(planningDate);
  nextPlanningDate.setDate(nextPlanningDate.getDate()+1);
  const makeIso=(hour,minute=0)=>new Date(planningDate.getFullYear(),planningDate.getMonth(),planningDate.getDate(),hour,minute).toISOString();
  state=normalize({
    ...structuredClone(DEFAULT_STATE),
    tracks:[{id:"track-a",name:"A",sigil:"A",subtitle:"",description:"",weeklyGoal:60,progression:"sequential"}],
    activeTrack:"track-a",
    items:[{id:"course-a",kind:"course",track:"track-a",title:"Curso A",estimatedMinutes:50,progress:0,status:"nao_iniciado",important:true,urgent:false,modules:[],createdAt:new Date().toISOString()}],
    routineBlocks:[],
    planningPreferences:{...DEFAULT_PLANNING_PREFERENCES,dayStart:"08:00",dayEnd:"12:00",minimumSessionMinutes:15,preferredSessionMinutes:30,planningBufferMinutes:0,useOnlyStudyBlocks:false,allowHobbySuggestions:false},
    externalCalendars:{google:{provider:"google",connected:true,clientId:"client",calendars:[{id:"work-cal",name:"Work",selected:true}],selectedCalendarIds:["work-cal"],privacy:{storeEventTitles:true},preferences:{allDayBlocksPlanning:false,defaultTravelBeforeMinutes:15,defaultTravelAfterMinutes:15,eventTravelOverrides:{}},events:[{id:"meeting",provider:"google",calendarId:"work-cal",title:"Planning",start:makeIso(10),end:makeIso(11),allDay:false,busy:true,transparency:"opaque",location:"",sourceUrl:"",updatedAt:makeIso(9),importedAt:makeIso(9)}]}}
  });
  let busy=getBusyIntervals(planningDate);
  if(!busy.external.some(item=>item.start===585&&item.end===675)){throw new Error("external calendar buffers should block free-time windows")}
  let externalWindows=getFreeWindows(planningDate,{now:planningNow});
  if(externalWindows.some(window=>window.start<675&&window.end>585)){throw new Error("external calendar events should be subtracted from free windows")}
  const privateEvent=normalizeExternalEvent({id:"private",calendarId:"work-cal",summary:"Dentist",location:"Clinic",start:{dateTime:makeIso(10)},end:{dateTime:makeIso(11)},status:"confirmed"},{provider:"google",privacy:{storeEventTitles:false},preferences:{defaultTravelBeforeMinutes:0,defaultTravelAfterMinutes:0,eventTravelOverrides:{}}});
  if(privateEvent.title!=="Busy"||privateEvent.location){throw new Error("privacy mode should hide external calendar details")}
  const publicEvent=normalizeExternalEvent({id:"public",calendarId:"work-cal",summary:"Dentist",location:"Clinic",start:{dateTime:makeIso(10)},end:{dateTime:makeIso(11)},status:"confirmed"},{provider:"google",privacy:{storeEventTitles:true},preferences:{defaultTravelBeforeMinutes:0,defaultTravelAfterMinutes:0,eventTravelOverrides:{}}});
  if(publicEvent.title!=="Dentist"||publicEvent.location!=="Clinic"){throw new Error("privacy opt-in should preserve external calendar details")}
  const allDay=normalizeExternalEvent({id:"all",calendarId:"work-cal",summary:"OOO",start:{date:externalDay},end:{date:dayKey(nextPlanningDate)},status:"confirmed"},{provider:"google",privacy:{storeEventTitles:true},preferences:{allDayBlocksPlanning:false,defaultTravelBeforeMinutes:0,defaultTravelAfterMinutes:0,eventTravelOverrides:{}}});
  state.externalCalendars.google.events=[allDay];
  state.externalCalendars.google.preferences.allDayBlocksPlanning=false;
  if(!getFreeWindows(planningDate,{now:planningNow}).length){throw new Error("all-day events should be optional blockers")}
  state.externalCalendars.google.preferences.allDayBlocksPlanning=true;
  if(getFreeWindows(planningDate,{now:planningNow}).length){throw new Error("all-day events should block planning when enabled")}
  const range=externalCalendarSyncRange(planningDate,state.externalCalendars.google);
  const merged=mergeExternalCalendarEvents([{id:"old",provider:"google",calendarId:"work-cal",title:"Old",start:makeIso(8),end:makeIso(9),allDay:false,busy:true,transparency:"opaque",updatedAt:makeIso(7),importedAt:makeIso(7)}],[{id:"old",calendarId:"work-cal",status:"cancelled"},{id:"new",calendarId:"work-cal",summary:"New",start:{dateTime:makeIso(9)},end:{dateTime:makeIso(9,30)},status:"confirmed",updated:makeIso(8)}],{rangeStart:range.start,rangeEnd:range.end,provider:"google",config:externalCalendarConfig()});
  if(merged.some(event=>event.id==="old")||!merged.some(event=>event.id==="new")){throw new Error("calendar merge should apply changed and deleted events")}
  state.externalCalendars.google.events=[{id:"cached",provider:"google",calendarId:"work-cal",title:"Cached",start:makeIso(9),end:makeIso(9,30),allDay:false,busy:true,transparency:"opaque",updatedAt:makeIso(8),importedAt:makeIso(8)}];
  state.externalCalendars.google.lastAttemptAt=null;
  const cachedLength=state.externalCalendars.google.events.length;
  const failed=await syncExternalCalendars({force:true,provider:{getCalendars:async()=>state.externalCalendars.google.calendars,getEvents:async()=>{throw new Error("offline")}}});
  if(!failed.error||state.externalCalendars.google.events.length!==cachedLength){throw new Error("sync errors should retain stale calendar cache")}
  state.externalCalendars.google.lastSyncError=null;
  state.externalCalendars.google.lastAttemptAt=new Date().toISOString();
  const throttled=await syncExternalCalendars({provider:{getCalendars:async()=>[],getEvents:async()=>[]}});
  if(!throttled.throttled){throw new Error("manual calendar sync should be throttled unless forced")}
  state.externalCalendars.google.lastAttemptAt=null;
  state.externalCalendars.google.preferences.allDayBlocksPlanning=false;
  state.externalCalendars.google.events=[{id:"cached",provider:"google",calendarId:"work-cal",title:"Cached",start:makeIso(10),end:makeIso(10,30),allDay:false,busy:true,transparency:"opaque",updatedAt:makeIso(8),importedAt:makeIso(8)}];
  state.dailyPlan={date:externalDay,minutes:60,items:[{type:"item",id:"course-a",title:"Focus",minutes:30,startMinute:600,endMinute:630,startTime:"10:00",endTime:"10:30"}],freeWindows:[],availableMinutes:0,notices:[]};
  if(!planConflictsForDate(planningDate).length){throw new Error("stale daily plans should warn on external calendar conflicts")}
  calendarCursor=new Date(planningDate);
  calendarFilters={routine:true,external:false,plan:false,completed:false};
  renderCalendar();
  if($("calendarGrid").innerHTML.includes("Externo")){throw new Error("calendar filters should hide external events")}
  calendarFilters.external=true;
  renderCalendar();
  if(!$("calendarGrid").innerHTML.includes("Externo")){throw new Error("calendar filters should show external events")}
  state=structuredClone(seededFresh);
  renderHomeTracks();
  state.activeTrack="track-electronics";
  expandedCourseId="course-elec-08";
  renderTracks();
  if(!$("trackHero").innerHTML.includes("Progressão: sequencial")){throw new Error("track hero should explain sequential progression")}
  if(!$("trackCourses").innerHTML.includes("Estudar mesmo assim")){throw new Error("locked future curriculum should remain viewable with explicit override")}
  if(!$("trackCourses").innerHTML.includes("openFichamentoForSource")||!$("trackCourses").innerHTML.includes("openNotes")){throw new Error("locked curriculum should keep notes and fichamentos available")}
  if(!$("trackCourses").innerHTML.includes("module-elec-08-01")){throw new Error("expanded future courses should render module summaries for navigation")}
  if($("trackCourses").innerHTML.includes("lesson-elec-08-01-01")){throw new Error("collapsed future modules should not render hidden lesson controls")}
  const futureMenuCount=($("trackCourses").innerHTML.match(/class="row-menu"/g)||[]).length;
  if(futureMenuCount>20){throw new Error("collapsed future curriculum should not render a dense hidden action menu stack")}
  const activeCourse=state.items.find(i=>i.id==="course-elec-01");
  expandedCourseId=activeCourse.id;
  renderTracks();
  const activeHtml=$("trackCourses").innerHTML;
  if(!activeHtml.includes("Módulo atual: MCU Background and Analysis")){throw new Error("course rows should show the current module")}
  if(!activeHtml.includes("module-elec-01-01")||!activeHtml.includes("module journey-module journey-active")){throw new Error("the active module should be expanded by default")}
  if(!activeHtml.includes("primary-action")){throw new Error("continue actions should use the primary action sizing class")}
  expandedCourseId="course-elec-08";
  renderTracks();
  if(resourceByScope("module-elec-08-01","module").sourceType!=="module"){throw new Error("module resources should be addressable by scope")}
  if(resourceByScope("lesson-elec-08-01-01","lesson").sourceType!=="lesson"){throw new Error("lesson resources should be addressable by scope")}
  const elec08=state.items.find(i=>i.id==="course-elec-08");
  elec08.modules[0].lessons[0].progress=100;
  elec08.modules[0].lessons[0].done=true;
  if(moduleProgress(elec08.modules[0])!==20||itemProgress(elec08)<=0){throw new Error("course progress should derive from lesson and module progress")}
  const elec01=state.items.find(i=>i.id==="course-elec-01");
  const elec02ForSequence=state.items.find(i=>i.id==="course-elec-02");
  elec01.modules.forEach(module=>{module.lessons.forEach(lesson=>{lesson.progress=100;lesson.done=true;lesson.status="concluido"});module.progress=100;module.done=true;module.status="concluido"});
  elec01.progress=itemProgress(elec01);elec01.status=statusFromProgress(elec01.progress);
  if(courseSequenceState(elec02ForSequence)!=="active"){throw new Error("completing a course should unlock the next course in the track")}
  state.items.filter(i=>i.track==="track-electronics"&&i.kind==="course"&&courseOrderValue(i)<courseOrderValue(elec08)).forEach(course=>{course.modules.forEach(module=>{module.lessons.forEach(lesson=>{lesson.progress=100;lesson.done=true;lesson.status="concluido"});module.progress=100;module.done=true;module.status="concluido"});(course.childCourses||[]).forEach(child=>{child.progress=100;child.status="concluido";child.done=true});course.progress=100;course.status="concluido";course.done=true});
  expandedCourseId=elec08.id;
  renderTracks();
  if(!$("trackCourses").innerHTML.includes("lesson-elec-08-01-01")){throw new Error("the active module should render its lesson rows")}
  if($("trackCourses").innerHTML.includes("lesson-elec-08-02-01")){throw new Error("inactive modules should stay collapsed without hidden lesson rows")}
  if(moduleSequenceState(elec08,elec08.modules[1])!=="locked"){throw new Error("later modules should be locked until the active module is complete")}
  if(elec08.modules[0].lessons[1]&&lessonSequenceState(elec08,elec08.modules[0],elec08.modules[0].lessons[1])!=="active"){throw new Error("lesson completion should unlock the next lesson in the same module")}
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
  if(!$("homeKnowledge").innerHTML.includes("openKnowledgeObject('note-perm')")){throw new Error("recent permanent notes should navigate through the unified knowledge action")}
  if(!$("homeKnowledge").innerHTML.includes("openKnowledgeObject('fic-1')")){throw new Error("recent fichamentos should navigate through the unified knowledge action")}
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
  if(state.tracks[0].progression!=="sequential"){throw new Error("new tracks should default to sequential progression")}
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
