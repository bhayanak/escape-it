// Gameplay scene — main game logic
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, SCENE, TILE_SIZE, PLAYER_RADIUS } from '../utils/constants.js';
import { Player } from '../entities/player.js';
import { loadLevel } from '../levels/level-loader.js';
import { circleRectOverlap, circleCircleCollision, circleRectCollision } from '../engine/collision.js';
import { Particles } from '../engine/particles.js';
import { getLevels } from '../levels/all-levels.js';

export class GameplayScene {
  constructor(game) {
    this.game = game;
    this.player = null;
    this.level = null;
    this.particles = new Particles();
    this.time = 0;
    this.starsCollected = 0;
    this.paused = false;
    this.deathTimer = 0;
    this.winTimer = 0;
  }

  enter() {
    const levels = getLevels();
    const levelData = levels[this.game.currentLevel - 1];
    if (!levelData) {
      this.game.setScene(SCENE.LEVEL_SELECT);
      return;
    }
    this.level = loadLevel(levelData);
    this.player = new Player(this.level.startX, this.level.startY);
    this.particles = new Particles();
    this.time = 0;
    this.starsCollected = 0;
    this.paused = false;
    this.deathTimer = 0;
    this.winTimer = 0;

    // Set background per pack (0=beginner, 1=advanced, 2=expert)
    const packIdx = this.game.currentLevel <= 50 ? 0 : this.game.currentLevel <= 100 ? 1 : 2;
    this.game.renderer.setBackground(packIdx);
  }

  update(dt) {
    if (this.winTimer > 0) {
      this.winTimer--;
      this.particles.update();
      if (this.winTimer <= 0) {
        this.game.completedStars = this._calcStars();
        this.game.completedTime = this.time;
        this.game.setScene(SCENE.LEVEL_COMPLETE);
      }
      return;
    }

    if (this.deathTimer > 0) {
      this.deathTimer--;
      this.particles.update();
      if (this.deathTimer <= 0) {
        this.game.setScene(SCENE.GAME_OVER);
      }
      return;
    }

    // Pause
    if (this.game.input.consumeKey('KeyP') || this.game.input.consumeKey('Escape')) {
      this.paused = !this.paused;
      return;
    }
    if (this.paused) {
      const click = this.game.input.consumeClick();
      if (click) {
        const btnW = 160;
        const btnX = CANVAS_WIDTH / 2 - btnW / 2;
        const cardY = 190;
        // Resume button
        if (click.x >= btnX && click.x <= btnX + btnW) {
          if (click.y >= cardY + 80 && click.y <= cardY + 124) {
            this.paused = false;
            this.game.audio.playClick();
          } else if (click.y >= cardY + 136 && click.y <= cardY + 180) {
            this.game.audio.playClick();
            this.game.setScene(SCENE.LEVEL_SELECT);
          }
        }
      }
      return;
    }

    this.time += dt / 1000;

    // Update entities
    this.player.update(this.game.input);

    for (const p of this.level.platforms) p.update();
    for (const b of this.level.blades) b.update();
    for (const c of this.level.crushers) c.update();
    if (this.level.portal) this.level.portal.update();
    for (const col of this.level.collectibles) col.update();
    this.particles.update();

    // Platform collision
    this._handlePlatformCollisions();

    // World right bound
    if (this.player.x + this.player.radius > this.level.width) {
      this.player.x = this.level.width - this.player.radius;
      this.player.vx = 0;
    }

    // Fall death
    if (this.player.y > this.level.height + 50) {
      this._die();
      return;
    }

    // Hazard collisions
    if (this._checkHazards()) {
      this._die();
      return;
    }

    // Collectible pickups
    this._checkCollectibles();

    // Portal check
    if (this.level.portal) {
      const dist = Math.hypot(this.player.x - this.level.portal.x, this.player.y - this.level.portal.y);
      if (dist < this.player.radius + this.level.portal.radius * 0.7) {
        this._win();
        return;
      }
    }

    // Camera
    this._updateCamera();
  }

  _handlePlatformCollisions() {
    const p = this.player;
    for (const plat of this.level.platforms) {
      const hit = circleRectOverlap(p.x, p.y, p.radius, plat.x, plat.y, plat.w, plat.h);
      if (!hit) continue;

      // One-way platforms: only bounce off the TOP surface.
      // Ball passes through from below, left, and right.
      if (hit.side === 'top' && p.vy > 0) {
        p.y = plat.y - p.radius;
        p.bounceOff();
        this.game.audio.playBounce();
        // Riding moving platforms
        if (plat.type === 'moving_h') {
          p.x += plat.speed * plat.dir;
        }
      }
    }
  }

  _checkHazards() {
    const p = this.player;

    // Spikes
    for (const spike of this.level.spikes) {
      const hb = spike.getHitbox();
      if (circleRectCollision(p.x, p.y, p.radius * 0.8, hb.x, hb.y, hb.w, hb.h)) {
        return true;
      }
    }

    // Blades
    for (const blade of this.level.blades) {
      if (circleCircleCollision(p.x, p.y, p.radius * 0.8, blade.cx, blade.cy, blade.radius)) {
        return true;
      }
    }

    // Crushers
    for (const crusher of this.level.crushers) {
      if (circleRectCollision(p.x, p.y, p.radius * 0.8,
        crusher.x, crusher.y, crusher.w, crusher.h + 6)) {
        return true;
      }
    }

    return false;
  }

  _checkCollectibles() {
    const p = this.player;
    for (const col of this.level.collectibles) {
      if (col.collected) continue;
      const dist = Math.hypot(p.x - col.x, p.y - col.y);
      if (dist < p.radius + col.radius + 4) {
        col.collect();
        this.starsCollected++;
        this.particles.burstCollect(col.x, col.y);
        this.game.audio.playCollect();
      }
    }
  }

  _updateCamera() {
    const renderer = this.game.renderer;
    const targetX = Math.max(0, this.player.x - CANVAS_WIDTH / 2);
    const targetY = Math.max(0, this.player.y - CANVAS_HEIGHT / 2);
    const maxX = Math.max(0, this.level.width - CANVAS_WIDTH);
    const maxY = Math.max(0, this.level.height - CANVAS_HEIGHT);
    renderer.camera.x += (Math.min(targetX, maxX) - renderer.camera.x) * 0.1;
    renderer.camera.y += (Math.min(targetY, maxY) - renderer.camera.y) * 0.1;
  }

  _die() {
    this.player.die();
    this.particles.burstDeath(this.player.x, this.player.y);
    this.game.renderer.triggerShake(6, 10);
    this.game.audio.playDeath();
    this.deathTimer = 40;
  }

  _win() {
    this.game.audio.playLevelComplete();
    if (this.level.portal) {
      this.particles.portalBurst(this.level.portal.x, this.level.portal.y);
    }
    this.winTimer = 50;
  }

  _calcStars() {
    let stars = 1; // completed
    if (this.starsCollected >= this.level.totalStars && this.level.totalStars > 0) stars = 2;
    if (stars === 2 && this.time <= this.level.timeTarget) stars = 3;
    return stars;
  }

  render(ctx) {
    const renderer = this.game.renderer;
    renderer.drawBackground(this.level.height);
    renderer.beginCamera();

    // Platforms
    for (const plat of this.level.platforms) plat.render(ctx);

    // Hazards
    for (const spike of this.level.spikes) spike.render(ctx);
    for (const blade of this.level.blades) blade.render(ctx);
    for (const crusher of this.level.crushers) crusher.render(ctx);

    // Collectibles
    for (const col of this.level.collectibles) col.render(ctx);

    // Portal
    if (this.level.portal) this.level.portal.render(ctx);

    // Particles
    this.particles.render(ctx);

    // Player
    if (this.player) this.player.render(ctx);

    renderer.endCamera();

    // HUD
    this._renderHUD(ctx);

    // Pause overlay
    if (this.paused) this._renderPause(ctx);
  }

  _renderHUD(ctx) {
    const renderer = this.game.renderer;

    // Top bar background
    ctx.fillStyle = 'rgba(5, 15, 10, 0.55)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 55);

    // Level name
    renderer.text(this.level.name, CANVAS_WIDTH / 2, 20, {
      font: 'bold 14px "Fredoka", sans-serif', color: '#fff', shadow: true
    });

    // Stars collected
    let starStr = '';
    for (let i = 0; i < this.level.totalStars; i++) {
      starStr += i < this.starsCollected ? '★' : '☆';
    }
    renderer.text(starStr, CANVAS_WIDTH / 2, 42, {
      font: '14px "Fredoka", sans-serif', color: COLORS.star
    });

    // Timer
    const secs = Math.floor(this.time);
    renderer.text(`${secs}s`, CANVAS_WIDTH - 30, 20, {
      font: 'bold 13px "Fredoka", sans-serif', color: COLORS.hud
    });

    // Pause button
    renderer.roundRect(10, 10, 36, 36, 8, COLORS.cardBg, COLORS.cardBorder);
    renderer.text('⏸', 28, 28, { font: '16px sans-serif' });

    // Check pause button tap
    const click = this.game.input.consumeClick();
    if (click && click.x <= 50 && click.y <= 50 && !this.paused) {
      this.paused = true;
    }
  }

  _renderPause(ctx) {
    const renderer = this.game.renderer;
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Pause card
    const cardX = CANVAS_WIDTH / 2 - 110;
    const cardY = 190;
    const cardW = 220;
    const cardH = 200;
    renderer.roundRect(cardX, cardY, cardW, cardH, 16, COLORS.cardBg, COLORS.cardBorder);

    renderer.text('PAUSED', CANVAS_WIDTH / 2, cardY + 40, {
      font: 'bold 28px "Fredoka", sans-serif', color: '#fff', shadow: true
    });

    // Divider
    ctx.strokeStyle = COLORS.divider;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 30, cardY + 65);
    ctx.lineTo(cardX + cardW - 30, cardY + 65);
    ctx.stroke();

    // Resume button
    const btnW = 160;
    const btnX = CANVAS_WIDTH / 2 - btnW / 2;
    renderer.roundRect(btnX, cardY + 80, btnW, 44, 12, COLORS.buttonBg);
    renderer.text('▶  Resume', CANVAS_WIDTH / 2, cardY + 102, {
      font: 'bold 17px "Fredoka", sans-serif', color: '#fff'
    });

    // Quit button
    renderer.roundRect(btnX, cardY + 136, btnW, 44, 12, COLORS.buttonSecondary);
    renderer.text('✕  Quit', CANVAS_WIDTH / 2, cardY + 158, {
      font: 'bold 17px "Fredoka", sans-serif', color: '#ccc'
    });
  }

  exit() {}
}
