import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { loadVisualCatalog } from "../dist/visuals.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const npm = process.env.npm_execpath;
if (!npm) throw new Error("Run this script with npm run verify:package.");
const catalog = await loadVisualCatalog();
const packDestination = path.resolve(root, process.env.npm_config_pack_destination ?? ".");
const [artifact] = JSON.parse(execFileSync(process.execPath, [
  npm, "pack", "--ignore-scripts", "--json", "--pack-destination", packDestination,
], { cwd: root, encoding: "utf8" }));
assert.ok(artifact?.filename && path.basename(artifact.filename) === artifact.filename);
const tarball = path.join(packDestination, artifact.filename);
const packed = new Set(artifact.files.map(file => file.path));
for (const file of [
  "content/guides/layout.md", "content/design-cautions.md", "content/provenance.json",
  "content/library/index.json", "content/examples/modal-dialog.html", "content/design-reuse.json",
  "designs/index.html", "docs/design-inventory.md", "docs/platform-adoption.md", "docs/mcp-workflows.md",
  "content/technology-options.json", "docs/technology-catalog.md",
  "content/analyses/halftone-talking-heads-study.json", "content/analysis-template.json", "content/analysis.schema.json",
  "content/analysis-exclusions.json", "docs/analyses/README.md", "docs/analyses/halftone-talking-heads-study.md",
  "docs/analyses/elements/design-preferences.md", "docs/recording-analyses.md",
]) assert.ok(packed.has(file), file);
assert.ok(!packed.has("content/analyses/boxing-arena-study.json"));
assert.ok(!packed.has("docs/analyses/boxing-arena-study.md"));
for (const { document } of catalog.analyses.list().logs) assert.ok(packed.has(document), document);
for (const source of catalog.sources.values()) {
  assert.equal(packed.has(source.path), source.distribution === "bundled", source.path);
}
for (const asset of catalog.reuse.assets) {
  for (const file of asset.paths) assert.equal(packed.has(file), asset.distribution === "bundled", file);
}
assert.ok([...packed].every(file =>
  !file.startsWith("node_modules/") && !file.startsWith("reference/") &&
  (!file.startsWith("designs/celebration/") || file === "designs/celebration/README.md")), "Private birthday sources and original media must never ship");
const fixture = await mkdtemp(path.join(tmpdir(), "design-mcp-package-"));
try {
  execFileSync(process.execPath, [
    npm, "install", "--prefix", fixture, "--ignore-scripts", "--omit=dev",
    "--no-audit", "--no-fund", "--package-lock=false", tarball,
  ], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  const installed = path.join(fixture, "node_modules/@acertainromance401/design-mcp");
  const installedCatalog = await loadVisualCatalog(new URL(`${installed}/`, "file:"));
  for (const source of catalog.sources.values()) {
    if (source.distribution === "local-only") {
      assert.equal(installedCatalog.sources.get(source.path).text, null, source.path);
      continue;
    }
    assert.deepEqual(await readFile(path.join(installed, source.path)), await readFile(path.join(root, source.path)));
  }
  for (const asset of catalog.reuse.assets.filter(item => item.distribution === "bundled")) {
    for (const file of asset.paths) assert.deepEqual(await readFile(path.join(installed, file)), await readFile(path.join(root, file)));
  }
  for (const entry of installedCatalog.entries.filter(item => item.distribution === "bundled")) {
    const text = installedCatalog.get({ id: entry.id, includeSource: true }).source;
    const base = new URL(entry.path, new URL(`${installed}/`, "file:"));
    for (const [, target] of text.matchAll(/(?:src|href)=["'](\.\.?\/[^"'#]+)(?:#[^"']*)?["']/gu)) {
      await readFile(new URL(target, base));
    }
  }
  const client = new Client({ name: "design-mcp-package-check", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath, args: [path.join(installed, "dist/index.js")], cwd: fixture, stderr: "pipe",
  });
  let stderr = "";
  transport.stderr?.on("data", chunk => { stderr += chunk.toString(); });
  try {
    await client.connect(transport);
    assert.match(client.getInstructions(), /FIRST read design:\/\/design-cautions/u);
    const cautions = await client.readResource({ uri: "design://design-cautions" });
    assert.match(cautions.contents[0].text, /사용자가 제공하는 예시는 마음에 드는 디자인으로 받아들인다/u);
    const result = await client.callTool({ name: "get_design_pattern", arguments: {
      id: "layout.content-width", includeSourceExample: true,
    } });
    assert.equal(result.isError, undefined);
    assert.equal(result.structuredContent.designCautions.document, cautions.contents[0].text);
    assert.match(result.structuredContent.sourceExample, /enum EditorialLayout/u);
    const general = await client.callTool({ name: "get_design_pattern", arguments: {
      id: "overlay.modal-dialog", platform: "web", includeSourceExample: true,
    } });
    assert.match(general.structuredContent.sourceExample, /showModal/u);
    const counts = await client.callTool({ name: "list_design_categories", arguments: {} });
    assert.equal(counts.structuredContent.patternCount, 186);
    assert.equal(counts.structuredContent.visualExamples.exampleCount, 21);
    assert.deepEqual(counts.structuredContent.visualExamples.technologyLibrary, catalog.technologies.index());
    const technologySearch = await client.callTool({ name: "search_design_technologies", arguments: {
      query: "Blender", status: "candidate", limit: 1,
    } });
    assert.equal(technologySearch.isError, undefined);
    assert.equal(technologySearch.structuredContent.results[0].id, "blender");
    const webgpu = await client.readResource({ uri: "design://technologies/webgpu" });
    assert.equal(JSON.parse(webgpu.contents[1].text).status, "candidate");
    const searchAnalysis = await client.callTool({ name: "search_design_analyses", arguments: {
      query: "#f2efec", axis: "color", scope: "preferred",
    } });
    assert.equal(searchAnalysis.isError, undefined);
    assert.equal(searchAnalysis.structuredContent.results[0].id, "halftone-talking-heads-study");
    const savedAnalysis = await client.callTool({ name: "get_design_analysis", arguments: { id: "halftone-talking-heads-study" } });
    assert.equal(savedAnalysis.structuredContent.typography.fonts[0].renderedFamily, null);
    assert.equal(savedAnalysis.structuredContent.designCautions.document, cautions.contents[0].text);
    const preferences = await client.callTool({ name: "get_design_preferences", arguments: { contextKey: "digital-visuals" } });
    assert.deepEqual(preferences.structuredContent.principles.map(item => [item.key, item.weight]), [["warm-muted-graphics", "tentative"]]);
    const rejected = await client.callTool({ name: "get_design_analysis", arguments: { id: "boxing-arena-study" } });
    assert.equal(rejected.structuredContent.error.code, "UNKNOWN_ANALYSIS");
    const analysisGuide = await client.readResource({ uri: "design://analysis-workflow" });
    assert.match(analysisGuide.contents[1].text, /analysis:save/u);
    for (const { id } of counts.structuredContent.visualExamples.examples) {
      const { structuredContent: visual, isError } = await client.callTool({ name: "get_design_visual", arguments: { id, includeSource: true } });
      assert.equal(isError, undefined);
      if (id === "birthday") {
        assert.equal(visual.sourceAvailable, false);
        assert.equal(visual.source, null);
        assert.match(visual.sourceNotice, /LOCAL_ONLY_SOURCE_UNAVAILABLE/u);
      } else {
        assert.equal(visual.sourceAvailable, true);
        assert.match(visual.source, /^<!doctype html>/iu);
      }
    }
    const plan = await client.callTool({ name: "create_visual_adoption_plan", arguments: {
      visualIds: ["ascii-character"], platform: "metal", projectType: "existing",
    } });
    assert.equal(plan.isError, undefined);
    assert.match(plan.structuredContent.platform.requirements.join(" "), /MTKView/u);
    const module = await client.readResource({ uri: "design://source-files/designs/characters/assets/ascii/renderer.js" });
    assert.match(module.contents[1].text, /ASCII_SHADER/u);
    await assert.rejects(client.readResource({ uri: "design://source-files/designs/celebration/birthday.html" }));
    assert.equal(stderr, "");
    console.log(`PASS: installed ${artifact.filename} in an isolated directory; 21 designs, saved analysis search/detail, Metal plan, source modules and private-asset exclusions verified.`);
    console.log(`Reusable package: ${tarball}`);
  } finally {
    await client.close();
  }
} finally {
  await rm(fixture, { recursive: true, force: true });
}
