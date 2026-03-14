// Rotating blade obstacle
import { TILE_SIZE, COLORS } from '../utils/constants.js';

export class Blade {
  constructor(data) {
    this.cx = data.x * TILE_SIZE + TILE_SIZE / 2;
    this.cy = data.y * TILE_SIZE + TILE_SIZE / 2;
    this.radius = (data.radius || 0.7) * TILE_SIZE;
    this.angle = 0;
    this.speed = data.speed || 0.05;
    this.teeth = data.teeth || 8;
  }

  update() {
    this.angle += this.speed;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.cx, this.cy);

    // Outer danger glow (non-rotating)
    const glowR = this.radius * 1.8;
    const glow = ctx.createRadialGradient(0, 0, this.radius * 0.5, 0, 0, glowR);
    glow.addColorStop(0, 'rgba(255, 60, 60, 0.18)');
    glow.addColorStop(1, 'rgba(255, 60, 60, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-glowR, -glowR, glowR * 2, glowR * 2);

    ctx.rotate(this.angle);

    // Outer circle — metallic gradient
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    const bodyGrad = ctx.createRadialGradient(-this.radius * 0.3, -this.radius * 0.3, 0, 0, 0, this.radius);
    bodyGrad.addColorStop(0, '#6a6a78');
    bodyGrad.addColorStop(0.6, COLORS.bladeBody || '#4a4a55');
    bodyGrad.addColorStop(1, '#2a2a32');
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Teeth — pointy red
    for (let i = 0; i < this.teeth; i++) {
      const a = (i / this.teeth) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(a - 0.18) * this.radius * 0.68,
        Math.sin(a - 0.18) * this.radius * 0.68
      );
      ctx.lineTo(
        Math.cos(a) * this.radius * 1.2,
        Math.sin(a) * this.radius * 1.2
      );
      ctx.lineTo(
        Math.cos(a + 0.18) * this.radius * 0.68,
        Math.sin(a + 0.18) * this.radius * 0.68
      );
      ctx.closePath();
      const toothGrad = ctx.createLinearGradient(
        Math.cos(a) * this.radius * 0.5, Math.sin(a) * this.radius * 0.5,
        Math.cos(a) * this.radius * 1.2, Math.sin(a) * this.radius * 1.2
      );
      toothGrad.addColorStop(0, '#a03030');
      toothGrad.addColorStop(1, COLORS.blade);
      ctx.fillStyle = toothGrad;
      ctx.fill();
    }

    // Center bolt — metallic
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.22, 0, Math.PI * 2);
    const boltGrad = ctx.createRadialGradient(-1, -1, 0, 0, 0, this.radius * 0.22);
    boltGrad.addColorStop(0, '#ccc');
    boltGrad.addColorStop(1, '#666');
    ctx.fillStyle = boltGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}
