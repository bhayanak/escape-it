// Simple particle system for juice effects
export class Particles {
  constructor() {
    this.list = [];
  }

  emit(x, y, count, opts = {}) {
    const {
      color = '255, 210, 42',
      speed = 3,
      life = 25,
      size = 3,
      gravity = 0.05,
      spread = Math.PI * 2,
      angle = 0,
    } = opts;

    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const s = speed * (0.5 + Math.random() * 0.5);
      this.list.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life, maxLife: life,
        size: size * (0.5 + Math.random() * 0.5),
        color, gravity,
      });
    }
  }

  // Death burst
  burstDeath(x, y) {
    this.emit(x, y, 20, { color: '255, 71, 87', speed: 4, life: 30, size: 4, gravity: 0.08 });
    this.emit(x, y, 10, { color: '255, 150, 150', speed: 2, life: 20, size: 2, gravity: 0.03 });
  }

  // Star collect
  burstCollect(x, y) {
    this.emit(x, y, 12, { color: '255, 211, 42', speed: 3, life: 20, size: 3, gravity: 0.02 });
  }

  // Portal shimmer
  portalBurst(x, y) {
    this.emit(x, y, 25, { color: '162, 155, 254', speed: 3.5, life: 30, size: 3, gravity: 0 });
  }

  update() {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;
      if (p.life <= 0) this.list.splice(i, 1);
    }
  }

  render(ctx) {
    for (const p of this.list) {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
      ctx.fill();
    }
  }
}
