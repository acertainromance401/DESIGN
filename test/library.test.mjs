import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Script } from "node:vm";
import test from "node:test";
import { loadCatalog } from "../dist/catalog.js";

const catalog = await loadCatalog();
const general = [...catalog.patterns.values()].filter(({ origin }) => origin === "general");

test("general library has specific use, avoid, anatomy, adaptation, accessibility and checks for every pattern", () => {
  assert.equal(general.length, 138);
  const categories = catalog.listCategories().categories;
  assert.equal(categories.filter(({ sourceKind }) => sourceKind === "general").length, 22);
  assert.equal(categories.filter(({ sourceKind }) => sourceKind === "weashion").length, 14);
  const principles = new Set();
  for (const pattern of general) {
    const detail = catalog.getPattern(pattern.id, "web");
    assert.equal(detail.sourceKind, "general");
    assert.equal(detail.sourceImplementationStatus, "guidance");
    assert.equal(detail.source.project, "DESIGN General Library");
    assert.equal(detail.sourceExample, null);
    assert.ok(detail.guidance.useWhen.length > 10, pattern.id);
    assert.ok(detail.guidance.avoidWhen.length > 10, pattern.id);
    assert.ok(detail.guidance.anatomy.length >= 2, pattern.id);
    assert.ok(detail.guidance.accessibility.length > 10, pattern.id);
    assert.ok(detail.validationChecklist.length >= 2, pattern.id);
    assert.ok(detail.source.references.every((url) => new URL(url).protocol === "https:"));
    assert.ok(!principles.has(detail.principle), `Duplicated principle: ${pattern.id}`);
    principles.add(detail.principle);
    for (const id of pattern.authored.relatedPatterns) assert.ok(catalog.patterns.has(id));
  }
});

test("source and platform-example filters are applied before pagination", () => {
  const generic = catalog.search({ query: "모달", source: "general", platform: "web", hasExample: true });
  assert.ok(generic.results.some(({ id }) => id === "overlay.modal-dialog"));
  assert.ok(generic.results.every(({ sourceKind, sourceExampleAvailable }) =>
    sourceKind === "general" && sourceExampleAvailable));
  assert.ok(catalog.search({ query: "layout", source: "weashion" }).results.every(({ sourceKind }) => sourceKind === "weashion"));
  assert.equal(catalog.search({ query: "모달", platform: "agnostic", hasExample: true }).total, 0);
  assert.equal(catalog.search({ query: "모달", source: "weashion", platform: "web", hasExample: true }).total, 0);
  assert.ok(catalog.search({ query: "뉴모피즘", source: "general" }).results.some(({ id }) => id === "style.neumorphism"));
  assert.ok(catalog.search({ query: "heatmap", source: "general" }).results.some(({ id }) => id === "chart.heatmap"));
  assert.ok(catalog.search({ query: "kanban", source: "general" }).results.some(({ id }) => id === "productivity.kanban-board"));
  const first = catalog.search({ query: "a", source: "general", platform: "web", hasExample: true, limit: 3 });
  assert.equal(first.total, 10);
  assert.equal(first.results.length, 3);
  assert.equal(first.nextOffset, 3);
  const second = catalog.search({
    query: "a", source: "general", platform: "web", hasExample: true, limit: 3, offset: first.nextOffset,
  });
  assert.equal(second.results.length, 3);
  assert.ok(second.results.every(({ id }) => !first.results.some((item) => item.id === id)));
  assert.ok(second.results.every(({ sourceKind, sourceExampleAvailable }) => sourceKind === "general" && sourceExampleAvailable));
  assert.equal(catalog.search({
    query: "modal", source: "general", category: "overlays", platform: "web", hasExample: false,
  }).results.some(({ id }) => id === "overlay.modal-dialog"), false);
});

test("exactly ten representative patterns have separate SwiftUI and web code, requirements and honest limits", () => {
  const withExamples = general.filter(({ examples }) => Object.keys(examples).length > 0);
  assert.equal(withExamples.length, 10);
  for (const pattern of withExamples) {
    for (const platform of ["web", "swiftui"]) {
      const compact = catalog.getPattern(pattern.id, platform);
      assert.equal(compact.sourceExampleAvailable, true);
      assert.equal(compact.sourceExample, null);
      const full = catalog.getPattern(pattern.id, platform, true);
      assert.ok(full.sourceExample.length > 200);
      assert.ok(full.example.requirements.length > 10);
      assert.ok(full.example.limitations.length > 0);
      assert.equal(full.example.validation, platform === "web" ? "browser-tested" : "typechecked-macos");
      assert.match(full.source.completeness, /not-production/u);
      assert.equal(catalog.getPattern(pattern.id, "agnostic", true).sourceExample, null);
    }
  }
  assert.equal(catalog.getPattern("style.neumorphism", "web", true).sourceExample, null);
  const plan = catalog.plan({
    objective: "모달 개선", projectType: "existing", platform: "web",
    source: "general", patternIds: ["overlay.modal-dialog"],
  });
  assert.ok(plan.validationChecklist.some((check) => check.includes("Escape")));
  assert.throws(() => catalog.plan({
    objective: "배치", projectType: "new", source: "general", patternIds: ["layout.content-width"],
  }), { code: "SOURCE_CONFLICT" });
});

test("web example JavaScript parses, no external assets, no hidden-only content requirement", async () => {
  const directory = new URL("../content/examples/", import.meta.url);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".html"));
  assert.equal(files.length, 10);
  for (const file of files) {
    const html = await readFile(new URL(file, directory), "utf8");
    assert.match(html, /<!doctype html>/iu);
    assert.match(html, /<html lang="en">/u);
    assert.match(html, /name="viewport"/u);
    assert.doesNotMatch(html, /<(?:script|img|link)\b[^>]*(?:src|href)="https?:/u);
    for (const [, code] of html.matchAll(/<script>([\s\S]*?)<\/script>/gu)) {
      assert.doesNotThrow(() => new Script(code, { filename: file }));
    }
  }
});

test("malformed general catalogs fail explicitly instead of dropping invalid patterns", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "design-general-invalid-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL("../content/", import.meta.url), directory, { recursive: true });
  const file = path.join(directory, "library/visual-styles.json");
  const definition = JSON.parse(await readFile(file, "utf8"));
  definition.patterns[0].relatedPatterns = ["unknown.missing"];
  await writeFile(file, JSON.stringify(definition));
  await assert.rejects(loadCatalog(pathToFileURL(`${directory}${path.sep}`)), /Unknown related pattern/u);
  definition.patterns[0].relatedPatterns = [];
  definition.patterns[0].examples = { web: {
    file: "../outside.html", requirements: "test requirements",
    validation: "browser-tested", limitations: ["not verified"],
  } };
  await writeFile(file, JSON.stringify(definition));
  await assert.rejects(loadCatalog(pathToFileURL(`${directory}${path.sep}`)));
  definition.patterns[0].examples.web = {
    file: "modal-dialog.html", requirements: "test requirements",
    validation: "typechecked-macos", limitations: ["not verified"],
  };
  await writeFile(file, JSON.stringify(definition));
  await assert.rejects(loadCatalog(pathToFileURL(`${directory}${path.sep}`)), /validation\/platform mismatch/u);
  definition.patterns[0].examples.web.validation = "browser-tested";
  definition.patterns[0].examples.web.file = "missing-example.html";
  await writeFile(file, JSON.stringify(definition));
  await assert.rejects(loadCatalog(pathToFileURL(`${directory}${path.sep}`)), { code: "ENOENT" });
  definition.patterns[0].examples = {};
  definition.patterns[1].id = definition.patterns[0].id;
  await writeFile(file, JSON.stringify(definition));
  await assert.rejects(loadCatalog(pathToFileURL(`${directory}${path.sep}`)), /Duplicate general pattern/u);
});
