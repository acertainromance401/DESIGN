import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { z } from "zod";

const slug = z.string().regex(/^[a-z][a-z0-9-]*$/u);
const patternId = z.string().regex(/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/u);
const strings = z.array(z.string().min(1));
const sourceSchema = z.strictObject({
  project: z.string(),
  guidePath: z.string(),
  baseline: z.string(),
  verification: z.string(),
  examplePlatform: z.literal("swiftui"),
});
const categorySchema = z.strictObject({
  id: slug,
  keywords: strings,
  swiftui: z.string().min(1),
  web: z.string().min(1),
  checks: strings.min(1),
});
const definitionSchema = z.strictObject({
  sourceSnippet: z.string().regex(/^\d{2}$/u),
  id: patternId,
  category: slug,
  keywords: strings.min(1),
  principle: z.string().min(1),
  cautions: strings.min(1),
  dependencies: strings,
  supplements: strings.default([]),
  status: z.enum([
    "documented", "documented-with-limitations", "defined-not-connected", "reference", "inventory",
  ]).default("documented"),
});
const manifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  source: sourceSchema,
  categories: z.array(categorySchema).min(1),
  patterns: z.array(definitionSchema).min(1),
});
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const provenanceSchema = z.strictObject({
  schemaVersion: z.literal(1),
  source: sourceSchema,
  files: z.array(z.strictObject({
    file: z.string().regex(/^(?:README|[a-z][a-z0-9-]*)\.md$/u),
    originalSha256: sha256Schema,
    bundledSha256: sha256Schema,
    codeBlocks: z.array(sha256Schema),
  })),
});

export const platformSchema = z.enum(["swiftui", "web", "agnostic"]);
export type Platform = z.infer<typeof platformSchema>;
export const searchShape = {
  query: z.string().trim().min(1).max(200).describe("Korean/English keywords, e.g. 반응형 레이아웃 or scroll reveal"),
  category: slug.optional().describe("Optional category ID returned by list_design_categories"),
  platform: platformSchema.default("swiftui"),
  limit: z.number().int().min(1).max(10).default(6),
  offset: z.number().int().min(0).max(1000).default(0),
};
export const patternShape = {
  id: patternId.describe("Stable pattern ID returned by search_design_patterns"),
  platform: platformSchema.default("swiftui"),
  includeSourceExample: z.boolean().default(false).describe("Opt in to the full, non-standalone source excerpt; SwiftUI target only"),
};
export const adoptionShape = {
  objective: z.string().trim().min(1).max(1000),
  projectType: z.enum(["new", "existing"]),
  platform: platformSchema.default("swiftui"),
  patternIds: z.array(patternId).min(1).max(8).optional().describe("Prefer explicit IDs after search; otherwise the objective is searched"),
  categoryIds: z.array(slug).min(1).max(6).optional().describe("Optional category filter; does not force unrelated matches"),
};
const searchSchema = z.object(searchShape);
const adoptionSchema = z.object(adoptionShape);

type Definition = z.infer<typeof definitionSchema>;
type Category = z.infer<typeof categorySchema> & { title: string; patternCount: number };
type Source = z.infer<typeof sourceSchema>;
type Guide = { id: string; title: string; markdown: string };
type Pattern = Definition & { title: string; markdown: string; sourceReferences: string[]; languages: string[] };

export class DesignError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "DesignError";
  }
}

export const globalCautions = [
  "Reference values, colors, fonts, timings and breakpoints belong to WEASHION; map them to the target project instead of imposing them.",
  "Source snippets are excerpts, not standalone components. Resolve dependencies and API availability before use.",
  "Web implementation examples are not yet provided. Transfer principles, not SwiftUI/UIKit/SceneKit APIs.",
  "This server reads only its bundled catalog. It has not inspected, tested or modified the target project.",
  "Source implementation status is a document-snapshot claim, not a fresh application verification.",
];

export function codeBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/^```[^\n]*\n.*?^```[ \t]*$/gms)].map(([block]) => block);
}

function hash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function section(markdown: string, anchor: string): { title: string; body: string } {
  if (!/^[a-z0-9-]+$/u.test(anchor)) throw new Error(`Invalid section anchor: ${anchor}`);
  const match = markdown.match(new RegExp(
    `<a id="${anchor}"></a>\\s*\\n## ([^\\n]+)\\n([\\s\\S]*?)(?=\\n(?:<a id=|## )|$)`, "u",
  ));
  if (!match?.[1] || !match[2]) throw new Error(`Missing or empty section: ${anchor}`);
  return { title: match[1], body: match[2].trim() };
}

function unique(values: string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}`);
}

function tokenize(query: string): string[] {
  return [...new Set(query.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])];
}

export class DesignCatalog {
  constructor(
    public readonly source: Source,
    public readonly categories: readonly Category[],
    public readonly guides: ReadonlyMap<string, Guide>,
    public readonly patterns: ReadonlyMap<string, Pattern>,
  ) {}

  private category(id: string): Category {
    const category = this.categories.find((entry) => entry.id === id);
    if (!category) throw new DesignError("UNKNOWN_CATEGORY", `Unknown category "${id}". Call list_design_categories.`);
    return category;
  }

  private pattern(id: string): Pattern {
    const pattern = this.patterns.get(id);
    if (!pattern) throw new DesignError("UNKNOWN_PATTERN", `Unknown pattern "${id}". Call search_design_patterns.`);
    return pattern;
  }

  private summary(pattern: Pattern, platform: Platform) {
    return {
      id: pattern.id,
      title: pattern.title,
      category: pattern.category,
      principle: pattern.principle,
      sourceImplementationStatus: pattern.status,
      targetPlatform: platform,
      sourceExampleAvailable: platform === "swiftui" && pattern.languages.length > 0,
      uri: `design://patterns/${pattern.id}`,
    };
  }

  listCategories() {
    return {
      source: this.source,
      patternCount: this.patterns.size,
      categories: this.categories.map(({ id, title, keywords, patternCount }) => ({
        id, title, keywords, patternCount, uri: `design://guides/${id}`,
      })),
      cautions: globalCautions,
    };
  }

  private ranked(query: string, categoryIds: string[] = []) {
    for (const id of categoryIds) this.category(id);
    const tokens = tokenize(query);
    if (!tokens.length) throw new DesignError("EMPTY_QUERY", "Use at least one Korean/English word or number.");
    return [...this.patterns.values()]
      .filter((pattern) => !categoryIds.length || categoryIds.includes(pattern.category))
      .map((pattern) => {
        const definition = this.category(pattern.category);
        const primary = `${pattern.id} ${pattern.title} ${pattern.keywords.join(" ")}`.normalize("NFKC").toLowerCase();
        const secondary = `${pattern.principle} ${definition.keywords.join(" ")}`.normalize("NFKC").toLowerCase();
        const body = pattern.markdown.normalize("NFKC").toLowerCase();
        const score = tokens.reduce((sum, token) =>
          sum + (primary.includes(token) ? 8 : secondary.includes(token) ? 3 : body.includes(token) ? 1 : 0), 0);
        return { pattern, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.pattern.id.localeCompare(b.pattern.id));
  }

  search(input: z.input<typeof searchSchema>) {
    const { query, category, platform, limit, offset } = searchSchema.parse(input);
    const ranked = this.ranked(query, category ? [category] : []);
    const results = ranked.slice(offset, offset + limit).map(({ pattern, score }) => ({
      ...this.summary(pattern, platform), score,
    }));
    return {
      query, platform, total: ranked.length, offset,
      nextOffset: offset + limit < ranked.length ? offset + limit : null,
      results,
      matching: "Deterministic weighted keyword search, not semantic/vector search. Scores are relevance weights, not confidence.",
      guidance: results.length ? "Fetch selected IDs with get_design_pattern." : "No match. Try shorter keywords or list_design_categories; no unrelated fallback was selected.",
    };
  }

  getPattern(id: string, platform: Platform = "swiftui", includeSourceExample = false) {
    const pattern = this.pattern(id);
    const category = this.category(pattern.category);
    const includeExample = includeSourceExample && platform === "swiftui";
    return {
      ...this.summary(pattern, platform),
      adaptation: platform === "agnostic"
        ? "Preserve the principle and interaction semantics; choose and validate an implementation in the target platform. No platform-neutral executable component is supplied."
        : category[platform],
      cautions: [...pattern.cautions, ...globalCautions],
      sourceDependencies: pattern.dependencies,
      validationChecklist: category.checks,
      source: {
        ...this.source,
        snippet: pattern.sourceSnippet,
        guideUri: `design://guides/${pattern.category}`,
        references: pattern.sourceReferences,
        languages: pattern.languages,
        completeness: "reference-excerpt-not-standalone",
      },
      sourceExample: includeExample ? pattern.markdown : null,
      sourceExampleNotice: includeExample
        ? "Original reference excerpt, with portable provenance links. It is not a ready-to-paste component."
        : platform === "swiftui"
          ? "Full source is opt-in: set includeSourceExample=true."
          : "SwiftUI-project source is intentionally omitted for this target. Web implementation examples are not provided.",
    };
  }

  plan(input: z.input<typeof adoptionSchema>) {
    const request = adoptionSchema.parse(input);
    for (const id of request.categoryIds ?? []) this.category(id);
    const allowedCategories = new Set(request.categoryIds);
    let selected: Pattern[];
    if (request.patternIds) {
      if (new Set(request.patternIds).size !== request.patternIds.length) {
        throw new DesignError("DUPLICATE_PATTERN_IDS", "Each selected pattern ID must occur only once.");
      }
      selected = request.patternIds.map((id) => this.pattern(id));
      if (allowedCategories.size && selected.some((pattern) => !allowedCategories.has(pattern.category))) {
        throw new DesignError("CATEGORY_CONFLICT", "An explicit pattern is outside the requested categoryIds.");
      }
    } else {
      selected = this.ranked(request.objective, request.categoryIds)
        .slice(0, 6).map(({ pattern }) => pattern);
      if (!selected.length) {
        throw new DesignError("NO_MATCHING_PATTERNS",
          "No relevant pattern matched the objective and category filters. Search shorter keywords, then pass explicit patternIds.");
      }
    }
    const categoryIds = [...new Set(selected.map((pattern) => pattern.category))];
    return {
      objective: request.objective,
      projectType: request.projectType,
      platform: request.platform,
      assessment: "Guidance only. No target files have been inspected, edited or tested.",
      selectionMethod: request.patternIds ? "explicit-pattern-ids" : "keyword-matches",
      patterns: selected.map((pattern) => ({
        ...this.getPattern(pattern.id, request.platform),
        cautions: pattern.cautions,
      })),
      steps: [
        request.projectType === "existing"
          ? "먼저 연결된 AI가 기존 화면·토큰·컴포넌트·상태·테스트와 사용자 변경을 조사합니다. 기존 공개 동작과 디자인 규칙을 보존합니다."
          : "먼저 연결된 AI가 화면 목적·주요 행동·플랫폼 최소 버전·접근성·디자인 위계를 정하고 프로젝트 구조를 확인합니다.",
        "선택한 원칙을 대상 토큰·레이아웃·상태·언어 체계에 매핑합니다. 원본 수치나 브랜드 자산을 기본값으로 강제하지 않습니다.",
        request.platform === "web"
          ? "웹 구현은 별도로 작성·검증합니다. 원본 SwiftUI/UIKit/SceneKit 발췌를 웹 코드로 간주하거나 기계적으로 변환하지 않습니다."
          : "필요한 원본 예제만 조회하고 의존 타입·상태 소유권·API 가용성을 확인한 뒤 대상 프로젝트의 기존 도구로 구현합니다.",
        "작은 화면·큰 글씨·동작 줄이기·키보드/보조기술과 관련 상태 전환을 검증합니다. 경계값을 바꾸면 바로 전·경계·바로 뒤를 테스트합니다.",
        "연결된 AI가 실제 변경과 검증 결과·미수행 검증·남은 한계를 구분해 보고합니다. 이 MCP의 계획을 실행 완료로 표현하지 않습니다.",
      ],
      validationChecklist: [...new Set(categoryIds.flatMap((id) => this.category(id).checks))],
      cautions: globalCautions,
    };
  }
}

export async function loadCatalog(root = new URL("../content/", import.meta.url)): Promise<DesignCatalog> {
  const manifest = manifestSchema.parse(JSON.parse(await readFile(new URL("manifest.json", root), "utf8")));
  const provenance = provenanceSchema.parse(JSON.parse(await readFile(new URL("provenance.json", root), "utf8")));
  if (JSON.stringify(manifest.source) !== JSON.stringify(provenance.source)) {
    throw new Error("Manifest source differs from imported provenance. Re-import the reviewed guides.");
  }
  unique(manifest.categories.map(({ id }) => id), "category IDs");
  unique(manifest.patterns.map(({ id }) => id), "pattern IDs");
  unique(manifest.patterns.map(({ sourceSnippet }) => sourceSnippet), "source snippet IDs");
  unique(provenance.files.map(({ file }) => file), "provenance files");
  const expectedFiles = ["README.md", ...manifest.categories.map(({ id }) => `${id}.md`)];
  if (provenance.files.length !== expectedFiles.length ||
      expectedFiles.some((file) => !provenance.files.some((entry) => entry.file === file))) {
    throw new Error("Guide file inventory differs from manifest.");
  }
  const guides = new Map<string, Guide>();
  for (const record of provenance.files) {
    const markdown = await readFile(new URL(`guides/${record.file}`, root), "utf8");
    if (hash(markdown) !== record.bundledSha256 ||
        JSON.stringify(codeBlocks(markdown).map(hash)) !== JSON.stringify(record.codeBlocks)) {
      throw new Error(`Guide integrity mismatch: ${record.file}. Re-import reviewed source; do not silently serve stale metadata.`);
    }
    const title = markdown.match(/^# (.+)$/mu)?.[1];
    if (!title) throw new Error(`Guide has no title: ${record.file}`);
    const id = record.file.slice(0, -3);
    guides.set(id, { id, title, markdown });
  }
  const categories = manifest.categories.map((definition) => {
    const guide = guides.get(definition.id);
    if (!guide) throw new Error(`Missing category guide: ${definition.id}`);
    const patternCount = manifest.patterns.filter(({ category }) => category === definition.id).length;
    if (!patternCount) throw new Error(`Empty category: ${definition.id}`);
    return { ...definition, title: guide.title, patternCount };
  });
  const patterns = new Map<string, Pattern>();
  for (const definition of manifest.patterns) {
    const guide = guides.get(definition.category);
    if (!guide) throw new Error(`Unknown category for pattern: ${definition.id}`);
    const excerpt = section(guide.markdown, `snippet-${definition.sourceSnippet}`);
    let markdown = excerpt.body;
    for (const supplement of definition.supplements) {
      const [guideId, anchor] = supplement.split("#");
      const supplementGuide = guideId ? guides.get(guideId) : undefined;
      if (!supplementGuide || !anchor) throw new Error(`Invalid supplement: ${supplement}`);
      const addition = section(supplementGuide.markdown, anchor);
      markdown += `\n\n### ${addition.title}\n\n${addition.body}`;
    }
    patterns.set(definition.id, {
      ...definition,
      title: excerpt.title.replace(/^\d{2}\. /u, ""),
      markdown,
      sourceReferences: [...new Set([...markdown.matchAll(/`WEASHION:([^`]+)`/gu)].map((match) => match[1]!))],
      languages: [...new Set([...markdown.matchAll(/^```(\w+)/gmu)].map((match) => match[1]!))],
    });
  }
  const actualSnippets = [...guides.values()].flatMap(({ markdown }) =>
    [...markdown.matchAll(/^## (\d{2})\. /gmu)].map((match) => match[1]!));
  unique(actualSnippets, "bundled source sections");
  if (actualSnippets.length !== manifest.patterns.length ||
      actualSnippets.some((id) => !manifest.patterns.some(({ sourceSnippet }) => sourceSnippet === id))) {
    throw new Error("Bundled sections and manifest patterns do not match.");
  }
  return new DesignCatalog(manifest.source, categories, guides, patterns);
}
