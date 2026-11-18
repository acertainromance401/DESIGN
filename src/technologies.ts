import { readFile } from "node:fs/promises";
import { z } from "zod";
import { DesignError } from "./catalog.js";
import type { ReuseData } from "./reuse.js";

const slug = z.string().regex(/^[a-z][a-z0-9-]*$/u);
const text = z.string().trim().min(1);
export const technologyCategories = {
  "web-ui": "웹 UI·앱 구조",
  styling: "레이아웃·색·타이포·디자인 시스템",
  "graphics-2d": "2D 그래픽·합성",
  "graphics-3d": "3D·셰이더·공간/XR",
  "motion-media": "모션·영상·오디오",
  "data-visualization": "데이터 시각화·지도",
  "native-cross-platform": "네이티브·크로스플랫폼 UI",
  "game-engines": "게임·인터랙티브 엔진",
  "asset-authoring": "시안·디자인 자산 제작",
  verification: "미리보기·품질·접근성 검수",
} as const;
const categoryId = z.enum(Object.keys(technologyCategories) as (keyof typeof technologyCategories)[]);
const platform = z.enum(["web", "ios", "macos", "android", "windows", "linux", "visionos"]);
const kind = z.enum(["technique", "api", "library", "framework", "engine", "tool", "service", "format", "workflow"]);
const status = z.enum(["source-backed", "candidate"]);
const metadata = z.strictObject({
  category: categoryId, kind,
  platforms: z.array(platform).min(1).refine(values => new Set(values).size === values.length, "Duplicate platforms"),
});
const optionSchema = metadata.extend({
  id: slug, title: text, keywords: z.array(text).min(1),
  what: text, useWhen: text, requires: text, tradeoff: text, check: text,
  reference: z.url({ protocol: /^https$/u }),
});
const optionsSchema = z.strictObject({
  schemaVersion: z.literal(1),
  sourceMetadata: z.record(slug, metadata),
  candidates: z.array(optionSchema).min(1),
});

export const technologyIndexUri = "design://technologies";
export const technologyDocument = "docs/technology-catalog.md";
export const technologySearchShape = {
  query: z.string().trim().min(1).max(200).optional(),
  category: categoryId.optional(),
  platform: platform.optional().describe("Where a technology can run or be used for authoring; not a compatibility guarantee"),
  kind: kind.optional(),
  status: status.optional(),
  limit: z.number().int().min(1).max(20).default(8),
  offset: z.number().int().min(0).max(1000).default(0),
};
type Technology =
  | (ReuseData["technologies"][number] & z.infer<typeof metadata> & { status: "source-backed"; exampleCount: number })
  | (z.infer<typeof optionSchema> & { status: "candidate"; exampleCount: 0 });

const normalize = (value: string) => value.normalize("NFKC").toLowerCase();
export function searchTerms(value: string) {
  return [...new Set(normalize(value).match(/[\p{L}\p{N}]+/gu) ?? [])];
}

export class TechnologyCatalog {
  constructor(public readonly entries: readonly Technology[]) {}

  index() {
    const sourceBackedCount = this.entries.filter(item => item.status === "source-backed").length;
    return {
      uri: technologyIndexUri, document: technologyDocument, count: this.entries.length,
      sourceBackedCount, candidateCount: this.entries.length - sourceBackedCount,
      categories: Object.entries(technologyCategories).map(([id, title]) => ({
        id, title, count: this.entries.filter(item => item.category === id).length,
      })),
      platforms: platform.options, kinds: kind.options, statuses: status.options,
      searchTool: "search_design_technologies",
      notice: "Catalog coverage only. No target environment, installed tools, SDK, license or browser/device compatibility was verified.",
    };
  }

  get(id: string) {
    const item = this.entries.find(technology => technology.id === id);
    if (!item) throw new DesignError("UNKNOWN_TECHNOLOGY", `Unknown technology "${id}". Call search_design_technologies.`);
    return { ...item, uri: `${technologyIndexUri}/${id}` };
  }

  search(input: unknown) {
    const args = z.object(technologySearchShape).parse(input);
    const terms = args.query ? searchTerms(args.query) : [];
    if (args.query && terms.length === 0) {
      throw new DesignError("EMPTY_TECHNOLOGY_QUERY", "Use a technology name or a descriptive keyword.");
    }
    const phrase = terms.join(" ");
    const ranked = this.entries.filter(item =>
      (!args.category || item.category === args.category) &&
      (!args.platform || item.platforms.includes(args.platform)) &&
      (!args.kind || item.kind === args.kind) && (!args.status || item.status === args.status),
    ).map(item => {
      if (!terms.length) return { item, score: 1 };
      const identity = [item.id, item.title].map(value => searchTerms(value).join(" "));
      const aliases = item.keywords.map(value => searchTerms(value).join(" "));
      const names = [...identity, ...aliases];
      const description = normalize(`${item.what} ${item.status === "candidate" ? item.useWhen : ""}`);
      const exact = identity.includes(phrase) ? 80 : aliases.includes(phrase) ? 20 : 0;
      const score = exact + terms.reduce((sum, term) =>
        sum + (names.some(name => name.includes(term)) ? 5 : description.includes(term) ? 1 : 0), 0);
      return { item, score };
    }).filter(match => match.score > 0).sort((a, b) => b.score - a.score ||
      Number(b.item.status === "source-backed") - Number(a.item.status === "source-backed") || a.item.id.localeCompare(b.item.id));
    const end = args.offset + args.limit;
    return {
      ...args, total: ranked.length, nextOffset: end < ranked.length ? end : null,
      results: ranked.slice(args.offset, end).map(({ item }) => ({
        id: item.id, title: item.title, category: item.category, kind: item.kind, status: item.status,
        platforms: item.platforms, exampleCount: item.exampleCount,
        summary: item.status === "candidate" ? item.useWhen : item.what, uri: `${technologyIndexUri}/${item.id}`,
      })),
      matching: "Keyword shortlist, not a verified match for the target system or an automatic recommendation.",
    };
  }
}

export async function loadTechnologyCatalog(root: URL, reuse: ReuseData) {
  const options = optionsSchema.parse(JSON.parse(await readFile(new URL("content/technology-options.json", root), "utf8")));
  const ids = new Set(reuse.technologies.map(item => item.id));
  for (const id of Object.keys(options.sourceMetadata)) {
    if (!ids.has(id)) throw new Error(`Metadata refers to unknown source-backed technology: ${id}`);
  }
  const documented = reuse.technologies.map((item): Technology => {
    const details = options.sourceMetadata[item.id];
    if (!details) throw new Error(`Missing source-backed technology metadata: ${item.id}`);
    const exampleCount = reuse.designs.filter(design => design.technologies.some(usage => usage.id === item.id)).length;
    if (!exampleCount) throw new Error(`Source-backed technology has no declared use: ${item.id}`);
    return { ...item, ...details, status: "source-backed", exampleCount };
  });
  const candidates = options.candidates.map((item): Technology => {
    if (ids.has(item.id)) throw new Error(`Duplicate technology ID: ${item.id}`);
    ids.add(item.id);
    return { ...item, status: "candidate", exampleCount: 0 };
  });
  return new TechnologyCatalog([...documented, ...candidates]);
}
