# Knowledge Extraction Pipeline

Arcana extracts knowledge only after the raw Focus Circle session note has been saved. The saved session note remains the source of truth, and extraction is a review workflow, not an automatic rewrite.

## Flow

1. Focus Circle records raw notes and structured semantic blocks.
2. Completing focus saves a session note with `knowledgeExtractionStatus: "pending"`.
3. Arcana opens `knowledgeExtractionDialog` with the original notes on the left and suggested candidates on the right.
4. The user can edit, reject, merge, add candidates manually, save a draft, skip, or save approved knowledge.
5. Saving approved knowledge creates or updates notes/fichamento sections and marks the session as `completed`.

## Local Provider

The default provider is `LOCAL_KNOWLEDGE_EXTRACTION_PROVIDER`, implemented by `KnowledgeExtractionProvider` with id `local-semantic-blocks`.

It uses:

- structured focus blocks;
- simple local marker parsing from the raw note text;
- title/content normalization for dedupe suggestions.

It does not call OpenAI, Anthropic, Gemini, or any remote AI service.

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
node tests/static-tests.mjs
node tests/knowledge-extraction-tests.mjs
```
