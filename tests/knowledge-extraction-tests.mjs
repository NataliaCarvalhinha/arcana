import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const app = readFileSync("app.js", "utf8");
const db = readFileSync("db.js", "utf8");
const index = readFileSync("index.html", "utf8");

assert.match(app, /class KnowledgeExtractionProvider/, "extraction has a provider boundary");
assert.match(app, /local-semantic-blocks/, "default extraction is local and deterministic");
assert.match(app, /function extractKnowledge/, "knowledge extraction orchestrator exists");
assert.match(app, /extractionCandidateFromBlock/, "focus blocks feed extraction candidates");
assert.match(app, /extractionCandidateFromMarker/, "raw note markers feed extraction candidates");
assert.match(app, /savedSessionNote=await saveFocusDraft\(true/, "raw session notes save before review opens");
assert.match(app, /openKnowledgeExtractionReview\(savedSessionNote/, "focus completion opens review dialog");
assert.match(app, /sourceReferences/, "extracted notes carry provenance");
assert.match(app, /mergeUniqueSourceReferences/, "provenance is merged additively");
assert.match(app, /knowledgeExtractionStatus:"completed"/, "completed reviews update the session status");
assert.match(app, /route==="inbox"/, "next actions can route to inbox");
assert.match(app, /upsertManagedSection/, "extracted fichamento sections are managed");
assert.match(index, /id="knowledgeExtractionDialog"/, "review dialog is in the app shell");
assert.match(index, /data-extraction-add="next-action"/, "manual next-action candidates are available");
assert.match(index, /data-knowledge-tab="permanent"/, "permanent notes have a knowledge tab");
assert.match(db, /function normalizeNoteTitle/, "dedupe normalizes note titles");
assert.match(db, /function noteMatchKeys/, "dedupe includes aliases");
assert.match(db, /sourceReferences/, "stored notes keep source references");
assert.match(db, /ARCANA:START/, "Obsidian exports use managed Arcana sections");
assert.doesNotMatch(app, /openai|anthropic|gemini|gpt-|chat completions/i, "extraction does not call remote AI providers");
