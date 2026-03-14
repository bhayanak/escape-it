// Player — bouncing ball entity
import { PLAYER_RADIUS, PLAYER_SPEED, COLORS, CANVAS_WIDTH } from '../utils/constants.js';
import { applyGravity, applyFriction, clampSpeed, bounce } from '../engine/physics.js';

export class Player {
  constructor(x, y) {
    this.spawn = { x, y };
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = PLAYER_RADIUS;
    this.alive = true;
    this.onGround = false;
    this.squash = 1; // squash-and-stretch factor
    this.trail = [];  // trail particles
  }

  reset() {
    this.x = this.spawn.x;
    this.y = this.spawn.y;
    this.vx = 0;
    this.vy = 0;
    this.alive = true;
    this.onGround = false;
    this.squash = 1;
    this.trail = [];
  }

  update(input) {
    if (!this.alive) return;

    // Horizontal input
    if (input.isLeft()) {
      this.vx -= PLAYER_SPEED * 0.3;
    } else if (input.isRight()) {
      this.vx += PLAYER_SPEED * 0.3;
    }
    applyFriction(this);
    clampSpeed(this);
    applyGravity(this);

    this.x += this.vx;
    this.y += this.vy;

    // Squash-and-stretch recovery
    this.squash += (1 - this.squash) * 0.15;

    // Trail
    if (this.trail.length > 8) this.trail.shift();
    this.trail.push({ x: this.x, y: this.y, life: 8 });
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].life--;
      if (this.trail[i].life <= 0) this.trail.splice(i, 1);
    }

    // World left/right bounds
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = 0;
    }
  }

  bounceOff() {
    bounce(this);
    this.squash = 0.6;
    this.onGround = true;
  }

  die() {
    this.alive = false;
  }

  render(ctx) {
    // Trail with glow
    for (const t of this.trail) {
      const alpha = t.life / 8 * 0.3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius * (t.life / 8) * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLORS.playerTrail}, ${alpha})`;
      ctx.fill();
    }

    if (!this.alive) return;

    const scaleX = 1 + (1 - this.squash) * 0.5;
    const scaleY = this.squash;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(scaleX, scaleY);

    // Outer glow — pulsing green
    const t = performance.now() / 1000;
    const glowPulse = 1 + 0.15 * Math.sin(t * 3);
    const glowR = this.radius * 2.4 * glowPulse;
    const glowGrad = ctx.createRadialGradient(0, 0, this.radius * 0.4, 0, 0, glowR);
    glowGrad.addColorStop(0, COLORS.playerGlow);
    glowGrad.addColorStop(1, 'rgba(80, 240, 170, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(-glowR, -glowR, glowR * 2, glowR * 2);

    // Shadow beneath
    ctx.beginPath();
    ctx.arc(0, this.radius * 0.35, this.radius * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();

    // Body — rich green orb
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(-3, -4, 2, 0, 0, this.radius);
    grad.addColorStop(0, COLORS.playerHighlight);
    grad.addColorStop(0.5, COLORS.player);
    grad.addColorStop(1, '#0a6644');
    ctx.fillStyle = grad;
    ctx.fill();

    // Rim highlight
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(160, 255, 200, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Shine spot
    ctx.beginPath();
    ctx.arc(-3, -5, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();

    // Secondary small shine
    ctx.beginPath();
    ctx.arc(3, 3, this.radius * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,255,220,0.3)';
    ctx.fill();

    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      w: this.radius * 2,
      h: this.radius * 2
    };
  }
}
