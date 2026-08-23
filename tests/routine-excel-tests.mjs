import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

const sandbox = {
  console,
  Blob,
  TextEncoder,
  TextDecoder,
  Response,
  DecompressionStream: typeof DecompressionStream === "undefined" ? undefined : DecompressionStream
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync("routine-excel.js", "utf8"), sandbox, { filename: "routine-excel.js" });

const excel = sandbox.ArcanaRoutineExcel;
assert.ok(excel, "ArcanaRoutineExcel is exposed");

const workbook = {
  sheets: [
    {
      name: "Rotina",
      rows: [
        ["ID", "Atividade", "Início"],
        ["safe", "=1+1", 0.375],
        ["plus", "+SUM(A1:A2)", "09:00"],
        ["minus", "-literal", "10:00"],
        ["at", "@literal", "11:00"]
      ]
    },
    { name: "Instruções", rows: [["Arcana Routine Format Version", 1]] }
  ]
};

const blob = excel.createWorkbookBlob(workbook);
const buffer = await blob.arrayBuffer();
const binaryText = new TextDecoder().decode(buffer);

assert.doesNotMatch(binaryText, /<f>/, "writer must not emit formula cells");
assert.match(binaryText, /=1\+1/, "formula-like text is stored as text");
assert.match(binaryText, /\+SUM\(A1:A2\)/, "plus-prefixed text is stored as text");

const parsed = await excel.parseWorkbookBuffer(buffer);
assert.equal(parsed.sheets.Rotina.rows[1][1], "=1+1");
assert.equal(parsed.sheets.Rotina.rows[1][2], 0.375);
assert.equal(parsed.sheets.Rotina.rows[2][1], "+SUM(A1:A2)");
assert.equal(parsed.sheets.Rotina.rows[3][1], "-literal");
assert.equal(parsed.sheets.Rotina.rows[4][1], "@literal");

await assert.rejects(
  () => excel.parseWorkbookFile({ name: "bad.xlsm", size: 10, arrayBuffer: async () => buffer }),
  /macros/i
);
await assert.rejects(
  () => excel.parseWorkbookFile({ name: "bad.xlsx", size: 9 * 1024 * 1024, arrayBuffer: async () => buffer }),
  /grande/i
);

console.log("routine Excel workbook checks passed");
