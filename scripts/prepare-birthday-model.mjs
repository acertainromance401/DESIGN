import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const source = new URL("../reference/private/birthday/Meshy_AI_Birthday_Sprinkle_Cake_20261115_texture.blend", import.meta.url);
const output = new URL("designs/celebration/assets/birthday/cake-mobile.glb", root);
const metadata = new URL("designs/celebration/assets/birthday/cake.meta.json", root);
const blender = process.env.BLENDER_BIN ?? "/Applications/Blender.app/Contents/MacOS/Blender";
await access(blender);
await access(source);
await mkdir(new URL("./", output), { recursive: true });
const sourceHash = createHash("sha256").update(await readFile(source)).digest("hex");

const script = `
import bpy, json, os
from mathutils import Vector

output = ${JSON.stringify(fileURLToPath(output))}
metadata = ${JSON.stringify(fileURLToPath(metadata))}
objects = [o for o in bpy.context.scene.objects if o.type == "MESH"]
if not objects:
    raise RuntimeError("The source contains no mesh objects")

def triangles(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)

source_triangles = sum(triangles(o) for o in objects)
bpy.ops.object.select_all(action="DESELECT")
for obj in objects:
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    obj.data.validate(clean_customdata=False)
    ratio = min(1.0, 45000 / source_triangles)
    if ratio < 1:
        modifier = obj.modifiers.new("Mobile geometry budget", "DECIMATE")
        modifier.ratio = ratio
        modifier.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.validate(clean_customdata=False)
    obj.data.update()
    obj.select_set(False)

images = []
for image in bpy.data.images:
    if not image.size[0] or image.type in {"RENDER_RESULT", "COMPOSITING"}:
        continue
    # Packed images are lazy-loaded; has_data is false until their pixels are read.
    image.pixels[0]
    is_color = any(
        node.type == "TEX_IMAGE" and node.image == image and
        any(link.to_socket.name == "Base Color" for socket in node.outputs for link in socket.links)
        for material in bpy.data.materials if material.use_nodes
        for node in material.node_tree.nodes
    )
    limit = 2048 if is_color else 1024
    width, height = image.size
    scale = min(1, limit / max(width, height))
    if scale < 1:
        image.scale(max(1, round(width * scale)), max(1, round(height * scale)))
    images.append({"name": image.name, "width": image.size[0], "height": image.size[1]})

for obj in objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = objects[0]
bpy.ops.export_scene.gltf(
    filepath=output, export_format="GLB", use_selection=True,
    export_image_format="JPEG", export_jpeg_quality=85,
    export_animations=False, export_cameras=False, export_lights=False,
    export_yup=True
)
points = [o.matrix_world @ Vector(corner) for o in objects for corner in o.bound_box]
result = {
    "source": os.path.basename(bpy.data.filepath),
    "blender": bpy.app.version_string,
    "sourceTriangles": source_triangles,
    "triangles": sum(triangles(o) for o in objects),
    "vertices": sum(len(o.data.vertices) for o in objects),
    "textures": images,
    "jpegQuality": 85,
    "bytes": os.path.getsize(output),
    "boundsBlender": {
        "min": [min(p[i] for p in points) for i in range(3)],
        "max": [max(p[i] for p in points) for i in range(3)]
    }
}
with open(metadata, "w") as handle:
    json.dump(result, handle, indent=2)
print("MOBILE_MODEL=" + json.dumps(result))
`;

const result = spawnSync(blender, [
  "--background", "--factory-startup", "--disable-autoexec", "--threads", "2",
  fileURLToPath(source), "--python-expr", script,
], { stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`Blender exited with status ${result.status}`);
const afterHash = createHash("sha256").update(await readFile(source)).digest("hex");
if (afterHash !== sourceHash) throw new Error("The source .blend file changed during export");
const stats = JSON.parse(await readFile(metadata, "utf8"));
if (stats.triangles > 46000 || stats.bytes > 4 * 1024 * 1024) {
  throw new Error(`Model exceeds mobile budget: ${JSON.stringify(stats)}`);
}
await writeFile(metadata, `${JSON.stringify({ ...stats, sourceSha256: sourceHash }, null, 2)}\n`);
console.log(`Verified mobile model: ${stats.triangles.toLocaleString()} triangles, ${(stats.bytes / 1024 / 1024).toFixed(2)} MiB. Source preserved.`);
