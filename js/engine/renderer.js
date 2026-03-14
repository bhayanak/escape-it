// Renderer — Canvas 2D with camera, background image, animated creepers
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../utils/constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0 };
    this.shake = { x: 0, y: 0, duration: 0, intensity: 0 };
    this._stars = this._generateStars(60);
    this._creepers = this._generateCreepers(14);
    this._fireflies = this._generateFireflies(25);
    this._bgImgs = [null, null, null]; // one per pack
    this._bgLoaded = [false, false, false];
    this._activeBg = 0; // index of current background
    this._loadBgs();
  }

  _loadBgs() {
    const srcs = ['assets/background.jpg', 'assets/back2.jpg', 'assets/back3.jpg'];
    srcs.forEach((src, i) => {
      const img = new Image();
      img.onload = () => { this._bgImgs[i] = img; this._bgLoaded[i] = true; };
      img.src = src;
    });
  }

  /** Set which background to use (0 = beginner, 1 = advanced, 2 = expert) */
  setBackground(index) {
    this._activeBg = Math.max(0, Math.min(2, index));
  }

  _generateStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT * 3,
        r: 0.3 + Math.random() * 1.5,
        alpha: 0.15 + Math.random() * 0.5,
        twinkleSpeed: 0.015 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        hue: 140 + Math.random() * 80, // green-gold range
      });
    }
    return stars;
  }

  _generateCreepers(count) {
    const creepers = [];
    for (let i = 0; i < count; i++) {
      const x = (i / count) * CANVAS_WIDTH + (Math.random() - 0.5) * 30;
      creepers.push({
        x,
        length: 40 + Math.random() * 100,
        width: 2 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.015,
        amplitude: 3 + Math.random() * 8,
        leaves: Math.floor(2 + Math.random() * 4),
        hue: 90 + Math.random() * 50, // green range
        sat: 40 + Math.random() * 30,
      });
    }
    return creepers;
  }

  _generateFireflies(count) {
    const ff = [];
    for (let i = 0; i < count; i++) {
      ff.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        baseX: Math.random() * CANVAS_WIDTH,
        baseY: Math.random() * CANVAS_HEIGHT,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01,
        radius: 15 + Math.random() * 30,
        size: 1 + Math.random() * 2,
        alpha: 0,
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: 0.02 + Math.random() * 0.04,
      });
    }
    return ff;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground(levelHeight) {
    const ctx = this.ctx;
    const t = performance.now() / 1000;
    const camY = this.camera.y || 0;

    // ── Background image (stretched, dimmed) ──
    const bgIdx = this._activeBg;
    if (this._bgLoaded[bgIdx] && this._bgImgs[bgIdx]) {
      const bgImg = this._bgImgs[bgIdx];
      ctx.save();
      ctx.globalAlpha = 0.35;
      // Parallax: slow vertical scroll
      const imgH = CANVAS_WIDTH * (bgImg.height / bgImg.width);
      const offsetY = (-camY * 0.08) % imgH;
      ctx.drawImage(bgImg, 0, offsetY, CANVAS_WIDTH, imgH);
      if (offsetY + imgH < CANVAS_HEIGHT) {
        ctx.drawImage(bgImg, 0, offsetY + imgH, CANVAS_WIDTH, imgH);
      }
      ctx.restore();
    }

    // ── Dark gradient overlay for depth ──
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, 'rgba(5, 15, 10, 0.75)');
    grad.addColorStop(0.4, 'rgba(8, 20, 15, 0.55)');
    grad.addColorStop(1, 'rgba(5, 12, 20, 0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // ── Twinkling particles (replacing old grid) ──
    for (const s of this._stars) {
      const sy = ((s.y - camY * 0.12) % (CANVAS_HEIGHT + 20) + CANVAS_HEIGHT + 20) % (CANVAS_HEIGHT + 20);
      const alpha = s.alpha * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 10 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, sy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 60%, 75%, ${alpha})`;
      ctx.fill();
    }

    // ── Fireflies (floating, blinking) ──
    for (const ff of this._fireflies) {
      ff.phase += ff.speed;
      ff.blinkPhase += ff.blinkSpeed;
      ff.x = ff.baseX + Math.sin(ff.phase) * ff.radius;
      ff.y = ((ff.baseY + Math.cos(ff.phase * 0.7) * ff.radius * 0.5 - camY * 0.06)
              % (CANVAS_HEIGHT + 40) + CANVAS_HEIGHT + 40) % (CANVAS_HEIGHT + 40);
      ff.alpha = Math.max(0, Math.sin(ff.blinkPhase)) * 0.7;

      if (ff.alpha > 0.05) {
        // Glow
        const glow = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 6);
        glow.addColorStop(0, `rgba(200, 255, 100, ${ff.alpha * 0.4})`);
        glow.addColorStop(1, `rgba(200, 255, 100, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(ff.x - ff.size * 6, ff.y - ff.size * 6, ff.size * 12, ff.size * 12);
        // Core
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 255, 140, ${ff.alpha})`;
        ctx.fill();
      }
    }

    // ── Hanging creepers / vines (animated swinging) ──
    this._drawCreepers(ctx, t, camY);
  }

  _drawCreepers(ctx, t, camY) {
    for (const c of this._creepers) {
      ctx.save();
      const swing = Math.sin(t * c.speed * 6 + c.phase) * c.amplitude;
      const startY = (-camY * 0.03 + c.phase * 50) % 20 - 10; // peek from top

      ctx.beginPath();
      ctx.moveTo(c.x, startY);

      // Vine curve
      const segments = 8;
      for (let i = 1; i <= segments; i++) {
        const frac = i / segments;
        const cx1 = c.x + swing * frac * 0.6;
        const cy1 = startY + c.length * (frac - 0.5 / segments);
        const cx2 = c.x + swing * frac;
        const cy2 = startY + c.length * frac;
        ctx.quadraticCurveTo(cx1, cy1, cx2, cy2);
      }

      ctx.strokeStyle = `hsla(${c.hue}, ${c.sat}%, 30%, 0.5)`;
      ctx.lineWidth = c.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Leaves along the vine
      for (let j = 0; j < c.leaves; j++) {
        const leafFrac = 0.3 + (j / c.leaves) * 0.65;
        const lx = c.x + swing * leafFrac;
        const ly = startY + c.length * leafFrac;
        const leafAngle = swing * 0.03 + j * 1.2;
        const leafSize = 4 + Math.sin(t * 0.5 + j) * 1.5;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(leafAngle);
        ctx.beginPath();
        ctx.ellipse(0, 0, leafSize, leafSize * 2.2, 0, 0, Math.PI * 2);
        const leafAlpha = 0.35 + Math.sin(t * 0.3 + c.phase + j) * 0.15;
        ctx.fillStyle = `hsla(${c.hue + 10}, ${c.sat + 10}%, 35%, ${leafAlpha})`;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  beginCamera() {
    this.ctx.save();
    let ox = -this.camera.x;
    let oy = -this.camera.y;
    if (this.shake.duration > 0) {
      ox += (Math.random() - 0.5) * this.shake.intensity * 2;
      oy += (Math.random() - 0.5) * this.shake.intensity * 2;
      this.shake.duration--;
    }
    this.ctx.translate(Math.round(ox), Math.round(oy));
  }

  endCamera() {
    this.ctx.restore();
  }

  triggerShake(intensity = 5, duration = 8) {
    this.shake.intensity = intensity;
    this.shake.duration = duration;
  }

  // Draw a rounded rectangle
  roundRect(x, y, w, h, r, fillStyle, strokeStyle) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
    if (strokeStyle) { ctx.strokeStyle = strokeStyle; ctx.lineWidth = 1.5; ctx.stroke(); }
  }

  // Draw circle
  circle(x, y, r, fillStyle) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  // Draw text with optional shadow + glow
  text(str, x, y, { font = '20px "Fredoka", Arial', color = COLORS.text, align = 'center', baseline = 'middle', shadow = false, glow = null } = {}) {
    const ctx = this.ctx;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = 14;
    }
    if (shadow) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillText(str, x + 1, y + 2);
    }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
    ctx.shadowBlur = 0;
  }
}
