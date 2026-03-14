// Level loader — parse level data into game entities
import { Platform } from '../entities/platform.js';
import { Spike } from '../entities/spike.js';
import { Blade } from '../entities/blade.js';
import { Crusher } from '../entities/crusher.js';
import { Portal } from '../entities/portal.js';
import { Collectible } from '../entities/collectible.js';
import { TILE_SIZE } from '../utils/constants.js';

export function loadLevel(data) {
  const level = {
    name: data.name,
    width: data.width * TILE_SIZE,
    height: data.height * TILE_SIZE,
    startX: data.start.x * TILE_SIZE + TILE_SIZE / 2,
    startY: data.start.y * TILE_SIZE + TILE_SIZE / 2,
    platforms: [],
    spikes: [],
    blades: [],
    crushers: [],
    portal: null,
    collectibles: [],
    totalStars: 0,
    timeTarget: data.timeTarget || 30,
  };

  for (const p of (data.platforms || [])) {
    level.platforms.push(new Platform(p));
  }
  for (const s of (data.hazards || []).filter(h => h.type === 'spike')) {
    level.spikes.push(new Spike(s));
  }
  for (const b of (data.hazards || []).filter(h => h.type === 'blade')) {
    level.blades.push(new Blade(b));
  }
  for (const c of (data.hazards || []).filter(h => h.type === 'crusher')) {
    level.crushers.push(new Crusher(c));
  }

  if (data.exit) {
    level.portal = new Portal(data.exit);
  }

  for (const c of (data.collectibles || [])) {
    level.collectibles.push(new Collectible(c));
    level.totalStars++;
  }

  return level;
}
