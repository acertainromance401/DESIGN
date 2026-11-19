import { readFile, readdir } from "node:fs/promises";
import { z } from "zod";
import { DesignError } from "./catalog.js";
import { characterDimensions, characterGuide, characterUri, designCharacterSchema } from "./analysis-character.js";
import { analysisFocusInfo, analysisFocusSchema, analysisScopeUri, type AnalysisFocus } from "./analysis-focuses.js";
import {
  analysisExclusionsSchema, buildPreferenceProfile, isPreferredReference, preferenceKeyword, preferenceSignalSchema,
  preferenceSignalKey, preferenceUri, type AnalysisExclusion,
} from "./analysis-preferences.js";

const slug = z.string().regex(/^[a-z][a-z0-9-]*$/u);
const text = z.string().trim().min(1);
const certainty = z.enum(["confirmed", "estimated", "unknown"]);
const evidenceIds = z.array(slug);
const finding = z.strictObject({
  topic: text, observation: text, certainty, evidenceIds, focus: analysisFocusSchema.optional(),
});
export type AnalysisFinding = z.infer<typeof finding>;
const section = z.strictObject({
  summary: text, findings: z.array(finding), reuse: z.array(text),
});
const coreAxes = ["color", "layout", "typography"] as const;
export const elementAxes = ["text-placement", "subject-composition", "lighting", "motion", "texture", "interaction"] as const;
export const analysisAxes = [...coreAxes, ...elementAxes] as const;
export type AnalysisAxis = typeof analysisAxes[number];
const characterSchema = designCharacterSchema(analysisAxes);
const axisDetails: Record<AnalysisAxis, { title: string; anchor: string }> = {
  color: { title: "색감 분석", anchor: "색감-분석" },
  layout: { title: "레이아웃 분석", anchor: "레이아웃-분석" },
  typography: { title: "폰트 분석", anchor: "폰트-분석" },
  "text-placement": { title: "글자 배치 분석", anchor: "text-placement" },
  "subject-composition": { title: "인물·피사체 구도 분석", anchor: "subject-composition" },
  lighting: { title: "조명 분석", anchor: "lighting" },
  motion: { title: "모션 분석", anchor: "motion" },
  texture: { title: "질감 분석", anchor: "texture" },
  interaction: { title: "상호작용 분석", anchor: "interaction" },
};

export function analysisLogInfo(axis: AnalysisAxis) {
  return {
    axis, ...axisDetails[axis],
    uri: `design://analysis-logs/${axis}`,
    document: axis === "color" ? "designs/palettes/color-combinations.md" : `docs/analyses/elements/${axis}.md`,
    documentAnchor: axis === "color" ? "#사용자-제공-레퍼런스-색감-분석" : "",
  };
}

const analysisRecord = z.strictObject({
  schemaVersion: z.literal(1),
  id: slug.refine(value => value !== "readme", "The readme ID is reserved for the report index"),
  title: text,
  summary: text,
  status: z.enum(["draft", "analyzed"]),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
  visualId: slug.optional(),
  source: z.strictObject({
    type: z.enum(["local-html", "url", "image", "other"]),
    location: text,
    description: text,
    referenceGroup: slug.optional(),
  }),
  keywords: z.array(text),
  evidence: z.array(z.strictObject({
    id: slug,
    kind: z.enum(["source-code", "browser-render", "image", "external-reference"]),
    location: text,
    description: text,
  })),
  analysisScope: z.array(z.enum(analysisAxes)).min(1).optional(),
  color: section.extend({
    palette: z.array(z.strictObject({
      role: text, value: text.nullable(), certainty, evidenceIds,
    })),
  }).optional(),
  layout: section.optional(),
  typography: section.extend({
    fonts: z.array(z.strictObject({
      role: text,
      declaredFamilies: z.array(text),
      renderedFamily: text.nullable(),
      weight: text.nullable(),
      identification: z.enum(["declared-only", "rendered-confirmed", "estimated", "unknown"]),
      evidenceIds,
      notes: text,
      license: text,
    })),
  }).optional(),
  elements: z.partialRecord(z.enum(elementAxes), section).optional(),
  character: characterSchema.optional(),
  preferenceFocuses: z.array(analysisFocusSchema).min(1).optional(),
  preferenceSignals: z.array(preferenceSignalSchema).optional(),
  limitations: z.array(text).min(1),
});
export type DesignAnalysis = z.infer<typeof analysisRecord>;
export const analysisSchema = analysisRecord.superRefine((record, context) => {
  const issue = (path: (string | number)[], message: string) => context.addIssue({ code: "custom", path, message });
  if (record.updatedAt < record.createdAt) issue(["updatedAt"], "updatedAt must not precede createdAt");
  if (record.source.type === "url" && !z.url({ protocol: /^https?$/u }).safeParse(record.source.location).success) {
    issue(["source", "location"], "URL references require an http(s) URL");
  }
  if (record.source.type === "local-html" && !record.source.location.endsWith(".html")) {
    issue(["source", "location"], "Local HTML references require an .html path");
  }
  const ids = new Set(record.evidence.map(item => item.id));
  if (ids.size !== record.evidence.length) issue(["evidence"], "Duplicate evidence IDs");
  function checkEvidence(references: string[], path: (string | number)[], required: boolean) {
    if (required && references.length === 0) issue(path, "Confirmed or estimated observations require evidence");
    for (const id of references) if (!ids.has(id)) issue(path, `Unknown evidence ID: ${id}`);
  }
  const scope = record.analysisScope && new Set(record.analysisScope);
  if (record.analysisScope && scope?.size !== record.analysisScope.length) {
    issue(["analysisScope"], "Duplicate analysis axes");
  }
  for (const axis of analysisAxes) {
    const observed = getAnalysisSection(record, axis);
    const isCoreAxis = axis === "color" || axis === "layout" || axis === "typography";
    const path = isCoreAxis ? [axis] : ["elements", axis];
    if (!observed) {
      if (scope?.has(axis) ?? isCoreAxis) issue(path, "Section is required for the analysis scope");
      continue;
    }
    if (record.character) {
      if (coreAxes.some(axis => !record[axis])) {
        issue(["character"], "Character synthesis requires color, layout and typography sections; do not infer it from a partial analysis");
      }
      const observations = collectCharacterObservations(record);
      for (const dimension of characterDimensions) {
        const item = record.character[dimension];
        if (item.certainty === "unknown") continue;
        const seen = new Set<string>();
        for (const [index, reference] of item.observations.entries()) {
          const path = ["character", dimension, "observations", index];
          const key = JSON.stringify([reference.axis, reference.topic]);
          if (seen.has(key)) issue(path, "Duplicate observation reference");
          seen.add(key);
          const matches = observations.filter(observation =>
            observation.axis === reference.axis && observation.topic === reference.topic);
          if (matches.length !== 1) {
            issue(path, "Reference must resolve to a single non-unknown observation with viewed evidence");
          }
        }
        if (dimension === "mood" && seen.size < 2) {
          issue(["character", dimension, "observations"], "Mood requires at least two distinct observations");
        }
      }
      record.character.useCases.forEach((useCase, index) => {
        const path = ["character", "useCases", index, "dimensions"];
        if (new Set(useCase.dimensions).size !== useCase.dimensions.length) issue(path, "Duplicate character dimension");
        if (useCase.dimensions.some(dimension => record.character?.[dimension].certainty !== "estimated")) {
          issue(path, "Use cases must be grounded in interpreted dimensions, not unknown dimensions");
        }
      });
    }
    if (scope && !scope.has(axis)) issue(path, "Section is outside the analysis scope");
    if (record.status === "analyzed" && observed.findings.length === 0) {
      issue([...path, "findings"], "Analyzed sections require findings");
    }
    observed.findings.forEach((item, index) => {
      const findingPath = [...path, "findings", index];
      checkEvidence(item.evidenceIds, [...findingPath, "evidenceIds"], item.certainty !== "unknown");
      if (item.focus && analysisFocusInfo(item.focus).axis !== axis) {
        issue([...findingPath, "focus"], `Focus "${item.focus}" does not belong to axis "${axis}"`);
      }
    });
  }
  record.color?.palette.forEach((item, index) => {
    checkEvidence(item.evidenceIds, ["color", "palette", index, "evidenceIds"], item.certainty !== "unknown");
    if (item.certainty !== "unknown" && item.value === null) issue(["color", "palette", index, "value"], "Known colors require a value");
    if (item.certainty === "unknown" && item.value !== null) issue(["color", "palette", index, "value"], "Unknown colors must use null");
  });
  record.typography?.fonts.forEach((font, index) => {
    checkEvidence(font.evidenceIds, ["typography", "fonts", index, "evidenceIds"], font.identification !== "unknown");
    if (font.identification === "rendered-confirmed" && font.renderedFamily === null) {
      issue(["typography", "fonts", index, "renderedFamily"], "Rendered confirmation requires the actual font");
    }
    if (font.identification === "rendered-confirmed" && !record.evidence.some(item =>
      item.kind === "browser-render" && font.evidenceIds.includes(item.id))) {
      issue(["typography", "fonts", index, "evidenceIds"], "Rendered fonts require browser-render evidence, not CSS alone");
    }
    if (font.identification !== "rendered-confirmed" && font.renderedFamily !== null) {
      issue(["typography", "fonts", index, "renderedFamily"], "Do not report an unverified rendered font");
    }
    if (font.identification === "declared-only" && font.declaredFamilies.length === 0) {
      issue(["typography", "fonts", index, "declaredFamilies"], "Declared fonts require a family stack");
    }
  });
  const taggedPreferred = record.keywords.includes(preferenceKeyword);
  if (record.preferenceFocuses) {
    if (!taggedPreferred) issue(["preferenceFocuses"], "Preference scope requires a user-provided preferred reference");
    if (new Set(record.preferenceFocuses).size !== record.preferenceFocuses.length) {
      issue(["preferenceFocuses"], "Duplicate preferred focuses");
    }
  }
  const signalKeys = new Set<string>();
  for (const [index, signal] of (record.preferenceSignals ?? []).entries()) {
    const path = ["preferenceSignals", index];
    const key = preferenceSignalKey(signal);
    if (signalKeys.has(key)) issue(path, "Duplicate preference signal");
    signalKeys.add(key);
    if (signal.direction === "prefer" && (!taggedPreferred || record.preferenceFocuses && !record.preferenceFocuses.includes(signal.focus))) {
      issue(path, "Positive preference signals require a user-provided preferred reference within its stated scope");
    }
    if (signal.basis === "explicit" && !signal.userNote) issue([...path, "userNote"], "Explicit preference requires the user's stated feedback");
    if (signal.basis === "inferred" && (signal.userNote || signal.direction === "avoid")) {
      issue(path, "Do not infer rejection or attach explicit user feedback to an inferred signal");
    }
    checkEvidence(signal.evidenceIds, [...path, "evidenceIds"], true);
    const observed = getAnalysisSection(record, analysisFocusInfo(signal.focus).axis);
    const findingEvidence = new Set(observed?.findings.filter(item =>
      item.focus === signal.focus && item.certainty !== "unknown").flatMap(item => item.evidenceIds));
    if (signal.evidenceIds.some(id => !findingEvidence.has(id))) {
      issue([...path, "evidenceIds"], "Preference signals require observed evidence from the same focus");
    }
  }
  if (record.status === "analyzed") {
    if (record.evidence.length === 0) issue(["evidence"], "Analyzed records require source evidence");
    if (record.color?.palette.length === 0) issue(["color", "palette"], "Record colors or an explicitly unknown palette");
    if (record.typography?.fonts.length === 0) issue(["typography", "fonts"], "Record fonts or explicitly unknown identification");
  }
});

export function getAnalysisSection(record: DesignAnalysis, axis: AnalysisAxis) {
  return axis === "color" || axis === "layout" || axis === "typography" ? record[axis] : record.elements?.[axis];
}

function collectCharacterObservations(record: DesignAnalysis) {
  const viewedEvidence = new Set(record.evidence.filter(item => item.kind !== "source-code").map(item => item.id));
  return analysisAxes.flatMap(axis => {
    const findings = getAnalysisSection(record, axis)?.findings ?? [];
    return findings.filter(item => item.certainty !== "unknown" &&
      item.evidenceIds.some(id => viewedEvidence.has(id)) &&
      findings.filter(other => other.topic === item.topic).length === 1,
    ).map(item => ({ axis, ...item }));
  });
}

const searchQuery = z.string().trim().min(1).max(200);
export const analysisCharacterShape = {
  id: slug.optional().describe("Saved reference ID. Omit for a new record or the general rubric."),
  record: z.record(z.string(), z.unknown()).optional().describe("New client-authored analysis JSON with observations and evidence. Do not combine with id."),
  character: characterSchema.optional().describe("Optional synthesis to review against id or record. Omit to inspect the available observations and rubric."),
};

export const analysisSearchShape = {
  query: searchQuery.optional().describe("Keyword query for saved element observations or reference metadata. Provide this, character, or useCase."),
  character: z.strictObject({ query: searchQuery, dimension: z.enum(characterDimensions).optional() }).optional()
    .describe("Match the words within one interpreted dimension (mood, style, feel or impression)."),
  useCase: searchQuery.optional().describe("Match the words within a single use case's context and goal, not avoid conditions."),
  axis: z.enum(["all", ...analysisAxes]).default("all"),
  focus: analysisFocusSchema.optional(),
  status: z.enum(["all", "draft", "analyzed"]).default("analyzed"),
  scope: z.enum(["all", "preferred"]).default("all"),
  visualId: slug.optional(),
  limit: z.number().int().min(1).max(10).default(5),
  offset: z.number().int().min(0).max(10000).default(0),
};
export const analysisGetShape = { id: slug, axis: z.enum(analysisAxes).optional(), focus: analysisFocusSchema.optional() };
const normalized = (value: string) => value.normalize("NFKC").toLowerCase();
function queryTerms(query: string) {
  const terms = [...new Set(normalized(query).match(/[\p{L}\p{N}]+/gu) ?? [])];
  if (terms.length === 0) throw new DesignError("EMPTY_ANALYSIS_QUERY", "Use a color, layout, font name or descriptive keyword.");
  return terms;
}
function matchesTerms(value: string, terms: string[]) {
  const body = normalized(value);
  return terms.every(term => body.includes(term));
}
const sectionValues = (record: DesignAnalysis) =>
  [record.color, record.layout, record.typography, ...Object.values(record.elements ?? {})].filter(section => section !== undefined);

function resolveFocus(axis: AnalysisAxis | "all" | undefined, focus: AnalysisFocus | undefined) {
  if (!focus) return undefined;
  const definition = analysisFocusInfo(focus);
  if (axis && axis !== "all" && axis !== definition.axis) {
    throw new DesignError("ANALYSIS_FOCUS_AXIS_MISMATCH", `Focus "${focus}" belongs to "${definition.axis}", not "${axis}".`);
  }
  return definition;
}

export class AnalysisCatalog {
  constructor(
    public readonly entries: readonly DesignAnalysis[],
    public readonly template: DesignAnalysis,
    public readonly exclusions: readonly AnalysisExclusion[] = [],
  ) {}

  assertEligible(record: DesignAnalysis) {
    const excluded = this.exclusions.find(item =>
      item.analysisId === record.id || item.visualId === record.visualId || item.sourceLocation === record.source.location);
    if (excluded) throw new DesignError("ANALYSIS_EXCLUDED", `Analysis "${record.id}" is excluded: ${excluded.reason}`);
  }

  preferences(filter?: Parameters<typeof buildPreferenceProfile>[1]) {
    return buildPreferenceProfile(this.entries, filter);
  }

  summary(record: DesignAnalysis) {
    return {
      id: record.id, title: record.title, summary: record.summary,
      status: record.status, updatedAt: record.updatedAt, visualId: record.visualId ?? null,
      ...(record.preferenceFocuses ? { preferenceFocuses: record.preferenceFocuses } : {}),
      ...(record.character ? { hasCharacter: true } : {}),
      uri: `design://analyses/${record.id}`, file: `content/analyses/${record.id}.json`,
      document: `docs/analyses/${record.id}.md`, axes: analysisAxes.filter(axis => !!getAnalysisSection(record, axis)),
    };
  }

  logEntries(axis: AnalysisAxis) {
    return this.entries.flatMap(record => {
      const observed = getAnalysisSection(record, axis);
      return observed && isPreferredReference(record)
        ? [{ record, section: observed }] : [];
    });
  }

  list() {
    return {
      analysisCount: this.entries.length,
      analyzedCount: this.entries.filter(item => item.status === "analyzed").length,
      draftCount: this.entries.filter(item => item.status === "draft").length,
      characterCount: this.entries.filter(item => item.status === "analyzed" && item.character).length,
      uri: "design://analyses", templateUri: "design://analysis-template", schemaUri: "design://analysis-schema",
      recordingGuideUri: "design://analysis-workflow", scopeUri: analysisScopeUri, preferenceUri, characterUri,
      analyses: this.entries.map(item => this.summary(item)),
      logs: analysisAxes.map(axis => ({ ...analysisLogInfo(axis), entryCount: this.logEntries(axis).length })),
      notice: "Saved reference observations, not implementation or automatic target inspection. Drafts are excluded from search by default.",
    };
  }

  forVisual(id: string) {
    return this.entries.filter(item => item.visualId === id);
  }

  searchText(id: string) {
    return this.forVisual(id).filter(item => item.status === "analyzed")
      .map(item => JSON.stringify([item.keywords, ...sectionValues(item)])).join(" ");
  }

  private lookup(id: string) {
    const record = this.entries.find(item => item.id === id);
    if (!record) throw new DesignError("UNKNOWN_ANALYSIS", `Unknown analysis "${id}". Call search_design_analyses.`);
    return record;
  }

  character({ id, record: input, character }: z.infer<z.ZodObject<typeof analysisCharacterShape>>) {
    if ((id && input) || (character && !id && !input) || (character && input?.character !== undefined)) {
      throw new DesignError("INVALID_CHARACTER_INPUT", "Pass a saved id or a new record, not both. Supply a synthesis once, with its source record.");
    }
    const guide = characterGuide();
    if (!id && !input) return { mode: "guide", ...guide };
    const saved = id ? this.lookup(id) : undefined;
    const result = analysisSchema.safeParse(character ? { ...(saved ?? input), character } : saved ?? input);
    if (!result.success) {
      throw new DesignError("INVALID_CHARACTER_RECORD", result.error.issues.map(issue =>
        `${issue.path.join(".") || "record"}: ${issue.message}`).join("; "));
    }
    const record = result.data;
    this.assertEligible(record);
    const observations = collectCharacterObservations(record);
    const referenced = record.character && new Set(characterDimensions.flatMap(dimension => {
      const item = record.character?.[dimension];
      return item?.certainty === "estimated"
        ? item.observations.map(reference => JSON.stringify([reference.axis, reference.topic])) : [];
    }));
    const selected = observations.filter(item => !referenced || referenced.has(JSON.stringify([item.axis, item.topic])));
    const usedEvidence = new Set(selected.flatMap(item => item.evidenceIds));
    return {
      mode: (character || input?.character ? "reviewed" : record.character ? "saved" : "prepare"),
      id: record.id, title: record.title, status: record.status, ...guide,
      fullAnalysis: coreAxes.every(axis => !!record[axis]), observations: selected,
      evidence: record.evidence.filter(item => usedEvidence.has(item.id)),
      ...(record.character ? { character: record.character } : {}),
      limitations: record.limitations,
    };
  }

  get(id: string, axis?: AnalysisAxis, focus?: AnalysisFocus) {
    const record = this.lookup(id);
    const focusDefinition = resolveFocus(axis, focus);
    const selectedAxis = focusDefinition?.axis ?? axis;
    const notice = "Font declarations, rendered confirmation and estimates remain distinct. No external source was fetched by this request.";
    if (!selectedAxis) return { ...record, uri: `design://analyses/${id}`, notice };
    const observed = getAnalysisSection(record, selectedAxis);
    if (!observed) throw new DesignError("ANALYSIS_AXIS_NOT_RECORDED", `Analysis "${id}" has no recorded "${selectedAxis}" section.`);
    const selectedFindings = focusDefinition ? observed.findings.filter(item => item.focus === focus) : observed.findings;
    if (focusDefinition && !selectedFindings.length) {
      throw new DesignError("ANALYSIS_FOCUS_NOT_RECORDED", `Analysis "${id}" has no findings tagged "${focus}".`);
    }
    const evidenceIds = new Set([
      ...selectedFindings.flatMap(item => item.evidenceIds),
      ...(!focusDefinition && selectedAxis === "color" && record.color ? record.color.palette.flatMap(item => item.evidenceIds) : []),
      ...(!focusDefinition && selectedAxis === "typography" && record.typography ? record.typography.fonts.flatMap(item => item.evidenceIds) : []),
    ]);
    return {
      ...this.summary(record), axis: selectedAxis,
      ...(focusDefinition
        ? { focus: focusDefinition.id, summary: focusDefinition.title, section: { findings: selectedFindings } }
        : { summary: observed.summary, section: observed }),
      evidence: record.evidence.filter(item => evidenceIds.has(item.id)),
      logUri: analysisLogInfo(selectedAxis).uri, notice,
    };
  }

  search(input: unknown) {
    const args = z.object(analysisSearchShape).parse(input);
    const focus = resolveFocus(args.axis, args.focus);
    const axis = focus?.axis ?? args.axis;
    if (!args.query && (!args.character && !args.useCase || axis !== "all")) {
      throw new DesignError("EMPTY_ANALYSIS_QUERY", "Pass a keyword query, character filter, or use case. Axis and focus filters require a keyword query.");
    }
    const terms = args.query ? queryTerms(args.query) : [];
    const characterTerms = args.character && queryTerms(args.character.query);
    const useCaseTerms = args.useCase && queryTerms(args.useCase);
    const ranked = this.entries.filter(item =>
      (args.status === "all" || item.status === args.status) && (!args.visualId || item.visualId === args.visualId) &&
      (args.scope === "all" || isPreferredReference(item)),
    ).flatMap(record => {
      const metadata = normalized(`${record.id} ${record.title} ${record.summary} ${record.keywords.join(" ")}`);
      const scopedFocuses = args.scope === "preferred" ? record.preferenceFocuses : undefined;
      if (characterTerms || useCaseTerms) {
        const character = record.character;
        if (!character || scopedFocuses) return [];
        const dimensions = args.character?.dimension ? [args.character.dimension] : characterDimensions;
        const matchedDimensions = characterTerms ? dimensions.filter(dimension => {
          const item = character[dimension];
          return item.certainty === "estimated" && matchesTerms(`${item.label} ${item.reasoning}`, characterTerms);
        }) : undefined;
        if (matchedDimensions?.length === 0) return [];
        if (useCaseTerms && !character.useCases.some(useCase =>
          matchesTerms(`${useCase.context} ${useCase.goal}`, useCaseTerms) &&
          (!matchedDimensions || useCase.dimensions.some(dimension => matchedDimensions.includes(dimension))))) return [];
        if (!terms.length) return [{ record, score: 1 }];
      }
      const observed = scopedFocuses
        ? (axis === "all" ? sectionValues(record) : [getAnalysisSection(record, axis)])
          .flatMap(section => (section?.findings ?? []).filter(item =>
            item.focus && scopedFocuses.includes(item.focus) && (!focus || item.focus === focus.id))
            .map(item => [item.topic, item.observation]))
        : focus
        ? getAnalysisSection(record, focus.axis)?.findings.filter(item => item.focus === focus.id).map(item => [item.topic, item.observation])
        : axis === "all" ? sectionValues(record) : getAnalysisSection(record, axis);
      if (!observed) return [];
      const body = normalized(JSON.stringify(observed));
      const score = terms.reduce((sum, term) => sum +
        (axis === "all" && !scopedFocuses && metadata.includes(term) ? 5 : body.includes(term) ? 2 : 0), 0);
      return [{ record, score }];
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.record.id.localeCompare(b.record.id));
    const end = args.offset + args.limit;
    return {
      ...(args.query ? { query: args.query } : {}),
      ...(args.character ? { character: args.character } : {}), ...(args.useCase ? { useCase: args.useCase } : {}),
      axis, ...(focus ? { focus: focus.id } : {}), status: args.status, scope: args.scope,
      total: ranked.length, offset: args.offset,
      nextOffset: end < ranked.length ? end : null,
      results: ranked.slice(args.offset, end).map(item => this.summary(item.record)),
      matching: "Deterministic keyword search. Axis/focus filters restrict query. Character and use-case filters require every keyword within one interpreted dimension or one stated use case, respectively. When combined, the use case must cite a matching dimension.",
    };
  }
}

export async function loadAnalysisCatalog(root: URL, visualIds: ReadonlySet<string>): Promise<AnalysisCatalog> {
  const template = analysisSchema.parse(JSON.parse(await readFile(new URL("content/analysis-template.json", root), "utf8")));
  const exclusions = analysisExclusionsSchema.parse(JSON.parse(await readFile(new URL("content/analysis-exclusions.json", root), "utf8")));
  const directory = new URL("content/analyses/", root);
  const entries: DesignAnalysis[] = [];
  for (const file of (await readdir(directory)).filter(file => file.endsWith(".json")).sort()) {
    if (!/^[a-z][a-z0-9-]*\.json$/u.test(file)) throw new Error(`Invalid analysis filename: ${file}`);
    const record = analysisSchema.parse(JSON.parse(await readFile(new URL(file, directory), "utf8")));
    if (file !== `${record.id}.json`) throw new Error(`Analysis filename must match its ID: ${file}`);
    if (record.visualId && !visualIds.has(record.visualId)) throw new Error(`Unknown analysis visual ID: ${record.visualId}`);
    entries.push(record);
  }
  const catalog = new AnalysisCatalog(entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id)), template, exclusions);
  for (const record of entries) catalog.assertEligible(record);
  return catalog;
}
