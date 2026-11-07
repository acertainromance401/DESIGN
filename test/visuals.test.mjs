import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { Script } from "node:vm";
import { loadVisualCatalog } from "../dist/visuals.js";

const visuals = await loadVisualCatalog();

test("three boxing references have distinct portable SVG drafts and documented links", () => {
  const guide = visuals.readFile("boxing-references.md").text;
  assert.equal(visuals.entries.filter(entry => entry.guide === "boxing-references.md").length, 3);
  assert.equal([...visuals.files.keys()].filter(file => file === "boxing-references.md").length, 1);
  for (const [id, pin] of [
    ["boxing-overhead", "932456297873976480"],
    ["boxing-vintage", "39547302974134220"],
    ["boxing-arena", "797418677813974005"],
  ]) {
    const html = visuals.get({ id, includeSource: true }).source;
    assert.match(html, /<svg/u);
    assert.match(html, /가상/u);
    assert.doesNotMatch(html, /[↗↘↖↙]|<script|(?:src|href)="https?:/u);
    assert.match(guide, new RegExp(pin, "u"));
    assert.ok(visuals.search({ query: id }).results.some(result => result.id === id));
  }
});

test("sports collage uses a bundled photograph and documents its license and original reference", async () => {
  const html = visuals.get({ id: "sports-collage", includeSource: true }).source;
  assert.doesNotMatch(html, /[↗↘↖↙]|<script|(?:src|href)="https?:/u);
  assert.match(html, /clip-path="url\(#player\)"/u);
  const sources = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/gu)];
  assert.equal(sources.length, 4);
  for (const [, path] of sources) {
    const asset = await readFile(new URL(`../docs/${path}`, import.meta.url));
    assert.equal(asset.subarray(0, 3).toString("hex"), "ffd8ff");
  }
  assert.match(visuals.readFile("sports-collage.md").text, /CC0/u);
  assert.match(visuals.readFile("sports-collage.md").text, /706080047875226216/u);
});

test("editorial effects script parses and uses progressive content and motion controls", () => {
  const html = visuals.get({ id: "black-editorial", includeSource: true }).source;
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gu)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new Script(scripts[0][1]));
  assert.match(html, /id="effects" type="checkbox"/u);
  assert.match(html, /prefers-reduced-motion: reduce/u);
  assert.match(html, /visibilitychange/u);
  assert.doesNotMatch(html, /[↗↘↖↙]/u);
  assert.doesNotMatch(html, /opacity:\s*0[;,}]|setInterval|iterations:\s*Infinity/u);
});

test("editorial effects stop immediately and respect motion, visibility and pointer limits", () => {
  const html = visuals.get({ id: "black-editorial", includeSource: true }).source;
  const source = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gu)][0][1];
  const makeTarget = () => {
    const handlers = new Map();
    return {
      addEventListener: (name, callback) => handlers.set(name, callback),
      dispatch: (name, event) => handlers.get(name)?.(event),
    };
  };
  const running = new Set();
  const element = () => ({
    ...makeTarget(),
    animate(_frames, timing) {
      const animation = {
        effect: { target: this }, duration: timing.duration,
        cancel() { running.delete(animation); animation.oncancel?.(); },
      };
      running.add(animation);
      return animation;
    },
  });
  const properties = new Map();
  const hero = {
    ...element(),
    style: {
      setProperty: (name, value) => properties.set(name, value),
      removeProperty: name => properties.delete(name),
    },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
  };
  const body = element();
  const details = { ...makeTarget(), open: false, querySelector: () => body };
  const label = { hidden: true };
  const control = { ...makeTarget(), checked: true, closest: () => label };
  const preference = { ...makeTarget(), matches: false };
  const pointer = { ...makeTarget(), matches: true };
  let active = false;
  let frame;
  const document = {
    ...makeTarget(), hidden: false,
    documentElement: { classList: { toggle: (_name, value) => { active = value; } } },
    querySelector: selector => selector === "#effects" ? control : selector === ".hero" ? hero : element(),
    querySelectorAll: () => [details],
  };
  new Script(source).runInNewContext({
    document, window: {},
    matchMedia: query => query.includes("reduced-motion") ? preference : pointer,
    requestAnimationFrame: callback => { frame = callback; return 1; },
    cancelAnimationFrame: () => { frame = undefined; },
  });
  assert.equal(label.hidden, false);
  assert.equal(active, true);
  assert.equal([...running][0].duration, 480);
  hero.dispatch("pointermove", { pointerType: "mouse", clientX: 1000, clientY: -1000 });
  frame();
  assert.equal(properties.get("--glow-x"), "14px");
  assert.equal(properties.get("--glow-y"), "-10px");
  details.open = true;
  details.dispatch("toggle");
  assert.ok([...running].some(animation => animation.duration === 220));
  details.open = false;
  details.dispatch("toggle");
  assert.ok([...running].every(animation => animation.effect.target !== body));
  preference.matches = true;
  preference.dispatch("change");
  assert.equal(active, false);
  assert.equal(running.size, 0);
  assert.equal(properties.size, 0);
  details.open = true;
  details.dispatch("toggle");
  hero.dispatch("pointermove", { pointerType: "mouse", clientX: 100, clientY: 100 });
  assert.equal(frame, undefined);
  assert.equal(running.size, 0);
  preference.matches = false;
  preference.dispatch("change");
  hero.dispatch("pointermove", { pointerType: "touch", clientX: 100, clientY: 100 });
  assert.equal(frame, undefined);
  document.hidden = true;
  document.dispatch("visibilitychange");
  assert.equal(active, false);
  document.hidden = false;
  document.dispatch("visibilitychange");
  assert.equal(active, true);
  control.checked = false;
  control.dispatch("change");
  assert.equal(active, false);
  assert.equal(running.size, 0);
});

test("visual examples remain separate, compact by default and searchable in Korean/English", () => {
  assert.equal(visuals.list().exampleCount, 11);
  assert.equal(visuals.files.size, 16);
  assert.ok(visuals.search({ query: "검정 포스터 레퍼런스" }).results.some(({ id }) => id === "black-editorial"));
  assert.ok(visuals.search({ query: "검정 모던 미니멀" }).results.some(({ id }) => id === "black-minimal"));
  for (const { id } of visuals.entries) {
    const compact = visuals.get({ id });
    assert.equal(compact.source, null);
    assert.equal(compact.platform, "web");
    assert.ok(compact.limitations.length);
    assert.match(visuals.get({ id, includeSource: true }).source, /^<!doctype html>/iu);
  }
  for (const query of ["리플", "ripple", "햅틱", "쉬머"]) {
    assert.ok(visuals.search({ query }).results.some(({ id }) => id === "screen-effects"));
  }
  assert.ok(visuals.search({ query: "카페 배색" }).results.some(({ id }) => id === "mood-examples"));
  assert.equal(visuals.search({ query: "zzzzunmatched" }).total, 0);
  const first = visuals.search({ query: "시연", limit: 1 });
  assert.ok(first.total > 1);
  assert.equal(first.results.length, 1);
  assert.equal(first.nextOffset, 1);
  assert.notEqual(visuals.search({ query: "시연", limit: 1, offset: 1 }).results[0].id, first.results[0].id);
  assert.equal(visuals.search({ query: "시연", offset: 1000 }).results.length, 0);
  assert.throws(() => visuals.search({ query: " " }));
  assert.throws(() => visuals.search({ query: "배색", limit: 11 }));
  assert.throws(() => visuals.get({ id: "missing" }), { code: "UNKNOWN_VISUAL" });
  assert.throws(() => visuals.get({ id: "../package.json" }));
  assert.throws(() => visuals.readFile("../package.json"), { code: "UNKNOWN_VISUAL_FILE" });
});

test("bundled guidance links are portable and missing/invalid files fail explicitly", async t => {
  for (const { file, mimeType } of visuals.files.values()) {
    if (mimeType !== "text/markdown") continue;
    const text = visuals.readFile(file).text;
    assert.doesNotMatch(text, /\]\(\.\.?\//u);
    for (const [, name] of text.matchAll(/design:\/\/visual-files\/([a-z-]+\.(?:html|md))/gu)) {
      assert.ok(visuals.files.has(name), name);
    }
  }
  const directory = await mkdtemp(join(tmpdir(), "design-visuals-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const root = pathToFileURL(`${directory}/`);
  await assert.rejects(loadVisualCatalog(root), /ENOENT/u);
  await writeFile(join(directory, "boxing-overhead.html"), "");
  await assert.rejects(loadVisualCatalog(root), /Invalid or empty visual file/u);
});
