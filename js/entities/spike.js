// Spike hazard — static triangular spikes
import { TILE_SIZE, COLORS } from '../utils/constants.js';

export class Spike {
  constructor(data) {
    this.x = data.x * TILE_SIZE;
    this.y = data.y * TILE_SIZE;
    this.w = (data.w || 1) * TILE_SIZE;
    this.dir = data.dir || 'up'; // 'up' | 'down' | 'left' | 'right'
    this.spikeCount = Math.floor(this.w / (TILE_SIZE * 0.5));
    if (this.spikeCount < 1) this.spikeCount = 1;
  }

  getHitbox() {
    const shrink = 4;
    if (this.dir === 'up') {
      return { x: this.x + shrink, y: this.y + TILE_SIZE * 0.3, w: this.w - shrink * 2, h: TILE_SIZE * 0.7 };
    } else if (this.dir === 'down') {
      return { x: this.x + shrink, y: this.y, w: this.w - shrink * 2, h: TILE_SIZE * 0.7 };
    }
    return { x: this.x + shrink, y: this.y + shrink, w: this.w - shrink * 2, h: TILE_SIZE - shrink * 2 };
  }

  render(ctx) {
    const spikeW = this.w / this.spikeCount;
    const t = performance.now() / 1000;
    const pulse = 0.85 + 0.15 * Math.sin(t * 3 + this.x * 0.1);

    for (let i = 0; i < this.spikeCount; i++) {
      const sx = this.x + i * spikeW;
      let tipX, tipY, baseY1, baseY2;

      if (this.dir === 'up') {
        tipX = sx + spikeW / 2; tipY = this.y + TILE_SIZE * 0.15;
        baseY1 = this.y + TILE_SIZE; baseY2 = this.y + TILE_SIZE;
      } else {
        tipX = sx + spikeW / 2; tipY = this.y + TILE_SIZE * 0.85;
        baseY1 = this.y; baseY2 = this.y;
      }

      // Glow under each spike
      ctx.save();
      ctx.globalAlpha = 0.18 * pulse;
      const glow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, spikeW);
      glow.addColorStop(0, COLORS.spike);
      glow.addColorStop(1, 'rgba(255,60,80,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(tipX - spikeW, tipY - spikeW, spikeW * 2, spikeW * 2);
      ctx.restore();

      // Spike body with gradient
      ctx.beginPath();
      if (this.dir === 'up') {
        ctx.moveTo(sx, baseY1);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(sx + spikeW, baseY2);
      } else {
        ctx.moveTo(sx, baseY1);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(sx + spikeW, baseY2);
      }
      ctx.closePath();
      const grad = ctx.createLinearGradient(tipX, tipY, tipX, this.dir === 'up' ? baseY1 : baseY1);
      grad.addColorStop(0, COLORS.spikeTip || '#ff8060');
      grad.addColorStop(1, COLORS.spike);
      ctx.fillStyle = grad;
      ctx.globalAlpha = pulse;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Bright edge highlight
      ctx.beginPath();
      if (this.dir === 'up') {
        ctx.moveTo(sx + 2, baseY1);
        ctx.lineTo(tipX, tipY + 2);
      } else {
        ctx.moveTo(sx + 2, baseY1);
        ctx.lineTo(tipX, tipY - 2);
      }
      ctx.strokeStyle = 'rgba(255,200,160,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
