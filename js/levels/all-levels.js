// 150 procedurally generated levels — 3 packs of 50
// Each level is deterministically generated from its number.
import { generateLevel } from './level-generator.js';

let _cache = null;

export function getLevels() {
  if (!_cache) {
    _cache = [];
    for (let i = 1; i <= 150; i++) _cache.push(generateLevel(i));
  }
  return _cache;
}

/* ── Original hand-crafted levels (kept for reference) ─────────────────
export function getLevels_original() {
  return [
    // ========================================
    // PACK 1: EASY (Levels 1–5)
    // ========================================

    // Level 1 — "First Steps" — simple vertical climb
    {
      name: 'First Steps',
      width: 12, height: 25,
      tileSize: 32,
      start: { x: 6, y: 23 },
      exit: { x: 6, y: 2 },
      timeTarget: 25,
      platforms: [
        { x: 0, y: 24, w: 12, h: 1 },         // floor
        { x: 2, y: 20, w: 8, h: 1 },
        { x: 0, y: 16, w: 7, h: 1 },
        { x: 5, y: 12, w: 7, h: 1 },
        { x: 1, y: 8, w: 6, h: 1 },
        { x: 4, y: 4, w: 6, h: 1 },            // near exit
      ],
      hazards: [],
      collectibles: [
        { x: 5, y: 19 },
        { x: 3, y: 15 },
        { x: 8, y: 11 },
      ],
    },

    // Level 2 — "Side to Side"
    {
      name: 'Side to Side',
      width: 12, height: 28,
      tileSize: 32,
      start: { x: 2, y: 26 },
      exit: { x: 10, y: 2 },
      timeTarget: 30,
      platforms: [
        { x: 0, y: 27, w: 5, h: 1 },
        { x: 7, y: 23, w: 5, h: 1 },
        { x: 0, y: 19, w: 5, h: 1 },
        { x: 7, y: 15, w: 5, h: 1 },
        { x: 0, y: 11, w: 5, h: 1 },
        { x: 6, y: 7, w: 6, h: 1 },
        { x: 8, y: 3, w: 4, h: 1 },
      ],
      hazards: [],
      collectibles: [
        { x: 9, y: 22 },
        { x: 2, y: 18 },
        { x: 8, y: 6 },
      ],
    },

    // Level 3 — "Careful Now"
    // First spike introduction: spikes sit at platform EDGES so the safe landing zone
    // is wide and obvious. Teaches: "land in the middle, not at the edges."
    {
      name: 'Careful Now',
      width: 12, height: 28,
      tileSize: 32,
      start: { x: 2, y: 26 },       // left start — far from any spikes
      exit: { x: 10, y: 2 },        // right exit
      timeTarget: 35,
      platforms: [
        { x: 0,  y: 27, w: 12, h: 1 },   // full floor
        { x: 6,  y: 23, w: 6,  h: 1 },   // jump RIGHT — wide, no spike
        { x: 0,  y: 19, w: 5,  h: 1 },   // jump LEFT  — no spike
        { x: 6,  y: 15, w: 6,  h: 1 },   // jump RIGHT — spike only at far-right edge (x=11)
        { x: 0,  y: 11, w: 6,  h: 1 },   // jump LEFT  — spike only at far-left  edge (x=0)
        { x: 4,  y: 7,  w: 6,  h: 1 },   // center-right — no spike, relief platform
        { x: 7,  y: 3,  w: 5,  h: 1 },   // exit platform
      ],
      hazards: [
        // 1-tile spike at far-right edge of the right platform — safe zone is 5 tiles wide
        { type: 'spike', x: 11, y: 14, w: 1, dir: 'up' },
        // 1-tile spike at far-left  edge of the left  platform — safe zone is 5 tiles wide
        { type: 'spike', x: 0,  y: 10, w: 1, dir: 'up' },
      ],
      collectibles: [
        { x: 8, y: 22 },   // center of first right platform
        { x: 2, y: 18 },   // center of left platform
        { x: 5, y: 6  },   // center of relief platform
      ],
    },

    // Level 4 — "Moving On"
    {
      name: 'Moving On',
      width: 12, height: 30,
      tileSize: 32,
      start: { x: 2, y: 28 },
      exit: { x: 10, y: 2 },
      timeTarget: 35,
      platforms: [
        { x: 0, y: 29, w: 5, h: 1 },
        { x: 4, y: 25, w: 4, h: 1, type: 'moving_h', speed: 0.8, range: 4 },
        { x: 0, y: 21, w: 5, h: 1 },
        { x: 7, y: 17, w: 5, h: 1 },
        { x: 2, y: 13, w: 4, h: 1, type: 'moving_h', speed: 0.7, range: 3 },
        { x: 0, y: 9, w: 6, h: 1 },
        { x: 6, y: 5, w: 6, h: 1 },
        { x: 8, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'spike', x: 0, y: 20, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 6, y: 24 },
        { x: 3, y: 12 },
        { x: 9, y: 4 },
      ],
    },

    // Level 5 — "The Gauntlet"
    {
      name: 'The Gauntlet',
      width: 12, height: 32,
      tileSize: 32,
      start: { x: 6, y: 30 },
      exit: { x: 6, y: 2 },
      timeTarget: 35,
      platforms: [
        { x: 2, y: 31, w: 8, h: 1 },
        { x: 0, y: 27, w: 5, h: 1 },
        { x: 7, y: 27, w: 5, h: 1 },
        { x: 3, y: 23, w: 6, h: 1 },
        { x: 0, y: 19, w: 4, h: 1 },
        { x: 5, y: 19, w: 3, h: 1, type: 'moving_h', speed: 0.6, range: 4 },
        { x: 2, y: 15, w: 8, h: 1 },
        { x: 0, y: 11, w: 5, h: 1 },
        { x: 7, y: 11, w: 5, h: 1 },
        { x: 3, y: 7, w: 6, h: 1 },
        { x: 4, y: 3, w: 5, h: 1 },
      ],
      hazards: [
        { type: 'spike', x: 5, y: 26, w: 2, dir: 'up' },
        { type: 'spike', x: 4, y: 22, w: 2, dir: 'up' },
        { type: 'spike', x: 4, y: 14, w: 4, dir: 'up' },
      ],
      collectibles: [
        { x: 2, y: 26 },
        { x: 7, y: 18 },
        { x: 5, y: 6 },
      ],
    },

    // ========================================
    // PACK 2: MEDIUM (Levels 6–10)
    // ========================================

    // Level 6 — "Blade Runner"
    {
      name: 'Blade Runner',
      width: 12, height: 30,
      tileSize: 32,
      start: { x: 2, y: 28 },
      exit: { x: 10, y: 2 },
      timeTarget: 35,
      platforms: [
        { x: 0, y: 29, w: 5, h: 1 },
        { x: 7, y: 25, w: 5, h: 1 },
        { x: 0, y: 21, w: 5, h: 1 },
        { x: 6, y: 17, w: 6, h: 1 },
        { x: 0, y: 13, w: 6, h: 1 },
        { x: 6, y: 9, w: 6, h: 1 },
        { x: 2, y: 5, w: 5, h: 1 },
        { x: 8, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'blade', x: 5, y: 25, radius: 0.6, speed: 0.04 },
        { type: 'blade', x: 5, y: 17, radius: 0.6, speed: 0.05 },
        { type: 'blade', x: 5, y: 9, radius: 0.7, speed: 0.04 },
        { type: 'spike', x: 3, y: 4, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 9, y: 24 },
        { x: 2, y: 12 },
        { x: 9, y: 8 },
      ],
    },

    // Level 7 — "Crush Hour"
    {
      name: 'Crush Hour',
      width: 12, height: 30,
      tileSize: 32,
      start: { x: 6, y: 28 },
      exit: { x: 6, y: 2 },
      timeTarget: 40,
      platforms: [
        { x: 2, y: 29, w: 8, h: 1 },
        { x: 0, y: 25, w: 5, h: 1 },
        { x: 7, y: 25, w: 5, h: 1 },
        { x: 3, y: 21, w: 6, h: 1 },
        { x: 0, y: 17, w: 5, h: 1 },
        { x: 7, y: 17, w: 5, h: 1 },
        { x: 3, y: 13, w: 6, h: 1 },
        { x: 0, y: 9, w: 5, h: 1 },
        { x: 7, y: 9, w: 5, h: 1 },
        { x: 4, y: 5, w: 5, h: 1 },
        { x: 4, y: 3, w: 5, h: 1 },
      ],
      hazards: [
        { type: 'crusher', x: 5, y: 19, w: 2, h: 1, range: 3, speed: 1.5, wait: 50 },
        { type: 'crusher', x: 5, y: 11, w: 2, h: 1, range: 3, speed: 2, wait: 40 },
        { type: 'spike', x: 5, y: 24, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 2, y: 24 },
        { x: 5, y: 16 },
        { x: 5, y: 4 },
      ],
    },

    // Level 8 — "Narrow Escape"
    {
      name: 'Narrow Escape',
      width: 12, height: 32,
      tileSize: 32,
      start: { x: 6, y: 30 },
      exit: { x: 6, y: 2 },
      timeTarget: 35,
      platforms: [
        { x: 3, y: 31, w: 6, h: 1 },
        { x: 1, y: 27, w: 4, h: 1 },
        { x: 7, y: 27, w: 4, h: 1 },
        { x: 4, y: 23, w: 4, h: 1 },
        { x: 0, y: 19, w: 4, h: 1 },
        { x: 8, y: 19, w: 4, h: 1 },
        { x: 4, y: 15, w: 4, h: 1, type: 'moving_h', speed: 0.7, range: 2 },
        { x: 1, y: 11, w: 4, h: 1 },
        { x: 7, y: 11, w: 4, h: 1 },
        { x: 4, y: 7, w: 4, h: 1 },
        { x: 4, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'spike', x: 5, y: 26, w: 2, dir: 'up' },
        { type: 'blade', x: 3, y: 19, radius: 0.5, speed: 0.04 },
        { type: 'blade', x: 8, y: 15, radius: 0.5, speed: 0.05 },
        { type: 'spike', x: 5, y: 10, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 5, y: 22 },
        { x: 2, y: 18 },
        { x: 5, y: 6 },
      ],
    },

    // Level 9 — "Moving Maze"
    {
      name: 'Moving Maze',
      width: 12, height: 32,
      tileSize: 32,
      start: { x: 2, y: 30 },
      exit: { x: 10, y: 2 },
      timeTarget: 40,
      platforms: [
        { x: 0, y: 31, w: 5, h: 1 },
        { x: 3, y: 27, w: 4, h: 1, type: 'moving_h', speed: 0.8, range: 5 },
        { x: 0, y: 23, w: 4, h: 1 },
        { x: 6, y: 23, w: 4, h: 1, type: 'moving_h', speed: 0.6, range: 2 },
        { x: 2, y: 19, w: 4, h: 1, type: 'moving_v', speed: 0.5, range: 2 },
        { x: 7, y: 17, w: 5, h: 1 },
        { x: 0, y: 13, w: 5, h: 1 },
        { x: 5, y: 13, w: 3, h: 1, type: 'moving_h', speed: 0.7, range: 4 },
        { x: 2, y: 9, w: 4, h: 1 },
        { x: 7, y: 5, w: 5, h: 1 },
        { x: 8, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'spike', x: 0, y: 22, w: 2, dir: 'up' },
        { type: 'blade', x: 5, y: 13, radius: 0.5, speed: 0.05 },
        { type: 'spike', x: 9, y: 4, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 5, y: 26 },
        { x: 8, y: 16 },
        { x: 4, y: 8 },
      ],
    },

    // Level 10 — "No Rest"
    {
      name: 'No Rest',
      width: 12, height: 34,
      tileSize: 32,
      start: { x: 6, y: 32 },
      exit: { x: 6, y: 2 },
      timeTarget: 45,
      platforms: [
        { x: 3, y: 33, w: 6, h: 1 },
        { x: 0, y: 29, w: 4, h: 1 },
        { x: 8, y: 29, w: 4, h: 1 },
        { x: 4, y: 25, w: 4, h: 1, type: 'moving_h', speed: 0.6, range: 3 },
        { x: 0, y: 21, w: 4, h: 1 },
        { x: 6, y: 21, w: 3, h: 1, type: 'moving_v', speed: 0.5, range: 2 },
        { x: 2, y: 17, w: 8, h: 1 },
        { x: 0, y: 13, w: 4, h: 1 },
        { x: 8, y: 13, w: 4, h: 1 },
        { x: 4, y: 9, w: 4, h: 1, type: 'moving_h', speed: 0.9, range: 3 },
        { x: 0, y: 5, w: 5, h: 1 },
        { x: 7, y: 5, w: 5, h: 1 },
        { x: 4, y: 3, w: 5, h: 1 },
      ],
      hazards: [
        { type: 'spike', x: 4, y: 28, w: 4, dir: 'up' },
        { type: 'blade', x: 5, y: 21, radius: 0.6, speed: 0.05 },
        { type: 'crusher', x: 4, y: 15, w: 2, h: 1, range: 3, speed: 1.5, wait: 45 },
        { type: 'spike', x: 5, y: 4, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 9, y: 28 },
        { x: 2, y: 20 },
        { x: 5, y: 8 },
      ],
    },

    // ========================================
    // PACK 3: HARD (Levels 11–15)
    // ========================================

    // Level 11 — "Blade Storm"
    {
      name: 'Blade Storm',
      width: 12, height: 34,
      tileSize: 32,
      start: { x: 2, y: 32 },
      exit: { x: 10, y: 2 },
      timeTarget: 40,
      platforms: [
        { x: 0, y: 33, w: 5, h: 1 },
        { x: 7, y: 29, w: 5, h: 1 },
        { x: 0, y: 25, w: 5, h: 1 },
        { x: 7, y: 21, w: 5, h: 1 },
        { x: 0, y: 17, w: 5, h: 1 },
        { x: 7, y: 13, w: 5, h: 1 },
        { x: 0, y: 9, w: 5, h: 1 },
        { x: 7, y: 5, w: 5, h: 1 },
        { x: 8, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'blade', x: 5, y: 29, radius: 0.7, speed: 0.05 },
        { type: 'blade', x: 5, y: 25, radius: 0.7, speed: 0.06 },
        { type: 'blade', x: 5, y: 21, radius: 0.6, speed: 0.04 },
        { type: 'blade', x: 5, y: 17, radius: 0.7, speed: 0.07 },
        { type: 'blade', x: 5, y: 13, radius: 0.6, speed: 0.05 },
        { type: 'blade', x: 5, y: 9, radius: 0.7, speed: 0.06 },
        { type: 'spike', x: 9, y: 4, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 9, y: 28 },
        { x: 2, y: 16 },
        { x: 9, y: 4 },
      ],
    },

    // Level 12 — "Crusher Canyon"
    {
      name: 'Crusher Canyon',
      width: 12, height: 34,
      tileSize: 32,
      start: { x: 6, y: 32 },
      exit: { x: 6, y: 2 },
      timeTarget: 45,
      platforms: [
        { x: 3, y: 33, w: 6, h: 1 },
        { x: 0, y: 29, w: 5, h: 1 },
        { x: 7, y: 29, w: 5, h: 1 },
        { x: 3, y: 25, w: 6, h: 1 },
        { x: 0, y: 21, w: 5, h: 1 },
        { x: 7, y: 21, w: 5, h: 1 },
        { x: 3, y: 17, w: 6, h: 1 },
        { x: 0, y: 13, w: 5, h: 1 },
        { x: 7, y: 13, w: 5, h: 1 },
        { x: 3, y: 9, w: 6, h: 1 },
        { x: 4, y: 5, w: 5, h: 1 },
        { x: 4, y: 3, w: 5, h: 1 },
      ],
      hazards: [
        { type: 'crusher', x: 5, y: 27, w: 2, h: 1, range: 3, speed: 2, wait: 35 },
        { type: 'crusher', x: 5, y: 19, w: 2, h: 1, range: 3, speed: 2.5, wait: 30 },
        { type: 'crusher', x: 5, y: 11, w: 2, h: 1, range: 3, speed: 3, wait: 25 },
        { type: 'spike', x: 5, y: 28, w: 2, dir: 'up' },
        { type: 'spike', x: 5, y: 20, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 2, y: 28 },
        { x: 9, y: 20 },
        { x: 5, y: 8 },
      ],
    },

    // Level 13 — "The Labyrinth"
    {
      name: 'The Labyrinth',
      width: 12, height: 36,
      tileSize: 32,
      start: { x: 2, y: 34 },
      exit: { x: 10, y: 2 },
      timeTarget: 50,
      platforms: [
        { x: 0, y: 35, w: 5, h: 1 },
        { x: 4, y: 31, w: 4, h: 1, type: 'moving_h', speed: 0.9, range: 4 },
        { x: 0, y: 27, w: 4, h: 1 },
        { x: 8, y: 27, w: 4, h: 1 },
        { x: 4, y: 23, w: 4, h: 1, type: 'moving_v', speed: 0.6, range: 2 },
        { x: 0, y: 19, w: 5, h: 1 },
        { x: 7, y: 19, w: 5, h: 1 },
        { x: 3, y: 15, w: 3, h: 1, type: 'moving_h', speed: 0.8, range: 3 },
        { x: 0, y: 11, w: 4, h: 1 },
        { x: 8, y: 11, w: 4, h: 1 },
        { x: 4, y: 7, w: 4, h: 1, type: 'moving_h', speed: 1.0, range: 4 },
        { x: 8, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'blade', x: 6, y: 27, radius: 0.6, speed: 0.05 },
        { type: 'spike', x: 0, y: 18, w: 3, dir: 'up' },
        { type: 'crusher', x: 5, y: 17, w: 2, h: 1, range: 3, speed: 2, wait: 35 },
        { type: 'blade', x: 6, y: 11, radius: 0.6, speed: 0.06 },
        { type: 'spike', x: 9, y: 2, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 6, y: 30 },
        { x: 2, y: 18 },
        { x: 9, y: 10 },
      ],
    },

    // Level 14 — "Death Corridor"
    {
      name: 'Death Corridor',
      width: 12, height: 36,
      tileSize: 32,
      start: { x: 6, y: 34 },
      exit: { x: 6, y: 2 },
      timeTarget: 50,
      platforms: [
        { x: 3, y: 35, w: 6, h: 1 },
        { x: 1, y: 31, w: 3, h: 1 },
        { x: 8, y: 31, w: 3, h: 1 },
        { x: 4, y: 27, w: 4, h: 1, type: 'moving_h', speed: 0.8, range: 3 },
        { x: 1, y: 23, w: 3, h: 1 },
        { x: 8, y: 23, w: 3, h: 1 },
        { x: 4, y: 19, w: 4, h: 1 },
        { x: 0, y: 15, w: 3, h: 1 },
        { x: 9, y: 15, w: 3, h: 1 },
        { x: 4, y: 11, w: 4, h: 1, type: 'moving_v', speed: 0.5, range: 2 },
        { x: 1, y: 7, w: 3, h: 1 },
        { x: 8, y: 7, w: 3, h: 1 },
        { x: 4, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'spike', x: 4, y: 30, w: 4, dir: 'up' },
        { type: 'blade', x: 6, y: 23, radius: 0.6, speed: 0.05 },
        { type: 'crusher', x: 5, y: 17, w: 2, h: 1, range: 3, speed: 2.5, wait: 30 },
        { type: 'blade', x: 6, y: 15, radius: 0.5, speed: 0.06 },
        { type: 'spike', x: 4, y: 6, w: 4, dir: 'up' },
        { type: 'crusher', x: 5, y: 5, w: 2, h: 1, range: 2, speed: 2, wait: 35 },
      ],
      collectibles: [
        { x: 2, y: 30 },
        { x: 6, y: 18 },
        { x: 5, y: 6 },
      ],
    },

    // Level 15 — "The Final Escape"
    {
      name: 'The Final Escape',
      width: 12, height: 40,
      tileSize: 32,
      start: { x: 6, y: 38 },
      exit: { x: 6, y: 2 },
      timeTarget: 60,
      platforms: [
        { x: 3, y: 39, w: 6, h: 1 },
        { x: 0, y: 35, w: 4, h: 1 },
        { x: 8, y: 35, w: 4, h: 1 },
        { x: 3, y: 31, w: 3, h: 1, type: 'moving_h', speed: 0.9, range: 4 },
        { x: 0, y: 27, w: 4, h: 1 },
        { x: 8, y: 27, w: 4, h: 1 },
        { x: 4, y: 23, w: 4, h: 1, type: 'moving_v', speed: 0.6, range: 2 },
        { x: 0, y: 19, w: 5, h: 1 },
        { x: 7, y: 19, w: 5, h: 1 },
        { x: 3, y: 15, w: 3, h: 1, type: 'moving_h', speed: 1.0, range: 3 },
        { x: 0, y: 11, w: 4, h: 1 },
        { x: 8, y: 11, w: 4, h: 1 },
        { x: 4, y: 7, w: 4, h: 1, type: 'moving_h', speed: 1.1, range: 4 },
        { x: 4, y: 3, w: 4, h: 1 },
      ],
      hazards: [
        { type: 'spike', x: 4, y: 34, w: 4, dir: 'up' },
        { type: 'blade', x: 6, y: 35, radius: 0.6, speed: 0.05 },
        { type: 'spike', x: 4, y: 26, w: 4, dir: 'up' },
        { type: 'crusher', x: 5, y: 21, w: 2, h: 1, range: 3, speed: 2.5, wait: 30 },
        { type: 'blade', x: 5, y: 19, radius: 0.6, speed: 0.06 },
        { type: 'crusher', x: 5, y: 13, w: 2, h: 1, range: 3, speed: 3, wait: 25 },
        { type: 'blade', x: 6, y: 11, radius: 0.5, speed: 0.07 },
        { type: 'spike', x: 5, y: 6, w: 2, dir: 'up' },
      ],
      collectibles: [
        { x: 2, y: 34 },
        { x: 9, y: 18 },
        { x: 5, y: 6 },
      ],
    },
  ];
}
*/
