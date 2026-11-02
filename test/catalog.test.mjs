import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { codeBlocks, DesignError, loadCatalog } from "../dist/catalog.js";

const catalog = await loadCatalog();

test("all categories, source topics and exact code blocks are bundled", async () => {
  assert.equal(catalog.categories.length, 14);
  assert.equal(catalog.patterns.size, 48);
  assert.equal(catalog.guides.size, 15);
  const hashes = [...catalog.guides.values()].flatMap(({ markdown }) =>
    codeBlocks(markdown).map((block) => createHash("sha256").update(block).digest("hex")));
  const provenance = JSON.parse(await readFile(new URL("../content/provenance.json", import.meta.url), "utf8"));
  const expected = provenance.files.flatMap(({ codeBlocks }) => codeBlocks);
  assert.equal(hashes.length, 57);
  assert.deepEqual(hashes.sort(), expected.sort());
  assert.equal(catalog.categories.reduce((sum, item) => sum + item.patternCount, 0), 48);
});

test("every migrated guide link is portable and resolves to a registered resource", () => {
  const uris = new Set([
    "design://catalog",
    ...[...catalog.patterns.keys()].map((id) => `design://patterns/${id}`),
    ...[...catalog.guides.keys()].map((id) => `design://guides/${id}`),
  ]);
  for (const guide of catalog.guides.values()) {
    assert.doesNotMatch(guide.markdown, /\/Users\/|file:\/\/|<img\b|\]\(\.\.?\//u, guide.id);
    for (const [, uri] of guide.markdown.matchAll(/\]\((design:\/\/[^)]+)\)/gu)) {
      assert.ok(uris.has(uri), `Unregistered resource link in ${guide.id}: ${uri}`);
    }
  }
});

test("guidance is compact by default and source is explicitly incomplete", () => {
  const compact = catalog.getPattern("layout.content-width");
  assert.equal(compact.sourceExample, null);
  assert.equal(compact.source.completeness, "reference-excerpt-not-standalone");
  const full = catalog.getPattern("layout.content-width", "swiftui", true);
  assert.match(full.sourceExample, /enum EditorialLayout/u);
  assert.match(full.sourceExample, /26\.3\. 실제 코드의 선/u);
  assert.ok(full.source.references.some((reference) => reference.includes("EditorialStyle.swift#L224")));
  assert.ok(full.sourceDependencies.length > 0);
  assert.ok(full.cautions.some((caution) => caution.includes("700pt")));
  assert.match(catalog.getPattern("colors.semantic-palette", "swiftui", true).sourceExample, /#FAF9F6/u);
  assert.match(catalog.getPattern("type.font-cascade", "swiftui", true).sourceExample, /OFL-BodoniModa/u);
});

test("web/agnostic requests never masquerade as runnable web examples", () => {
  for (const platform of ["web", "agnostic"]) {
    const result = catalog.getPattern("layout.content-width", platform, true);
    assert.equal(result.sourceExample, null);
    assert.equal(result.sourceExampleAvailable, false);
    assert.match(result.sourceExampleNotice, /omitted/u);
    assert.equal(result.source.examplePlatform, "swiftui");
  }
  assert.match(catalog.getPattern("layout.content-width", "web").adaptation, /CSS/u);
  assert.equal(catalog.getPattern("motion.glyph-replacement").sourceImplementationStatus, "defined-not-connected");
  assert.equal(catalog.getPattern("motion.launch-splash").sourceImplementationStatus, "documented-with-limitations");
});

test("Korean/English search is ranked, bounded, filtered and paginated", () => {
  for (const query of ["반응형 레이아웃", "responsive layout"]) {
    const result = catalog.search({ query, category: "layout", limit: 3 });
    assert.ok(result.total >= 5);
    assert.equal(result.results.length, 3);
    assert.ok(result.results.every(({ category }) => category === "layout"));
    const second = catalog.search({ query, category: "layout", limit: 3, offset: result.nextOffset });
    assert.ok(second.results.every(({ id }) => !result.results.some((item) => item.id === id)));
    assert.equal(second.nextOffset, null);
  }
  assert.ok(catalog.search({ query: "scroll reveal" }).results.some(({ id }) => id === "motion.scroll-reveal"));
  assert.deepEqual(catalog.search({ query: "zzznomatchingpatternzzz" }).results, []);
  assert.throws(() => catalog.search({ query: "!!!" }), { code: "EMPTY_QUERY" });
  assert.throws(() => catalog.search({ query: " " }));
  assert.throws(() => catalog.search({ query: "layout", limit: 11 }));
  assert.throws(() => catalog.search({ query: "layout", category: "unknown" }), { code: "UNKNOWN_CATEGORY" });
  assert.throws(() => catalog.getPattern("missing.pattern"), { code: "UNKNOWN_PATTERN" });
});

test("new/existing plans use actual selected patterns without claiming target inspection", () => {
  const request = {
    objective: "반응형 입력 UI",
    platform: "swiftui",
    patternIds: ["layout.content-width", "input.focus-and-validation"],
  };
  const existing = catalog.plan({ ...request, projectType: "existing" });
  const fresh = catalog.plan({ ...request, projectType: "new" });
  assert.equal(existing.patterns.length, 2);
  assert.match(existing.steps[0], /보존/u);
  assert.match(fresh.steps[0], /화면 목적/u);
  assert.match(existing.assessment, /No target files/u);
  assert.ok(existing.patterns.every(({ sourceExample }) => sourceExample === null));
  assert.ok(existing.validationChecklist.length > 0);
  const web = catalog.plan({ ...request, projectType: "existing", platform: "web" });
  assert.match(web.steps[2], /웹 구현은 별도로/u);
});

test("automatic planning filters before ranking, searches the full objective and rejects unrelated fallbacks", () => {
  const filtered = catalog.plan({
    objective: "3d rendering material 회전 로딩 스튜디오 그림자 반응형 레이아웃",
    projectType: "existing",
    categoryIds: ["layout"],
  });
  assert.ok(filtered.patterns.length > 0);
  assert.ok(filtered.patterns.every(({ category }) => category === "layout"));
  assert.ok(catalog.plan({
    objective: `${"z".repeat(220)} 반응형`,
    projectType: "new",
  }).patterns.some(({ category }) => category === "layout"));
  assert.throws(() => catalog.plan({
    objective: "zzznomatchingpatternzzz", projectType: "new",
  }), { code: "NO_MATCHING_PATTERNS" });
  assert.throws(() => catalog.plan({
    objective: "layout", projectType: "existing", patternIds: ["missing.pattern"],
  }), { code: "UNKNOWN_PATTERN" });
  assert.throws(() => catalog.plan({
    objective: "layout", projectType: "existing",
    patternIds: ["layout.content-width"], categoryIds: ["motion"],
  }), { code: "CATEGORY_CONFLICT" });
  assert.throws(() => catalog.plan({
    objective: "layout", projectType: "new",
    patternIds: ["layout.content-width", "layout.content-width"],
  }), (error) => error instanceof DesignError && error.code === "DUPLICATE_PATTERN_IDS");
});

test("catalog fails explicitly when its snapshot has changed without a reviewed import", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "design-mcp-integrity-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL("../content/", import.meta.url), directory, { recursive: true });
  await writeFile(path.join(directory, "guides/layout.md"), "# Modified\n");
  await assert.rejects(loadCatalog(pathToFileURL(`${directory}${path.sep}`)), /integrity mismatch/u);
});
