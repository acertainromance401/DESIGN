import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { loadVisualCatalog } from "../dist/visuals.js";
import { loadCatalog } from "../dist/catalog.js";

const visualCatalog = await loadVisualCatalog();
const patternCatalog = await loadCatalog();

function assertCautions(result) {
  const { designCautions } = result.structuredContent;
  assert.equal(Object.keys(result.structuredContent)[0], "designCautions");
  assert.equal(designCautions.uri, "design://design-cautions");
  assert.equal(designCautions.requiredBeforeDesign, true);
  for (const phrase of [
    "박스형 디자인", "세로줄 포인트", "장식용 대각선 화살표", "실제 렌더링",
    "모든 프로젝트에서 항상 적용하는 디자인 규칙", "선택·배치·구현·수정·검수",
    "색감·레이아웃·폰트를 분리해서 먼저 분석", "### 색감 분석", "### 레이아웃 분석", "### 폰트 분석",
    "CSS 선언만으로 실제 적용 서체를 확정하지 않으며 fallback 여부를 구분",
    "### 분석 결과 축적", "문서 생성·검증에 성공했을 때만 저장 완료",
    "사용자가 제공하는 예시는 마음에 드는 디자인으로 받아들인다",
    "전체 디자인 선호는 확인된 사실로 기록",
    "이후 디자인에서는 관련 선호 레퍼런스를 먼저 찾아",
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
  assert.equal(tools.length, 13);
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
  const availableCount = files => [...files.values()].filter(file => file.text !== null).length;
  assert.equal(resources.length, 5 + patternCatalog.patterns.size + patternCatalog.guides.size +
    availableCount(visualCatalog.files) + availableCount(visualCatalog.sources) +
    visualCatalog.reuse.families.length + visualCatalog.technologies.entries.length + visualCatalog.reuse.platforms.length +
    6 + visualCatalog.analyses.entries.length + visualCatalog.analyses.list().logs.length);
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
  assert.equal(categories.structuredContent.visualExamples.exampleCount, 21);
  assert.ok(categories.structuredContent.visualExamples.analysisLibrary.analyzedCount >= 1);
  const halftoneId = "halftone-talking-heads-study";
  const profile = await client.callTool({ name: "get_design_preferences", arguments: {} });
  assertCautions(profile);
  const profileResource = await client.readResource({ uri: "design://design-preferences" });
  const { designCautions, ...profileData } = profile.structuredContent;
  assert.deepEqual(profileData, visualCatalog.analyses.preferences());
  assert.ok(profileData.preferredReferenceIds.includes(halftoneId));
  const warmMuted = profileData.principles.find(item => item.key === "warm-muted-graphics");
  assert.match(warmMuted.references.find(ref => ref.analysisId === halftoneId).application, /HEX/u);
  assert.deepEqual(JSON.parse(profileResource.contents[1].text), profileData);
  const scopedProfile = await client.callTool({ name: "get_design_preferences", arguments: {
    focus: "color.temperature-saturation", contextKey: "digital-visuals",
  } });
  assertCautions(scopedProfile);
  assert.deepEqual(scopedProfile.structuredContent.principles.map(item => item.key), ["warm-muted-graphics"]);
  const analysisSearch = await client.callTool({ name: "search_design_analyses", arguments: {
    query: "#f2efec", axis: "color", scope: "preferred",
  } });
  assertCautions(analysisSearch);
  assert.equal(analysisSearch.structuredContent.results[0].id, halftoneId);
  const analysis = await client.callTool({ name: "get_design_analysis", arguments: { id: halftoneId } });
  assertCautions(analysis);
  assert.equal(analysis.structuredContent.typography.fonts[0].renderedFamily, null);
  assert.equal(analysis.structuredContent.typography.fonts[0].identification, "unknown");
  assert.ok(analysis.structuredContent.color.palette.length);
  assert.ok(analysis.structuredContent.layout.findings.length);
  const lighting = await client.callTool({ name: "get_design_analysis", arguments: {
    id: halftoneId, axis: "lighting",
  } });
  assertCautions(lighting);
  assert.equal(lighting.structuredContent.axis, "lighting");
  assert.equal(lighting.structuredContent.color, undefined);
  assert.match(lighting.structuredContent.section.summary, /명암/u);
  assert.deepEqual(lighting.structuredContent.evidence.map(item => item.id), ["detail-frame"]);
  const analysisLog = await client.readResource({ uri: lighting.structuredContent.logUri });
  assert.match(analysisLog.contents[1].text, /halftone-talking-heads-study\.md#lighting/u);
  assert.match(analysisLog.contents[1].text, /lighting\.shadows/u);
  assert.doesNotMatch(analysisLog.contents[1].text, /boxing-arena-study\.md/u);
  const scope = await client.readResource({ uri: "design://analysis-scope" });
  const { focuses } = JSON.parse(scope.contents[1].text);
  assert.equal(new Set(focuses.map(item => item.id)).size, 49);
  assert.ok(focuses.every(item => item.id.startsWith(`${item.axis}.`)));
  const focused = await client.callTool({ name: "get_design_analysis", arguments: {
    id: "halftone-talking-heads-study", focus: "lighting.shadows",
  } });
  assertCautions(focused);
  assert.equal(focused.structuredContent.axis, "lighting");
  assert.deepEqual(focused.structuredContent.section.findings.map(item => item.focus), ["lighting.shadows"]);
  assert.deepEqual(focused.structuredContent.evidence.map(item => item.id), ["detail-frame"]);
  const focusedSearch = await client.callTool({ name: "search_design_analyses", arguments: {
    query: "국소 명암", focus: "lighting.shadows",
  } });
  assertCautions(focusedSearch);
  assert.deepEqual(focusedSearch.structuredContent.results.map(item => item.id), [halftoneId]);
  const missingAxis = await client.callTool({ name: "get_design_analysis", arguments: {
    id: halftoneId, axis: "interaction",
  } });
  assert.equal(missingAxis.isError, true);
  assert.equal(missingAxis.structuredContent.error.code, "ANALYSIS_AXIS_NOT_RECORDED");
  const unknownAnalysis = await client.callTool({ name: "get_design_analysis", arguments: { id: "boxing-arena-study" } });
  assertCautions(unknownAnalysis);
  assert.equal(unknownAnalysis.isError, true);
  assert.equal(unknownAnalysis.structuredContent.error.code, "UNKNOWN_ANALYSIS");
  await assert.rejects(client.readResource({ uri: "design://analyses/boxing-arena-study" }));
  const emptyAnalysisQuery = await client.callTool({ name: "search_design_analyses", arguments: { query: "###" } });
  assertCautions(emptyAnalysisQuery);
  assert.equal(emptyAnalysisQuery.structuredContent.error.code, "EMPTY_ANALYSIS_QUERY");
  const savedResource = await client.readResource({ uri: `design://analyses/${halftoneId}` });
  assert.equal(JSON.parse(savedResource.contents[1].text).typography.fonts[0].renderedFamily, null);
  const colorOnlyId = "pinterest-quantus-palette";
  const colorOnly = await client.callTool({ name: "get_design_analysis", arguments: { id: colorOnlyId, axis: "color" } });
  assertCautions(colorOnly);
  assert.deepEqual(colorOnly.structuredContent.axes, ["color"]);
  const colorLog = await client.readResource({ uri: colorOnly.structuredContent.logUri });
  assert.ok(colorLog.contents[1].text.includes(`${colorOnlyId}.md#색감-분석`));
  const layoutLog = await client.readResource({ uri: "design://analysis-logs/layout" });
  assert.ok(!layoutLog.contents[1].text.includes(`${colorOnlyId}.md`));
  const template = await client.readResource({ uri: "design://analysis-template" });
  assert.equal(JSON.parse(template.contents[1].text).status, "draft");
  assert.match(JSON.parse(template.contents[1].text).source.description, /사용자가 제공한 예시는 전체 디자인 선호/u);
  const analysisWorkflow = await client.readResource({ uri: "design://analysis-workflow" });
  assert.match(analysisWorkflow.contents[1].text, /keywords`에 `사용자 선호 레퍼런스/u);
  assert.doesNotMatch(analysisWorkflow.contents[1].text, /분석한 디자인을 좋아한다고 자동 추정하지 않습니다/u);
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
  assert.equal(JSON.parse(visualIndex.contents[1].text).fileCount, 27);
  const compactVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "mood-examples" } });
  assert.equal(compactVisual.structuredContent.source, null);
  assert.match(compactVisual.structuredContent.guide, /18가지를/u);
  for (const [name, args, expected] of [
    ["get_design_technology", { id: "ascii-postprocess" }, "ascii-postprocess"],
    ["get_design_platform", { id: "metal" }, "metal"],
  ]) {
    const result = await client.callTool({ name, arguments: args });
    assertCautions(result);
    assert.equal(result.structuredContent.id, expected);
  }
  const technologyCatalog = await client.readResource({ uri: "design://technologies" });
  assert.deepEqual(JSON.parse(technologyCatalog.contents[1].text), visualCatalog.technologies.index());
  const technologySearch = await client.callTool({ name: "search_design_technologies", arguments: {
    query: "WebGPU", platform: "web", status: "candidate", category: "graphics-3d", limit: 1,
  } });
  assertCautions(technologySearch);
  assert.equal(technologySearch.structuredContent.results[0].id, "webgpu");
  const candidate = await client.callTool({ name: "get_design_technology", arguments: { id: "webgpu" } });
  assertCautions(candidate);
  assert.equal(candidate.structuredContent.status, "candidate");
  assert.deepEqual(candidate.structuredContent.examples, []);
  assert.match(candidate.structuredContent.check, /디바이스 손실/u);
  const candidateResource = await client.readResource({ uri: "design://technologies/figma" });
  assert.equal(JSON.parse(candidateResource.contents[1].text).kind, "service");
  const visualPlan = await client.callTool({ name: "create_visual_adoption_plan", arguments: {
    visualIds: ["ascii-character"], platform: "metal", projectType: "existing",
  } });
  assertCautions(visualPlan);
  assert.equal(visualPlan.structuredContent.selections[0].id, "ascii-character");
  assert.equal(visualPlan.structuredContent.targetPlatform, "metal");
  assert.match(visualPlan.structuredContent.targetInspection, /Not performed/u);
  const renderer = await client.readResource({ uri: "design://source-files/designs/characters/assets/ascii/renderer.js" });
  assert.match(renderer.contents[1].text, /ASCII_SHADER/u);
  assert.equal(renderer.contents[0].uri, "design://design-cautions");
  const missingTechnology = await client.callTool({ name: "get_design_technology", arguments: { id: "missing" } });
  assertCautions(missingTechnology);
  assert.equal(missingTechnology.isError, true);
  assert.equal(missingTechnology.structuredContent.error.code, "UNKNOWN_TECHNOLOGY");
  const invalidVisualPlan = await client.callTool({ name: "create_visual_adoption_plan", arguments: {
    visualIds: ["missing"], platform: "unity", projectType: "new",
  } });
  assertCautions(invalidVisualPlan);
  assert.equal(invalidVisualPlan.isError, true);
  await assert.rejects(client.readResource({ uri: "design://source-files/../../package.json" }));
  const invalidVisual = await client.callTool({ name: "get_design_visual", arguments: { id: "../package" } });
  assert.equal(invalidVisual.isError, true);
  const invalidVisualSearch = await client.callTool({ name: "search_design_visuals", arguments: { query: " " } });
  assert.equal(invalidVisualSearch.isError, true);
  for (const file of ["color-combinations.md", "mood-examples.md", "screen-effects.md", "reference-studies.md"]) {
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
  assert.equal(prompts.length, 3);
  const visualPrompt = await client.getPrompt({ name: "adopt_visual_design", arguments: {
    objective: "문자 캐릭터를 게임에 적용", platform: "godot", projectType: "existing",
  } });
  assert.match(visualPrompt.messages[0].content.text, /create_visual_adoption_plan/u);
  assert.ok(visualPrompt.messages[0].content.text.indexOf("AI 티가 나지 않는 디자인") <
    visualPrompt.messages[0].content.text.indexOf("Target: godot"));
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
