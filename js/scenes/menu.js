// Main menu scene — polished nature-themed design
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, SCENE } from '../utils/constants.js';
import { getTotalStars } from '../utils/storage.js';

export class MenuScene {
  constructor(game) {
    this.game = game;
    this.timer = 0;
    this.orbs = [];
    this.leaves = [];
    this.ballY = 0;
    this.ballVy = 0;
  }

  enter() {
    this.timer = 0;
    this.ballY = 330;
    this.ballVy = -5;
    // Floating leaf particles
    this.leaves = [];
    for (let i = 0; i < 18; i++) {
      this.leaves.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        r: 2 + Math.random() * 4,
        speed: 0.3 + Math.random() * 0.6,
        alpha: 0.12 + Math.random() * 0.25,
        drift: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        hue: 80 + Math.random() * 60,
      });
    }
    // Glowing orbs
    this.orbs = [];
    for (let i = 0; i < 10; i++) {
      this.orbs.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        r: 2 + Math.random() * 5,
        speed: 0.15 + Math.random() * 0.3,
        alpha: 0.05 + Math.random() * 0.15,
        drift: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  update() {
    this.timer++;

    // Animate bouncing ball mascot
    this.ballVy += 0.35;
    this.ballY += this.ballVy;
    if (this.ballY >= 330) {
      this.ballY = 330;
      this.ballVy = -6.5;
    }

    // Update leaves
    for (const l of this.leaves) {
      l.y -= l.speed;
      l.x += l.drift + Math.sin(this.timer * 0.02 + l.rot) * 0.2;
      l.rot += l.rotSpeed;
      if (l.y < -10) { l.y = CANVAS_HEIGHT + 10; l.x = Math.random() * CANVAS_WIDTH; }
    }

    // Update orbs
    for (const o of this.orbs) {
      o.y -= o.speed;
      o.x += o.drift;
      if (o.y < -10) { o.y = CANVAS_HEIGHT + 10; o.x = Math.random() * CANVAS_WIDTH; }
    }

    const click = this.game.input.consumeClick();
    if (!click) return;

    // Play button
    const btnX = CANVAS_WIDTH / 2 - 90;
    const btnY = 420;
    if (click.x >= btnX && click.x <= btnX + 180 && click.y >= btnY && click.y <= btnY + 56) {
      this.game.audio.playClick();
      this.game.setScene(SCENE.LEVEL_SELECT);
      return;
    }

    // Mute button
    if (click.x >= CANVAS_WIDTH - 52 && click.x <= CANVAS_WIDTH - 10 && click.y >= 12 && click.y <= 50) {
      this.game.audio.toggleMute();
      this.game.audio.playClick();
    }
  }

  render(ctx) {
    const renderer = this.game.renderer;
    renderer.drawBackground();

    // Floating leaf particles
    for (const l of this.leaves) {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.r, l.r * 1.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${l.hue}, 50%, 45%, ${l.alpha})`;
      ctx.fill();
      ctx.restore();
    }

    // Glowing orbs
    for (const o of this.orbs) {
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 3);
      g.addColorStop(0, `rgba(180, 255, 120, ${o.alpha})`);
      g.addColorStop(1, `rgba(180, 255, 120, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(o.x - o.r * 3, o.y - o.r * 3, o.r * 6, o.r * 6);
    }

    // Animated ball mascot
    const squash = this.ballVy > 3 ? 0.7 : (this.ballVy < -3 ? 1.3 : 1);
    const scaleX = 1 + (1 - squash) * 0.5;
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, this.ballY);
    ctx.scale(scaleX, squash);
    // Glow
    const glow = ctx.createRadialGradient(0, 0, 8, 0, 0, 40);
    glow.addColorStop(0, 'rgba(100, 255, 180, 0.35)');
    glow.addColorStop(1, 'rgba(100, 255, 180, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-40, -40, 80, 80);
    // Ball body
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(-5, -5, 3, 0, 0, 22);
    grad.addColorStop(0, '#b0ffdb');
    grad.addColorStop(0.5, COLORS.player);
    grad.addColorStop(1, '#006644');
    ctx.fillStyle = grad;
    ctx.fill();
    // Rim highlight
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(180, 255, 220, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Shine
    ctx.beginPath();
    ctx.arc(-6, -7, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fill();
    ctx.restore();

    // Shadow under ball
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH / 2, 354, 18, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    // Title with nature glow
    const titleY = 120 + Math.sin(this.timer * 0.03) * 4;
    // Title shadow/glow layers
    renderer.text('ESCAPE IT', CANVAS_WIDTH / 2, titleY, {
      font: 'bold 48px "Fredoka", "Baloo 2", sans-serif',
      color: '#fff',
      shadow: true,
      glow: 'rgba(100, 255, 160, 0.6)'
    });

    // Subtitle
    renderer.text('Bounce your way through the jungle!', CANVAS_WIDTH / 2, titleY + 46, {
      font: '14px "Fredoka", sans-serif', color: 'rgba(180, 230, 200, 0.7)'
    });

    // Decorative vine line
    ctx.save();
    ctx.strokeStyle = 'rgba(100, 200, 130, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const lineY = titleY + 68;
    ctx.moveTo(CANVAS_WIDTH / 2 - 90, lineY);
    for (let x = -90; x <= 90; x += 5) {
      ctx.lineTo(CANVAS_WIDTH / 2 + x, lineY + Math.sin(x * 0.08 + this.timer * 0.04) * 3);
    }
    ctx.stroke();
    ctx.restore();

    // Star count badge
    const totalStars = getTotalStars();
    const badgeY = 258;
    // Badge background
    const badgeGrad = ctx.createLinearGradient(CANVAS_WIDTH / 2 - 55, badgeY, CANVAS_WIDTH / 2 + 55, badgeY + 40);
    badgeGrad.addColorStop(0, 'rgba(20, 50, 30, 0.7)');
    badgeGrad.addColorStop(1, 'rgba(10, 35, 20, 0.6)');
    renderer.roundRect(CANVAS_WIDTH / 2 - 55, badgeY, 110, 40, 20, badgeGrad, 'rgba(100, 200, 130, 0.3)');
    renderer.text(`⭐ ${totalStars}`, CANVAS_WIDTH / 2, badgeY + 20, {
      font: 'bold 17px "Fredoka", sans-serif', color: COLORS.star
    });

    // Play button — large, prominent, nature-themed
    const btnX = CANVAS_WIDTH / 2 - 90;
    const btnY = 420;
    // Button shadow
    renderer.roundRect(btnX + 2, btnY + 3, 180, 56, 16, 'rgba(0,0,0,0.35)');
    // Button gradient (green theme)
    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX, btnY + 56);
    btnGrad.addColorStop(0, '#45c77a');
    btnGrad.addColorStop(1, '#1a8a4a');
    renderer.roundRect(btnX, btnY, 180, 56, 16, btnGrad);
    // Button border glow
    ctx.save();
    ctx.shadowColor = 'rgba(100, 255, 160, 0.4)';
    ctx.shadowBlur = 12;
    renderer.roundRect(btnX, btnY, 180, 56, 16, null, 'rgba(140, 255, 180, 0.4)');
    ctx.shadowBlur = 0;
    ctx.restore();
    renderer.text('▶  PLAY', CANVAS_WIDTH / 2, btnY + 28, {
      font: 'bold 24px "Fredoka", sans-serif', color: '#fff', shadow: true
    });

    // Mute button
    const muted = this.game.audio.muted;
    renderer.roundRect(CANVAS_WIDTH - 52, 12, 40, 38, 10, 'rgba(20, 50, 30, 0.6)', 'rgba(100, 200, 130, 0.3)');
    renderer.text(muted ? '🔇' : '🔊', CANVAS_WIDTH - 32, 32, { font: '18px sans-serif' });

    // Version
    renderer.text('v2.0', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 18, {
      font: '11px "Fredoka", sans-serif', color: 'rgba(100, 180, 130, 0.4)'
    });
  }

  exit() {}
}
