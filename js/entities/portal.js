// Portal — level exit goal
import { TILE_SIZE, COLORS } from '../utils/constants.js';

export class Portal {
  constructor(data) {
    this.x = data.x * TILE_SIZE + TILE_SIZE / 2;
    this.y = data.y * TILE_SIZE + TILE_SIZE / 2;
    this.radius = TILE_SIZE * 0.6;
    this.pulsePhase = 0;
    this.particles = [];
  }

  update() {
    this.pulsePhase += 0.06;
    // Shimmer particles
    if (Math.random() < 0.3) {
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * this.radius * 2,
        y: this.y + (Math.random() - 0.5) * this.radius * 2,
        vy: -0.5 - Math.random(),
        life: 20 + Math.random() * 15,
        maxLife: 35,
        size: 1 + Math.random() * 2,
      });
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  render(ctx) {
    const pulse = Math.sin(this.pulsePhase) * 0.15 + 1;
    const r = this.radius * pulse;

    // Glow
    const glow = ctx.createRadialGradient(this.x, this.y, r * 0.2, this.x, this.y, r * 1.8);
    glow.addColorStop(0, 'rgba(162, 155, 254, 0.4)');
    glow.addColorStop(1, 'rgba(108, 92, 231, 0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    grad.addColorStop(0, '#ddd6fe');
    grad.addColorStop(0.5, COLORS.portal);
    grad.addColorStop(1, COLORS.portalGlow);
    ctx.fillStyle = grad;
    ctx.fill();

    // Inner ring
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Particles
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(162, 155, 254, ${alpha * 0.7})`;
      ctx.fill();
    }
  }
}
