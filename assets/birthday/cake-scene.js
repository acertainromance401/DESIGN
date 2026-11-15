import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CandleLighting, CANDLE_LIGHTING_MS } from "./candle-lighting.js";

const MODEL_URL = new URL("./cake-mobile.glb", import.meta.url);

function disposeTree(root) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  root.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of object.material ? [].concat(object.material) : []) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value?.isTexture) textures.add(value);
      }
    }
  });
  for (const texture of textures) {
    texture.dispose();
    if (typeof texture.source?.data?.close === "function") texture.source.data.close();
  }
  for (const material of materials) material.dispose();
  for (const geometry of geometries) geometry.dispose();
}

function addCandles(model, scene) {
  const candles = new THREE.Group();
  const flames = [];
  const lights = [];
  const ray = new THREE.Raycaster();
  const top = new THREE.Box3().setFromObject(model).max.y;
  const waxGeometry = new THREE.CylinderGeometry(0.043, 0.045, 0.34, 12);
  const wickGeometry = new THREE.CylinderGeometry(0.007, 0.007, 0.045, 5);
  const wickMaterial = new THREE.MeshBasicMaterial({ color: 0x382820 });
  const flameGeometry = new THREE.SphereGeometry(1, 12, 12);
  const positions = flameGeometry.attributes.position;
  for (let index = 0; index < positions.count; index++) {
    const taper = 0.8 - positions.getY(index) * 0.4;
    positions.setX(index, positions.getX(index) * taper);
    positions.setZ(index, positions.getZ(index) * taper);
  }
  flameGeometry.computeVertexNormals();
  const outerMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa35, transparent: true, opacity: 0.78, depthWrite: false, toneMapped: false });
  const innerMaterial = new THREE.MeshBasicMaterial({ color: 0xfff1cb, toneMapped: false });
  const colors = [0xf8d77f, 0xa5d6c3, 0xf2aca8];

  for (let index = 0; index < 3; index++) {
    const x = (index - 1) * 0.4;
    const z = index === 1 ? -0.2 : 0.12;
    ray.set(new THREE.Vector3(x, top + 1, z), new THREE.Vector3(0, -1, 0));
    const surface = ray.intersectObject(model, true)[0];
    if (!surface) throw new Error("Could not locate the cake surface for a candle");
    const y = surface.point.y;
    const candle = new THREE.Mesh(waxGeometry, new THREE.MeshStandardMaterial({ color: colors[index], roughness: 0.7 }));
    candle.position.set(x, y + 0.16, z);
    candles.add(candle);
    const wick = new THREE.Mesh(wickGeometry, wickMaterial);
    wick.position.set(x, y + 0.35, z);
    candles.add(wick);
    const flame = new THREE.Group();
    const outer = new THREE.Mesh(flameGeometry, outerMaterial);
    outer.scale.set(0.055, 0.12, 0.055);
    const inner = new THREE.Mesh(flameGeometry, innerMaterial);
    inner.scale.set(0.025, 0.073, 0.025);
    inner.position.y = -0.025;
    flame.add(outer, inner);
    flame.position.set(x, y + 0.455, z);
    candles.add(flame);
    flames.push(flame);
    const light = new THREE.PointLight(0xffb05c, 0.65, 3.5, 2);
    light.position.copy(flame.position);
    candles.add(light);
    lights.push(light);
  }
  scene.add(candles);
  return { flames, lights };
}

export async function createCakeScene(container, onFailure) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", "촛불 세 개가 켜진 동희의 3D 생일 케이크");
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  const download = new AbortController();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const lighting = new CandleLighting();
  container.style.setProperty("--candle-transition", `${CANDLE_LIGHTING_MS}ms`);
  let active = false;
  let lit = true;
  let disposed = false;
  let failed = false;
  let frame = 0;
  let lastFrame = 0;
  let flames = [];
  let candleLights = [];
  let center;
  let corners;

  const ambient = new THREE.HemisphereLight(0xfff3da, 0x214c62, 2);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xfff2d9, 2.5);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc6e8ff, 1.3);
  fill.position.set(3, 2, -2);
  scene.add(fill);

  function draw(time = performance.now()) {
    if (disposed || failed) return;
    const levels = lighting.sample(time);
    ambient.intensity = levels.ambient;
    key.intensity = levels.key;
    fill.intensity = levels.fill;
    candleLights.forEach((light, index) => {
      const flicker = reducedMotion.matches ? 1 : 1 + Math.sin(time * 0.012 + index * 2.3) * 0.04;
      light.intensity = levels.candle * flicker;
    });
    renderer.render(scene, camera);
  }

  function stopFrames() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function animate(time) {
    frame = 0;
    if (!active || disposed || failed || document.hidden || reducedMotion.matches) return;
    const transitioning = lighting.sample(time).transitioning;
    if (time - lastFrame >= 1000 / 30 || (!lit && !transitioning)) {
      if (lit) {
        flames.forEach((flame, index) => {
          const flicker = Math.sin(time * 0.012 + index * 2.3);
          flame.scale.set(1 + flicker * 0.06, 1 + flicker * 0.1, 1);
          flame.rotation.z = Math.sin(time * 0.008 + index) * 0.06;
        });
      }
      draw(time);
      lastFrame = time;
    }
    if (lit || transitioning) frame = requestAnimationFrame(animate);
  }

  function schedule() {
    stopFrames();
    if (active && (lit || lighting.sample(performance.now()).transitioning) && !document.hidden && !reducedMotion.matches && !failed && !disposed) frame = requestAnimationFrame(animate);
  }

  function positionCandleLight() {
    if (!active || !flames.length || disposed) return;
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const origin = new THREE.Vector3();
    for (const flame of flames) origin.add(flame.getWorldPosition(new THREE.Vector3()));
    origin.divideScalar(flames.length).project(camera);
    const radius = Math.max(144, rect.width * 0.65);
    container.style.setProperty("--candle-x", `${rect.left + (origin.x + 1) * rect.width / 2}px`);
    container.style.setProperty("--candle-y", `${rect.top + (1 - origin.y) * rect.height / 2}px`);
    container.style.setProperty("--candle-radius-x", `${radius}px`);
    container.style.setProperty("--candle-radius-y", `${radius * 0.8}px`);
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height || !center || disposed) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const direction = new THREE.Vector3(0, 0.65, 1).normalize();
    const up = new THREE.Vector3(0, direction.z, -direction.y);
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let distance = 0;
    for (const corner of corners) {
      const offset = corner.clone().sub(center);
      distance = Math.max(distance,
        offset.dot(direction) + Math.abs(offset.x) / (tangent * camera.aspect),
        offset.dot(direction) + Math.abs(offset.dot(up)) / tangent);
    }
    camera.position.copy(center).addScaledVector(direction, distance * 1.04);
    camera.lookAt(center);
    camera.updateMatrixWorld();
    positionCandleLight();
    draw();
  }

  function contextLost(event) {
    event.preventDefault();
    failed = true;
    dispose();
    onFailure(new Error("WebGL context lost"));
  }

  function visibilityChanged() {
    if (!document.hidden && active) draw();
    schedule();
  }

  function motionChanged() {
    if (reducedMotion.matches) lighting.setLit(lit, performance.now(), true);
    if (active) draw();
    schedule();
  }

  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibilityChanged);
  reducedMotion.addEventListener("change", motionChanged);
  window.addEventListener("scroll", positionCandleLight, { passive: true });
  const observer = new ResizeObserver(resize);

  function dispose() {
    if (disposed) return;
    disposed = true;
    download.abort();
    stopFrames();
    observer.disconnect();
    document.removeEventListener("visibilitychange", visibilityChanged);
    reducedMotion.removeEventListener("change", motionChanged);
    window.removeEventListener("scroll", positionCandleLight);
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    disposeTree(scene);
    const contextWasLost = renderer.getContext().isContextLost();
    renderer.dispose();
    if (!contextWasLost) renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  try {
    const response = await fetch(MODEL_URL, { signal: download.signal });
    if (!response.ok) throw new Error(`Cake model request failed with HTTP ${response.status}`);
    const data = await response.arrayBuffer();
    const { scene: model } = await new GLTFLoader().parseAsync(data, new URL("./", MODEL_URL).href);
    if (failed) {
      disposeTree(model);
      throw new Error("WebGL became unavailable while loading the cake");
    }
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    if (!(size.x > 0 && size.y > 0 && size.z > 0)) throw new Error("The cake has invalid dimensions");
    const scale = 2.6 / Math.max(size.x, size.z);
    const originalCenter = bounds.getCenter(new THREE.Vector3());
    model.scale.multiplyScalar(scale);
    model.position.set(-originalCenter.x * scale, -bounds.min.y * scale, -originalCenter.z * scale);
    scene.add(model);
    model.updateMatrixWorld(true);
    const candles = addCandles(model, scene);
    flames = candles.flames;
    candleLights = candles.lights;
    const cakeBounds = new THREE.Box3().setFromObject(scene);
    center = cakeBounds.getCenter(new THREE.Vector3());
    corners = [];
    for (const x of [cakeBounds.min.x, cakeBounds.max.x]) {
      for (const y of [cakeBounds.min.y, cakeBounds.max.y]) {
        for (const z of [cakeBounds.min.z, cakeBounds.max.z]) corners.push(new THREE.Vector3(x, y, z));
      }
    }
    observer.observe(container);
    const layout = container.closest("main");
    if (layout) observer.observe(layout);
    resize();
  } catch (error) {
    dispose();
    throw error;
  }

  return {
    setActive(value) {
      active = value;
      if (value) resize();
      schedule();
    },
    setLit(value, immediate = false) {
      lit = value;
      lighting.setLit(value, performance.now(), immediate || reducedMotion.matches);
      flames.forEach(flame => {
        flame.visible = value;
        flame.scale.set(1, 1, 1);
      });
      renderer.domElement.setAttribute("aria-label", value ? "촛불 세 개가 켜진 동희의 3D 생일 케이크" : "촛불이 모두 꺼진 동희의 3D 생일 케이크");
      positionCandleLight();
      draw();
      schedule();
    },
    dispose,
  };
}
