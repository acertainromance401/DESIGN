import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = process.argv[2];
if (!source || process.argv.length !== 3) {
  throw new Error("Usage: npm run import:guides -- /absolute/path/to/ui-ux-code-guide");
}
const manifest = JSON.parse(await readFile(path.join(root, "content/manifest.json"), "utf8"));
const numbers = new Map(manifest.patterns.map((pattern) => [pattern.sourceSnippet, pattern.id]));
const files = ["README", ...manifest.categories.map((category) => category.id)];
const hash = (text) => createHash("sha256").update(text).digest("hex");
const blocks = (text) => [...text.matchAll(/^```[^\n]*\n.*?^```[ \t]*$/gms)].map(([block]) => block);
const imported = [];

function portableLink(label, target, file) {
  if (/^(https?:|mailto:)/u.test(target)) return `[${label}](${target})`;
  const [relative, fragment] = target.split("#");
  if (!relative || files.includes(path.basename(relative, ".md"))) {
    if (fragment && /^snippet-\d{2}$/u.test(fragment)) {
      const id = numbers.get(fragment.slice(8));
      if (!id) throw new Error(`Unknown source snippet: ${target}`);
      return `[${label}](design://patterns/${id})`;
    }
    const guide = relative ? path.basename(relative, ".md") : file;
    return `[${label}](design://guides/${guide})`;
  }
  const sourcePath = path.posix.normalize(path.posix.join(manifest.source.guidePath, target));
  if (sourcePath.startsWith("../")) throw new Error(`Reference escapes source project: ${target}`);
  return `${label} (\`WEASHION:${sourcePath}\`)`;
}

for (const file of files) {
  const original = await readFile(path.resolve(source, `${file}.md`), "utf8");
  const pieces = original.split(/(^```[^\n]*\n.*?^```[ \t]*$)/gms);
  const markdown = pieces.map((piece, index) => {
    if (index % 2) return piece;
    return piece
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gu, (_, alt, target) =>
        `${alt} (원본 이미지 미포함; ${portableLink("출처", target, file)})`)
      .replace(/<img\b[^>]*>/gu, (image) => {
        const alt = image.match(/\balt="([^"]*)"/u)?.[1] ?? "원본 이미지";
        const target = image.match(/\bsrc="([^"]*)"/u)?.[1];
        if (!target) throw new Error(`Image has no source in ${file}`);
        return `${alt} (이미지 미포함; ${portableLink("출처", target, file)})`;
      })
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gu, (_, label, target) =>
        target.startsWith("design:") ? `[${label}](${target})` : portableLink(label, target, file));
  }).join("");
  if (JSON.stringify(blocks(original)) !== JSON.stringify(blocks(markdown))) {
    throw new Error(`Code block content changed during import: ${file}`);
  }
  imported.push({
    file: `${file}.md`,
    originalSha256: hash(original),
    bundledSha256: hash(markdown),
    codeBlocks: blocks(original).map(hash),
    markdown,
  });
}
const sectionNumbers = imported.flatMap(({ markdown }) =>
  [...markdown.matchAll(/^## (\d{2})\. /gm)].map((match) => match[1]));
if (sectionNumbers.length !== numbers.size || new Set(sectionNumbers).size !== numbers.size ||
    [...numbers.keys()].some((number) => !sectionNumbers.includes(number))) {
  throw new Error("Source guides must contain each of the 48 declared sections exactly once.");
}
if (imported.reduce((sum, file) => sum + file.codeBlocks.length, 0) !== 57) {
  throw new Error("Expected the 57 code blocks of the declared baseline; review the manifest before importing.");
}
await mkdir(path.join(root, "content/guides"), { recursive: true });
for (const file of imported) {
  await writeFile(path.join(root, "content/guides", file.file), file.markdown);
}
const provenance = {
  schemaVersion: 1,
  source: manifest.source,
  files: imported.map(({ markdown: _markdown, ...file }) => file),
};
await writeFile(path.join(root, "content/provenance.json"), JSON.stringify(provenance, null, 2) + "\n");
console.log(`Imported ${imported.length} portable guides, ${numbers.size} patterns and 57 unchanged code blocks.`);
