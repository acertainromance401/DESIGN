export const APPLAUSE_URL = new URL("./pwlpl-applause-sound-effect-521104.mp3", import.meta.url);

function createAudioContext() {
  const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContext) throw new Error("Web Audio is unavailable for applause");
  return new AudioContext();
}

export class ApplauseSound {
  #createContext;
  #context;
  #buffer;
  #loading;
  #source;
  #generation = 0;

  constructor(createContext = createAudioContext) {
    this.#createContext = createContext;
  }

  async prepare() {
    if (!this.#context || this.#context.state === "closed") this.#context = this.#createContext();
    const context = this.#context;
    // Resume synchronously within the button gesture, before downloading or decoding.
    const resumed = context.state === "running" ? Promise.resolve() : context.resume();
    if (!this.#buffer && !this.#loading) {
      this.#loading = (async () => {
        const response = await fetch(APPLAUSE_URL);
        if (!response.ok) throw new Error(`Applause request failed with HTTP ${response.status}`);
        this.#buffer = await context.decodeAudioData(await response.arrayBuffer());
      })().finally(() => { this.#loading = undefined; });
    }
    await Promise.all([resumed, this.#loading]);
    if (context.state !== "running") throw new Error("Applause audio was interrupted");
  }

  async play() {
    this.stop();
    const generation = this.#generation;
    try {
      await this.prepare();
    } catch (error) {
      if (generation === this.#generation) throw error;
      console.error("[birthday] Retired applause preparation failed", error);
      return;
    }
    if (generation !== this.#generation) return;
    const source = this.#context.createBufferSource();
    source.buffer = this.#buffer;
    source.loop = false;
    source.connect(this.#context.destination);
    source.onended = () => {
      source.disconnect();
      if (this.#source === source) this.#source = undefined;
    };
    try {
      source.start();
    } catch (error) {
      source.onended = null;
      source.disconnect();
      throw error;
    }
    this.#source = source;
  }

  stop() {
    this.#generation++;
    if (!this.#source) return;
    this.#source.onended = null;
    this.#source.stop();
    this.#source.disconnect();
    this.#source = undefined;
  }
}

export const applause = new ApplauseSound();
