import assert from "node:assert/strict";
import test from "node:test";
import { AnimationClock, AsciiCharacter, getDrawingSize, getGridSize } from "../designs/characters/assets/ascii/renderer.js";

test("ASCII grid uses CSS character dimensions, independent of display pixel ratio", () => {
  assert.deepEqual(getGridSize(960, 640, 8), { columns: 180, rows: 80 });
  assert.deepEqual(getGridSize(360, 480, 8), { columns: 67, rows: 60 });
  assert.ok(getGridSize(960, 640, 6).columns > getGridSize(960, 640, 14).columns);
});

test("large or extremely fine grids stay inside the GPU sampling budget", () => {
  for (const [width, height, size] of [[7680, 4320, 1], [800, 9000, 1], [9000, 100, 1]]) {
    const { columns, rows } = getGridSize(width, height, size);
    assert.ok(columns > 0 && columns <= 320);
    assert.ok(rows > 0 && rows <= 180);
    assert.ok(columns * rows <= 36000);
  }
  assert.deepEqual(getGridSize(1, 1, 14), { columns: 1, rows: 1 });
});

test("drawing resolution is capped without inflating the character sampling grid", () => {
  assert.deepEqual(getDrawingSize(960, 640, 3), { width: 1440, height: 960 });
  assert.deepEqual(getDrawingSize(400, 600, 1), { width: 400, height: 600 });
  const large = getDrawingSize(7680, 4320, 2);
  assert.ok(large.width <= 2048 && large.height <= 1536);
  assert.ok(Math.abs(large.width / large.height - 7680 / 4320) < 0.002);
});

test("invalid dimensions and non-finite rendering inputs fail explicitly", () => {
  for (const invalid of [0, -1, NaN, Infinity]) {
    assert.throws(() => getGridSize(invalid, 600, 8), RangeError);
    assert.throws(() => getGridSize(600, invalid, 8), RangeError);
    assert.throws(() => getGridSize(600, 600, invalid), RangeError);
    assert.throws(() => getDrawingSize(600, 600, invalid), RangeError);
  }
});

test("animation starts without a jump and caps long frame stalls", () => {
  const clock = new AnimationClock();
  assert.equal(clock.sample(2000, true), 0);
  assert.equal(clock.sample(2020, true), 0.02);
  assert.equal(clock.sample(10000, true), 0.07);
});

test("paused and hidden intervals do not advance animation on resume", () => {
  const clock = new AnimationClock();
  clock.sample(0, true);
  clock.sample(20, true);
  assert.equal(clock.sample(40, false), 0.02);
  assert.equal(clock.sample(4000, false), 0.02);
  clock.reset();
  assert.equal(clock.sample(8000, true), 0.02);
  assert.equal(clock.sample(8020, true), 0.04);
});

test("invalid or backwards animation timestamps are rejected", () => {
  const clock = new AnimationClock();
  for (const invalid of [-1, NaN, Infinity]) assert.throws(() => clock.sample(invalid, true), RangeError);
  clock.sample(100, true);
  assert.throws(() => clock.sample(50, true), RangeError);
});

test("queued resize callbacks do not access a lost or disposed WebGL context", () => {
  const renderer = Object.create(AsciiCharacter.prototype);
  renderer.stopped = true;
  renderer.canvas = {
    getBoundingClientRect() { throw new Error("Stopped renderer accessed its canvas"); },
  };
  assert.doesNotThrow(() => renderer.resize());
});
