import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const npm = process.env.npm_execpath;
if (!npm) throw new Error("Run this script with npm run verify:package.");
const packed = JSON.parse(execFileSync(process.execPath, [
  npm, "pack", "--ignore-scripts", "--json",
], { cwd: root, encoding: "utf8" }));
const [artifact] = packed;
assert.ok(artifact?.filename && path.basename(artifact.filename) === artifact.filename);
assert.ok(artifact.files.some(({ path }) => path === "content/guides/layout.md"));
assert.ok(artifact.files.some(({ path }) => path === "content/provenance.json"));
assert.ok(artifact.files.some(({ path }) => path === "content/library/index.json"));
assert.ok(artifact.files.some(({ path }) => path === "content/examples/modal-dialog.html"));
for (const file of ["boxing-overhead.html", "boxing-vintage.html", "boxing-arena.html", "boxing-references.md", "sports-collage.html", "sports-collage.md", "assets/sports-soccer-cc0.jpg", "aesthetic.html", "black-editorial.html", "black-minimal.html", "high-energy.html", "color-combinations.html", "color-combinations.md", "mood-examples.html", "mood-examples.md", "screen-effects.html", "screen-effects.md"]) {
  assert.ok(artifact.files.some(({ path }) => path === `docs/${file}`), file);
}
assert.ok(artifact.files.every(({ path }) => !path.startsWith("node_modules/")));
const fixture = await mkdtemp(path.join(tmpdir(), "design-mcp-package-"));
try {
  execFileSync(process.execPath, [
    npm, "install", "--prefix", fixture, "--ignore-scripts", "--omit=dev",
    "--no-audit", "--no-fund", "--package-lock=false", path.join(root, artifact.filename),
  ], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  const client = new Client({ name: "design-mcp-package-check", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(fixture, "node_modules/@acertainromance401/design-mcp/dist/index.js")],
    cwd: fixture,
    stderr: "pipe",
  });
  let stderr = "";
  transport.stderr?.on("data", (chunk) => { stderr += chunk.toString(); });
  try {
    await client.connect(transport);
    const result = await client.callTool({ name: "get_design_pattern", arguments: {
      id: "layout.content-width", includeSourceExample: true,
    } });
    assert.equal(result.isError, undefined);
    assert.match(result.structuredContent.sourceExample, /enum EditorialLayout/u);
    const general = await client.callTool({ name: "get_design_pattern", arguments: {
      id: "overlay.modal-dialog", platform: "web", includeSourceExample: true,
    } });
    assert.match(general.structuredContent.sourceExample, /showModal/u);
    const counts = await client.callTool({ name: "list_design_categories", arguments: {} });
    assert.equal(counts.structuredContent.patternCount, 186);
    assert.equal(counts.structuredContent.visualExamples.exampleCount, 11);
    for (const { id } of counts.structuredContent.visualExamples.examples) {
      const visual = await client.callTool({ name: "get_design_visual", arguments: { id, includeSource: true } });
      assert.equal(visual.isError, undefined);
      assert.match(visual.structuredContent.source, /^<!doctype html>/iu);
    }
    const visuals = await client.callTool({ name: "search_design_visuals", arguments: { query: "배색" } });
    assert.ok(visuals.structuredContent.results.some(({ id }) => id === "mood-examples"));
    const resource = await client.readResource({ uri: "design://visual-files/screen-effects.md" });
    assert.match(resource.contents[0].text, /design:\/\/visual-files\/screen-effects.html/u);
    assert.equal(stderr, "");
    console.log(`PASS: installed ${artifact.filename} in an isolated directory; real MCP lookup succeeded.`);
    console.log(`Reusable package: ${path.join(root, artifact.filename)}`);
  } finally {
    await client.close();
  }
} finally {
  await rm(fixture, { recursive: true, force: true });
}
