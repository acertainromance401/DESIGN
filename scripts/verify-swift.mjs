import { execFileSync } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.platform !== "darwin") {
  throw new Error("SwiftUI example typechecking requires macOS and Xcode. This check is not a platform-neutral parser.");
}
const folder = fileURLToPath(new URL("../content/examples/", import.meta.url));
const files = (await readdir(folder)).filter((file) => file.endsWith(".swift")).sort();
if (!files.length) throw new Error("No SwiftUI examples found.");
const cache = await mkdtemp(path.join(tmpdir(), "design-swift-cache-"));
try {
  execFileSync("xcrun", [
    "swiftc", "-typecheck", "-swift-version", "6",
    "-target", `${process.arch === "arm64" ? "arm64" : "x86_64"}-apple-macosx14.0`,
    "-module-cache-path", cache,
    ...files.map((file) => path.join(folder, file)),
  ], { stdio: "inherit" });
  console.log(`PASS: ${files.length} SwiftUI examples typechecked together for macOS 14 (Swift 6). No iOS runtime or device validation claimed.`);
} finally {
  await rm(cache, { recursive: true, force: true });
}
