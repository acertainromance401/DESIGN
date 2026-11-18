import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { AnalysisCatalog, analysisAxes, analysisLogInfo, analysisSchema, loadAnalysisCatalog } from "../dist/analyses.js";
import { renderAnalysisLog } from "../dist/analysis-logs.js";
import { loadVisualCatalog, VisualCatalog } from "../dist/visuals.js";
import { saveAnalysisRecord } from "../scripts/manage-analysis.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { loadCatalog } from "../dist/catalog.js";
import { createServer } from "../dist/server.js";

const root = new URL("../", import.meta.url);
const visuals = await loadVisualCatalog();
const { analyses } = visuals;
const halftone = analyses.get("halftone-talking-heads-study");
const fixtureSource = "<style>body { color: #010203; font-family: FixtureFont, system-ui }</style>";
const fixtureFinding = (focus, topic) => ({ focus, topic, observation: topic, certainty: "confirmed", evidenceIds: ["fixture-css"] });
const section = (focus, topic) => ({ summary: topic, findings: [fixtureFinding(focus, topic)], reuse: [] });
const seed = analysisSchema.parse({
  schemaVersion: 1, id: "fixture-css-study", title: "Test-only CSS sample", summary: "Test-only observations from a synthetic source",
  status: "analyzed", createdAt: "2026-11-17", updatedAt: "2026-11-17", visualId: "ascii-character",
  source: { type: "local-html", location: "synthetic-fixture.html", description: "Test-only source, not a catalog entry" },
  keywords: [],
  evidence: [{ id: "fixture-css", kind: "source-code", location: "synthetic-fixture.html#L1", description: "Fixture CSS" }],
  color: {
    ...section("color.palette-roles", "Fixture color"),
    palette: [{ role: "Test ink", value: "#010203", certainty: "confirmed", evidenceIds: ["fixture-css"] }],
  },
  layout: section("layout.grid", "Fixture grid"),
  typography: {
    ...section("typography.family", "Fixture font declaration"),
    fonts: [{ role: "body", declaredFamilies: ["FixtureFont", "system-ui"], renderedFamily: null, weight: null,
      identification: "declared-only", evidenceIds: ["fixture-css"], notes: "CSS only", license: "Unknown" }],
  },
  elements: { lighting: section("lighting.source-direction", "Fixture directional light") },
  limitations: ["실제 렌더링 서체 미검증"],
});
const visualIds = new Set(visuals.entries.map(item => item.id));
const seededCatalog = new AnalysisCatalog([seed], analyses.template);

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), "design-analyses-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const url = pathToFileURL(`${directory}/`);
  await cp(new URL("content/", root), new URL("content/", url), { recursive: true });
  return url;
}

test("saved source analysis separates three axes and does not invent a rendered font", async () => {
  assert.equal(analysisSchema.parse(seed).status, "analyzed");
  assert.equal(analyses.template.status, "draft");
  assert.ok(seed.color.findings.length && seed.layout.findings.length && seed.typography.findings.length);
  assert.equal(seed.typography.fonts[0].identification, "declared-only");
  assert.equal(seed.typography.fonts[0].renderedFamily, null);
  for (const swatch of seed.color.palette) assert.ok(fixtureSource.includes(swatch.value), swatch.value);
  assert.ok(fixtureSource.includes(seed.typography.fonts[0].declaredFamilies.join(", ")));
  assert.match(seed.limitations.join(" "), /렌더링 서체/u);
  const report = await readFile(new URL("docs/analyses/halftone-talking-heads-study.md", root), "utf8");
  for (const title of ["색감 분석", "레이아웃 분석", "폰트 분석"]) assert.ok(report.includes(`## ${title}`));
  assert.match(report, /실제 렌더링 서체: 미확인/u);
});

test("the palette guide keeps its eight comparisons and collects saved user preference colors separately", async () => {
  const guide = await readFile(new URL("designs/palettes/color-combinations.md", root), "utf8");
  const [comparisons, managed] = guide.split("<!-- preference-colors:start -->");
  assert.equal([...comparisons.matchAll(/\]\(\.\/color-combinations\.html#/gu)].length, 8);
  const [log] = managed.split("<!-- preference-colors:end -->");
  const preferred = analyses.entries.filter(record => record.color && record.status === "analyzed" && record.keywords.includes("사용자 선호 레퍼런스"));
  const ids = [...log.matchAll(/\.\.\/\.\.\/docs\/analyses\/([a-z0-9-]+)\.md#색감-분석/gu)].map(match => match[1]);
  assert.ok(ids.includes("halftone-talking-heads-study"));
  assert.deepEqual(ids, preferred.map(record => record.id));
  for (const record of preferred) {
    assert.ok(log.includes(record.color.summary));
    for (const { value, certainty } of record.color.palette) {
      assert.ok(log.includes(`| ${value ?? "미확인"} | ${certainty} |`));
    }
    for (const principle of record.color.reuse) assert.ok(log.includes(principle));
  }
});

test("one registered analysis updates every recorded element log without adding drafts or internal studies", async t => {
  const directory = await fixture(t);
  const original = analyses.entries.find(record => record.id === halftone.id);
  const record = { ...structuredClone(original), id: "element-log-example", title: "요소 로그 등록 검증" };
  record.evidence.push({ id: "fixture-css", kind: "source-code", location: "synthetic interaction", description: "Test-only interaction evidence" });
  record.elements.interaction = section("interaction.recovery", "Test undo");
  await saveAnalysisRecord(record, { directory });
  await saveAnalysisRecord({ ...record, id: "element-log-draft", status: "draft" }, { directory });
  await saveAnalysisRecord(seed, { directory });
  const refreshed = await loadAnalysisCatalog(directory, visualIds);
  for (const axis of analysisAxes) {
    const indexed = refreshed.list().logs.find(log => log.axis === axis);
    assert.equal(indexed.entryCount, analyses.logEntries(axis).length + 1);
    const log = renderAnalysisLog(refreshed, axis);
    assert.match(log, /element-log-example\.md/u);
    assert.doesNotMatch(log, /element-log-draft\.md|fixture-css-study\.md|boxing-arena-study\.md/u);
    const registered = refreshed.get(record.id, axis);
    assert.ok(log.includes(registered.section.summary));
    const { document } = analysisLogInfo(axis);
    if (axis !== "color") assert.equal(await readFile(new URL(document, root), "utf8"), renderAnalysisLog(analyses, axis));
  }
});

test("a completed color-only reference saves without placeholders and appears only in the color log", async t => {
  const directory = await fixture(t);
  const { layout, typography, elements, ...core } = seed;
  const input = {
    ...core, id: "color-only-example", keywords: ["사용자 선호 레퍼런스"],
    analysisScope: ["color"], preferenceFocuses: ["color.palette-roles"],
  };
  for (const invalid of [
    { ...input, analysisScope: undefined },
    { ...input, analysisScope: ["color", "color"] },
    { ...input, analysisScope: ["color", "layout"] },
    { ...input, layout },
    { ...input, typography },
    { ...input, elements },
    { ...input, color: { ...input.color, findings: [] } },
    { ...input, color: { ...input.color, palette: [] } },
  ]) {
    assert.equal(analysisSchema.safeParse(invalid).success, false);
  }
  await saveAnalysisRecord(input, { directory });
  const refreshed = await loadAnalysisCatalog(directory, visualIds);
  const record = refreshed.get(input.id);
  assert.deepEqual(record.analysisScope, ["color"]);
  for (const key of ["layout", "typography", "elements"]) assert.ok(!(key in record));
  const search = refreshed.search({ query: "Fixture color", axis: "color", scope: "preferred" });
  assert.deepEqual(search.results.find(result => result.id === input.id)?.axes, ["color"]);
  for (const axis of analysisAxes) {
    const recorded = axis === "color";
    assert.equal(refreshed.logEntries(axis).length, analyses.logEntries(axis).length + Number(recorded));
    assert.equal(renderAnalysisLog(refreshed, axis).includes(`${input.id}.md`), recorded);
    if (!recorded) assert.throws(() => refreshed.get(input.id, axis), { code: "ANALYSIS_AXIS_NOT_RECORDED" });
  }
});

test("extra elements honor record compatibility, scoped keyword search and evidence validation", () => {
  const legacy = structuredClone(seed);
  delete legacy.elements;
  assert.ok(analysisSchema.safeParse(legacy).success);
  for (const mutate of [
    copy => { copy.elements.unknown = copy.elements.lighting; },
    copy => { copy.elements.lighting.findings = []; },
    copy => { copy.elements.lighting.findings[0].evidenceIds = ["missing-evidence"]; },
  ]) {
    const copy = structuredClone(seed);
    mutate(copy);
    assert.equal(analysisSchema.safeParse(copy).success, false);
  }
  assert.deepEqual(seededCatalog.search({ query: "directional", axis: "lighting" }).results.map(item => item.id), [seed.id]);
  assert.equal(seededCatalog.search({ query: "directional", axis: "text-placement" }).total, 0);
  assert.throws(() => seededCatalog.get(seed.id, "motion"), { code: "ANALYSIS_AXIS_NOT_RECORDED" });
});

test("focus validation and filtering isolate individual observations without breaking untagged records", () => {
  const invalid = structuredClone(seed);
  invalid.elements.lighting.findings[0].focus = "texture.grain";
  assert.equal(analysisSchema.safeParse(invalid).success, false);
  invalid.elements.lighting.findings[0].focus = "lighting.not-defined";
  assert.equal(analysisSchema.safeParse(invalid).success, false);
  delete invalid.elements.lighting.findings[0].focus;
  assert.ok(analysisSchema.safeParse(invalid).success);

  const direction = seededCatalog.get(seed.id, undefined, "lighting.source-direction");
  assert.equal(direction.axis, "lighting");
  assert.deepEqual(direction.section.findings.map(item => item.topic), ["Fixture directional light"]);
  assert.deepEqual(direction.evidence.map(item => item.id), ["fixture-css"]);
  assert.equal(seededCatalog.search({ query: "directional", focus: "lighting.source-direction" }).total, 1);
  assert.equal(seededCatalog.search({ query: "directional", focus: "lighting.atmosphere" }).total, 0);
  assert.equal(seededCatalog.search({ query: "가림", focus: "lighting.shadows" }).total, 0);
  assert.throws(() => analyses.search({ query: "조명", axis: "layout", focus: "lighting.shadows" }),
    { code: "ANALYSIS_FOCUS_AXIS_MISMATCH" });
  assert.throws(() => seededCatalog.get(seed.id, undefined, "lighting.shadows"), { code: "ANALYSIS_FOCUS_NOT_RECORDED" });
});

test("schema rejects incomplete evidence, fabricated font confirmation, bad sources and dates", () => {
  for (const change of [
    item => { item.id = "../escape"; },
    item => { item.id = "readme"; },
    item => { item.extra = true; },
    item => { item.updatedAt = "2026-02-31"; },
    item => { item.updatedAt = "2000-01-01"; },
    item => { item.source = { ...item.source, type: "url", location: "javascript:alert(1)" }; },
    item => { item.source.location = "not-html.txt"; },
    item => { item.evidence.push(item.evidence[0]); },
    item => { item.color.findings[0].evidenceIds = ["missing-evidence"]; },
    item => { item.layout.findings[0].evidenceIds = []; },
    item => { item.typography.findings = []; },
    item => { item.color.palette[0].value = null; },
    item => { item.color.palette[0].certainty = "unknown"; },
    item => { item.typography.fonts[0].renderedFamily = "Guessed Font"; },
    item => { item.typography.fonts[0].identification = "rendered-confirmed"; },
    item => {
      item.typography.fonts[0].renderedFamily = "CSS Is Not Rendering Evidence";
      item.typography.fonts[0].identification = "rendered-confirmed";
    },
    item => { item.typography.fonts[0].declaredFamilies = []; },
  ]) {
    const invalid = structuredClone(seed);
    change(invalid);
    assert.equal(analysisSchema.safeParse(invalid).success, false);
  }
  const rendered = structuredClone(seed);
  rendered.evidence.push({ id: "browser-font", kind: "browser-render", location: "fixture browser", description: "Fixture rendered-font inspection" });
  Object.assign(rendered.typography.fonts[0], {
    renderedFamily: "Fixture Font", identification: "rendered-confirmed", evidenceIds: ["browser-font"],
  });
  assert.equal(analysisSchema.safeParse(rendered).success, true);
  const unexamined = structuredClone(analyses.template);
  unexamined.status = "analyzed";
  assert.equal(analysisSchema.safeParse(unexamined).success, false);
});

test("analysis search is bounded, paginated and axis-specific; drafts remain opt-in", () => {
  const draft = { ...structuredClone(analyses.template), id: "pending-study", title: "초안전용검색어" };
  const second = { ...structuredClone(seed), id: "second-study" };
  const catalog = new AnalysisCatalog([seed, second, draft], analyses.template);
  assert.equal(catalog.search({ query: "#010203", axis: "color" }).total, 2);
  assert.equal(catalog.search({ query: "#010203", axis: "typography" }).total, 0);
  assert.equal(catalog.search({ query: "FixtureFont", axis: "typography" }).total, 2);
  assert.equal(catalog.search({ query: "FixtureFont", axis: "layout" }).total, 0);
  assert.equal(catalog.search({ query: "FixtureFont", scope: "preferred" }).total, 0);
  assert.equal(catalog.search({ query: "초안전용검색어" }).total, 0);
  assert.equal(catalog.search({ query: "초안전용검색어", status: "draft" }).results[0].id, draft.id);
  const page = catalog.search({ query: "Fixture", limit: 1 });
  assert.equal(page.nextOffset, 1);
  const next = catalog.search({ query: "Fixture", limit: 1, offset: page.nextOffset });
  assert.notEqual(page.results[0].id, next.results[0].id);
  assert.equal(next.nextOffset, null);
  assert.equal(catalog.search({ query: "Fixture", visualId: "ascii-character" }).total, 2);
  assert.equal(catalog.search({ query: "Fixture", visualId: "black-minimal" }).total, 0);
  assert.throws(() => catalog.search({ query: "font", limit: 11 }));
  assert.throws(() => catalog.search({ query: "font", offset: -1 }));
  assert.throws(() => catalog.search({ query: "###" }), { code: "EMPTY_ANALYSIS_QUERY" });
  assert.throws(() => catalog.get("missing"), { code: "UNKNOWN_ANALYSIS" });
  assert.equal(catalog.list().draftCount, 1);
});

test("existing visual detail, search and adoption plan link to accumulated analyses", () => {
  const catalog = new VisualCatalog(visuals.entries, visuals.files, visuals.reuse, visuals.sources, seededCatalog, visuals.technologies);
  assert.equal(catalog.get({ id: "ascii-character" }).referenceAnalyses[0].id, seed.id);
  assert.equal(catalog.get({ id: "black-minimal" }).referenceAnalyses.length, 0);
  assert.equal(catalog.search({ query: "FixtureFont" }).results[0].id, "ascii-character");
  assert.equal(catalog.plan({ visualIds: ["ascii-character"], platform: "swiftui", projectType: "existing" })
    .selections[0].referenceAnalyses[0].uri, `design://analyses/${seed.id}`);
});

test("the rejected arena is absent from analyses and cannot be re-registered", async t => {
  const directory = await fixture(t);
  const rejectedId = "boxing-arena-study";
  assert.throws(() => analyses.get(rejectedId), { code: "UNKNOWN_ANALYSIS" });
  assert.equal(analyses.search({ query: "fixture", visualId: "boxing-arena", status: "all" }).total, 0);
  assert.ok(!analyses.list().analyses.some(item => item.id === rejectedId));
  const arena = visuals.get({ id: "boxing-arena" });
  assert.equal(arena.sourceAvailable, true);
  assert.deepEqual(arena.referenceAnalyses, []);
  for (const file of [`content/analyses/${rejectedId}.json`, `docs/analyses/${rejectedId}.md`]) {
    await assert.rejects(access(new URL(file, root)), { code: "ENOENT" });
  }
  for (const file of ["docs/analyses/README.md", "docs/design-inventory.md", "docs/analyses/elements/design-preferences.md"]) {
    assert.ok(!(await readFile(new URL(file, root), "utf8")).includes(rejectedId), file);
  }
  for (const record of [
    { ...seed, id: rejectedId },
    { ...seed, visualId: "boxing-arena" },
    { ...seed, source: { ...seed.source, location: arena.path } },
  ]) {
    await assert.rejects(saveAnalysisRecord(record, { directory }), { code: "ANALYSIS_EXCLUDED" });
  }
  await writeFile(new URL(`content/analyses/${rejectedId}.json`, directory), JSON.stringify({ ...seed, id: rejectedId }));
  await assert.rejects(loadAnalysisCatalog(directory, visualIds), { code: "ANALYSIS_EXCLUDED" });
});

test("preference signals respect stated scope, evidence and explicit feedback", () => {
  const reference = structuredClone(analyses.entries.find(record => record.id === halftone.id));
  for (const change of [
    copy => { copy.preferenceSignals[0].basis = "explicit"; },
    copy => { copy.preferenceSignals[0].direction = "avoid"; },
    copy => { copy.preferenceSignals[0].userNote = "Not explicitly stated"; },
    copy => { copy.preferenceSignals[0].evidenceIds = ["video-metadata"]; },
    copy => { copy.preferenceSignals[0].focus = "lighting.source-direction"; },
    copy => { copy.preferenceSignals.push(copy.preferenceSignals[0]); },
    copy => { copy.preferenceFocuses = [reference.preferenceSignals[1].focus]; },
    copy => { copy.keywords = []; },
  ]) {
    const invalid = structuredClone(reference);
    change(invalid);
    assert.equal(analysisSchema.safeParse(invalid).success, false);
  }
  const scoped = analysisSchema.parse({
    ...reference, preferenceFocuses: [reference.preferenceSignals[0].focus], preferenceSignals: reference.preferenceSignals.slice(0, 1),
  });
  const catalog = new AnalysisCatalog([scoped], analyses.template);
  assert.equal(catalog.search({ query: "분홍", scope: "preferred", axis: "color" }).total, 1);
  assert.equal(catalog.search({ query: "병치", scope: "preferred" }).total, 0);
  assert.equal(catalog.search({ query: "병치", axis: "layout" }).total, 1);
  assert.deepEqual(catalog.search({ query: "분홍", scope: "preferred" }).results[0].preferenceFocuses, scoped.preferenceFocuses);
  assert.equal(catalog.preferences().principles.length, 1);
});

test("independent sources raise weight in matching contexts; explicitly rejected traits stay separate", () => {
  const reference = analyses.entries.find(record => record.id === halftone.id);
  const signal = reference.preferenceSignals[0];
  const copy = (id, location, overrides = {}) => analysisSchema.parse({
    ...reference, id, source: { ...reference.source, location }, preferenceSignals: [signal], ...overrides,
  });
  const primary = copy("primary", "source.mp4#t=6");
  const same = copy("same-design", "source.mp4#t=8");
  const otherContext = copy("other-context", "context.png", { preferenceSignals: [{ ...signal, contextKey: "text-ui" }] });
  const draft = copy("draft", "draft.png", { status: "draft" });
  const filtered = records => new AnalysisCatalog(records, analyses.template).preferences({ focus: signal.focus }).principles;
  assert.deepEqual(filtered([primary, same, otherContext, draft]).map(item => [item.weight, item.sourceCount]), [
    ["tentative", 1], ["tentative", 1],
  ]);
  const independent = copy("independent", "different.png");
  assert.equal(filtered([primary, same, independent])[0].sourceCount, 2);
  assert.equal(filtered([primary, same, independent])[0].weight, "recurring");
  const group = sources => sources.map(record => ({ ...record, source: { ...record.source, referenceGroup: "same-artwork" } }));
  assert.equal(filtered(group([primary, independent]))[0].weight, "tentative");
  const explicit = copy("explicit", "rejection.png", {
    keywords: [], preferenceSignals: [{ ...signal, direction: "avoid", basis: "explicit", userNote: "Test-only rejection for this context" }],
  });
  const ranked = filtered([primary, independent, otherContext, explicit]);
  assert.deepEqual(ranked.map(item => [item.weight, item.direction]), [
    ["explicit", "avoid"], ["recurring", "prefer"], ["tentative", "prefer"],
  ]);
  assert.equal(ranked[0].references[0].userNote, "Test-only rejection for this context");
});

test("new external references persist without fake HTML; duplicate and invalid saves leave data intact", async t => {
  const directory = await fixture(t);
  const external = { ...structuredClone(seed), id: "external-reference", updatedAt: seed.createdAt, source: {
    type: "url", location: "https://example.com/design-reference", description: "Test-only external reference, not fetched",
  } };
  delete external.visualId;
  const before = await loadAnalysisCatalog(directory, visualIds);
  const target = await saveAnalysisRecord(external, { directory });
  const original = await readFile(target, "utf8");
  assert.equal(before.entries.length, analyses.entries.length, "existing in-memory catalog is unchanged until reload");
  const loaded = await loadAnalysisCatalog(directory, visualIds);
  assert.equal(loaded.entries.length, before.entries.length + 1);
  assert.equal(loaded.get(external.id).source.location, external.source.location);
  assert.equal(loaded.get(external.id).visualId, undefined);
  await assert.rejects(saveAnalysisRecord(external, { directory }), /already exists/u);
  assert.equal(await readFile(target, "utf8"), original);
  await assert.rejects(saveAnalysisRecord({ ...external, visualId: "missing-visual" }, { directory, replace: true }), /Unknown analysis visual ID/u);
  const revised = { ...external, title: "의도적으로 수정한 분석", updatedAt: "2026-11-18" };
  await saveAnalysisRecord(revised, { directory, replace: true });
  assert.equal((await loadAnalysisCatalog(directory, visualIds)).get(external.id).title, revised.title);
  await assert.rejects(saveAnalysisRecord(external, { directory, replace: true }), /updatedAt backwards/u);
  await assert.rejects(saveAnalysisRecord({ ...revised, createdAt: "2026-11-16" }, { directory, replace: true }), /createdAt/u);
  await assert.rejects(saveAnalysisRecord({ ...revised, id: "not-saved" }, { directory, replace: true }), /missing analysis/u);
  assert.ok((await readdir(new URL("content/analyses/", directory))).every(file => file.endsWith(".json")));
});

test("simultaneous new registrations never silently overwrite an ID", async t => {
  const directory = await fixture(t);
  const record = { ...structuredClone(analyses.template), id: "simultaneous-draft" };
  const results = await Promise.allSettled([
    saveAnalysisRecord(record, { directory }), saveAnalysisRecord(record, { directory }),
  ]);
  assert.equal(results.filter(item => item.status === "fulfilled").length, 1);
  assert.equal(results.filter(item => item.status === "rejected").length, 1);
  assert.equal((await loadAnalysisCatalog(directory, visualIds)).get(record.id).status, "draft");
  assert.ok((await readdir(new URL("content/analyses/", directory))).every(file => file.endsWith(".json")));
});

test("a newly registered external reference is discoverable through MCP after reloading the saved catalog", async t => {
  const directory = await fixture(t);
  for (const source of visuals.sources.values()) {
    if (source.distribution !== "bundled") continue;
    const target = new URL(source.path, directory);
    await mkdir(new URL("./", target), { recursive: true });
    await writeFile(target, source.text);
  }
  const record = { ...structuredClone(seed), id: "external-discoverable", source: {
    type: "url", location: "https://example.com/fixture", description: "Test-only unbundled reference",
  } };
  delete record.visualId;
  await saveAnalysisRecord(record, { directory });
  const refreshed = await loadVisualCatalog(directory);
  const server = createServer(await loadCatalog(), refreshed);
  const client = new Client({ name: "fresh-analysis-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const search = await client.callTool({ name: "search_design_analyses", arguments: { query: record.id } });
    assert.equal(search.isError, undefined);
    assert.equal(search.structuredContent.results[0].id, record.id);
    const detail = await client.callTool({ name: "get_design_analysis", arguments: { id: record.id } });
    assert.equal(detail.structuredContent.source.location, record.source.location);
    assert.equal(detail.structuredContent.typography.fonts[0].renderedFamily, null);
    const resource = await client.readResource({ uri: `design://analyses/${record.id}` });
    assert.equal(resource.contents[0].uri, "design://design-cautions");
    assert.equal(JSON.parse(resource.contents[1].text).id, record.id);
  } finally {
    await client.close();
    await server.close();
  }
});

test("loader rejects mismatched filenames and unknown visual references instead of skipping records", async t => {
  const directory = await fixture(t);
  const target = new URL("content/analyses/new-study.json", directory);
  await writeFile(target, JSON.stringify(seed));
  await assert.rejects(loadAnalysisCatalog(directory, visualIds), /filename must match/u);
  await writeFile(target, JSON.stringify({ ...seed, id: "new-study", visualId: "not-a-visual" }));
  await assert.rejects(loadAnalysisCatalog(directory, visualIds), /Unknown analysis visual ID/u);
  await writeFile(target, "{");
  await assert.rejects(loadAnalysisCatalog(directory, visualIds), SyntaxError);
});

test("authoring CLI fails explicitly on invalid commands without writing data", () => {
  assert.throws(() => execFileSync(process.execPath, [
    fileURLToPath(new URL("../scripts/manage-analysis.mjs", import.meta.url)), "save",
  ], { encoding: "utf8", stdio: "pipe" }), error => error.status === 1 && /Usage:/u.test(error.stderr));
});
