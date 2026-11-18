import { readFile } from "node:fs/promises";
import { z } from "zod";

const slug = z.string().regex(/^[a-z][a-z0-9-]*$/u);
const strings = z.array(z.string().min(1)).min(1);
const sourcePath = z.string().regex(/^(?:designs|scripts)\/[a-zA-Z0-9/._-]+$/u)
  .refine(value => !value.split("/").some(part => part === "." || part === ".." || part === ""), "Invalid source path");
const distribution = z.enum(["bundled", "local-only"]);
export const reusePlatformSchema = z.enum(["web", "swiftui", "metal", "realitykit", "spritekit", "unity", "godot", "unreal"]);
export type ReusePlatform = z.infer<typeof reusePlatformSchema>;
export const visualPlanShape = {
  visualIds: z.array(slug).min(1).max(8).refine(ids => new Set(ids).size === ids.length, "Duplicate visual IDs"),
  platform: reusePlatformSchema,
  projectType: z.enum(["new", "existing"]),
};
export const technologyGetShape = { id: slug };
const schema = z.strictObject({
  schemaVersion: z.literal(1),
  supportFiles: z.array(sourcePath.refine(value => value.startsWith("scripts/") && value.endsWith(".mjs"), "Support files must be scripts")),
  families: z.array(z.strictObject({ id: slug, title: z.string().min(1), summary: z.string().min(1) })).min(1),
  platforms: z.array(z.strictObject({
    id: reusePlatformSchema, title: z.string().min(1), requirements: strings, workflow: strings,
    validation: strings, limits: strings, references: z.array(z.url()).min(1),
  })).min(1),
  technologies: z.array(z.strictObject({
    id: slug, title: z.string().min(1), keywords: strings, what: z.string().min(1),
    web: z.string().min(1), apple: z.string().min(1), game: z.string().min(1),
    checks: strings, references: z.array(z.url()).min(1),
  })).min(1),
  assets: z.array(z.strictObject({
    id: slug, paths: z.array(sourcePath).min(1), distribution,
    rights: z.string().min(1), replacement: z.string().min(1),
  })),
  guidePaths: z.record(z.string().regex(/^[a-z-]+\.md$/u), sourcePath.refine(value => value.endsWith(".md"), "Guide must be Markdown")),
  designs: z.array(z.strictObject({
    id: slug, family: slug, path: sourcePath.refine(value => value.endsWith(".html"), "Design must be HTML"),
    legacyPath: z.string().regex(/^(?:docs\/)?[a-z][a-z0-9-]*\.html$/u),
    distribution, sourceFiles: z.array(sourcePath.refine(value => value.endsWith(".js"), "Runtime sources must be JavaScript")), assetIds: z.array(slug),
    technologies: z.array(z.strictObject({
      id: slug, location: sourcePath, application: z.string().min(1),
    })).min(1),
    reusableParts: strings, native: z.string().min(1), game: z.string().min(1),
    requirements: strings, checks: strings,
  })).min(1),
});
export type ReuseData = z.infer<typeof schema>;
export type ReuseDesign = ReuseData["designs"][number];

export async function loadReuseData(root: URL): Promise<ReuseData> {
  const data = schema.parse(JSON.parse(await readFile(new URL("content/design-reuse.json", root), "utf8")));
  for (const [label, rows] of Object.entries({
    family: data.families, platform: data.platforms, technology: data.technologies,
    asset: data.assets, design: data.designs,
  })) {
    if (new Set(rows.map(row => row.id)).size !== rows.length) throw new Error(`Duplicate reuse ${label} ID`);
  }
  if (data.platforms.length !== reusePlatformSchema.options.length) throw new Error("Missing reuse platform");
  const declaredSources = new Set([
    ...data.supportFiles, ...data.designs.flatMap(design => [design.path, ...design.sourceFiles]),
  ]);
  const paths = new Set<string>();
  for (const design of data.designs) {
    if (!data.families.some(family => family.id === design.family)) throw new Error(`Unknown family: ${design.family}`);
    if (!design.path.startsWith(`designs/${design.family}/`)) throw new Error(`Wrong family path: ${design.path}`);
    if (paths.has(design.path)) throw new Error(`Duplicate design path: ${design.path}`);
    paths.add(design.path);
    for (const technology of design.technologies) {
      if (!data.technologies.some(entry => entry.id === technology.id)) throw new Error(`Unknown technology: ${technology.id}`);
      if (!declaredSources.has(technology.location)) throw new Error(`Undeclared evidence source: ${technology.location}`);
    }
    for (const id of design.assetIds) {
      if (!data.assets.some(asset => asset.id === id)) throw new Error(`Unknown asset: ${id}`);
    }
  }
  return data;
}
