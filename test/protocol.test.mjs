import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

test("real stdio client discovers and calls tools, resources and prompts from an unrelated cwd", { timeout: 20000 }, async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "design-mcp-client-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [fileURLToPath(new URL("../dist/index.js", import.meta.url))],
    cwd: directory,
    stderr: "pipe",
  });
  let stderr = "";
  transport.stderr?.on("data", (chunk) => { stderr += chunk.toString(); });
  const client = new Client({ name: "design-mcp-test", version: "1.0.0" });
  t.after(() => client.close());
  await client.connect(transport);
  const { tools } = await client.listTools();
  assert.equal(tools.length, 6);
  assert.ok(tools.every(({ annotations }) => annotations.readOnlyHint && !annotations.openWorldHint));
  const categories = await client.callTool({ name: "list_design_categories", arguments: {} });
  assert.equal(categories.structuredContent.categories.length, 36);
  assert.equal(categories.structuredContent.patternCount, 186);
  const search = await client.callTool({
    name: "search_design_patterns", arguments: { query: "반응형 레이아웃", category: "layout", limit: 2 },
  });
  assert.equal(search.structuredContent.results.length, 2);
  const pattern = await client.callTool({
    name: "get_design_pattern",
    arguments: { id: "layout.content-width", platform: "swiftui", includeSourceExample: true },
  });
  assert.match(pattern.structuredContent.sourceExample, /enum EditorialLayout/u);
  const web = await client.callTool({
    name: "get_design_pattern",
    arguments: { id: "layout.content-width", platform: "web", includeSourceExample: true },
  });
  assert.equal(web.structuredContent.sourceExample, null);
  const plan = await client.callTool({
    name: "create_design_adoption_plan",
    arguments: { objective: "기존 앱 반응형 개선", projectType: "existing", patternIds: ["layout.content-width"] },
  });
  assert.equal(plan.structuredContent.projectType, "existing");
  const unknown = await client.callTool({ name: "get_design_pattern", arguments: { id: "missing.pattern" } });
  assert.equal(unknown.isError, true);
  assert.equal(unknown.structuredContent.error.code, "UNKNOWN_PATTERN");
  const invalid = await client.callTool({ name: "search_design_patterns", arguments: { query: " ", limit: 99 } });
  assert.equal(invalid.isError, true);
  const { resources } = await client.listResources();
  assert.equal(resources.length, 241);
  assert.equal(categories.structuredContent.visualExamples.exampleCount, 11);
  const visuals = await client.callTool({ name: "search_design_visuals", arguments: { query: "시트 쉬머" } });
  assert.ok(visuals.structuredContent.results.some(({ id }) => id === "screen-effects"));
  const visual = await client.callTool({ name: "get_design_visual", arguments: { id: "screen-effects", includeSource: true } });
  assert.match(visual.structuredContent.source, /dialog\.showModal/u);
  assert.match(visual.structuredContent.guide, /32개/u);
  const unknownVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "missing" } });
  assert.equal(unknownVisual.isError, true);
  assert.equal(unknownVisual.structuredContent.error.code, "UNKNOWN_VISUAL");
  const visualHtml = await client.readResource({ uri: "design://visual-files/mood-examples.html" });
  assert.equal(visualHtml.contents[0].mimeType, "text/html");
  assert.match(visualHtml.contents[0].text, /music-violet/u);
  const visualIndex = await client.readResource({ uri: "design://visual-examples" });
  assert.equal(JSON.parse(visualIndex.contents[0].text).fileCount, 16);
  const compactVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "mood-examples" } });
  assert.equal(compactVisual.structuredContent.source, null);
  assert.match(compactVisual.structuredContent.guide, /18가지를/u);
  const invalidVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "../package" } });
  assert.equal(invalidVisual.isError, true);
  const invalidVisualSearch = await client.callTool({ name: "search_design_visuals", arguments: { query: " " } });
  assert.equal(invalidVisualSearch.isError, true);
  for (const file of ["color-combinations.md", "mood-examples.md", "screen-effects.md"]) {
    const guide = await client.readResource({ uri: `design://visual-files/${file}` });
    for (const [, uri] of guide.contents[0].text.matchAll(/\]\((design:\/\/visual-files\/[^)]+)\)/gu)) {
      const linked = await client.readResource({ uri });
      assert.equal(linked.contents.length, 1);
    }
  }
  const resource = await client.readResource({ uri: "design://patterns/layout.content-width" });
  assert.equal(JSON.parse(resource.contents[0].text).id, "layout.content-width");
  const guide = await client.readResource({ uri: "design://guides/layout" });
  assert.match(guide.contents[0].text, /반응형 배치/u);
  await assert.rejects(client.readResource({ uri: "design://guides/not-bundled" }));
  const { prompts } = await client.listPrompts();
  assert.equal(prompts.length, 2);
  const prompt = await client.getPrompt({
    name: "update_project_design", arguments: { objective: "웹 화면 개선", platform: "web" },
  });
  assert.match(prompt.messages[0].content.text, /Preserve existing behavior/u);
  assert.match(prompt.messages[0].content.text, /validation\/limitations/u);
  const general = await client.callTool({
    name: "get_design_pattern",
    arguments: { id: "overlay.modal-dialog", platform: "web", includeSourceExample: true },
  });
  assert.match(general.structuredContent.sourceExample, /showModal/u);
  assert.equal(general.structuredContent.sourceKind, "general");
  assert.equal(general.structuredContent.example.validation, "browser-tested");
  const withExamples = await client.callTool({
    name: "search_design_patterns",
    arguments: { query: "dialog", platform: "web", source: "general", hasExample: true },
  });
  assert.ok(withExamples.structuredContent.results.some(({ id }) => id === "overlay.modal-dialog"));
  assert.equal(stderr, "");
});
