// Game over scene — card overlay design
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, SCENE } from '../utils/constants.js';

export class GameOverScene {
  constructor(game) {
    this.game = game;
    this.timer = 0;
  }

  enter() {
    this.timer = 0;
  }

  update() {
    this.timer++;
    const click = this.game.input.consumeClick();
    if (click && this.timer > 30) {
      const btnW = 170;
      const btnX = CANVAS_WIDTH / 2 - btnW / 2;
      const cardY = 180;
      // Retry
      if (click.x >= btnX && click.x <= btnX + btnW &&
          click.y >= cardY + 120 && click.y <= cardY + 168) {
        this.game.audio.playClick();
        this.game.setScene(SCENE.GAMEPLAY);
        return;
      }
      // Quit
      if (click.x >= btnX && click.x <= btnX + btnW &&
          click.y >= cardY + 178 && click.y <= cardY + 222) {
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
    const cardX = CANVAS_WIDTH / 2 - 120;
    const cardY = 180;
    const cardW = 240;
    const cardH = 250;
    renderer.roundRect(cardX, cardY, cardW, cardH, 18, COLORS.cardBg, COLORS.cardBorder);

    // Shake on initial frames
    const shakeX = this.timer < 10 ? (Math.random() - 0.5) * 3 : 0;
    const shakeY = this.timer < 10 ? (Math.random() - 0.5) * 3 : 0;

    // Death icon
    renderer.text('💥', CANVAS_WIDTH / 2 + shakeX, cardY + 35 + shakeY, {
      font: '32px sans-serif'
    });

    renderer.text('OOPS!', CANVAS_WIDTH / 2 + shakeX, cardY + 75 + shakeY, {
      font: 'bold 32px "Fredoka", sans-serif', color: COLORS.death, shadow: true
    });

    renderer.text('You Died Hard!', CANVAS_WIDTH / 2, cardY + 105, {
      font: '14px "Fredoka", sans-serif', color: COLORS.textMuted
    });

    if (this.timer > 30) {
      const btnW = 170;
      const btnX = CANVAS_WIDTH / 2 - btnW / 2;

      // Retry button
      renderer.roundRect(btnX, cardY + 120, btnW, 48, 12, COLORS.buttonBg);
      renderer.text('↻  Try Again', CANVAS_WIDTH / 2, cardY + 144, {
        font: 'bold 17px "Fredoka", sans-serif', color: '#fff'
      });

      // Level select button
      renderer.roundRect(btnX, cardY + 178, btnW, 44, 12, COLORS.buttonSecondary);
      renderer.text('Level Select', CANVAS_WIDTH / 2, cardY + 200, {
        font: 'bold 15px "Fredoka", sans-serif', color: '#ccc'
      });
    }
  }

  exit() {}
}
