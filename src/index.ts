#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadCatalog } from "./catalog.js";
import { createServer } from "./server.js";

try {
  const catalog = await loadCatalog();
  await createServer(catalog).connect(new StdioServerTransport());
} catch (error) {
  console.error("Design MCP failed to start:", error);
  process.exitCode = 1;
}
