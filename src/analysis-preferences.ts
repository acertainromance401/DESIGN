import { z } from "zod";
import { analysisFocusSchema } from "./analysis-focuses.js";
import type { DesignAnalysis } from "./analyses.js";

const slug = z.string().regex(/^[a-z][a-z0-9-]*$/u);
const text = z.string().trim().min(1);
export const preferenceKeyword = "사용자 선호 레퍼런스";
export const preferenceUri = "design://design-preferences";
export const preferenceDocument = "docs/analyses/elements/design-preferences.md";

export const preferenceSignalSchema = z.strictObject({
  key: slug,
  focus: analysisFocusSchema,
  direction: z.enum(["prefer", "avoid"]),
  basis: z.enum(["explicit", "inferred"]),
  interpretation: text,
  contextKey: slug,
  context: text,
  application: text,
  tradeoff: text.optional(),
  evidenceIds: z.array(slug).min(1),
  userNote: text.optional(),
});
type PreferenceSignal = z.infer<typeof preferenceSignalSchema>;
export const preferenceGetShape = { focus: analysisFocusSchema.optional(), contextKey: slug.optional() };
type PreferenceFilter = z.infer<z.ZodObject<typeof preferenceGetShape>>;
type SourceSignal = { record: DesignAnalysis; signal: PreferenceSignal };
const priority = { explicit: 3, recurring: 2, tentative: 1 };

export const analysisExclusionsSchema = z.array(z.strictObject({
  analysisId: slug,
  visualId: slug,
  sourceLocation: text,
  reason: text,
}));
export type AnalysisExclusion = z.infer<typeof analysisExclusionsSchema>[number];

export function isPreferredReference(record: DesignAnalysis) {
  return record.status === "analyzed" && record.keywords.includes(preferenceKeyword);
}

export function preferenceSignalKey(signal: PreferenceSignal) {
  return `${signal.focus}:${signal.key}:${signal.contextKey}:${signal.direction}`;
}

export function buildPreferenceProfile(records: readonly DesignAnalysis[], filter: PreferenceFilter = {}) {
  const preferred = records.filter(isPreferredReference);
  const groups = new Map<string, [SourceSignal, ...SourceSignal[]]>();
  for (const record of records) {
    if (record.status !== "analyzed") continue;
    for (const signal of record.preferenceSignals ?? []) {
      if ((filter.focus && signal.focus !== filter.focus) || (filter.contextKey && signal.contextKey !== filter.contextKey)) continue;
      const key = preferenceSignalKey(signal);
      const matched = groups.get(key);
      if (matched) matched.push({ record, signal });
      else groups.set(key, [{ record, signal }]);
    }
  }
  const principles = [...groups.values()].map(group => {
    const first = group[0];
    const sources = new Set(group.map(({ record }) => record.source.referenceGroup
      ? `group:${record.source.referenceGroup}` : `location:${record.source.location.split("#")[0]}`));
    const weight: keyof typeof priority = group.some(({ signal }) => signal.basis === "explicit") ? "explicit"
      : sources.size >= 2 ? "recurring" : "tentative";
    return {
      key: first.signal.key, focus: first.signal.focus, contextKey: first.signal.contextKey,
      direction: first.signal.direction, weight,
      sourceCount: sources.size,
      references: group.map(({ record, signal }) => ({
        analysisId: record.id, basis: signal.basis, interpretation: signal.interpretation,
        context: signal.context, application: signal.application, evidenceIds: signal.evidenceIds,
        ...(signal.tradeoff ? { tradeoff: signal.tradeoff } : {}),
        ...(signal.userNote ? { userNote: signal.userNote } : {}),
      })),
    };
  });
  const matchingIds = new Set(principles.flatMap(item => item.references.map(ref => ref.analysisId)));
  return {
    uri: preferenceUri, document: preferenceDocument, ...filter,
    preferredReferenceIds: preferred.filter(record => !filter.focus && !filter.contextKey || matchingIds.has(record.id)).map(record => record.id),
    principles: principles.sort((a, b) => priority[b.weight] - priority[a.weight] ||
      a.key.localeCompare(b.key) || a.contextKey.localeCompare(b.contextKey) ||
      a.focus.localeCompare(b.focus) || a.direction.localeCompare(b.direction)),
    guidance: [
      "Use only principles relevant to the request and their recorded context. The current brief, function and accessibility are constraints.",
      "Explicit feedback outranks recurring observations from independent sources, which outrank tentative interpretations of one example. This is a rule-based priority, not model training.",
      "An overall preference does not confirm a preference for each observed feature. A rejected example is not evidence that the user dislikes its individual features.",
      "When two signals conflict, retain both contexts rather than averaging them. Explain which decision they inform, what was omitted, and what remains uncertain.",
    ],
  };
}
