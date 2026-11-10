import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

function assertCautions(result) {
  const { designCautions } = result.structuredContent;
  assert.equal(Object.keys(result.structuredContent)[0], "designCautions");
  assert.equal(designCautions.uri, "design://design-cautions");
  assert.equal(designCautions.requiredBeforeDesign, true);
  for (const phrase of [
    "박스형 디자인", "세로줄 포인트", "장식용 대각선 화살표", "실제 렌더링",
    "모든 프로젝트에서 항상 적용하는 디자인 규칙", "선택·배치·구현·수정·검수",
  ]) {
    assert.ok(designCautions.document.includes(phrase), phrase);
  }
  assert.deepEqual(JSON.parse(result.content[0].text), result.structuredContent);
}

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
  assert.match(client.getInstructions(), /FIRST read design:\/\/design-cautions/u);
  assert.match(client.getInstructions(), /every design element in every project/u);
  // A client may request a visual before discovering categories.
  const firstLookup = await client.callTool({ name: "get_design_visual", arguments: { id: "black-minimal" } });
  assertCautions(firstLookup);
  const { tools } = await client.listTools();
  assert.equal(tools.length, 6);
  assert.ok(tools.every(({ annotations }) => annotations.readOnlyHint && !annotations.openWorldHint));
  const categories = await client.callTool({ name: "list_design_categories", arguments: {} });
  assertCautions(categories);
  assert.equal(categories.structuredContent.categories.length, 36);
  assert.equal(categories.structuredContent.patternCount, 186);
  const search = await client.callTool({
    name: "search_design_patterns", arguments: { query: "반응형 레이아웃", category: "layout", limit: 2 },
  });
  assertCautions(search);
  assert.equal(search.structuredContent.results.length, 2);
  const pattern = await client.callTool({
    name: "get_design_pattern",
    arguments: { id: "layout.content-width", platform: "swiftui", includeSourceExample: true },
  });
  assertCautions(pattern);
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
  assertCautions(plan);
  assert.equal(plan.structuredContent.projectType, "existing");
  const unknown = await client.callTool({ name: "get_design_pattern", arguments: { id: "missing.pattern" } });
  assertCautions(unknown);
  assert.equal(unknown.isError, true);
  assert.equal(unknown.structuredContent.error.code, "UNKNOWN_PATTERN");
  const invalid = await client.callTool({ name: "search_design_patterns", arguments: { query: " ", limit: 99 } });
  assert.equal(invalid.isError, true);
  const { resources } = await client.listResources();
  assert.equal(resources.length, 242);
  assert.equal(resources[0].uri, "design://design-cautions");
  const cautions = await client.readResource({ uri: "design://design-cautions" });
  assert.equal(cautions.contents.length, 1);
  assert.equal(cautions.contents[0].text, firstLookup.structuredContent.designCautions.document);
  for (const { uri } of resources.filter(({ uri }) => uri !== "design://design-cautions")) {
    const result = await client.readResource({ uri });
    assert.equal(result.contents.length, 2, uri);
    assert.equal(result.contents[0].uri, "design://design-cautions", uri);
    assert.equal(result.contents[0].mimeType, "text/markdown", uri);
    assert.equal(result.contents[0].text, cautions.contents[0].text, uri);
    assert.equal(result.contents[1].uri, uri);
  }
  assert.equal(categories.structuredContent.visualExamples.exampleCount, 11);
  const visuals = await client.callTool({ name: "search_design_visuals", arguments: { query: "시트 쉬머" } });
  assertCautions(visuals);
  assert.ok(visuals.structuredContent.results.some(({ id }) => id === "screen-effects"));
  const visual = await client.callTool({ name: "get_design_visual", arguments: { id: "screen-effects", includeSource: true } });
  assertCautions(visual);
  assert.match(visual.structuredContent.source, /dialog\.showModal/u);
  assert.match(visual.structuredContent.guide, /32개/u);
  const unknownVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "missing" } });
  assert.equal(unknownVisual.isError, true);
  assert.equal(unknownVisual.structuredContent.error.code, "UNKNOWN_VISUAL");
  const visualHtml = await client.readResource({ uri: "design://visual-files/mood-examples.html" });
  assert.equal(visualHtml.contents[1].mimeType, "text/html");
  assert.match(visualHtml.contents[1].text, /^<!doctype html>/iu);
  assert.match(visualHtml.contents[1].text, /music-violet/u);
  const visualIndex = await client.readResource({ uri: "design://visual-examples" });
  assert.equal(JSON.parse(visualIndex.contents[1].text).fileCount, 16);
  const compactVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "mood-examples" } });
  assert.equal(compactVisual.structuredContent.source, null);
  assert.match(compactVisual.structuredContent.guide, /18가지를/u);
  const invalidVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "../package" } });
  assert.equal(invalidVisual.isError, true);
  const invalidVisualSearch = await client.callTool({ name: "search_design_visuals", arguments: { query: " " } });
  assert.equal(invalidVisualSearch.isError, true);
  for (const file of ["color-combinations.md", "mood-examples.md", "screen-effects.md"]) {
    const guide = await client.readResource({ uri: `design://visual-files/${file}` });
    for (const [, uri] of guide.contents[1].text.matchAll(/\]\((design:\/\/visual-files\/[^)]+)\)/gu)) {
      const linked = await client.readResource({ uri });
      assert.equal(linked.contents.length, 2);
    }
  }
  const resource = await client.readResource({ uri: "design://patterns/layout.content-width" });
  assert.equal(JSON.parse(resource.contents[1].text).id, "layout.content-width");
  const guide = await client.readResource({ uri: "design://guides/layout" });
  assert.match(guide.contents[1].text, /반응형 배치/u);
  await assert.rejects(client.readResource({ uri: "design://guides/not-bundled" }));
  const { prompts } = await client.listPrompts();
  assert.equal(prompts.length, 2);
  const prompt = await client.getPrompt({
    name: "update_project_design", arguments: { objective: "웹 화면 개선", platform: "web" },
  });
  assert.match(prompt.messages[0].content.text, /Preserve existing behavior/u);
  assert.match(prompt.messages[0].content.text, /validation\/limitations/u);
  for (const name of ["start_design_project", "update_project_design"]) {
    const result = await client.getPrompt({ name, arguments: { objective: "화면 개선", platform: "web" } });
    const text = result.messages[0].content.text;
    assert.ok(text.startsWith("FIRST: Read and apply design://design-cautions"));
    assert.ok(text.indexOf(cautions.contents[0].text) < text.indexOf("Target: web."));
    assert.match(text, /every screen, component, graphic and motion/u);
  }
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
