import { readFile } from "node:fs/promises";
import { z } from "zod";

const text = z.string().trim().min(1);
const texts = z.array(text).min(1);
const slug = text.regex(/^[a-z][a-z0-9-]*$/u);
const exampleSchema = z.strictObject({
  file: text.regex(/^[a-z][a-z0-9-]*\.(swift|html)$/u),
  requirements: text,
  validation: z.enum(["typechecked-macos", "browser-tested"]),
  limitations: texts,
});
const patternSchema = z.strictObject({
  id: text.regex(/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/u),
  title: text,
  keywords: texts,
  principle: text,
  useWhen: text,
  avoidWhen: text,
  anatomy: texts,
  swiftui: text,
  web: text,
  accessibility: text,
  checks: texts.min(2),
  cautions: texts,
  relatedPatterns: z.array(text).default([]),
  examples: z.strictObject({
    swiftui: exampleSchema.optional(),
    web: exampleSchema.optional(),
  }).default({}),
});
const categorySchema = z.strictObject({
  id: slug,
  title: text,
  keywords: texts,
  swiftui: text,
  web: text,
  checks: texts,
  references: z.array(z.string().url()).min(1),
  patterns: z.array(patternSchema).min(1),
});
const indexSchema = z.strictObject({
  schemaVersion: z.literal(1),
  source: z.strictObject({
    project: z.literal("DESIGN General Library"),
    baseline: text,
    verification: text,
  }),
  categories: z.array(slug).min(1),
});

export type GeneralPattern = z.infer<typeof patternSchema>;
export type GeneralCategory = z.infer<typeof categorySchema>;
export type Example = z.infer<typeof exampleSchema> & { code: string };
export type PatternExamples = Partial<Record<"swiftui" | "web", Example>>;

export async function loadLibrary(root: URL) {
  const index = indexSchema.parse(JSON.parse(await readFile(new URL("library/index.json", root), "utf8")));
  if (new Set(index.categories).size !== index.categories.length) throw new Error("Duplicate general category IDs.");
  const categories: GeneralCategory[] = [];
  const examples = new Map<string, PatternExamples>();
  const ids = new Set<string>();
  for (const id of index.categories) {
    const category = categorySchema.parse(JSON.parse(await readFile(new URL(`library/${id}.json`, root), "utf8")));
    if (category.id !== id) throw new Error(`General category ID does not match filename: ${id}`);
    for (const pattern of category.patterns) {
      if (ids.has(pattern.id)) throw new Error(`Duplicate general pattern: ${pattern.id}`);
      ids.add(pattern.id);
      const loaded: PatternExamples = {};
      for (const platform of ["swiftui", "web"] as const) {
        const definition = pattern.examples[platform];
        if (!definition) continue;
        if (!definition.file.endsWith(platform === "swiftui" ? ".swift" : ".html")) {
          throw new Error(`Example file/platform mismatch: ${pattern.id}`);
        }
        if (definition.validation !== (platform === "swiftui" ? "typechecked-macos" : "browser-tested")) {
          throw new Error(`Example validation/platform mismatch: ${pattern.id}`);
        }
        const code = await readFile(new URL(`examples/${definition.file}`, root), "utf8");
        if (!code.trim()) throw new Error(`Empty example: ${definition.file}`);
        loaded[platform] = { ...definition, code };
      }
      examples.set(pattern.id, loaded);
    }
    categories.push(category);
  }
  return { source: index.source, categories, examples };
}

export function renderGeneralGuide(category: GeneralCategory): string {
  return [
    `# ${category.title}`,
    "DESIGN이 작성한 범용 설계 지침입니다. WEASHION에서의 사용·실행 검증을 주장하지 않습니다. " +
      "대표 코드의 플랫폼 요구사항과 검증 한계는 패턴 상세 응답에서 별도로 확인합니다.",
    ...category.patterns.map((pattern) => [
      `## ${pattern.title}`,
      `[패턴 상세](design://patterns/${pattern.id})`,
      pattern.principle,
      `- 사용: ${pattern.useWhen}\n- 피할 때: ${pattern.avoidWhen}`,
      `### 구조\n${pattern.anatomy.map((item) => `- ${item}`).join("\n")}`,
      `### 플랫폼 적용\n- SwiftUI: ${pattern.swiftui}\n- Web: ${pattern.web}`,
      `### 접근성\n${pattern.accessibility}`,
      `### 검증\n${pattern.checks.map((item) => `- ${item}`).join("\n")}`,
      `### 주의\n${pattern.cautions.map((item) => `- ${item}`).join("\n")}`,
    ].join("\n\n")),
    "## 참고 기준\n" + category.references.map((url) => `- ${url}`).join("\n"),
  ].join("\n\n") + "\n";
}
