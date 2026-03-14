// Crusher — vertically moving block hazard
import { TILE_SIZE, COLORS } from '../utils/constants.js';

export class Crusher {
  constructor(data) {
    this.x = data.x * TILE_SIZE;
    this.originY = data.y * TILE_SIZE;
    this.y = this.originY;
    this.w = (data.w || 2) * TILE_SIZE;
    this.h = (data.h || 1) * TILE_SIZE;
    this.range = (data.range || 3) * TILE_SIZE;
    this.speed = data.speed || 2;
    this.waitTime = data.wait || 40;
    this.state = 'waiting'; // 'waiting' | 'crushing' | 'returning'
    this.timer = this.waitTime;
    this.dir = 1;
  }

  update() {
    if (this.state === 'waiting') {
      this.timer--;
      if (this.timer <= 0) {
        this.state = 'crushing';
      }
    } else if (this.state === 'crushing') {
      this.y += this.speed * 3;
      if (this.y >= this.originY + this.range) {
        this.y = this.originY + this.range;
        this.state = 'returning';
        this.timer = 10;
      }
    } else if (this.state === 'returning') {
      this.timer--;
      if (this.timer <= 0) {
        this.y -= this.speed;
        if (this.y <= this.originY) {
          this.y = this.originY;
          this.state = 'waiting';
          this.timer = this.waitTime;
        }
      }
    }
  }

  render(ctx) {
    const isCrushing = this.state === 'crushing';

    // Warning glow when crushing
    if (isCrushing) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      const glow = ctx.createRadialGradient(
        this.x + this.w / 2, this.y + this.h, 0,
        this.x + this.w / 2, this.y + this.h, this.w * 0.8
      );
      glow.addColorStop(0, 'rgba(255, 100, 50, 0.4)');
      glow.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(this.x - this.w * 0.3, this.y, this.w * 1.6, this.w);
      ctx.restore();
    }

    // Top rod with metallic gradient
    const rodX = this.x + this.w / 2 - 4;
    const rodY = this.originY - 10;
    const rodH = this.y - this.originY + 10;
    const rodGrad = ctx.createLinearGradient(rodX, 0, rodX + 8, 0);
    rodGrad.addColorStop(0, '#555');
    rodGrad.addColorStop(0.5, '#888');
    rodGrad.addColorStop(1, '#555');
    ctx.fillStyle = rodGrad;
    ctx.fillRect(rodX, rodY, 8, rodH);

    // Body with gradient and hazard stripes
    const bodyGrad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.h);
    bodyGrad.addColorStop(0, '#7a5a40');
    bodyGrad.addColorStop(0.5, COLORS.crusher);
    bodyGrad.addColorStop(1, '#503828');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // Hazard stripes
    ctx.save();
    ctx.globalAlpha = 0.15;
    const stripeW = 8;
    for (let sx = this.x; sx < this.x + this.w; sx += stripeW * 2) {
      ctx.fillStyle = '#ff8844';
      ctx.fillRect(sx, this.y, stripeW, this.h);
    }
    ctx.restore();

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Bottom teeth with gradient
    const teethCount = Math.floor(this.w / 10);
    const tw = this.w / teethCount;
    for (let i = 0; i < teethCount; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x + i * tw, this.y + this.h);
      ctx.lineTo(this.x + i * tw + tw / 2, this.y + this.h + 7);
      ctx.lineTo(this.x + (i + 1) * tw, this.y + this.h);
      ctx.closePath();
      const toothGrad = ctx.createLinearGradient(0, this.y + this.h, 0, this.y + this.h + 7);
      toothGrad.addColorStop(0, COLORS.crusherTeeth);
      toothGrad.addColorStop(1, '#806040');
      ctx.fillStyle = toothGrad;
      ctx.fill();
    }
  }
}
