// Platform entity — static and moving
import { TILE_SIZE, COLORS } from '../utils/constants.js';

export class Platform {
  constructor(data) {
    this.x = data.x * TILE_SIZE;
    this.y = data.y * TILE_SIZE;
    this.w = data.w * TILE_SIZE;
    this.h = (data.h || 1) * TILE_SIZE;
    this.type = data.type || 'static'; // 'static' | 'moving_h' | 'moving_v'
    this.speed = data.speed || 1;
    this.range = (data.range || 3) * TILE_SIZE;
    this.originX = this.x;
    this.originY = this.y;
    this.dir = 1;
  }

  update() {
    if (this.type === 'moving_h') {
      this.x += this.speed * this.dir;
      if (this.x > this.originX + this.range || this.x < this.originX) {
        this.dir *= -1;
      }
    } else if (this.type === 'moving_v') {
      this.y += this.speed * this.dir;
      if (this.y > this.originY + this.range || this.y < this.originY) {
        this.dir *= -1;
      }
    }
  }

  render(ctx) {
    const r = 5;

    // Platform shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.moveTo(this.x + r + 2, this.y + 3);
    ctx.lineTo(this.x + this.w - r + 2, this.y + 3);
    ctx.quadraticCurveTo(this.x + this.w + 2, this.y + 3, this.x + this.w + 2, this.y + r + 3);
    ctx.lineTo(this.x + this.w + 2, this.y + this.h - r + 3);
    ctx.quadraticCurveTo(this.x + this.w + 2, this.y + this.h + 3, this.x + this.w - r + 2, this.y + this.h + 3);
    ctx.lineTo(this.x + r + 2, this.y + this.h + 3);
    ctx.quadraticCurveTo(this.x + 2, this.y + this.h + 3, this.x + 2, this.y + this.h - r + 3);
    ctx.lineTo(this.x + 2, this.y + r + 3);
    ctx.quadraticCurveTo(this.x + 2, this.y + 3, this.x + r + 2, this.y + 3);
    ctx.closePath();
    ctx.fill();

    // Platform body with gradient
    ctx.beginPath();
    ctx.moveTo(this.x + r, this.y);
    ctx.lineTo(this.x + this.w - r, this.y);
    ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, this.y + r);
    ctx.lineTo(this.x + this.w, this.y + this.h - r);
    ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, this.x + this.w - r, this.y + this.h);
    ctx.lineTo(this.x + r, this.y + this.h);
    ctx.quadraticCurveTo(this.x, this.y + this.h, this.x, this.y + this.h - r);
    ctx.lineTo(this.x, this.y + r);
    ctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
    ctx.closePath();

    const isMoving = this.type !== 'static';
    const bodyGrad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.h);
    if (isMoving) {
      bodyGrad.addColorStop(0, COLORS.platformMovingLight);
      bodyGrad.addColorStop(0.5, COLORS.platformMoving);
      bodyGrad.addColorStop(1, '#2a6878');
    } else {
      bodyGrad.addColorStop(0, COLORS.platformLight);
      bodyGrad.addColorStop(0.5, COLORS.platform);
      bodyGrad.addColorStop(1, COLORS.platformDark);
    }
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Mossy texture — small dots
    ctx.save();
    ctx.globalAlpha = 0.12;
    const seed = Math.abs(this.x * 7 + this.y * 13);
    for (let i = 0; i < Math.floor(this.w / 8); i++) {
      const dotX = this.x + 4 + ((seed + i * 37) % (this.w - 8));
      const dotY = this.y + 3 + ((seed + i * 53) % Math.max(1, this.h - 6));
      const dotR = 1 + ((seed + i * 17) % 3);
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
      ctx.fillStyle = isMoving ? 'rgba(120, 200, 220, 0.5)' : 'rgba(100, 200, 120, 0.5)';
      ctx.fill();
    }
    ctx.restore();

    // Border with natural tint
    ctx.strokeStyle = isMoving ? 'rgba(120, 220, 240, 0.12)' : 'rgba(100, 200, 130, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Top highlight stripe — grassy
    const topHL = isMoving ? 'rgba(120, 220, 255, 0.3)' : 'rgba(100, 220, 130, 0.3)';
    ctx.fillStyle = topHL;
    ctx.fillRect(this.x + 2, this.y + 1, this.w - 4, 2);

    // Moving platform indicator — glowing dots
    if (isMoving) {
      const dotCount = Math.floor(this.w / 16);
      for (let i = 0; i < dotCount; i++) {
        const dx = this.x + 8 + i * 16;
        const dy = this.y + this.h / 2;
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120, 220, 255, 0.3)';
        ctx.fill();
      }
    }
  }
}
