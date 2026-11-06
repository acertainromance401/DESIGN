import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { loadLibrary, renderGeneralGuide } from "./library.js";
import type { GeneralPattern, PatternExamples } from "./library.js";

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
const originSchema = z.enum(["all", "weashion", "general"]);
export const searchShape = {
  query: z.string().trim().min(1).max(200).describe("Korean/English keywords, e.g. 반응형 레이아웃 or scroll reveal"),
  category: slug.optional().describe("Optional category ID returned by list_design_categories"),
  platform: platformSchema.default("swiftui"),
  limit: z.number().int().min(1).max(10).default(6),
  offset: z.number().int().min(0).max(1000).default(0),
  source: originSchema.default("all").describe("Filter original project references or the general design library"),
  hasExample: z.boolean().optional().describe("Filter by actual example availability for the selected platform; not a compatibility guarantee"),
};
export const patternShape = {
  id: patternId.describe("Stable pattern ID returned by search_design_patterns"),
  platform: platformSchema.default("swiftui"),
  includeSourceExample: z.boolean().default(false).describe("Opt in to the selected platform's example, if available. Original project excerpts remain SwiftUI-only."),
};
export const adoptionShape = {
  objective: z.string().trim().min(1).max(1000),
  projectType: z.enum(["new", "existing"]),
  platform: platformSchema.default("swiftui"),
  patternIds: z.array(patternId).min(1).max(8).optional().describe("Prefer explicit IDs after search; otherwise the objective is searched"),
  categoryIds: z.array(slug).min(1).max(6).optional().describe("Optional category filter; does not force unrelated matches"),
  source: originSchema.default("all"),
};
const searchSchema = z.object(searchShape);
const adoptionSchema = z.object(adoptionShape);

type Definition = z.infer<typeof definitionSchema>;
type Category = z.infer<typeof categorySchema> & {
  title: string; patternCount: number; guideId: string; origin: "weashion" | "general";
};
type Source = z.infer<typeof sourceSchema>;
type Guide = { id: string; title: string; markdown: string; origin: "weashion" | "general" };
type Pattern = Omit<Definition, "sourceSnippet" | "status"> & {
  sourceSnippet?: string;
  status: Definition["status"] | "guidance";
  origin: "weashion" | "general";
  title: string;
  markdown: string;
  sourceReferences: string[];
  languages: string[];
  authored?: GeneralPattern;
  examples?: PatternExamples;
};

export class DesignError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "DesignError";
  }
}

export const globalCautions = [
  "Project references and authored general guidance are different sources. Map reference values to the target, not a mandatory brand or breakpoint.",
  "Original WEASHION snippets are incomplete excerpts; general examples declare their own platform requirements and validation limits.",
  "Only selected general patterns include SwiftUI and web examples. No automatic SwiftUI-to-web translation or production-readiness guarantee is provided.",
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
    public readonly generalSource: { project: string; baseline: string; verification: string },
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
      sourceKind: pattern.origin,
      targetPlatform: platform,
      sourceExampleAvailable: this.hasExample(pattern, platform),
      uri: `design://patterns/${pattern.id}`,
    };
  }

  listCategories() {
    return {
      source: this.source,
      sources: [this.source, this.generalSource],
      patternCount: this.patterns.size,
      sourceCounts: {
        weashion: [...this.patterns.values()].filter(({ origin }) => origin === "weashion").length,
        general: [...this.patterns.values()].filter(({ origin }) => origin === "general").length,
      },
      categories: this.categories.map(({ id, title, keywords, patternCount, guideId, origin }) => ({
        id, title, keywords, patternCount, sourceKind: origin, uri: `design://guides/${guideId}`,
      })),
      cautions: globalCautions,
    };
  }

  private hasExample(pattern: Pattern, platform: Platform): boolean {
    return pattern.origin === "weashion"
      ? platform === "swiftui" && pattern.languages.length > 0
      : platform !== "agnostic" && pattern.examples?.[platform] !== undefined;
  }

  private ranked(query: string, categoryIds: string[] = [], source: z.infer<typeof originSchema> = "all",
    platform: Platform = "swiftui", hasExample?: boolean) {
    for (const id of categoryIds) this.category(id);
    const tokens = tokenize(query);
    if (!tokens.length) throw new DesignError("EMPTY_QUERY", "Use at least one Korean/English word or number.");
    return [...this.patterns.values()]
      .filter((pattern) => !categoryIds.length || categoryIds.includes(pattern.category))
      .filter((pattern) => source === "all" || pattern.origin === source)
      .filter((pattern) => hasExample === undefined || this.hasExample(pattern, platform) === hasExample)
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
    const { query, category, platform, limit, offset, source, hasExample } = searchSchema.parse(input);
    const ranked = this.ranked(query, category ? [category] : [], source, platform, hasExample);
    const results = ranked.slice(offset, offset + limit).map(({ pattern, score }) => ({
      ...this.summary(pattern, platform), score,
    }));
    return {
      query, platform, source, total: ranked.length, offset,
      nextOffset: offset + limit < ranked.length ? offset + limit : null,
      results,
      matching: "Deterministic weighted keyword search, not semantic/vector search. Scores are relevance weights, not confidence.",
      guidance: results.length ? "Fetch selected IDs with get_design_pattern." : "No match. Try shorter keywords or list_design_categories; no unrelated fallback was selected.",
    };
  }

  getPattern(id: string, platform: Platform = "swiftui", includeSourceExample = false) {
    const pattern = this.pattern(id);
    const category = this.category(pattern.category);
    const available = this.hasExample(pattern, platform);
    const includeExample = includeSourceExample && available;
    const example = platform !== "agnostic" ? pattern.examples?.[platform] : undefined;
    const authored = pattern.authored;
    return {
      ...this.summary(pattern, platform),
      adaptation: platform === "agnostic"
        ? "Preserve the principle and interaction semantics; choose and validate an implementation in the target platform. No platform-neutral executable component is supplied."
        : authored?.[platform] ?? category[platform],
      guidance: authored ? {
        useWhen: authored.useWhen,
        avoidWhen: authored.avoidWhen,
        anatomy: authored.anatomy,
        accessibility: authored.accessibility,
        relatedPatterns: authored.relatedPatterns.map((id) => `design://patterns/${id}`),
      } : null,
      cautions: [...pattern.cautions, ...globalCautions],
      sourceDependencies: example ? [example.requirements] : pattern.dependencies,
      validationChecklist: authored?.checks ?? category.checks,
      source: pattern.origin === "weashion" ? {
        ...this.source,
        snippet: pattern.sourceSnippet,
        guideUri: `design://guides/${pattern.category}`,
        references: pattern.sourceReferences,
        languages: pattern.languages,
        completeness: "reference-excerpt-not-standalone",
      } : {
        ...this.generalSource,
        guideUri: `design://guides/${category.guideId}`,
        references: pattern.sourceReferences,
        languages: pattern.languages,
        completeness: example ? "educational-example-not-production-component" : "guidance-without-code",
      },
      example: example ? {
        file: example.file,
        requirements: example.requirements,
        validation: example.validation,
        limitations: example.limitations,
      } : null,
      sourceExample: includeExample
        ? example ? `\`\`\`${platform === "web" ? "html" : "swift"}\n${example.code.trim()}\n\`\`\`` : pattern.markdown
        : null,
      sourceExampleNotice: includeExample
        ? example ? "Original educational example. Check declared validation and limitations; target-project verification remains required."
          : "Original reference excerpt, with portable provenance links. It is not a ready-to-paste component."
        : available
          ? "Full source is opt-in: set includeSourceExample=true."
          : "Source is omitted: no example is available for this pattern and target. Guidance is not executable code.",
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
      if (request.source !== "all" && selected.some(({ origin }) => origin !== request.source)) {
        throw new DesignError("SOURCE_CONFLICT", "An explicit pattern is outside the requested source filter.");
      }
      if (allowedCategories.size && selected.some((pattern) => !allowedCategories.has(pattern.category))) {
        throw new DesignError("CATEGORY_CONFLICT", "An explicit pattern is outside the requested categoryIds.");
      }
    } else {
      selected = this.ranked(request.objective, request.categoryIds, request.source, request.platform)
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
          ? "웹 구현은 별도로 검증합니다. 제공된 HTML 예제의 요구사항을 확인하고, 원본 SwiftUI/UIKit/SceneKit 발췌를 웹 코드로 간주하거나 기계적으로 변환하지 않습니다."
          : "필요한 원본 예제만 조회하고 의존 타입·상태 소유권·API 가용성을 확인한 뒤 대상 프로젝트의 기존 도구로 구현합니다.",
        "작은 화면·큰 글씨·동작 줄이기·키보드/보조기술과 관련 상태 전환을 검증합니다. 경계값을 바꾸면 바로 전·경계·바로 뒤를 테스트합니다.",
        "연결된 AI가 실제 변경과 검증 결과·미수행 검증·남은 한계를 구분해 보고합니다. 이 MCP의 계획을 실행 완료로 표현하지 않습니다.",
      ],
      validationChecklist: [...new Set([
        ...categoryIds.flatMap((id) => this.category(id).checks),
        ...selected.flatMap((pattern) => pattern.authored?.checks ?? []),
      ])],
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
    guides.set(id, { id, title, markdown, origin: "weashion" });
  }
  const categories: Category[] = manifest.categories.map((definition) => {
    const guide = guides.get(definition.id);
    if (!guide) throw new Error(`Missing category guide: ${definition.id}`);
    const patternCount = manifest.patterns.filter(({ category }) => category === definition.id).length;
    if (!patternCount) throw new Error(`Empty category: ${definition.id}`);
    return { ...definition, title: guide.title, patternCount, guideId: definition.id, origin: "weashion" };
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
      origin: "weashion",
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
  const library = await loadLibrary(root);
  for (const category of library.categories) {
    if (categories.some(({ id }) => id === category.id)) throw new Error(`General category collides with original: ${category.id}`);
    const guideId = `general-${category.id}`;
    if (guides.has(guideId)) throw new Error(`Guide ID collision: ${guideId}`);
    guides.set(guideId, {
      id: guideId, title: category.title, markdown: renderGeneralGuide(category), origin: "general",
    });
    categories.push({
      id: category.id, title: category.title, keywords: category.keywords,
      swiftui: category.swiftui, web: category.web, checks: category.checks,
      patternCount: category.patterns.length, guideId, origin: "general",
    });
    for (const authored of category.patterns) {
      if (patterns.has(authored.id)) throw new Error(`General pattern collides with original: ${authored.id}`);
      const examples = library.examples.get(authored.id) ?? {};
      patterns.set(authored.id, {
        id: authored.id, category: category.id, title: authored.title,
        keywords: authored.keywords, principle: authored.principle, cautions: authored.cautions,
        dependencies: [], supplements: [], status: "guidance", origin: "general",
        sourceReferences: category.references, authored, examples,
        markdown: [
          authored.useWhen, authored.avoidWhen, ...authored.anatomy,
          authored.swiftui, authored.web, authored.accessibility,
        ].join("\n"),
        languages: Object.keys(examples).map((platform) => platform === "web" ? "html" : "swift"),
      });
    }
  }
  for (const pattern of patterns.values()) {
    for (const related of pattern.authored?.relatedPatterns ?? []) {
      if (!patterns.has(related)) throw new Error(`Unknown related pattern ${related} in ${pattern.id}`);
    }
  }
  return new DesignCatalog(manifest.source, categories, guides, patterns, library.source);
}
