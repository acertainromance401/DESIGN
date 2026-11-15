export function setupBackgroundMusic(audio, startButton, status) {
  const gestures = startButton.ownerDocument;
  let pending = false;
  let failed = false;
  let generation = 0;
  audio.loop = true;
  audio.volume = 0.4;

  function showStatus(message) {
    status.textContent = message;
    status.hidden = !message;
  }

  function fail(error) {
    if (failed) return;
    failed = true;
    pending = false;
    generation++;
    audio.pause();
    console.error("[birthday] Could not play background music", error);
    showStatus("음악을 재생하지 못했어요. 연결을 확인하고 화면을 터치하면 다시 시도해요.");
    listenForGesture();
  }

  async function play(fromGesture = false) {
    if (!audio.paused || (pending && !fromGesture)) return;
    const attempt = ++generation;
    pending = true;
    failed = false;
    showStatus("");
    try {
      if (audio.error) audio.load();
      await audio.play();
    } catch (error) {
      if (attempt !== generation) return;
      if (error?.name === "NotAllowedError") {
        showStatus("화면을 터치하면 음악이 시작돼요.");
      } else {
        fail(error);
      }
    } finally {
      if (attempt === generation) pending = false;
    }
  }

  startButton.addEventListener("click", () => { void play(true); });
  function resumeAfterGesture(event) {
    if (event.composedPath().includes(startButton)) return;
    if (event.type === "keydown" && (event.repeat || event.ctrlKey || event.altKey || event.metaKey || !["Enter", " "].includes(event.key))) return;
    void play(true);
  }
  function listenForGesture() {
    gestures.addEventListener("click", resumeAfterGesture, { capture: true });
    gestures.addEventListener("keydown", resumeAfterGesture, { capture: true });
  }
  listenForGesture();
  audio.addEventListener("playing", () => {
    showStatus("");
    gestures.removeEventListener("click", resumeAfterGesture, { capture: true });
    gestures.removeEventListener("keydown", resumeAfterGesture, { capture: true });
  });
  audio.addEventListener("error", () => fail(audio.error ?? new Error("Audio loading failed")));
  startButton.disabled = false;
  startButton.textContent = "확인";
  void play();
}
