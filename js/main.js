// Main game — bootstrap and scene management
import { CANVAS_WIDTH, CANVAS_HEIGHT, SCENE } from './utils/constants.js';
import { Renderer } from './engine/renderer.js';
import { Input } from './engine/input.js';
import { Audio } from './engine/audio.js';
import { GameLoop } from './engine/game-loop.js';
import { MenuScene } from './scenes/menu.js';
import { LevelSelectScene } from './scenes/level-select.js';
import { GameplayScene } from './scenes/gameplay.js';
import { LevelCompleteScene } from './scenes/level-complete.js';
import { GameOverScene } from './scenes/game-over.js';
import { isMuted } from './utils/storage.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.ctx = this.canvas.getContext('2d');

    this.renderer = new Renderer(this.canvas);
    this.input = new Input(this.canvas);
    this.audio = new Audio();
    this.audio.muted = isMuted();

    this.currentLevel = 1;
    this.completedStars = 0;
    this.completedTime = 0;

    this.scenes = {
      [SCENE.MENU]: new MenuScene(this),
      [SCENE.LEVEL_SELECT]: new LevelSelectScene(this),
      [SCENE.GAMEPLAY]: new GameplayScene(this),
      [SCENE.LEVEL_COMPLETE]: new LevelCompleteScene(this),
      [SCENE.GAME_OVER]: new GameOverScene(this),
    };

    this.currentScene = null;
    this.setScene(SCENE.MENU);

    // Responsive canvas scaling
    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());

    this.loop = new GameLoop(
      (dt) => this._update(dt),
      (alpha) => this._render(alpha)
    );

    // Initialize audio on first user interaction
    const initAudio = () => {
      this.audio.init();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('touchstart', initAudio);

    this.loop.start();
  }

  _resizeCanvas() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspect = CANVAS_WIDTH / CANVAS_HEIGHT; // 2:3
    let w, h;
    if (vw / vh < aspect) {
      // Width-constrained
      w = vw;
      h = vw / aspect;
    } else {
      // Height-constrained
      h = vh;
      w = vh * aspect;
    }
    this.canvas.style.width = Math.floor(w) + 'px';
    this.canvas.style.height = Math.floor(h) + 'px';
  }

  setScene(name) {
    if (this.currentScene && this.currentScene.exit) {
      this.currentScene.exit();
    }
    this.currentScene = this.scenes[name];
    if (this.currentScene && this.currentScene.enter) {
      this.currentScene.enter();
    }
  }

  _update(dt) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(dt);
    }
  }

  _render(alpha) {
    this.renderer.clear();
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(this.ctx);
    }
  }
}

// Start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
