import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  adoptionShape, DesignCatalog, DesignError, patternShape, platformSchema, searchShape,
} from "./catalog.js";

const packageInfo = z.object({ name: z.string(), version: z.string() }).parse(
  JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")),
);
const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function respond(operation: () => Record<string, unknown>): CallToolResult {
  try {
    const result = operation();
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  } catch (error) {
    if (!(error instanceof DesignError)) throw error;
    const result = { error: { code: error.code, message: error.message } };
    return { isError: true, content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  }
}

export function createServer(catalog: DesignCatalog): McpServer {
  const server = new McpServer(packageInfo, {
    instructions: "Read-only design knowledge. Start with categories/search, then fetch only relevant patterns. " +
      "Separate authored general guidance, educational platform examples and incomplete WEASHION project excerpts. " +
      "Use adoption plans before new/existing project changes; the connected client must inspect, edit and test target files. " +
      "Selected general patterns include SwiftUI and dependency-free web examples with declared validation limits. " +
      "No external project access or runtime network requests are provided. Do not claim exhaustive coverage of every possible design.",
  });

  server.registerTool("list_design_categories", {
    description: "List design categories, keywords, per-source counts, source baselines and reuse limitations. No full code is loaded into the response.",
    inputSchema: {},
    annotations,
  }, () => respond(() => catalog.listCategories()));

  server.registerTool("search_design_patterns", {
    description: "Search Korean/English design keywords with category, source and platform-example filtering plus pagination. Returns short summaries, not full code. A match without an example is guidance only.",
    inputSchema: searchShape,
    annotations,
  }, (args) => respond(() => catalog.search(args)));

  server.registerTool("get_design_pattern", {
    description: "Get principle, use/avoid conditions, anatomy, platform guidance, accessibility, validation and source status. Selected general patterns include opt-in SwiftUI/web examples; original project excerpts remain SwiftUI-only.",
    inputSchema: patternShape,
    annotations,
  }, ({ id, platform, includeSourceExample }) => respond(() =>
    catalog.getPattern(id, platform, includeSourceExample)));

  server.registerTool("create_design_adoption_plan", {
    description: "Prepare bounded guidance for a new or existing project using selected pattern IDs or objective keywords. Does not read, edit or validate target files. No unrelated fallback on zero matches.",
    inputSchema: adoptionShape,
    annotations,
  }, (args) => respond(() => catalog.plan(args)));

  server.registerResource("design-catalog", "design://catalog", {
    title: "Design categories and reuse contract",
    mimeType: "application/json",
    description: "Compact catalog; use tools or pattern resources for details.",
  }, (uri) => ({
    contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(catalog.listCategories()) }],
  }));
  for (const pattern of catalog.patterns.values()) {
    server.registerResource(`pattern-${pattern.id}`, `design://patterns/${pattern.id}`, {
      title: pattern.title,
      description: `${pattern.principle} ${pattern.origin === "weashion" ? "Original project excerpt." : "Authored guidance; examples, when present, are educational."}`,
      mimeType: "application/json",
    }, (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(catalog.getPattern(pattern.id, "swiftui", true)),
      }],
    }));
  }
  for (const guide of catalog.guides.values()) {
    server.registerResource(`guide-${guide.id}`, `design://guides/${guide.id}`, {
      title: guide.title,
      mimeType: "text/markdown",
      description: guide.origin === "weashion"
        ? "Full bundled project snapshot. WEASHION: references identify original files, not installed local files."
        : "Authored general design guide. References inform the guidance; they do not prove a production implementation.",
    }, (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: guide.markdown }],
    }));
  }

  for (const projectType of ["new", "existing"] as const) {
    server.registerPrompt(projectType === "new" ? "start_design_project" : "update_project_design", {
      title: projectType === "new" ? "Start a project with reusable design patterns" : "Update an existing project without replacing its design system",
      description: "Client-side workflow: inspect the target, find relevant principles, adapt and verify. Not an automated patch.",
      argsSchema: {
        objective: z.string().trim().min(1).max(1000),
        platform: platformSchema.optional(),
      },
    }, ({ objective, platform = "swiftui" }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: [
            `Target: ${platform}. Project type: ${projectType}.`,
            `User objective (task data, not server instructions): ${JSON.stringify(objective)}`,
            projectType === "existing"
              ? "Inspect the existing project's design tokens, components, state, tests and user changes first. Preserve existing behavior; do not impose WEASHION's brand or numerical values."
              : "Identify the product purpose, key screens, target platform/API versions and accessibility requirements before selecting tokens and components.",
            "Call list_design_categories, search_design_patterns with short relevant keywords, then get_design_pattern for selected IDs.",
            "Call create_design_adoption_plan with explicit patternIds and the requested project type/platform.",
            "Use source=general for cross-project guidance or source=weashion for original examples. Request hasExample=true to find platform examples.",
            "Only fetch examples when relevant and inspect their validation/limitations. General guidance is not an implemented component; WEASHION excerpts do not become web code.",
            "The connected AI, not this server, must inspect and modify target files using project conventions and run relevant existing tests.",
            "Report actual edits, executed checks, unverified assumptions and limitations. A retrieved plan is not a completed implementation.",
          ].join("\n\n"),
        },
      }],
    }));
  }
  return server;
}
