import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

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
assert.match(app, /ArcanaStorage\.init/, "IndexedDB init is wired");
assert.match(app, /sincronização automática precisa do Arcana Local/, "static YouTube limitation is explicit");
assert.match(app, /function exportPlaylistFile/, "playlist JSON export is available");

const worker = readFileSync("service-worker.js", "utf8");
assert.match(worker, /caches\.open/, "service worker caches app shell");
assert.ok(!/youtube\.com|youtu\.be/.test(worker), "service worker does not cache YouTube");

console.log("static checks passed");
