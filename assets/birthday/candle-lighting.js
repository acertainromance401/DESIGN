export const CANDLE_LIGHTING_MS = 1100;

export class CandleLighting {
  #from = 1;
  #target = 1;
  #started = 0;

  setLit(lit, now, immediate = false) {
    const current = this.sample(now).darkness;
    const target = lit ? 1 : 0;
    if (target === this.#target && !immediate) return;
    this.#target = target;
    this.#from = immediate ? this.#target : current;
    this.#started = now;
  }

  sample(now) {
    if (!Number.isFinite(now)) throw new RangeError("Lighting requires a finite timestamp");
    const progress = Math.max(0, Math.min(1, (now - this.#started) / CANDLE_LIGHTING_MS));
    const eased = progress * progress * (3 - 2 * progress);
    const darkness = progress === 1 ? this.#target : this.#from + (this.#target - this.#from) * eased;
    return {
      darkness,
      transitioning: this.#from !== this.#target && progress < 1,
      ambient: 2 + (0.14 - 2) * darkness,
      key: 2.5 + (0.18 - 2.5) * darkness,
      fill: 1.3 + (0.06 - 1.3) * darkness,
      candle: this.#target === 1 ? 0.65 : 0,
    };
  }
}
