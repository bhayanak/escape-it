// Collectible — star/gem pickup
import { TILE_SIZE, COLORS } from '../utils/constants.js';

export class Collectible {
  constructor(data) {
    this.x = data.x * TILE_SIZE + TILE_SIZE / 2;
    this.y = data.y * TILE_SIZE + TILE_SIZE / 2;
    this.radius = 8;
    this.collected = false;
    this.phase = Math.random() * Math.PI * 2;
    this.sparkles = [];
  }

  update() {
    this.phase += 0.05;
    // Sparkle effect when collected
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life--;
      if (s.life <= 0) this.sparkles.splice(i, 1);
    }
  }

  collect() {
    if (this.collected) return false;
    this.collected = true;
    // Spawn sparkles
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      this.sparkles.push({
        x: this.x, y: this.y,
        vx: Math.cos(angle) * 2.5,
        vy: Math.sin(angle) * 2.5,
        life: 15,
        maxLife: 15,
      });
    }
    return true;
  }

  render(ctx) {
    // Sparkle particles (always render even after collected)
    for (const s of this.sparkles) {
      const alpha = s.life / s.maxLife;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 211, 42, ${alpha})`;
      ctx.fill();
    }

    if (this.collected) return;

    const bob = Math.sin(this.phase) * 3;
    const glow = Math.sin(this.phase * 2) * 0.2 + 0.3;

    // Glow
    ctx.beginPath();
    ctx.arc(this.x, this.y + bob, this.radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 211, 42, ${glow * 0.3})`;
    ctx.fill();

    // Star shape
    ctx.save();
    ctx.translate(this.x, this.y + bob);
    ctx.rotate(this.phase * 0.3);

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const r = this.radius;
      const ix = Math.cos(a) * r;
      const iy = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(ix, iy);
      else ctx.lineTo(ix, iy);

      const ia = a + Math.PI / 5;
      ctx.lineTo(Math.cos(ia) * r * 0.45, Math.sin(ia) * r * 0.45);
    }
    ctx.closePath();
    ctx.fillStyle = COLORS.star;
    ctx.fill();
    ctx.strokeStyle = COLORS.starGlow;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}
