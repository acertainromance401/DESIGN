import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const html = await readFile(new URL("../docs/screen-effects.html", import.meta.url), "utf8");
const markdown = await readFile(new URL("../docs/screen-effects.md", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/u)?.[1];

test("effect gallery script compiles and all 32 demos are documented", () => {
  assert.ok(script);
  new vm.Script(script);
  const data = script.slice(0, script.indexOf('const gallery = document.getElementById'));
  const demos = vm.runInNewContext(`${data}\ndemos`, {}, { timeout: 1000 });
  assert.equal(demos.length, 32);
  assert.equal(new Set(demos.map(([id]) => id)).size, 32);
  assert.equal(new Set(demos.map(([, , category]) => category)).size, 5);
  for (const [id, title, , note, markup] of demos) {
    assert.match(id, /^[a-z]+$/u);
    assert.ok(title && note && markup);
    assert.ok(markdown.includes(`](./screen-effects.html#${id})`), id);
  }
});

test("effect documentation links resolve without changing catalog counts", async () => {
  for (const [, link] of markdown.matchAll(/\]\((\.\.?\/[^)]+)\)/gu)) {
    await access(new URL(link.split("#")[0], new URL("../docs/screen-effects.md", import.meta.url)));
  }
  const manifest = JSON.parse(await readFile(new URL("../content/manifest.json", import.meta.url), "utf8"));
  const known = new Set(manifest.patterns.map(({ id }) => id));
  for (const file of ["background-effects", "motion-patterns", "microinteractions", "overlays", "state-patterns", "color-theming"]) {
    const category = JSON.parse(await readFile(new URL(`../content/library/${file}.json`, import.meta.url), "utf8"));
    category.patterns.forEach(({ id }) => known.add(id));
  }
  for (const [, id] of markdown.matchAll(/`((?:effect|theme|animation|interaction|motion|state|overlay)\.[a-z-]+)`/gu)) {
    assert.ok(known.has(id), `Unknown pattern reference: ${id}`);
  }
});
