const VERTEX_SHADER = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = position;
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}`;

const SCENE_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 uGrid;
uniform float uTime;
uniform float uYaw;
uniform float uMotion;
uniform float uRain;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float ellipsoid(vec3 p, vec3 radius) {
  return (length(p / radius) - 1.0) * min(radius.x, min(radius.y, radius.z));
}

float box(vec3 p, vec3 size) {
  vec3 d = abs(p) - size;
  return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
}

float capsule(vec3 p, vec3 a, vec3 b, float radius) {
  vec3 segment = b - a;
  float position = clamp(dot(p - a, segment) / dot(segment, segment), 0.0, 1.0);
  return length(p - a - segment * position) - radius;
}

vec2 nearest(vec2 a, vec2 b) {
  return a.x < b.x ? a : b;
}

float breath() {
  return 0.012 * sin(uTime * 1.7) + uMotion * 0.025 * cos(uTime * 10.8);
}

vec3 lanternPosition() {
  return vec3(
    0.88 + 0.045 * sin(uTime * 1.6),
    0.82 + breath() + 0.025 * sin(uTime * 2.0),
    0.34 + uMotion * 0.065 * sin(uTime * 5.4)
  );
}

vec2 scene(vec3 p) {
  float bob = breath();
  vec3 q = p;
  q.y -= bob;
  float lower = 1.0 - smoothstep(0.22, 1.8, q.y);
  q.x -= lower * lower * (0.055 * sin(uTime * 1.3 + q.y * 1.8)
    + uMotion * 0.055 * sin(uTime * 5.4));
  q.z -= lower * (0.038 * sin(uTime * 1.8 + q.y * 3.0)
    + uMotion * 0.06 * sin(uTime * 5.4 + q.y * 3.0));

  float height = clamp((q.y - 0.24) / 1.58, 0.0, 1.0);
  float angle = atan(q.z * 1.18, q.x);
  float folds = (sin(angle * 11.0 + q.y * 0.9)
    + 0.35 * sin(angle * 19.0 - q.y * 2.0)) * (0.012 + lower * 0.022);
  float radius = 0.255 + 0.43 * pow(1.0 - height, 0.85) + folds;
  float hem = 0.25 + 0.045 * sin(angle * 7.0 + uTime * 1.5)
    + 0.018 * sin(angle * 13.0);
  float cloak = max(length(vec2(q.x, q.z * 1.18)) - radius,
    max(hem - q.y, q.y - 1.82));
  vec2 result = vec2(cloak * 0.75, 1.0);

  float shoulders = ellipsoid(q - vec3(0.0, 1.73, 0.0), vec3(0.365, 0.18, 0.27));
  result = nearest(result, vec2(shoulders, 1.0));

  vec3 hood = q - vec3(0.0, 2.10, 0.015);
  hood.x += 0.016 * sin(uTime * 1.2) * smoothstep(0.0, 0.4, hood.y);
  float outside = ellipsoid(hood, vec3(0.375, 0.46, 0.35));
  outside += 0.006 * sin(atan(hood.x, hood.z) * 13.0 + hood.y * 8.0);
  float inside = ellipsoid(hood - vec3(0.0, -0.035, 0.235),
    vec3(0.255, 0.315, 0.29));
  result = nearest(result, vec2(max(outside, -inside), 1.0));

  float face = ellipsoid(q - vec3(0.0, 2.075, 0.13), vec3(0.205, 0.25, 0.155));
  result = nearest(result, vec2(face, 2.0));
  vec3 eyes = q - vec3(0.0, 2.105, 0.294);
  eyes.x = abs(eyes.x) - 0.074;
  result = nearest(result, vec2(ellipsoid(eyes, vec3(0.03, 0.017, 0.016)), 5.0));

  float stride = uMotion * 0.14 * sin(uTime * 5.4);
  float leftFoot = ellipsoid(p - vec3(-0.23, 0.09 + max(stride, 0.0) * 0.3,
    0.10 + stride), vec3(0.12, 0.085, 0.23));
  float rightFoot = ellipsoid(p - vec3(0.23, 0.09 + max(-stride, 0.0) * 0.3,
    0.10 - stride), vec3(0.12, 0.085, 0.23));
  result = nearest(result, vec2(min(leftFoot, rightFoot), 4.0));

  vec3 lantern = lanternPosition();
  vec3 hand = lantern + vec3(0.0, 0.34, 0.0);
  float arm = capsule(p, vec3(0.30, 1.63 + bob, 0.0), hand, 0.09);
  result = nearest(result, vec2(arm, 1.0));
  result = nearest(result, vec2(length(p - hand) - 0.065, 4.0));
  result = nearest(result, vec2(length(q - vec3(0.0, 1.63, 0.30)) - 0.043, 6.0));

  vec3 lamp = p - lantern;
  float frame = max(box(lamp, vec3(0.13, 0.18, 0.10)),
    -box(lamp, vec3(0.105, 0.15, 0.115)));
  frame = min(frame, box(lamp, vec3(0.01, 0.16, 0.102)));
  frame = min(frame, box(lamp - vec3(0.0, 0.205, 0.0), vec3(0.15, 0.025, 0.115)));
  vec3 handle = lamp - vec3(0.0, 0.29, 0.0);
  frame = min(frame, length(vec2(length(handle.xy) - 0.09, handle.z)) - 0.012);
  result = nearest(result, vec2(frame, 6.0));
  result = nearest(result, vec2(box(lamp, vec3(0.09, 0.135, 0.075)), 3.0));
  return result;
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.003, -0.003);
  return normalize(
    e.xyy * scene(p + e.xyy).x +
    e.yyx * scene(p + e.yyx).x +
    e.yxy * scene(p + e.yxy).x +
    e.xxx * scene(p + e.xxx).x
  );
}

float rainLayer(vec2 uv, float scale, float speed) {
  vec2 q = uv * vec2(scale, scale * 0.36);
  q.x += q.y * 0.32;
  q.y += uTime * speed;
  vec2 cell = floor(q);
  vec2 local = fract(q);
  float line = 1.0 - smoothstep(0.04, 0.18, abs(local.x - 0.5));
  line *= smoothstep(0.08, 0.3, local.y) * (1.0 - smoothstep(0.5, 0.95, local.y));
  return line * step(0.86, hash(cell)) * (0.5 + 0.5 * hash(cell + 4.1));
}

void main() {
  float aspect = (uGrid.x / uGrid.y) * (2.0 / 3.0);
  vec2 screen = (vUv - 0.5) * vec2(aspect, 1.0);
  vec3 origin = vec3(sin(uYaw) * 5.3, 1.78, cos(uYaw) * 5.3);
  vec3 forward = normalize(vec3(0.0, 1.30, 0.0) - origin);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  vec3 direction = normalize(forward * 1.70 + right * screen.x + up * screen.y);

  vec3 color = vec3(0.0);
  float material = 0.0;
  vec3 relative = origin - vec3(0.0, 1.3, 0.0);
  float b = dot(relative, direction);
  float discriminant = b * b - dot(relative, relative) + 1.72 * 1.72;
  float distanceToScene = 100.0;
  if (discriminant > 0.0) {
    float distanceAlongRay = max(0.0, -b - sqrt(discriminant));
    float exitDistance = -b + sqrt(discriminant);
    for (int stepIndex = 0; stepIndex < 88; stepIndex++) {
      vec2 samplePoint = scene(origin + direction * distanceAlongRay);
      if (samplePoint.x < 0.0035) {
        material = samplePoint.y;
        distanceToScene = distanceAlongRay;
        break;
      }
      distanceAlongRay += max(samplePoint.x * 0.85, 0.002);
      if (distanceAlongRay > exitDistance) break;
    }
  }

  if (material > 0.0) {
    vec3 p = origin + direction * distanceToScene;
    vec3 normal = normalAt(p);
    float diffuse = max(dot(normal, normalize(vec3(-2.5, 4.5, 4.0))), 0.0);
    float rim = pow(1.0 - max(dot(normal, -direction), 0.0), 2.5);
    float occlusion = clamp(scene(p + normal * 0.075).x / 0.075, 0.25, 1.0);
    float weave = 0.92 + 0.08 * sin(p.y * 165.0 + sin(p.x * 90.0));
    color = vec3((0.16 + diffuse * 0.83 + rim * 0.28) * occlusion * weave);
    if (material > 1.5 && material < 2.5) color *= 0.014;
    if (material > 2.5 && material < 3.5) {
      color = vec3(1.0, 0.68, 0.24) * (1.1 + 0.08 * sin(uTime * 8.0));
    }
    if (material > 3.5 && material < 4.5) color *= 0.36;
    if (material > 4.5 && material < 5.5) color = vec3(0.74, 0.82, 0.66);
    if (material > 5.5) color *= 0.63;
    float lanternLight = max(dot(normal, normalize(lanternPosition() - p)), 0.0);
    float falloff = 0.08 / (0.12 + dot(lanternPosition() - p, lanternPosition() - p));
    color += vec3(0.40, 0.25, 0.08) * lanternLight * falloff;
  }

  if (direction.y < -0.001) {
    float floorDistance = -origin.y / direction.y;
    if (floorDistance < distanceToScene) {
      vec3 floorPoint = origin + direction * floorDistance;
      float pool = exp(-dot(floorPoint.xz, floorPoint.xz) * 0.75);
      float grain = hash(floor(floorPoint.xz * 70.0));
      float rings = pow(0.5 + 0.5 * sin(length(floorPoint.xz - vec2(0.7, 0.2))
        * 55.0 - uTime * 3.0), 14.0);
      float shadow = smoothstep(0.18, 0.75, length(floorPoint.xz));
      color = vec3(pool * (0.022 + grain * 0.065 + uRain * rings * 0.04) * shadow);
      float reflection = exp(-pow((floorPoint.x - 0.88) * 7.0, 2.0))
        * exp(-abs(floorPoint.z - 0.5) * 1.8) * (0.5 + grain * 0.5);
      color += vec3(0.11, 0.075, 0.03) * reflection;
      material = 0.5;
    }
  }

  vec2 rainUv = vec2(screen.x, vUv.y);
  float rain = uRain * (
    rainLayer(rainUv, 62.0, 9.0) * 0.17 +
    rainLayer(rainUv + 2.6, 39.0, 12.0) * 0.31
  );
  color += vec3(rain * (material >= 1.0 ? 0.15 : 1.0));
  float kind = material >= 1.0 ? 1.0 : (rain > 0.045 ? 0.35 : 0.0);
  outColor = vec4(color, kind);
}`;

const ASCII_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uScene;
uniform sampler2D uAtlas;
uniform vec2 uGrid;
uniform float uGlyphCount;
uniform float uRainGlyph;
uniform float uPalette;

void main() {
  vec2 cell = floor(vUv * uGrid);
  vec2 local = fract(vUv * uGrid);
  vec4 source = texture(uScene, (cell + 0.5) / uGrid);
  float brightness = dot(source.rgb, vec3(0.2126, 0.7152, 0.0722));
  float level = floor(clamp(pow(brightness, 0.72) * 1.12, 0.0, 1.0) * (uGlyphCount - 1.0));
  bool isRain = source.a > 0.2 && source.a < 0.5;
  if (isRain) level = uRainGlyph;
  if (brightness < 0.025) level = 0.0;
  float glyph = texture(uAtlas, vec2((level + local.x) / uGlyphCount, local.y)).r;
  vec3 ink = mix(vec3(0.87, 0.88, 0.82), vec3(0.58, 0.90, 0.64), uPalette);
  vec3 tint = source.rgb / max(max(source.r, source.g), max(source.b, 0.001));
  ink *= mix(vec3(1.0), tint, 0.65 * (1.0 - uPalette));
  float strength = isRain ? clamp(brightness * 1.8, 0.0, 0.55)
    : mix(0.34, 1.0, smoothstep(0.025, 0.65, brightness));
  vec3 background = vec3(8.0, 10.0, 9.0) / 255.0;
  outColor = vec4(background + ink * glyph * strength, 1.0);
}`;

function positiveNumber(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive finite number`);
  }
}

export function getGridSize(width, height, cellHeight) {
  positiveNumber(width, "width");
  positiveNumber(height, "height");
  positiveNumber(cellHeight, "cellHeight");
  const columns = Math.max(1, Math.floor(width / (cellHeight * 2 / 3)));
  const rows = Math.max(1, Math.floor(height / cellHeight));
  const scale = Math.min(1, 320 / columns, 180 / rows, Math.sqrt(36000 / (columns * rows)));
  return {
    columns: Math.max(1, Math.floor(columns * scale)),
    rows: Math.max(1, Math.floor(rows * scale)),
  };
}

export function getDrawingSize(width, height, pixelRatio) {
  positiveNumber(width, "width");
  positiveNumber(height, "height");
  positiveNumber(pixelRatio, "pixelRatio");
  const scale = Math.min(pixelRatio, 1.5, 2048 / width, 1536 / height);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export class AnimationClock {
  elapsed = 0;
  previous = null;

  sample(timestamp, playing) {
    if (!Number.isFinite(timestamp) || timestamp < 0) {
      throw new RangeError("timestamp must be a non-negative finite number");
    }
    if (this.previous !== null && timestamp < this.previous) {
      throw new RangeError("animation timestamps must be monotonic");
    }
    if (playing && this.previous !== null) {
      this.elapsed += Math.min((timestamp - this.previous) / 1000, 0.05);
    }
    this.previous = timestamp;
    return this.elapsed;
  }

  reset() {
    this.previous = null;
  }
}

function makeProgram(gl, fragmentSource) {
  const shaders = [
    [gl.VERTEX_SHADER, VERTEX_SHADER],
    [gl.FRAGMENT_SHADER, fragmentSource],
  ].map(([type, source]) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("셰이더를 생성할 수 없습니다.");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`셰이더 컴파일에 실패했습니다: ${log}`);
    }
    return shader;
  });
  const program = gl.createProgram();
  if (!program) throw new Error("WebGL 프로그램을 생성할 수 없습니다.");
  for (const shader of shaders) gl.attachShader(program, shader);
  gl.linkProgram(program);
  for (const shader of shaders) gl.deleteShader(shader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`WebGL 프로그램 연결에 실패했습니다: ${log}`);
  }
  return program;
}

function makeTexture(gl) {
  const texture = gl.createTexture();
  if (!texture) throw new Error("문자 텍스처를 생성할 수 없습니다.");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

function makeAtlas(gl) {
  const characters = Array.from(" .:'-/|+*xo%#MW@");
  const tileWidth = 32;
  const tileHeight = 48;
  const tile = document.createElement("canvas");
  tile.width = tileWidth;
  tile.height = tileHeight;
  const context = tile.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("문자 이미지를 준비할 수 없습니다.");
  context.font = "38px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "white";
  const sorted = characters.map(character => {
    context.clearRect(0, 0, tileWidth, tileHeight);
    context.fillText(character, tileWidth / 2, tileHeight / 2);
    const pixels = context.getImageData(0, 0, tileWidth, tileHeight).data;
    let coverage = 0;
    for (let index = 3; index < pixels.length; index += 4) coverage += pixels[index];
    return { character, coverage };
  }).sort((a, b) => a.coverage - b.coverage);
  const atlas = document.createElement("canvas");
  atlas.width = tileWidth * sorted.length;
  atlas.height = tileHeight;
  const atlasContext = atlas.getContext("2d");
  if (!atlasContext) throw new Error("문자 아틀라스를 생성할 수 없습니다.");
  atlasContext.fillStyle = "black";
  atlasContext.fillRect(0, 0, atlas.width, atlas.height);
  atlasContext.fillStyle = "white";
  atlasContext.font = context.font;
  atlasContext.textAlign = "center";
  atlasContext.textBaseline = "middle";
  sorted.forEach(({ character }, index) => {
    atlasContext.fillText(character, index * tileWidth + tileWidth / 2, tileHeight / 2);
  });
  const texture = makeTexture(gl);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  return { texture, count: sorted.length, rainGlyph: sorted.findIndex(entry => entry.character === "/") };
}

export class AsciiCharacter {
  constructor(canvas, { playing = true, onResize = () => {}, onError = console.error } = {}) {
    const gl = canvas.getContext("webgl2", {
      alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power",
    });
    if (!gl) throw new Error("이 브라우저에서는 WebGL 2를 사용할 수 없습니다. 최신 Safari 또는 Chrome에서 열어 주세요.");
    this.canvas = canvas;
    this.gl = gl;
    this.playing = playing;
    this.onResize = onResize;
    this.onError = onError;
    this.cellHeight = 8;
    this.motion = 0;
    this.palette = 0;
    this.rain = 1;
    this.yaw = 0.18;
    this.frame = 0;
    this.stopped = false;
    this.clock = new AnimationClock();
    this.sceneProgram = makeProgram(gl, SCENE_SHADER);
    this.asciiProgram = makeProgram(gl, ASCII_SHADER);
    this.sceneUniforms = Object.fromEntries(
      ["uGrid", "uTime", "uYaw", "uMotion", "uRain"].map(name =>
        [name, gl.getUniformLocation(this.sceneProgram, name)]),
    );
    this.asciiUniforms = Object.fromEntries(
      ["uScene", "uAtlas", "uGrid", "uGlyphCount", "uRainGlyph", "uPalette"].map(name =>
        [name, gl.getUniformLocation(this.asciiProgram, name)]),
    );
    this.atlas = makeAtlas(gl);
    this.sceneTexture = makeTexture(gl);
    this.framebuffer = gl.createFramebuffer();
    this.vertexArray = gl.createVertexArray();
    if (!this.framebuffer || !this.vertexArray) throw new Error("WebGL 그리기 공간을 생성할 수 없습니다.");
    gl.bindVertexArray(this.vertexArray);
    this.tick = timestamp => {
      this.frame = 0;
      if (this.stopped || document.hidden) return;
      this.draw(this.clock.sample(timestamp, this.playing));
      if (this.playing) this.requestRender();
    };
    this.onVisibility = () => {
      this.clock.reset();
      if (document.hidden) {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
      } else {
        this.requestRender();
      }
    };
    this.onContextLost = event => {
      event.preventDefault();
      this.stopped = true;
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.onError(new Error("그래픽 연결이 끊겼습니다. 페이지를 다시 불러와 주세요."));
    };
    document.addEventListener("visibilitychange", this.onVisibility);
    canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
  }

  requestRender() {
    if (!this.frame && !this.stopped && !document.hidden) {
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  resize() {
    if (this.stopped) return;
    const { width, height } = this.canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    const drawing = getDrawingSize(width, height, window.devicePixelRatio);
    const grid = getGridSize(width, height, this.cellHeight);
    this.canvas.width = drawing.width;
    this.canvas.height = drawing.height;
    this.grid = grid;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, grid.columns, grid.rows,
      0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D, this.sceneTexture, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      this.stopped = true;
      this.onError(new Error(`문자 렌더링 공간을 준비하지 못했습니다. WebGL 상태: ${status}`));
      return;
    }
    this.onResize(grid);
    this.requestRender();
  }

  setPlaying(playing) {
    this.playing = playing;
    this.clock.reset();
    this.requestRender();
  }

  setCellHeight(value) {
    positiveNumber(value, "cellHeight");
    this.cellHeight = value;
    this.resize();
  }

  setMotion(value) {
    if (value !== 0 && value !== 1) throw new RangeError("motion must be 0 or 1");
    this.motion = value;
    this.requestRender();
  }

  setPalette(value) {
    if (value !== 0 && value !== 1) throw new RangeError("palette must be 0 or 1");
    this.palette = value;
    this.requestRender();
  }

  setRain(enabled) {
    this.rain = enabled ? 1 : 0;
    this.requestRender();
  }

  rotate(amount) {
    if (!Number.isFinite(amount)) throw new RangeError("rotation must be finite");
    this.yaw = ((this.yaw + amount) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    this.requestRender();
  }

  resetView() {
    this.yaw = 0.18;
    this.requestRender();
  }

  draw(time = this.clock.elapsed) {
    const gl = this.gl;
    const { columns, rows } = this.grid;
    gl.bindVertexArray(this.vertexArray);
    // Sample the 3D scene once per character, not once per display pixel.
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, columns, rows);
    gl.useProgram(this.sceneProgram);
    gl.uniform2f(this.sceneUniforms.uGrid, columns, rows);
    gl.uniform1f(this.sceneUniforms.uTime, time);
    gl.uniform1f(this.sceneUniforms.uYaw, this.yaw);
    gl.uniform1f(this.sceneUniforms.uMotion, this.motion);
    gl.uniform1f(this.sceneUniforms.uRain, this.rain);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.asciiProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.atlas.texture);
    gl.uniform1i(this.asciiUniforms.uScene, 0);
    gl.uniform1i(this.asciiUniforms.uAtlas, 1);
    gl.uniform2f(this.asciiUniforms.uGrid, columns, rows);
    gl.uniform1f(this.asciiUniforms.uGlyphCount, this.atlas.count);
    gl.uniform1f(this.asciiUniforms.uRainGlyph, this.atlas.rainGlyph);
    gl.uniform1f(this.asciiUniforms.uPalette, this.palette);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    this.stopped = true;
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    const gl = this.gl;
    gl.deleteTexture(this.atlas.texture);
    gl.deleteTexture(this.sceneTexture);
    gl.deleteFramebuffer(this.framebuffer);
    gl.deleteVertexArray(this.vertexArray);
    gl.deleteProgram(this.sceneProgram);
    gl.deleteProgram(this.asciiProgram);
  }
}
