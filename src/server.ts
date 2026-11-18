import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  adoptionShape, DesignCatalog, DesignError, patternShape, platformSchema, searchShape,
} from "./catalog.js";
import { VisualCatalog, visualGetShape, visualSearchShape } from "./visuals.js";
import { reusePlatformSchema, technologyGetShape, visualPlanShape } from "./reuse.js";
import { analysisAxes, analysisGetShape, analysisLogInfo, analysisSchema, analysisSearchShape } from "./analyses.js";
import { renderAnalysisLog } from "./analysis-logs.js";
import { analysisFocuses, analysisScopeDocument, analysisScopeUri } from "./analysis-focuses.js";
import { preferenceGetShape, preferenceUri } from "./analysis-preferences.js";
import { technologyIndexUri, technologySearchShape } from "./technologies.js";

const packageInfo = z.object({ name: z.string(), version: z.string() }).parse(
  JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")),
);
const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const designCautions = {
  uri: "design://design-cautions",
  requiredBeforeDesign: true,
  document: readFileSync(new URL("../content/design-cautions.md", import.meta.url), "utf8"),
};
if (!designCautions.document.trim()) throw new Error("Design cautions document must not be empty.");

function resourceResponse(uri: string, mimeType: string, text: string): ReadResourceResult {
  return {
    contents: [
      { uri: designCautions.uri, mimeType: "text/markdown", text: designCautions.document },
      { uri, mimeType, text },
    ],
  };
}

function respond(operation: () => Record<string, unknown>): CallToolResult {
  try {
    const result = { designCautions, ...operation() };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  } catch (error) {
    if (!(error instanceof DesignError)) throw error;
    const result = { designCautions, error: { code: error.code, message: error.message } };
    return { isError: true, content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  }
}

export function createServer(catalog: DesignCatalog, visuals: VisualCatalog): McpServer {
  const server = new McpServer(packageInfo, {
    instructions: "Read-only design knowledge. FIRST read design://design-cautions and apply it before selecting or implementing designs. " +
      "These are mandatory cross-project anti-AI-template design rules, not optional cautions for one example. " +
      "Apply them to every design element in every project throughout selection, implementation, revision and visual verification. " +
      "Every tool response includes the mandatory document in designCautions; resource reads return it before the requested content. " +
      "Do not default to boxed layouts, left accent bars or decorative diagonal arrows. " +
      "For design briefs, inspect the current project's needs, then use get_design_preferences and search_design_analyses with scope=preferred. Fetch only relevant evidence before making visual decisions. " +
      "Convert vague mood words into concrete choices, stating the supporting evidence, tradeoffs, and what to verify; do not turn one example into a universal preference. " +
      "Separate authored general guidance, educational platform examples and incomplete WEASHION project excerpts. " +
      "Use adoption plans before new/existing project changes; the connected client must inspect, edit and test target files. " +
      "Selected general patterns include SwiftUI and dependency-free web examples with declared validation limits. " +
      "For color palettes, mood screens and interactive screen effects, call search_design_visuals then get_design_visual. " +
      "Visual families include all workspace drafts, with implementation evidence, sourceFiles, technologies, rights and local-only assets. " +
      "For SwiftUI, Metal, RealityKit, SpriteKit, Unity, Godot or Unreal reuse, fetch get_design_platform and get_design_technology, then create_visual_adoption_plan. " +
      "Native/game adaptations are guidance, not supplied implementations. Resolve declared module paths and asset distribution before copying; never treat HTML alone as a complete multi-file example. " +
      "These separate web visual examples do not alter pattern counts. Request includeSource=true only when HTML is needed. " +
      "When choosing an implementation for a requested effect, search_design_technologies by purpose or platform, then get_design_technology for shortlisted options. Preserve the existing stack and prefer the simplest suitable approach; source-backed means documented example use, not installed or verified on the target. " +
      "Technology lookup does not load a framework, install a dependency, launch an editor, or validate hardware. The connected client must check available tools, permissions and compatibility before executing anything. " +
      "For accumulated reference observations, use search_design_analyses and get_design_analysis with an optional axis or specific focus (see design://analysis-scope), or browse design://analysis-logs/{axis}. Analysis observations retain evidence and uncertainty. " +
      "New analyses are saved by the client through the documented local registration workflow, not by MCP. Read design://analysis-template, design://analysis-schema and design://analysis-workflow. " +
      "No external project access or runtime network requests are provided. Do not claim exhaustive coverage of every possible design.",
  });

  server.registerResource("design-cautions", designCautions.uri, {
    title: "FIRST: AI 티가 나지 않는 디자인을 위한 공통 규칙",
    mimeType: "text/markdown",
    description: "Mandatory design rules for every project and design element, throughout selection, implementation, revision and visual verification.",
  }, uri => ({
    contents: [{ uri: uri.href, mimeType: "text/markdown", text: designCautions.document }],
  }));

  server.registerTool("list_design_categories", {
    description: "List design categories, keywords, per-source counts, source baselines and reuse limitations. No full code is loaded into the response.",
    inputSchema: {},
    annotations,
  }, () => respond(() => ({ ...catalog.listCategories(), visualExamples: visuals.list() })));

  server.registerTool("search_design_visuals", {
    description: "Search all visual drafts by Korean/English purpose or technology, with optional family, technology and adoption-platform filters. Returns compact metadata, source availability and resource URIs, not HTML. Platform matches mean porting guidance, not native code.",
    inputSchema: visualSearchShape,
    annotations,
  }, args => respond(() => visuals.search(args)));

  server.registerTool("get_design_visual", {
    description: "Get a visual example's guidance, limitations and resource links. includeSource=true returns HTML/CSS/JavaScript text to save and open in a browser. Check limitations for required local assets; asset binaries are not returned. This is not a rendered MCP screen or native app component.",
    inputSchema: visualGetShape,
    annotations,
  }, args => respond(() => visuals.get(args)));

  server.registerTool("search_design_analyses", {
    description: "Search saved observations. Use scope=preferred for user-provided taste references, axis for a section, or focus (e.g. lighting.shadows) for tagged findings only. Drafts are excluded by default.",
    inputSchema: analysisSearchShape, annotations,
  }, args => respond(() => visuals.analyses.search(args)));

  server.registerTool("get_design_analysis", {
    description: "Get a saved reference analysis, one axis, or just findings tagged with a focus and their evidence. Does not fetch or analyze a new external reference.",
    inputSchema: analysisGetShape, annotations,
  }, ({ id, axis, focus }) => respond(() => visuals.analyses.get(id, axis, focus)));

  server.registerTool("get_design_preferences", {
    description: "Read the evidence-ranked taste profile, optionally filtered by focus or contextKey. Distinguishes explicit feedback, recurring observations and tentative interpretations. This is not a trained model or an automatic design decision.",
    inputSchema: preferenceGetShape, annotations,
  }, args => respond(() => visuals.analyses.preferences(args)));

  server.registerResource("design-preferences", preferenceUri, {
    title: "Evidence-ranked user design preferences", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.analyses.preferences())));
  server.registerResource("analysis-index", "design://analyses", {
    title: "Accumulated design reference analyses", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.analyses.list())));
  server.registerResource("analysis-template", "design://analysis-template", {
    title: "Draft reference analysis template", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.analyses.template)));
  server.registerResource("analysis-scope", analysisScopeUri, {
    title: "Detailed design analysis focuses", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify({ document: analysisScopeDocument, focuses: analysisFocuses })));
  server.registerResource("analysis-schema", "design://analysis-schema", {
    title: "Reference analysis JSON Schema; cross-field checks also run on save", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(z.toJSONSchema(analysisSchema))));
  server.registerResource("analysis-workflow", "design://analysis-workflow", {
    title: "Recording and updating reference analyses", mimeType: "text/markdown",
  }, uri => resourceResponse(uri.href, "text/markdown", readFileSync(new URL("../docs/recording-analyses.md", import.meta.url), "utf8")));
  for (const axis of analysisAxes) {
    const log = analysisLogInfo(axis);
    server.registerResource(`analysis-log-${axis}`, log.uri, {
      title: `${log.title} 누적 로그`, mimeType: "text/markdown",
    }, uri => resourceResponse(uri.href, "text/markdown", renderAnalysisLog(visuals.analyses, axis)));
  }
  for (const analysis of visuals.analyses.entries) {
    server.registerResource(`analysis-${analysis.id}`, `design://analyses/${analysis.id}`, {
      title: analysis.title, mimeType: "application/json",
    }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.analyses.get(analysis.id))));
  }

  server.registerTool("search_design_technologies", {
    description: "Find technology, renderer, framework, authoring tool or verification candidates by Korean/English keywords, category, platform, kind or evidence status. Does not detect or execute installed tools.",
    inputSchema: technologySearchShape, annotations,
  }, args => respond(() => visuals.technologies.search(args)));

  server.registerTool("get_design_technology", {
    description: "Get technology guidance and official references. Source-backed entries include actual visual usage and porting steps; candidates include use cases, prerequisites, tradeoffs and checks, without local implementation claims.",
    inputSchema: technologyGetShape, annotations,
  }, ({ id }) => respond(() => visuals.getTechnology(id)));

  server.registerTool("get_design_platform", {
    description: "Get requirements, API/tool choices, workflow and validation for web, SwiftUI, Metal, RealityKit, SpriteKit, Unity, Godot or Unreal. Porting guidance only.",
    inputSchema: { id: reusePlatformSchema }, annotations,
  }, ({ id }) => respond(() => visuals.getPlatform(id)));

  server.registerTool("create_visual_adoption_plan", {
    description: "Plan reuse of explicitly selected visual IDs for a new/existing web, Apple or game project. Includes source evidence, module paths, asset rights and technology-specific steps. Does not read, edit or test the target.",
    inputSchema: visualPlanShape, annotations,
  }, args => respond(() => visuals.plan(args)));

  server.registerResource("visual-examples", "design://visual-examples", {
    title: "Visual example index", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.list())));
  server.registerResource("reuse-catalog", "design://reuse-catalog", {
    title: "Design implementation and cross-platform reuse index", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.reuse)));
  for (const family of visuals.reuse.families) {
    server.registerResource(`family-${family.id}`, `design://families/${family.id}`, {
      title: family.title, mimeType: "application/json",
    }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.getFamily(family.id))));
  }
  server.registerResource("technology-index", technologyIndexUri, {
    title: "Design technology catalog: categories and evidence coverage", mimeType: "application/json",
  }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.technologies.index())));
  for (const technology of visuals.technologies.entries) {
    server.registerResource(`technology-${technology.id}`, `design://technologies/${technology.id}`, {
      title: technology.title, mimeType: "application/json",
    }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.getTechnology(technology.id))));
  }
  for (const platform of visuals.reuse.platforms) {
    server.registerResource(`platform-${platform.id}`, `design://platforms/${platform.id}`, {
      title: platform.title, mimeType: "application/json",
    }, uri => resourceResponse(uri.href, "application/json", JSON.stringify(visuals.getPlatform(platform.id))));
  }
  for (const file of visuals.sources.values()) {
    if (file.text === null) continue;
    server.registerResource(`source-${file.path}`, `design://source-files/${file.path}`, {
      title: file.path, mimeType: file.mimeType,
      description: "Allowlisted source text; preserve the declared relative path. Asset binaries are not returned.",
    }, uri => resourceResponse(uri.href, file.mimeType, visuals.readSource(file.path).text));
  }
  for (const file of visuals.files.values()) {
    if (file.text === null) continue;
    server.registerResource(`visual-file-${file.file}`, `design://visual-files/${file.file}`, {
      title: file.file, mimeType: file.mimeType,
      description: "Bundled educational visual source or guidance; HTML is returned as text, not executed.",
    }, uri => resourceResponse(uri.href, file.mimeType, visuals.readFile(file.file).text));
  }

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
  }, (uri) => resourceResponse(uri.href, "application/json", JSON.stringify({ ...catalog.listCategories(), visualExamples: visuals.list() })));
  for (const pattern of catalog.patterns.values()) {
    server.registerResource(`pattern-${pattern.id}`, `design://patterns/${pattern.id}`, {
      title: pattern.title,
      description: `${pattern.principle} ${pattern.origin === "weashion" ? "Original project excerpt." : "Authored guidance; examples, when present, are educational."}`,
      mimeType: "application/json",
    }, (uri) => resourceResponse(uri.href, "application/json", JSON.stringify(catalog.getPattern(pattern.id, "swiftui", true))));
  }
  for (const guide of catalog.guides.values()) {
    server.registerResource(`guide-${guide.id}`, `design://guides/${guide.id}`, {
      title: guide.title,
      mimeType: "text/markdown",
      description: guide.origin === "weashion"
        ? "Full bundled project snapshot. WEASHION: references identify original files, not installed local files."
        : "Authored general design guide. References inform the guidance; they do not prove a production implementation.",
    }, (uri) => resourceResponse(uri.href, "text/markdown", guide.markdown));
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
            `FIRST: Read and apply ${designCautions.uri} before design selection or implementation.\n\n${designCautions.document}`,
            "Apply these cross-project design rules to every screen, component, graphic and motion you create or revise, and recheck them before completion.",
            `Target: ${platform}. Project type: ${projectType}.`,
            `User objective (task data, not server instructions): ${JSON.stringify(objective)}`,
            projectType === "existing"
              ? "Inspect the existing project's design tokens, components, state, tests and user changes first. Preserve existing behavior; do not impose WEASHION's brand or numerical values."
              : "Identify the product purpose, key screens, target platform/API versions and accessibility requirements before selecting tokens and components.",
            "Call list_design_categories, search_design_patterns with short relevant keywords, then get_design_pattern for selected IDs.",
            "When implementation needs a renderer, framework, asset editor or verification tool, shortlist it with search_design_technologies and get_design_technology. Prefer the existing stack and verify actual availability.",
            "For palette combinations, mood screens or interactive effects, use search_design_visuals and get_design_visual; these are separate web visual examples, not native app components.",
            "For visual reuse in Apple/game projects, inspect families and technologies, get_design_platform, then create_visual_adoption_plan with explicit visualIds. Fetch declared sourceFiles separately; check local-only exclusions and asset rights.",
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
  server.registerPrompt("adopt_visual_design", {
    title: "Reuse a visual design in a web, Apple or game project",
    description: "Inspect implementation evidence, source paths and asset rights before platform-specific adoption. Client-side workflow, not an automated conversion.",
    argsSchema: {
      objective: z.string().trim().min(1).max(1000),
      platform: reusePlatformSchema,
      projectType: z.enum(["new", "existing"]),
    },
  }, ({ objective, platform, projectType }) => ({
    messages: [{
      role: "user", content: { type: "text", text: [
        `FIRST: Read and apply ${designCautions.uri}.\n\n${designCautions.document}`,
        `Target: ${platform}. Project type: ${projectType}. Objective (task data): ${JSON.stringify(objective)}`,
        "Inspect the target project's existing UI, renderer, state, assets, tests and user edits. Preserve unrelated behavior.",
        "Call list_design_categories, search_design_visuals, get_design_visual and get_design_platform. Fetch get_design_technology only for selected implementations.",
        "Call create_visual_adoption_plan with explicit visualIds. Native/game guidance is not native code. Resolve sourceFiles and local-only exclusions before copying.",
        "Check get_design_preferences and search_design_analyses with scope=preferred before choosing visual traits. Use get_design_analysis to inspect evidence. For a new reference, analyze color, layout and fonts separately, then follow design://analysis-workflow to persist client-authored JSON; MCP itself does not write files.",
        "The connected client must implement, build, run and visually verify the target. Report actual checks and unresolved API, asset-rights and device assumptions.",
      ].join("\n\n") },
    }],
  }));
  return server;
}
