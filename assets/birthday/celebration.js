import { analyzeBreath, BlowDetector } from "./blow-detector.js";
import { applause } from "./applause.js";

const byId = id => document.getElementById(id);
const pageTitle = document.title;
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeColor = themeMeta.content;
const page = byId("birthday-page");
const intro = [byId("intro-greeting"), byId("intro-invitation")];
const experience = byId("cake-experience");
const letter = byId("letter-experience");
const letterTitle = byId("letter-title");
const ending = byId("ending-experience");
const endingTitle = byId("ending-title");
const endingPhoto = byId("ending-photo");
const endingImageError = byId("ending-image-error");
const letterPaper = byId("letter-paper-image");
const letterImageError = byId("letter-image-error");
const title = byId("cake-title");
const litTitle = title.textContent;
const status = byId("cake-status");
const controls = byId("cake-controls");
const loading = byId("model-loading");
const retry = byId("retry-cake");
const result = byId("celebration-result");
const microphoneButton = byId("microphone-button");
const meter = byId("breath-meter");
const confetti = byId("confetti");
let scene;
let scenePromise;
let sceneGeneration = 0;
let active = false;
let currentView = "intro";
let lit = true;
let microphoneRequest = 0;
let requestingMicrophone = false;
let stream;
let audio;
let audioSource;
let audioTimer;
let confettiFrame;

function showStatus(message) {
  status.textContent = message;
}

function setEndingTheme(enabled) {
  document.documentElement.classList.toggle("is-ending", enabled);
  themeMeta.content = enabled ? "#000000" : themeColor;
}

function closeAudio(context) {
  if (context && context.state !== "closed") {
    context.onstatechange = null;
    void context.close().catch(error => console.error("[birthday] Could not close the audio context", error));
  }
}

function stopMicrophone() {
  microphoneRequest++;
  requestingMicrophone = false;
  clearTimeout(audioTimer);
  audioSource?.disconnect();
  audioSource = undefined;
  for (const track of stream?.getTracks() ?? []) {
    track.onended = null;
    track.stop();
  }
  stream = undefined;
  closeAudio(audio);
  audio = undefined;
  meter.hidden = true;
  meter.value = 0;
  microphoneButton.disabled = false;
  microphoneButton.textContent = "마이크로 불기";
}

function stopConfetti() {
  cancelAnimationFrame(confettiFrame);
  confettiFrame = undefined;
  confetti.hidden = true;
}

function celebrateWithConfetti() {
  stopConfetti();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const context = confetti.getContext("2d");
  if (!context) {
    console.error("[birthday] A 2D context is unavailable for confetti");
    showStatus("촛불이 모두 꺼졌어! 이 브라우저에서는 종이꽃 효과를 표시할 수 없어요.");
    return;
  }
  const width = innerWidth;
  const height = innerHeight;
  const scale = Math.min(devicePixelRatio || 1, 1.5);
  confetti.width = Math.round(width * scale);
  confetti.height = Math.round(height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  const colors = ["#f5cf72", "#a9d8bd", "#f49d89", "#fff5d8", "#73c7d4"];
  const particles = Array.from({ length: width < 600 ? 90 : 140 }, (_, index) => {
    const side = index % 2 ? 1 : -1;
    return {
      x: side < 0 ? 0 : width,
      y: height * (0.55 + Math.random() * 0.2),
      vx: -side * (2 + Math.random() * 5),
      vy: -5 - Math.random() * 8,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      color: colors[index % colors.length],
      size: 4 + Math.random() * 4,
    };
  });
  confetti.hidden = false;
  const start = performance.now();
  let previous = start;
  function draw(now) {
    const elapsed = now - start;
    if (!active || elapsed >= 3400) {
      stopConfetti();
      return;
    }
    if (now - previous < 1000 / 30 && now !== start) {
      confettiFrame = requestAnimationFrame(draw);
      return;
    }
    const delta = Math.min(2, (now - previous) / (1000 / 60));
    previous = now;
    context.clearRect(0, 0, width, height);
    context.globalAlpha = Math.min(1, (3400 - elapsed) / 650);
    for (const particle of particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 0.16 * delta;
      particle.rotation += particle.spin * delta;
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;
      context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
      context.restore();
    }
    confettiFrame = requestAnimationFrame(draw);
  }
  draw(start);
}

function updateCakeState() {
  page.classList.toggle("is-candlelit", active && lit && currentView === "cake");
  title.textContent = lit ? litTitle : "하동희 생일 축하해~~!";
  controls.hidden = !lit;
  result.hidden = lit;
  scene.setLit(lit);
  showStatus(lit ? "소원을 하나 떠올리고\n촛불을 후— 불어주세요" : "촛불이 모두 꺼졌어요~~ 생일 축하해!");
}

function blowOut() {
  if (!active || currentView !== "cake" || !scene || !lit) return;
  lit = false;
  stopMicrophone();
  updateCakeState();
  title.focus({ preventScroll: true });
  byId("read-letter").scrollIntoView({ block: "nearest" });
  celebrateWithConfetti();
  void applause.play().catch(error => {
    console.error("[birthday] Could not play applause", error);
    if (active && !lit) showStatus("촛불이 모두 꺼졌어요~~ 박수 소리를 재생하지 못했지만, 생일 축하해!");
  });
}

function failScene(error) {
  console.error("[birthday] Could not display the WebGL cake", error);
  sceneGeneration++;
  page.classList.remove("is-candlelit");
  stopMicrophone();
  applause.stop();
  scene?.dispose();
  scene = undefined;
  scenePromise = undefined;
  loading.hidden = true;
  controls.hidden = true;
  result.hidden = true;
  retry.hidden = false;
  showStatus("3D 케이크를 표시하지 못했어요. 연결 상태와 브라우저의 WebGL 지원을 확인한 뒤 다시 시도해 주세요.");
}

export async function startCelebration() {
  if (location.hash !== "#cake") history.pushState(null, "", "#cake");
  document.title = pageTitle;
  active = true;
  currentView = "cake";
  letter.hidden = true;
  ending.hidden = true;
  setEndingTheme(false);
  page.classList.remove("is-reading-letter", "is-ending");
  page.classList.add("is-celebrating");
  page.setAttribute("aria-labelledby", "cake-title");
  intro.forEach(element => { element.hidden = true; });
  experience.hidden = false;
  window.scrollTo(0, 0);
  title.focus({ preventScroll: true });
  retry.hidden = true;
  if (!scene) {
    loading.hidden = false;
    controls.hidden = true;
    result.hidden = true;
    showStatus("모바일용 케이크를 불러오는 중이에요.");
    if (!scenePromise) {
      const generation = ++sceneGeneration;
      scenePromise = import("./cake-scene.js").then(module => module.createCakeScene(byId("cake-viewer"), error => {
        if (generation === sceneGeneration) failScene(error);
      }));
    }
    const generation = sceneGeneration;
    try {
      const loaded = await scenePromise;
      if (generation !== sceneGeneration) {
        loaded.dispose();
        return;
      }
      scene = loaded;
      scene.setLit(lit, true);
    } catch (error) {
      if (generation === sceneGeneration) failScene(error);
      else console.error("[birthday] Retired cake load failed", error);
      return;
    }
  }
  loading.hidden = true;
  const cakeActive = active && currentView === "cake";
  scene.setActive(cakeActive);
  if (cakeActive) updateCakeState();
}

function showFinalPage(view) {
  const isEnding = view === "ending";
  const heading = isEnding ? endingTitle : letterTitle;
  active = true;
  currentView = view;
  stopMicrophone();
  stopConfetti();
  scene?.setActive(false);
  intro.forEach(element => { element.hidden = true; });
  experience.hidden = true;
  letter.hidden = isEnding;
  ending.hidden = !isEnding;
  page.classList.remove("is-candlelit");
  page.classList.add("is-celebrating");
  page.classList.toggle("is-reading-letter", !isEnding);
  page.classList.toggle("is-ending", isEnding);
  setEndingTheme(isEnding);
  page.setAttribute("aria-labelledby", heading.id);
  document.title = `${isEnding ? "엔딩" : "편지"} | ${pageTitle}`;
  window.scrollTo(0, 0);
  heading.focus({ preventScroll: true });
}

function returnToIntro(updateHistory = true) {
  if (updateHistory && location.hash) history.pushState(null, "", location.pathname + location.search);
  active = false;
  currentView = "intro";
  stopMicrophone();
  stopConfetti();
  applause.stop();
  scene?.setActive(false);
  experience.hidden = true;
  letter.hidden = true;
  ending.hidden = true;
  setEndingTheme(false);
  page.classList.remove("is-celebrating", "is-candlelit", "is-reading-letter", "is-ending");
  page.setAttribute("aria-labelledby", "birthday-title");
  document.title = pageTitle;
  intro.forEach(element => { element.hidden = false; });
  byId("start-celebration").disabled = false;
  byId("start-celebration").focus();
}

function microphoneErrorMessage(error) {
  switch (error?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "마이크 권한이 허용되지 않았어요. 터치로 촛불을 끄거나 브라우저 설정에서 마이크를 허용해 주세요.";
    case "NotFoundError":
      return "사용할 수 있는 마이크가 없어요. 아래 터치 버튼으로 촛불을 꺼 주세요.";
    case "NotReadableError":
      return "마이크를 사용할 수 없어요. 다른 앱의 마이크 사용을 확인하거나 터치 버튼을 이용해 주세요.";
    default:
      return "마이크를 시작하지 못했어요. 다시 시도하거나 터치 버튼으로 촛불을 꺼 주세요.";
  }
}

async function enableMicrophone() {
  if (!active || currentView !== "cake" || !scene || !lit) return;
  if (stream || requestingMicrophone) {
    stopMicrophone();
    showStatus("마이크를 껐어요. 다시 켜거나 터치로 촛불을 끌 수 있어요.");
    return;
  }
  if (!isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    showStatus("마이크는 HTTPS의 GitHub Pages 또는 localhost에서 사용할 수 있어요. 지금은 터치로 촛불을 꺼 주세요.");
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    showStatus("이 브라우저에서는 소리 분석을 지원하지 않아요. 터치로 촛불을 꺼 주세요.");
    return;
  }
  const request = ++microphoneRequest;
  requestingMicrophone = true;
  microphoneButton.disabled = true;
  showStatus("마이크 사용 권한을 요청하고 있어요. 허용 후 잠시 조용히 기다려 주세요.");
  let localAudio;
  let localStream;
  try {
    localAudio = new AudioContextClass({ latencyHint: "interactive" });
    audio = localAudio;
    await localAudio.resume();
    if (request !== microphoneRequest) {
      closeAudio(localAudio);
      return;
    }
    localStream = await navigator.mediaDevices.getUserMedia({
      // Cancel speaker feedback from the music without suppressing breath noise.
      audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
      video: false,
    });
    if (request !== microphoneRequest || !active || !lit) {
      localStream.getTracks().forEach(track => track.stop());
      closeAudio(localAudio);
      return;
    }
    stream = localStream;
    if (audio.state !== "running") throw new Error("Audio capture was interrupted before analysis started");
    audio.onstatechange = () => {
      if (audio?.state === "suspended" || audio?.state === "interrupted") {
        stopMicrophone();
        if (active && lit) showStatus("소리 분석이 중단되어 마이크를 껐어요. 다시 켜거나 터치 버튼을 이용해 주세요.");
      }
    };
    const analyser = audio.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.15;
    audioSource = audio.createMediaStreamSource(stream);
    audioSource.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    const spectrum = new Float32Array(analyser.frequencyBinCount);
    const detector = new BlowDetector();
    let previous = performance.now();
    let wasCalibrating = true;
    requestingMicrophone = false;
    microphoneButton.disabled = false;
    microphoneButton.textContent = "마이크 끄기";
    meter.hidden = false;
    showStatus("주변 소리를 확인하고 있어요.\n잠깐만 조용히 기다려 주세요.");
    for (const track of stream.getAudioTracks()) {
      track.onended = () => {
        stopMicrophone();
        if (active && lit) showStatus("마이크 연결이 끊겼어요. 다시 켜거나 터치 버튼을 이용해 주세요.");
      };
    }
    function listen() {
      if (request !== microphoneRequest) return;
      analyser.getFloatTimeDomainData(samples);
      analyser.getFloatFrequencyData(spectrum);
      const now = performance.now();
      const detection = detector.update(analyzeBreath(samples, spectrum, audio.sampleRate), now - previous);
      previous = now;
      meter.value = detection.progress;
      if (wasCalibrating && !detection.calibrating) {
        wasCalibrating = false;
        showStatus("이제 마이크 가까이에서\n후— 하고 불어주세요");
      }
      if (detection.blown) {
        blowOut();
        return;
      }
      audioTimer = setTimeout(listen, 40);
    }
    listen();
  } catch (error) {
    if (localStream !== stream) localStream?.getTracks().forEach(track => track.stop());
    if (localAudio !== audio) closeAudio(localAudio);
    if (request !== microphoneRequest) return;
    console.error("[birthday] Microphone activation failed", error);
    stopMicrophone();
    showStatus(microphoneErrorMessage(error));
  }
}

microphoneButton.addEventListener("click", enableMicrophone);
byId("touch-blow").addEventListener("click", blowOut);
byId("back-to-intro").addEventListener("click", () => returnToIntro());
retry.addEventListener("click", () => { void startCelebration(); });
byId("relight-candles").addEventListener("click", () => {
  if (!scene) return;
  lit = true;
  stopConfetti();
  applause.stop();
  updateCakeState();
  microphoneButton.focus({ preventScroll: true });
});
function pauseForBackground() {
  const wasListening = stream || requestingMicrophone;
  stopMicrophone();
  stopConfetti();
  applause.stop();
  if (wasListening && active && lit) showStatus("화면을 벗어나 마이크를 껐어요. 다시 켜면 이어서 불 수 있어요.");
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseForBackground();
});
window.addEventListener("pagehide", () => {
  pauseForBackground();
  scene?.setActive(false);
});
window.addEventListener("pageshow", () => {
  scene?.setActive(active && currentView === "cake");
});

function syncRoute() {
  if (location.hash === "#letter") showFinalPage("letter");
  else if (location.hash === "#ending") showFinalPage("ending");
  else if (location.hash === "#cake") void startCelebration();
  else returnToIntro(false);
}

window.addEventListener("hashchange", syncRoute);
if (["#letter", "#cake", "#ending"].includes(location.hash)) syncRoute();

function showLetterImageError() {
  const avif = byId("letter-paper-avif");
  if (letterPaper.currentSrc.endsWith(".avif") && avif.media !== "not all") {
    console.warn("[birthday] Letter AVIF unavailable; retrying WebP");
    avif.media = "not all";
    return;
  }
  letterImageError.hidden = false;
}

letterPaper.addEventListener("error", showLetterImageError);
letterPaper.addEventListener("load", () => { letterImageError.hidden = true; });
if (letterPaper.complete && letterPaper.currentSrc && !letterPaper.naturalWidth) showLetterImageError();

function showEndingImageError() {
  endingImageError.hidden = false;
}

endingPhoto.addEventListener("error", showEndingImageError);
endingPhoto.addEventListener("load", () => { endingImageError.hidden = true; });
if (endingPhoto.complete && endingPhoto.currentSrc && !endingPhoto.naturalWidth) showEndingImageError();
