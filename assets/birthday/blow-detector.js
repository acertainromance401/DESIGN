export function analyzeBreath(samples, spectrum, sampleRate) {
  if (!samples.length || !spectrum.length || !(sampleRate > 0)) {
    throw new RangeError("Audio analysis requires samples, a spectrum, and a positive sample rate");
  }
  let squared = 0;
  for (const sample of samples) squared += sample * sample;
  let total = 0;
  let air = 0;
  for (let index = 0; index < spectrum.length; index++) {
    const power = 10 ** (spectrum[index] / 10);
    const frequency = index * sampleRate / (spectrum.length * 2);
    total += power;
    if (frequency >= 700 && frequency <= 9000) air += power;
  }
  return {
    rms: Math.sqrt(squared / samples.length),
    airRatio: total > 0 ? air / total : 0,
  };
}

export class BlowDetector {
  #calibration = 0;
  #noise = 0.008;
  #held = 0;
  #blown = false;

  update({ rms, airRatio }, elapsedMs) {
    if (![rms, airRatio, elapsedMs].every(Number.isFinite) || rms < 0 || airRatio < 0 || airRatio > 1 || elapsedMs < 0) {
      throw new RangeError("Invalid breath analysis frame");
    }
    // A stalled tab must not turn a single loud frame into a sustained breath.
    const delta = Math.min(elapsedMs, 100);
    if (this.#calibration < 700) {
      this.#calibration += delta;
      this.#noise = this.#noise * 0.85 + rms * 0.15;
      return { calibrating: true, progress: 0, blown: false };
    }
    const threshold = Math.max(0.03, this.#noise * 2.8);
    const isBreath = rms > threshold && airRatio > 0.06;
    this.#held = isBreath ? this.#held + delta : Math.max(0, this.#held - delta * 2);
    if (!isBreath && rms < threshold) this.#noise = this.#noise * 0.99 + rms * 0.01;
    this.#blown ||= this.#held >= 400;
    return { calibrating: false, progress: Math.min(1, this.#held / 400), blown: this.#blown };
  }
}
