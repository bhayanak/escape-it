// Game-wide constants
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;
export const TILE_SIZE = 32;
export const FPS = 60;
export const FIXED_DT = 1000 / FPS;

// Physics — all values are per-frame (runs at 60 FPS)
//
// GRAVITY        — pixels added to downward velocity every frame.
//                  Low (0.4) = floaty / ball hangs in air too long.
//                  High (0.7+) = heavy / very fast fall.
//                  Max bounce height = BOUNCE_FORCE² / (2 × GRAVITY).
//
// BOUNCE_FORCE   — initial upward velocity applied when the ball hits a platform top.
//                  More negative = bounces higher. With GRAVITY=0.52:
//                  -13.0 → rises ~162 px ≈ 5 tiles  (4-tile platform gaps = 128 px ✔)
//                  Too high (e.g. -15) = overshoots platforms, hard to aim.
//
// PLAYER_SPEED   — horizontal acceleration added per frame while left/right is held.
//                  Applied as PLAYER_SPEED × 0.3 each frame.
//                  Too low (< 2) = sluggish, hard to steer around hazards.
//                  Too high (> 5) = ball darts everywhere, uncontrollable.
//
// PLAYER_MAX_SPEED — caps horizontal velocity in pixels/frame.
//                  Lower = tighter, more precise control (recommended for narrow gaps).
//                  Higher = ball moves faster but overshoots easily.
//
// PLAYER_FRICTION — fraction of horizontal velocity retained each frame (0–1).
//                  0.88 = ball retains 88% per frame → stops quickly on release.
//                  0.82 = slippery. 0.95 = very slidey (hard to control).
//
// PLAYER_RADIUS  — collision radius in pixels (also sets visual size).
export const GRAVITY = 0.52;
export const BOUNCE_FORCE = -13.0;
export const PLAYER_SPEED = 3.5;
export const PLAYER_MAX_SPEED = 4.5;
export const PLAYER_FRICTION = 0.88;
export const PLAYER_RADIUS = 13;

// Colors — nature/jungle theme
export const COLORS = {
  // Backgrounds
  bg: '#0a1510',
  bgGradientTop: '#0c1a14',
  bgGradientMid: '#15302a',
  bgGradientBottom: '#1a4035',

  // Player
  player: '#40e8a0',
  playerHighlight: '#a0ffd8',
  playerGlow: 'rgba(80, 240, 170, 0.28)',
  playerTrail: '80, 240, 170',

  // Platforms
  platform: '#3a7055',
  platformLight: '#55a070',
  platformDark: '#1e4a35',
  platformTop: '#65b580',
  platformMoving: '#3a90a0',
  platformMovingLight: '#60c0c8',

  // Hazards
  spike: '#ff4050',
  spikeGlow: 'rgba(255, 60, 80, 0.35)',
  spikeTip: '#ff8060',
  blade: '#e04040',
  bladeBody: '#4a4a55',
  bladeCenter: '#aaa',
  crusher: '#6a5038',
  crusherTeeth: '#a07050',

  // Portal
  portal: '#b39dff',
  portalGlow: '#7c5ce7',
  portalInner: '#ddd6fe',

  // Collectibles
  star: '#ffd700',
  starGlow: '#fff44f',

  // UI
  text: '#ffffff',
  textShadow: 'rgba(0,0,0,0.6)',
  textMuted: 'rgba(180, 220, 200, 0.6)',
  hud: '#ffffffdd',
  buttonBg: '#38a065',
  buttonHover: '#45c77a',
  buttonSecondary: '#2a4840',
  buttonDanger: '#e84350',
  buttonSuccess: '#2ecc71',
  overlay: 'rgba(5, 15, 10, 0.9)',
  cardBg: 'rgba(15, 40, 25, 0.7)',
  cardBorder: 'rgba(80, 180, 120, 0.18)',
  death: '#ff4757',
  success: '#2ecc71',
  divider: 'rgba(80, 180, 120, 0.22)',
};

// Scenes
export const SCENE = {
  MENU: 'menu',
  LEVEL_SELECT: 'level_select',
  GAMEPLAY: 'gameplay',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over',
  PAUSED: 'paused',
};

// Level packs — 50 levels each, 150 total
export const LEVELS_PER_PACK = 50;
export const PACKS = [
  { name: 'Beginner', icon: '🌿', color: '#2ecc71', start: 1,  count: 50, starsToUnlock: 0 },
  { name: 'Advanced', icon: '🔥', color: '#f39c12', start: 51, count: 50, starsToUnlock: 30 },
  { name: 'Expert',   icon: '💀', color: '#e74c3c', start: 101, count: 50, starsToUnlock: 80 },
];

export const TOTAL_LEVELS = 150;
export const STARS_PER_LEVEL = 3;
