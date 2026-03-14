// Level complete scene — card design with star reveal
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, SCENE, TOTAL_LEVELS } from '../utils/constants.js';
import { saveLevelResult } from '../utils/storage.js';

export class LevelCompleteScene {
  constructor(game) {
    this.game = game;
    this.animTimer = 0;
    this.starReveal = 0;
    this.saved = false;
  }

  enter() {
    this.animTimer = 0;
    this.starReveal = 0;
    this.saved = false;
  }

  update() {
    this.animTimer++;

    // Animate star reveal
    if (this.animTimer > 20 && this.starReveal < this.game.completedStars) {
      if (this.animTimer % 25 === 0) {
        this.starReveal++;
        this.game.audio.playCollect();
      }
    }

    // Save result
    if (!this.saved && this.starReveal >= this.game.completedStars) {
      saveLevelResult(this.game.currentLevel, this.game.completedStars, this.game.completedTime);
      this.saved = true;
    }

    const click = this.game.input.consumeClick();
    if (click && this.animTimer > 60) {
      const btnW = 170;
      const btnX = CANVAS_WIDTH / 2 - btnW / 2;
      const cardY = 145;
      // Next level
      if (click.x >= btnX && click.x <= btnX + btnW &&
          click.y >= cardY + 215 && click.y <= cardY + 263) {
        this.game.audio.playClick();
        if (this.game.currentLevel < TOTAL_LEVELS) {
          this.game.currentLevel++;
          this.game.setScene(SCENE.GAMEPLAY);
        } else {
          this.game.setScene(SCENE.MENU);
        }
        return;
      }
      // Menu
      if (click.x >= btnX && click.x <= btnX + btnW &&
          click.y >= cardY + 273 && click.y <= cardY + 317) {
        this.game.audio.playClick();
        this.game.setScene(SCENE.LEVEL_SELECT);
        return;
      }
    }
  }

  render(ctx) {
    const renderer = this.game.renderer;
    renderer.drawBackground();

    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Card
    const cardX = CANVAS_WIDTH / 2 - 130;
    const cardY = 145;
    const cardW = 260;
    const cardH = 330;
    renderer.roundRect(cardX, cardY, cardW, cardH, 18, COLORS.cardBg, COLORS.cardBorder);

    // Success icon
    renderer.text('🎉', CANVAS_WIDTH / 2, cardY + 35, { font: '30px sans-serif' });

    renderer.text('LEVEL COMPLETE!', CANVAS_WIDTH / 2, cardY + 72, {
      font: 'bold 24px "Fredoka", sans-serif', color: COLORS.success, shadow: true, glow: 'rgba(46,204,113,0.4)'
    });

    // Divider
    ctx.strokeStyle = COLORS.divider;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 30, cardY + 92);
    ctx.lineTo(cardX + cardW - 30, cardY + 92);
    ctx.stroke();

    // Stars
    const starSize = 36;
    const gap = 14;
    const totalW = starSize * 3 + gap * 2;
    const startX = CANVAS_WIDTH / 2 - totalW / 2 + starSize / 2;
    for (let i = 0; i < 3; i++) {
      const x = startX + i * (starSize + gap);
      const y = cardY + 135;
      const earned = i < this.starReveal;

      if (earned) {
        const scale = 1 + Math.sin(this.animTimer * 0.08 + i * 1.2) * 0.08;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        // Glow
        ctx.shadowColor = COLORS.star;
        ctx.shadowBlur = 15;
        ctx.font = `${starSize}px "Fredoka", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = COLORS.star;
        ctx.fillText('★', 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();
      } else {
        ctx.font = `${starSize}px "Fredoka", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#334';
        ctx.fillText('☆', x, y);
      }
    }

    // Time
    const secs = Math.floor(this.game.completedTime);
    renderer.text(`⏱  ${secs}s`, CANVAS_WIDTH / 2, cardY + 185, {
      font: '16px "Fredoka", sans-serif', color: COLORS.textMuted
    });

    if (this.animTimer > 60) {
      const btnW = 170;
      const btnX = CANVAS_WIDTH / 2 - btnW / 2;
      const isLast = this.game.currentLevel >= TOTAL_LEVELS;

      // Next level / Finish button
      renderer.roundRect(btnX, cardY + 215, btnW, 48, 12, COLORS.buttonBg);
      renderer.text(isLast ? '🏠  Finish' : '→  Next Level', CANVAS_WIDTH / 2, cardY + 239, {
        font: 'bold 17px "Fredoka", sans-serif', color: '#fff'
      });

      // Level select button
      renderer.roundRect(btnX, cardY + 273, btnW, 44, 12, COLORS.buttonSecondary);
      renderer.text('Level Select', CANVAS_WIDTH / 2, cardY + 295, {
        font: 'bold 15px "Fredoka", sans-serif', color: '#ccc'
      });
    }
  }

  exit() {}
}
