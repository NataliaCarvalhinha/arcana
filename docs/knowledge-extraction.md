# Knowledge Extraction Pipeline

Arcana extracts knowledge only after the raw Focus Circle session note has been saved. The saved session note remains the source of truth, and extraction is a review workflow, not an automatic rewrite.

## Flow

1. Focus Circle records raw notes and structured semantic blocks.
2. Completing focus saves a session note with `knowledgeExtractionStatus: "pending"`.
3. Arcana opens `knowledgeExtractionDialog` with the original notes on the left and suggested candidates on the right.
4. The user can edit, reject, merge, add candidates manually, save a draft, skip, or save approved knowledge.
5. Saving approved knowledge creates or updates notes/fichamento sections and marks the session as `completed`.

## Providers

The default provider is `LOCAL_KNOWLEDGE_EXTRACTION_PROVIDER`, implemented by `KnowledgeExtractionProvider` with id `local-semantic-blocks`.

It uses:

- structured focus blocks;
- simple local marker parsing from the raw note text;
- title/content normalization for dedupe suggestions.

Arcana also has a structured `AIKnowledgeExtractionProvider`. It is optional and is never selected unless the user enables `AI` in Settings > Extração de conhecimento.

Provider behavior:

- local semantic extraction always runs first;
- AI output is combined after local suggestions, so semantic/manual source blocks win dedupe conflicts;
- if AI fails, the review remains usable with local suggestions, retry, and manual organization;
- tests use `MockAIKnowledgeExtractionProvider`, not paid or live AI APIs;
- no OpenAI, Anthropic, Gemini, or other paid endpoint is hardcoded.

## AI Safety Contract

AI extraction sends only a minimal payload:

- `session`: id, title, and duration;
- `resource`: id, title, type, URL, and course context;
- `rawNotes`: the saved session note text;
- `semanticBlocks`: structured blocks from the session.

The prompt instructs the provider to organize only what is supported by the notes, without inventing external facts, corrections, or expansions. The validated response schema is:

- `concepts`
- `permanentNotes`
- `questions`
- `nextActions`
- `quotes`
- `examples`
- `formulasCommands`
- `people`
- `connections`

Production static deploys should use a secure same-origin proxy such as `/api/knowledge-extraction`. Browser-entered development credentials are session-only and are not saved to IndexedDB, backups, Obsidian exports, Git, service worker assets, or app state. Portable exports strip knowledge-extraction secret-shaped fields defensively.

## Candidate Types

Supported review candidates:

- `concept`
- `permanent-note`
- `question`
- `quote`
- `example`
- `formula-command`
- `next-action`

Approved concepts, permanent notes, questions, quotes, examples, and formulas can create or update knowledge notes. Next actions can be routed to Inbox or saved as knowledge. The managed fichamento section links the approved extracted notes and records the next actions that came from the session.

## Provenance

Extracted candidates carry `sourceReferences` with session/resource metadata:

- `sessionId`
- `resourceId`
- `sourceId`
- `sourceTitle`
- `sourceTimestamp`
- `sourcePage`
- `sourceExcerpt`

When a candidate updates an existing note, Arcana merges source references additively.

## Dedupe

Knowledge notes dedupe by normalized title and aliases. Normalization lowercases text, removes diacritics, and collapses whitespace. The review UI can also show an explicit existing-note selector when a match is found.

When a session already promoted candidates, retry output filters those accepted note ids out of the candidate list. Extraction metadata records provider id, model, schema version, extraction timestamp, and `sourceNotesUpdatedAt`, so the UI can warn when source notes changed after the last extraction.

## Review States

The review dialog supports:

- loading while suggestions are generated;
- empty local/AI result;
- AI failure with local fallback;
- retrying automatic suggestions;
- manual candidate creation;
- category tabs for concepts, ideas, questions, evidence, and actions.

## Obsidian Export

Arcana exports provenance and related-knowledge links in managed sections:

```markdown
<!-- ARCANA:START arcana-sources -->
## Fontes Arcana
...
<!-- ARCANA:END arcana-sources -->
```

Fichamento extraction output is also stored in Arcana-managed sections, so future extraction saves update only those sections instead of overwriting user-authored content.

## Tests

Run:

```bash
node --check app.js
node --check db.js
node --check service-worker.js
node tests/static-tests.mjs
node tests/data-safety-tests.mjs
node tests/knowledge-extraction-tests.mjs
git diff --check
```
