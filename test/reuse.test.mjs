import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import vm from "node:vm";
import { loadVisualCatalog } from "../dist/visuals.js";
import { loadReuseData } from "../dist/reuse.js";

const root = new URL("../", import.meta.url);
const catalog = await loadVisualCatalog();
const workspaceEntries = catalog.entries.filter(entry =>
  entry.distribution === "bundled" || catalog.get({ id: entry.id }).sourceAvailable);
const canonical = new Set(workspaceEntries.map(entry => entry.path));

test("every standalone workspace design has one canonical family and an old-address redirect", async () => {
  const found = [];
  for (const family of catalog.reuse.families) {
    for (const file of await readdir(new URL(`designs/${family.id}/`, root))) {
      if (file.endsWith(".html")) found.push(`designs/${family.id}/${file}`);
    }
    assert.ok(catalog.getFamily(family.id).examples.length);
  }
  assert.deepEqual(new Set(found), canonical);
  assert.equal(catalog.entries.length, 21);
  for (const entry of workspaceEntries) {
    const source = await readFile(new URL(entry.path, root), "utf8");
    const alias = await readFile(new URL(entry.legacyPath, root), "utf8");
    assert.match(source, /<!doctype html>/iu);
    assert.match(alias, /rel="canonical"/u);
    const script = alias.match(/<script>([\s\S]*?)<\/script>/u)[1];
    let target;
    vm.runInNewContext(script, { location: {
      search: "?preview=1", hash: "#details", replace: value => { target = value; },
    } });
    const result = new URL(target, new URL(entry.legacyPath, root));
    assert.equal(result.pathname, new URL(entry.path, root).pathname);
    assert.equal(result.search, "?preview=1");
    assert.equal(result.hash, "#details");
  }
});

test("HTML dependencies, source modules, implementation evidence and declared assets resolve after moving", async () => {
  for (const entry of workspaceEntries) {
    const detail = catalog.get({ id: entry.id, includeSource: true });
    const base = new URL(entry.path, root);
    assert.equal(detail.sourceAvailable, true);
    assert.ok(detail.sourceFiles.every(file => file.available && file.uri.includes(file.path)));
    const localRefs = [
      ...[...detail.source.matchAll(/(?:src|href)=["'](\.\.?\/[^"'#]+)(?:#[^"']*)?["']/gu)].map(match => match[1]),
      ...[...detail.source.matchAll(/url\(["']?(\.\.?\/[^"')]+)["']?\)/gu)].map(match => match[1]),
      ...[...detail.source.matchAll(/import\(["'](\.\.?\/[^"']+)["']\)/gu)].map(match => match[1]),
    ];
    for (const target of localRefs) await access(new URL(target, base));
    for (const file of entry.sourceFiles) {
      const source = catalog.readSource(file);
      assert.equal(source.path, file);
      assert.ok(source.text);
      for (const [, target] of source.text.matchAll(/(?:from\s+|import\()["'](\.\.?\/[^"']+)["']/gu)) {
        await access(new URL(target, new URL(file, root)));
      }
    }
    for (const usage of entry.technologies) {
      await access(new URL(usage.location, root));
      assert.ok(catalog.getTechnology(usage.id).examples.some(example => example.id === entry.id));
    }
    for (const asset of detail.assets) for (const file of asset.paths) await access(new URL(file, root));
  }
});

test("technology/family filtering happens before pagination and own evidence outranks shared keywords", () => {
  assert.equal(catalog.search({ query: "리플", limit: 1 }).results[0].id, "screen-effects");
  const ascii = catalog.search({ query: "문자", technology: "ascii-postprocess", family: "characters", platform: "metal", limit: 1 });
  assert.equal(ascii.total, 1);
  assert.equal(ascii.results[0].id, "ascii-character");
  assert.equal(ascii.targetPlatform, "metal");
  assert.equal(ascii.results[0].platform, "web");
  assert.equal(catalog.search({ query: "문자", technology: "ascii-postprocess", family: "posters" }).total, 0);
  assert.equal(catalog.search({ query: "zzznomatch", platform: "unity" }).total, 0);
  assert.throws(() => catalog.search({ query: "유리", family: "missing" }), { code: "UNKNOWN_FAMILY" });
  assert.throws(() => catalog.search({ query: "유리", technology: "missing" }), { code: "UNKNOWN_TECHNOLOGY" });
  assert.throws(() => catalog.search({ query: "유리", platform: "unknown" }));
});

test("all eight adoption targets expose actionable requirements without claiming native implementation", () => {
  assert.equal(catalog.reuse.platforms.length, 8);
  for (const { id } of catalog.reuse.platforms) {
    const plan = catalog.plan({ visualIds: ["ascii-character", "liquid-glass"], platform: id, projectType: "existing" });
    assert.equal(plan.selections.length, 2);
    assert.match(plan.preservation, /preserve behavior/u);
    assert.match(plan.targetInspection, /Not performed/u);
    assert.ok(plan.platform.requirements.length);
    assert.ok(plan.platform.validation.length);
    assert.ok(plan.selections.every(item => item.technologySteps.length && item.targetAdaptation));
    assert.ok(plan.selections.every(item => item.platform === "web"));
    assert.match(plan.platform.implementationStatus, /not a compiled/u);
  }
  const metal = catalog.plan({ visualIds: ["ascii-character"], platform: "metal", projectType: "new" });
  assert.match(metal.platform.requirements.join(" "), /MTKView/u);
  assert.match(metal.selections[0].technologySteps.map(item => item.action).join(" "), /MTLTexture/u);
  assert.throws(() => catalog.plan({ visualIds: ["missing"], platform: "web", projectType: "new" }), { code: "UNKNOWN_VISUAL" });
  assert.throws(() => catalog.plan({ visualIds: ["ascii-character", "ascii-character"], platform: "web", projectType: "new" }));
  assert.throws(() => catalog.getPlatform("unknown"), { code: "UNKNOWN_PLATFORM" });
  assert.throws(() => catalog.readSource("../package.json"), { code: "UNKNOWN_SOURCE_FILE" });
  assert.throws(() => catalog.readSource("designs/shared/assets/sports-soccer-cc0.jpg"), { code: "UNKNOWN_SOURCE_FILE" });
});

test("an installed-style catalog explicitly reports absent local-only sources but requires public sources", async t => {
  const directory = await mkdtemp(path.join(tmpdir(), "design-reuse-package-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const temporary = pathToFileURL(`${directory}/`);
  await cp(new URL("content/", root), new URL("content/", temporary), { recursive: true });
  for (const source of catalog.sources.values()) {
    if (source.distribution === "local-only") continue;
    const target = new URL(source.path, temporary);
    await mkdir(new URL("./", target), { recursive: true });
    await writeFile(target, source.text);
  }
  const installed = await loadVisualCatalog(temporary);
  const birthday = installed.get({ id: "birthday", includeSource: true });
  assert.equal(birthday.sourceAvailable, false);
  assert.equal(birthday.source, null);
  assert.equal(birthday.htmlUri, null);
  assert.match(birthday.sourceNotice, /LOCAL_ONLY_SOURCE_UNAVAILABLE/u);
  assert.ok(birthday.sourceFiles.filter(file => file.distribution === "local-only").every(file => !file.available && file.uri === null));
  assert.ok(birthday.sourceFiles.some(file => file.path === "scripts/prepare-birthday-model.mjs" && file.available));
  assert.ok(installed.getTechnology("gltf-assets").examples[0].usage.sourceUri);
  assert.throws(() => installed.readSource(birthday.path), { code: "LOCAL_ONLY_SOURCE_UNAVAILABLE" });
  assert.equal(installed.search({ query: "호흡" }).results[0].id, "birthday");
  assert.match(installed.plan({ visualIds: ["birthday"], platform: "realitykit", projectType: "new" }).selections[0].assets[0].rights, /권리 미확인/u);
  await rm(new URL("designs/characters/assets/ascii/renderer.js", temporary));
  await assert.rejects(loadVisualCatalog(temporary), /ENOENT/u);
});

test("reuse metadata rejects traversal, duplicate IDs and unknown references", async t => {
  const directory = await mkdtemp(path.join(tmpdir(), "design-reuse-invalid-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, "content"));
  for (const mutate of [
    data => { data.designs[0].path = "designs/../../package.json"; },
    data => { data.designs[0].family = "missing"; },
    data => { data.designs[0].technologies[0].id = "missing"; },
    data => { data.designs[0].technologies[0].location = "scripts/missing.mjs"; },
    data => { data.designs[0].sourceFiles.push("designs/shared/assets/sports-soccer-cc0.jpg"); },
    data => { data.designs[0].assetIds = ["missing"]; },
    data => { data.designs.push(data.designs[0]); },
    data => { data.platforms.pop(); },
  ]) {
    const data = structuredClone(catalog.reuse);
    mutate(data);
    await writeFile(path.join(directory, "content/design-reuse.json"), JSON.stringify(data));
    await assert.rejects(loadReuseData(pathToFileURL(`${directory}/`)));
  }
});

test("generated family documentation and search navigation stay in sync with catalog metadata", () => {
  execFileSync(process.execPath, [fileURLToPath(new URL("scripts/build-design-docs.mjs", root)), "--check"], { stdio: "pipe" });
});
