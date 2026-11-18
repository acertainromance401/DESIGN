import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const files = [
  ["build/three.module.min.js", "three.module.min.js"],
  ["build/three.core.min.js", "three.core.min.js"],
  ["examples/jsm/loaders/GLTFLoader.js", "addons/loaders/GLTFLoader.js"],
  ["examples/jsm/utils/BufferGeometryUtils.js", "addons/utils/BufferGeometryUtils.js"],
  ["LICENSE", "LICENSE"],
];

for (const [source, destination] of files) {
  const target = new URL(`designs/celebration/assets/birthday/vendor/${destination}`, root);
  await mkdir(new URL("./", target), { recursive: true });
  await copyFile(new URL(`node_modules/three/${source}`, root), target);
}

console.log(`Prepared local Three.js 0.180.0 assets in ${fileURLToPath(new URL("designs/celebration/assets/birthday/vendor/", root))}`);
