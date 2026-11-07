#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadCatalog } from "./catalog.js";
import { createServer } from "./server.js";
import { loadVisualCatalog } from "./visuals.js";

try {
  const catalog = await loadCatalog();
  const visuals = await loadVisualCatalog();
  await createServer(catalog, visuals).connect(new StdioServerTransport());
} catch (error) {
  console.error("Design MCP failed to start:", error);
  process.exitCode = 1;
}
