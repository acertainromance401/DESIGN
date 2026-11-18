import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { loadTechnologyCatalog, technologyDocument } from "../dist/technologies.js";
import { loadVisualCatalog } from "../dist/visuals.js";

const root = new URL("../", import.meta.url);
const visuals = await loadVisualCatalog(root);
const catalog = visuals.technologies;

test("the documented catalog covers all technologies and labels evidence separately", async () => {
  const index = catalog.index();
  assert.equal(visuals.list().technologyLibrary.count, index.count);
  assert.equal(index.sourceBackedCount, visuals.reuse.technologies.length);
  assert.ok(index.candidateCount >= 80);
  assert.equal(index.count, index.sourceBackedCount + index.candidateCount);
  assert.equal(index.count, index.categories.reduce((total, category) => total + category.count, 0));
  assert.equal(index.categories.length, 10);
  const document = await readFile(new URL(technologyDocument, root), "utf8");
  assert.equal([...document.matchAll(/<a id="technology-[a-z0-9-]+"><\/a>/gu)].length, index.count);
  for (const item of catalog.entries) {
    assert.ok(document.includes(`id="technology-${item.id}"`), item.id);
    const detail = visuals.getTechnology(item.id);
    assert.equal(detail.examples.length, item.exampleCount, item.id);
    if (item.status === "source-backed") {
      assert.ok(detail.examples.length && detail.references.length && detail.checks.length);
      continue;
    }
    assert.equal(detail.status, "candidate");
    for (const value of [item.useWhen, item.requires, item.tradeoff, item.check, item.reference]) {
      assert.ok(document.includes(value), item.id);
    }
    assert.equal(detail.source, undefined);
  }
});

test("English names and Korean goals find appropriate options without inventing demo support", () => {
  assert.equal(catalog.search({ query: "WEBGPU" }).results[0].id, "webgpu");
  assert.equal(catalog.search({ query: "Figma", kind: "service" }).results[0].id, "figma");
  const halftone = catalog.search({ query: "도트 하프톤", platform: "web" }).results.map(item => item.id);
  assert.ok(halftone.includes("canvas-2d") && halftone.includes("web-video"));
  const graphics = catalog.search({ category: "graphics-3d", platform: "web", status: "source-backed", limit: 20 });
  assert.ok(graphics.results.some(item => item.id === "webgl-sdf"));
  assert.ok(graphics.results.every(item => item.status === "source-backed" && item.exampleCount > 0));
  assert.equal(visuals.search({ query: "WebGPU", technology: "webgpu" }).total, 0);
  assert.equal(catalog.search({ query: "figma", status: "source-backed" }).total, 0);
  assert.equal(catalog.search({ query: "jetpack compose", platform: "android", category: "native-cross-platform" }).results[0].id, "jetpack-compose");
  assert.equal(catalog.search({ query: "jetpack compose", platform: "ios", category: "native-cross-platform" })
    .results.some(item => item.id === "jetpack-compose"), false);
  assert.equal(catalog.search({ query: "zzznomatch" }).total, 0);
});

test("filters precede pagination and invalid request fields are rejected", () => {
  const filter = { category: "verification", status: "candidate", limit: 3 };
  const first = catalog.search(filter);
  const second = catalog.search({ ...filter, offset: first.nextOffset });
  assert.ok(first.total > filter.limit);
  assert.equal(first.total, second.total);
  assert.equal(new Set([...first.results, ...second.results].map(item => item.id)).size, 6);
  assert.throws(() => catalog.search({ query: "###" }), { code: "EMPTY_TECHNOLOGY_QUERY" });
  for (const invalid of [{ limit: 21 }, { offset: -1 }, { status: "installed" }, { category: "__proto__" }]) {
    assert.throws(() => catalog.search(invalid));
  }
});

test("loader rejects catalog drift and invalid evidence metadata", async t => {
  const directory = await mkdtemp(join(tmpdir(), "design-tech-invalid-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, "content"));
  const fixture = pathToFileURL(`${directory}/`);
  const options = JSON.parse(await readFile(new URL("content/technology-options.json", root), "utf8"));
  for (const [mutate, error] of [
    [copy => { copy.candidates.push(copy.candidates[0]); }, /Duplicate technology ID/u],
    [copy => { copy.candidates[0].id = "css-layout"; }, /Duplicate technology ID/u],
    [copy => { delete copy.sourceMetadata["css-layout"]; }, /Missing source-backed technology metadata/u],
    [copy => { copy.sourceMetadata.unused = copy.sourceMetadata["css-layout"]; }, /unknown source-backed technology/u],
    [copy => { copy.candidates[0].reference = "http://example.com"; }, /protocol/u],
    [copy => { copy.candidates[0].platforms.push(copy.candidates[0].platforms[0]); }, /Duplicate platforms/u],
  ]) {
    const copy = structuredClone(options);
    mutate(copy);
    await writeFile(new URL("content/technology-options.json", fixture), JSON.stringify(copy));
    await assert.rejects(loadTechnologyCatalog(fixture, visuals.reuse), error);
  }
});
