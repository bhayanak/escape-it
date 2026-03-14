// Level select scene — paginated with pack tabs and arrow navigation
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, SCENE, PACKS } from '../utils/constants.js';
import { getUnlockedLevel, getLevelData, getTotalStars } from '../utils/storage.js';

const COLS = 5;
const ROWS = 3;
const PER_PAGE = COLS * ROWS; // 15

export class LevelSelectScene {
  constructor(game) {
    this.game = game;
    this.packIdx = 0;   // 0=beginner, 1=advanced, 2=expert
    this.page = 0;      // page within current pack
    this.timer = 0;
  }

  _totalPages() {
    return Math.ceil(PACKS[this.packIdx].count / PER_PAGE);
  }

  enter() {
    this.timer = 0;
    // Reset to beginner if pack not unlocked
    const stars = getTotalStars();
    if (stars < PACKS[this.packIdx].starsToUnlock) this.packIdx = 0;
    this.page = 0;
    this.game.renderer.setBackground(this.packIdx);
  }

  update() {
    this.timer++;
    const totalStars = getTotalStars();

    // Keyboard: left/right arrows for page nav
    if (this.game.input.consumeKey('ArrowLeft')) {
      if (this.page > 0) { this.page--; this.game.audio.playClick(); }
    }
    if (this.game.input.consumeKey('ArrowRight')) {
      if (this.page < this._totalPages() - 1) { this.page++; this.game.audio.playClick(); }
    }

    const click = this.game.input.consumeClick();
    if (!click) return;

    // Back button (top-left)
    if (click.x <= 60 && click.y <= 55) {
      this.game.audio.playClick();
      this.game.setScene(SCENE.MENU);
      return;
    }

    // Pack tabs (y=62..96)
    if (click.y >= 62 && click.y <= 98) {
      for (let i = 0; i < PACKS.length; i++) {
        const tx = 6 + i * 131;
        if (click.x >= tx && click.x <= tx + 126) {
          if (totalStars >= PACKS[i].starsToUnlock) {
            this.packIdx = i;
            this.page = 0;
            this.game.renderer.setBackground(i);
            this.game.audio.playClick();
          }
          return;
        }
      }
    }

    // Level cards
    const unlocked = getUnlockedLevel();
    const pack = PACKS[this.packIdx];
    const gridY = 115;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = this.page * PER_PAGE + r * COLS + c;
        if (idx >= pack.count) continue;
        const lvl = pack.start + idx;
        const bx = 24 + c * 73;
        const by = gridY + r * 95;
        if (click.x >= bx && click.x <= bx + 62 && click.y >= by && click.y <= by + 70) {
          if (lvl <= unlocked) {
            this.game.audio.playClick();
            this.game.currentLevel = lvl;
            this.game.setScene(SCENE.GAMEPLAY);
          }
          return;
        }
      }
    }

    // Navigation arrows (bottom)
    const navY = 480;
    // Left arrow
    if (click.x >= 60 && click.x <= 120 && click.y >= navY && click.y <= navY + 40) {
      if (this.page > 0) { this.page--; this.game.audio.playClick(); }
      return;
    }
    // Right arrow
    if (click.x >= 280 && click.x <= 340 && click.y >= navY && click.y <= navY + 40) {
      if (this.page < this._totalPages() - 1) { this.page++; this.game.audio.playClick(); }
      return;
    }
  }

  render(ctx) {
    const renderer = this.game.renderer;
    renderer.drawBackground();

    const totalStars = getTotalStars();
    const unlocked = getUnlockedLevel();

    // ── Header ────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(5, 15, 10, 0.65)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 58);

    renderer.roundRect(12, 13, 44, 34, 10, COLORS.cardBg, COLORS.cardBorder);
    renderer.text('‹', 34, 30, { font: 'bold 22px "Fredoka", sans-serif', color: '#fff' });

    renderer.text('SELECT LEVEL', CANVAS_WIDTH / 2, 32, {
      font: 'bold 18px "Fredoka", sans-serif', color: '#fff', shadow: true,
    });

    renderer.text(`⭐${totalStars}`, CANVAS_WIDTH - 40, 32, {
      font: 'bold 13px "Fredoka", sans-serif', color: COLORS.star,
    });

    // ── Pack tabs ─────────────────────────────────────────────────────
    for (let i = 0; i < PACKS.length; i++) {
      const p = PACKS[i];
      const tx = 6 + i * 131;
      const ty = 64;
      const tw = 126;
      const th = 32;
      const active = i === this.packIdx;
      const isLocked = totalStars < p.starsToUnlock;

      if (active) {
        renderer.roundRect(tx, ty, tw, th, 8, p.color + '40', p.color);
      } else if (isLocked) {
        renderer.roundRect(tx, ty, tw, th, 8, 'rgba(10,25,15,0.5)', 'rgba(40,80,50,0.2)');
      } else {
        renderer.roundRect(tx, ty, tw, th, 8, COLORS.cardBg, COLORS.cardBorder);
      }

      if (isLocked) {
        renderer.text(`🔒 ${p.starsToUnlock}⭐`, tx + tw / 2, ty + th / 2 + 1, {
          font: '11px "Fredoka", sans-serif', color: '#556',
        });
      } else {
        renderer.text(`${p.icon} ${p.name}`, tx + tw / 2, ty + th / 2 + 1, {
          font: active ? 'bold 13px "Fredoka", sans-serif' : '12px "Fredoka", sans-serif',
          color: active ? '#fff' : '#8aa8',
        });
      }
    }

    // ── Level grid ────────────────────────────────────────────────────
    const pack = PACKS[this.packIdx];
    const gridY = 115;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = this.page * PER_PAGE + r * COLS + c;
        if (idx >= pack.count) continue;

        const lvl = pack.start + idx;
        const bx = 24 + c * 73;
        const by = gridY + r * 95;
        const bw = 62;
        const bh = 70;

        const isUnlocked = lvl <= unlocked;
        const levelInfo = getLevelData(lvl);

        // Card
        if (isUnlocked) {
          renderer.roundRect(bx, by, bw, bh, 10, COLORS.cardBg, COLORS.cardBorder);
          // Color accent at top
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(bx + 10, by);
          ctx.lineTo(bx + bw - 10, by);
          ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + 10);
          ctx.lineTo(bx + bw, by + 3);
          ctx.lineTo(bx, by + 3);
          ctx.lineTo(bx, by + 10);
          ctx.quadraticCurveTo(bx, by, bx + 10, by);
          ctx.closePath();
          ctx.fillStyle = pack.color + '40';
          ctx.fill();
          ctx.restore();
        } else {
          renderer.roundRect(bx, by, bw, bh, 10, 'rgba(10,25,15,0.6)', 'rgba(40,80,50,0.2)');
        }

        // Level number
        renderer.text(String(lvl), bx + bw / 2, by + 26, {
          font: 'bold 18px "Fredoka", sans-serif', color: isUnlocked ? '#fff' : '#3a5',
        });

        // Stars
        if (isUnlocked && levelInfo.stars > 0) {
          let s = '';
          for (let j = 0; j < 3; j++) s += j < levelInfo.stars ? '★' : '☆';
          renderer.text(s, bx + bw / 2, by + 52, { font: '12px "Fredoka", sans-serif', color: COLORS.star });
        } else if (!isUnlocked) {
          renderer.text('🔒', bx + bw / 2, by + 50, { font: '16px sans-serif' });
        } else {
          renderer.text('☆☆☆', bx + bw / 2, by + 52, { font: '12px "Fredoka", sans-serif', color: '#3a5' });
        }
      }
    }

    // ── Page navigation ───────────────────────────────────────────────
    const navY = 480;
    const total = this._totalPages();

    // Left arrow
    const canLeft = this.page > 0;
    renderer.roundRect(70, navY, 50, 36, 8,
      canLeft ? COLORS.cardBg : 'rgba(10,25,15,0.3)',
      canLeft ? COLORS.cardBorder : 'rgba(40,80,50,0.1)');
    renderer.text('◀', 95, navY + 19, {
      font: 'bold 18px "Fredoka", sans-serif', color: canLeft ? '#fff' : '#2a4',
    });

    // Page indicator
    renderer.text(`${this.page + 1} / ${total}`, CANVAS_WIDTH / 2, navY + 19, {
      font: 'bold 14px "Fredoka", sans-serif', color: 'rgba(160,210,180,0.6)',
    });

    // Right arrow
    const canRight = this.page < total - 1;
    renderer.roundRect(280, navY, 50, 36, 8,
      canRight ? COLORS.cardBg : 'rgba(10,25,15,0.3)',
      canRight ? COLORS.cardBorder : 'rgba(40,80,50,0.1)');
    renderer.text('▶', 305, navY + 19, {
      font: 'bold 18px "Fredoka", sans-serif', color: canRight ? '#fff' : '#2a4',
    });

    // Keyboard hint
    renderer.text('← → to change page', CANVAS_WIDTH / 2, navY + 54, {
      font: '11px "Fredoka", sans-serif', color: 'rgba(120,180,140,0.4)',
    });
  }

  exit() {}
}
