# Arcana Routine Excel

Arcana exports and imports a data-only `.xlsx` workbook for routine planning. It is intentionally separate from full backups and never includes activity logs, notes, fichamentos, Google tokens, calendar caches, Obsidian data, or personal knowledge objects.

## Workbook

Format version: `Arcana Routine Format Version: 1`

Sheets:

- `Rotina`: weekly routine blocks.
- `Hobbies`: optional hobby planning settings.
- `Configuração`: optional planning preferences already supported by Arcana.
- `Instruções`: human-readable format notes.

Unknown sheets and unknown columns are ignored. The `Rotina` sheet is required for import.

## Rotina

Columns:

`ID`, `Atividade`, `Categoria`, `Dias`, `Início`, `Fim`, `Local`, `Endereço`, `Ida (min)`, `Volta (min)`, `Repetição`, `Ativo`, `Observações`

Minimum import headers:

`ID`, `Atividade`, `Dias`, `Início`, `Fim`

Existing IDs update existing blocks. New IDs create blocks. Reimporting an unchanged file produces unchanged counts and does not churn timestamps. Missing rows do not delete data. Use `Ativo=Não` to pause a block.

## Hobbies

Columns:

`ID`, `Hobby`, `Ícone`, `Duração preferida (min)`, `Duração mínima (min)`, `Meta semanal`, `Dias preferidos`, `Horários preferidos`, `Ativo`, `Observações`

Existing IDs update hobbies and preserve session history, `lastDoneAt`, tags, location, and description when those fields are not represented in the workbook. Preferred time ranges use `HH:MM-HH:MM`, separated by commas.

## Compatibility

The workbook writer is a small local OOXML adapter in `routine-excel.js`. It writes inline string cells and numeric cells only, with no formulas, macros, VBA, or external references. `.xlsm` files are rejected and imports are limited to 8 MB.

The generated `.xlsx` files are intended to open in Excel, LibreOffice Calc, and Google Sheets. The parser supports stored ZIP entries and deflated entries through the browser `DecompressionStream` API.
