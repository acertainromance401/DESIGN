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
  assert.equal(tools.length, 4);
  assert.ok(tools.every(({ annotations }) => annotations.readOnlyHint && !annotations.openWorldHint));
  const categories = await client.callTool({ name: "list_design_categories", arguments: {} });
  assert.equal(categories.structuredContent.categories.length, 14);
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
  assert.equal(resources.length, 64);
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
  assert.match(prompt.messages[0].content.text, /no web implementation examples/u);
  assert.equal(stderr, "");
});
