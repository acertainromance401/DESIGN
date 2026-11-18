import { execFileSync } from "node:child_process";
import { link, readFile, rename, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { analysisSchema, loadAnalysisCatalog } from "../dist/analyses.js";
import { loadReuseData } from "../dist/reuse.js";
import { loadVisualCatalog } from "../dist/visuals.js";

const root = new URL("../", import.meta.url);

export async function saveAnalysisRecord(input, { replace = false, directory = root } = {}) {
  const record = analysisSchema.parse(input);
  const reuse = await loadReuseData(directory);
  const visualIds = new Set(reuse.designs.map(item => item.id));
  if (record.visualId && !visualIds.has(record.visualId)) throw new Error(`Unknown analysis visual ID: ${record.visualId}`);
  const catalog = await loadAnalysisCatalog(directory, visualIds);
  catalog.assertEligible(record);
  const previous = catalog.entries.find(item => item.id === record.id);
  if (previous && !replace) throw new Error(`Analysis "${record.id}" already exists. Use --replace for an intentional update.`);
  if (!previous && replace) throw new Error(`Cannot replace missing analysis "${record.id}". Save without --replace.`);
  if (previous && (record.createdAt !== previous.createdAt || record.updatedAt < previous.updatedAt)) {
    throw new Error("Keep createdAt unchanged and do not move updatedAt backwards when replacing an analysis.");
  }
  const target = new URL(`content/analyses/${record.id}.json`, directory);
  const temporary = new URL(`.${record.id}-${randomUUID()}.tmp`, target);
  try {
    await writeFile(temporary, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
    if (previous) await rename(temporary, target);
    else await link(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
  return target;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "check" && args.length === 0) {
    const catalog = await loadVisualCatalog(root);
    console.log(`Validated ${catalog.analyses.entries.length} saved analyses and the draft template.`);
    execFileSync(process.execPath, [fileURLToPath(new URL("./build-design-docs.mjs", import.meta.url)), "--check"], { stdio: "inherit" });
    return;
  }
  let input;
  let replace = false;
  if (command === "new" && args.length === 1) {
    const template = JSON.parse(await readFile(new URL("content/analysis-template.json", root), "utf8"));
    const today = new Date().toISOString().slice(0, 10);
    input = { ...template, id: args[0], createdAt: today, updatedAt: today };
  } else if (command === "save" && args[0] && (args.length === 1 || (args.length === 2 && args[1] === "--replace"))) {
    input = JSON.parse(await readFile(resolve(args[0]), "utf8"));
    replace = args[1] === "--replace";
  } else {
    throw new Error("Usage: new <id> | save <input.json> [--replace] | check. Use npm run analysis:new / analysis:save / analysis:check.");
  }
  const target = await saveAnalysisRecord(input, { replace });
  console.log(`Saved ${fileURLToPath(target)}. Generating reports; restart the MCP process after editing.`);
  execFileSync(process.execPath, [fileURLToPath(new URL("./build-design-docs.mjs", import.meta.url))], { stdio: "inherit" });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
