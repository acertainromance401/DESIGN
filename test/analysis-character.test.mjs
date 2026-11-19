import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { AnalysisCatalog, analysisSchema } from "../dist/analyses.js";

const json = async (path) => JSON.parse(await readFile(new URL(`../content/${path}`, import.meta.url), "utf8"));
const moon = analysisSchema.parse(await json("analyses/pinterest-moon-concentric-poster.json"));
const legacy = analysisSchema.parse(await json("analyses/pinterest-quantus-palette.json"));
const catalog = new AnalysisCatalog([moon, legacy], analysisSchema.parse(await json("analysis-template.json")));

test("validates links to unique viewed observations and requires two for mood", () => {
  const cases = [
    [copy => { copy.character.mood.observations.pop(); }, /two distinct observations/u],
    [copy => { copy.character.mood.observations[1] = copy.character.mood.observations[0]; }, /Duplicate observation/u],
    [copy => { copy.character.mood.observations[1].axis = "layout"; }, /single non-unknown observation/u],
    [copy => { copy.elements["subject-composition"].findings[0].certainty = "unknown"; }, /single non-unknown observation/u],
    [copy => { copy.evidence[0].kind = "source-code"; }, /viewed evidence/u],
    [copy => { copy.layout.findings.push(copy.layout.findings[0]); }, /single non-unknown observation/u],
    [copy => { copy.character.style.certainty = "confirmed"; }, /Invalid discriminator/u],
    [copy => { copy.character.useCases[0].dimensions.push("mood"); }, /Duplicate character dimension/u],
    [copy => { delete copy.character.useCases[0].verify; }, /Invalid input/u],
  ];
  for (const [mutate, expected] of cases) {
    const copy = structuredClone(moon);
    mutate(copy);
    const result = analysisSchema.safeParse(copy);
    assert.equal(result.success, false);
    assert.match(result.error.message, expected);
  }
});

test("accepts explicit unknowns but not reuse based on them, or synthesis of partial records", () => {
  const unknown = { certainty: "unknown", reason: "해당 상태의 인상을 판단할 근거가 부족하다." };
  const copy = structuredClone(moon);
  copy.character.feel = unknown;
  assert.throws(() => analysisSchema.parse(copy), /not unknown dimensions/u);
  copy.character.useCases[0].dimensions = ["mood"];
  assert.deepEqual(analysisSchema.parse(copy).character.feel, unknown);
  assert.equal(legacy.character, undefined);
  const character = {
    viewedState: "색상표 이미지", mood: unknown, style: unknown, feel: unknown, impression: unknown, useCases: [],
  };
  assert.throws(() => analysisSchema.parse({ ...legacy, character }), /partial analysis/u);
});

test("prepares existing or new observations and reviews without changing the saved record", () => {
  assert.equal(catalog.character({}).mode, "guide");
  assert.equal(catalog.character({ id: legacy.id }).fullAnalysis, false);
  assert.throws(() => catalog.character({ id: "missing-reference" }), { code: "UNKNOWN_ANALYSIS" });
  assert.throws(() => catalog.character({ id: moon.id, record: moon }), { code: "INVALID_CHARACTER_INPUT" });
  const { character, ...record } = moon;
  const prepared = catalog.character({ record });
  assert.equal(prepared.mode, "prepare");
  assert.ok(prepared.fullAnalysis);
  assert.ok(prepared.observations.some(item => item.axis === "color"));
  const candidate = { ...character, viewedState: "검토할 프레임 범위" };
  const proposal = catalog.character({ record, character: candidate });
  assert.equal(proposal.mode, "reviewed");
  assert.equal(proposal.character.viewedState, candidate.viewedState);
  assert.deepEqual(catalog.character({ record: { ...record, character: candidate } }), proposal);
  assert.equal(catalog.character({ id: moon.id, character: candidate }).mode, "reviewed");
  assert.equal(catalog.character({ id: moon.id }).mode, "saved");
  assert.deepEqual(catalog.character({ id: moon.id }).character, character);
  assert.ok(!proposal.observations.some(item => item.axis === "color"));
  assert.deepEqual(proposal.evidence.map(item => item.id), ["pin-preview"]);
});

test("searches combined character and use cases without matching exclusions or unrelated dimensions", () => {
  const mood = { dimension: "mood", query: "고요 고립감" };
  const style = { dimension: "style", query: "기하학적" };
  const useCase = "전시 랜딩";
  const ids = args => catalog.search(args).results.map(item => item.id);
  assert.deepEqual(ids({ character: mood, useCase, scope: "preferred" }), [moon.id]);
  assert.deepEqual(ids({ character: style }), [moon.id]);
  assert.deepEqual(ids({ character: style, useCase }), []);
  assert.deepEqual(ids({ character: mood, useCase: "예매" }), []);
  assert.deepEqual(ids({ character: { query: "고립감 기하학적" } }), []);
  assert.deepEqual(ids({ useCase: "전시 랜딩", query: "moon" }), [moon.id]);
  assert.deepEqual(ids({ useCase: "전시 랜딩", status: "draft" }), []);
  assert.deepEqual(ids({ query: "Quantus" }), [legacy.id]);
  assert.throws(() => catalog.search({}), { code: "EMPTY_ANALYSIS_QUERY" });
  const specificPreference = { ...moon, preferenceFocuses: ["layout.hierarchy"] };
  const scoped = new AnalysisCatalog([specificPreference], catalog.template);
  assert.equal(scoped.search({ character: mood, scope: "preferred" }).total, 0);
  assert.equal(scoped.search({ character: mood }).total, 1);
});
