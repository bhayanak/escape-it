// Game loop with fixed-timestep update and variable render
export class GameLoop {
  constructor(updateFn, renderFn, fixedDt = 1000 / 60) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.fixedDt = fixedDt;
    this.accumulator = 0;
    this.lastTime = 0;
    this.running = false;
    this.rafId = null;
    this.fps = 0;
    this._frameCount = 0;
    this._fpsTime = 0;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this._tick = this._tick.bind(this);
    this.rafId = requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  _tick(now) {
    if (!this.running) return;

    let frameTime = now - this.lastTime;
    this.lastTime = now;
    // Clamp large jumps (e.g. tab was hidden)
    if (frameTime > 200) frameTime = 200;

    this.accumulator += frameTime;
    while (this.accumulator >= this.fixedDt) {
      this.updateFn(this.fixedDt);
      this.accumulator -= this.fixedDt;
    }

    const alpha = this.accumulator / this.fixedDt;
    this.renderFn(alpha);

    // FPS counter
    this._frameCount++;
    this._fpsTime += frameTime;
    if (this._fpsTime >= 1000) {
      this.fps = this._frameCount;
      this._frameCount = 0;
      this._fpsTime = 0;
    }

    this.rafId = requestAnimationFrame(this._tick);
  }
}
