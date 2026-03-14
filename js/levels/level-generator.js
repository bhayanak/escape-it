// Procedural level generator — creates playable levels with gradual difficulty
// Uses seeded PRNG so every level is deterministic and reproducible.

// Mulberry32 — fast seeded PRNG
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

const WIDTH = 12; // level width in tiles

// ── Name pools (50 per pack) ──────────────────────────────────────────────

const BEGINNER_NAMES = [
  'First Steps', 'Side to Side', 'Careful Now', 'Easy Going', 'Gentle Rise',
  'Watch Out', 'Moving Along', 'Little Hop', 'Zigzag', 'Pebble Path',
  'Sky Walk', 'Cloud Nine', 'Daydream', 'Soft Landing', 'Baby Steps',
  'Wobbly Way', 'Training Day', 'Stepping Stones', 'Hop Along', 'Rising Sun',
  'Green Valley', 'Meadow Run', 'Lily Pads', 'Dewdrop', 'Morning Jog',
  'Sunny Side', 'Light Breeze', 'Featherweight', 'Puddle Jump', 'Garden Path',
  'Warm Up', 'Light Climb', 'Easy Rider', 'Cruise Control', 'Smooth Sailing',
  'Open Road', 'Clear Skies', 'Simple Hop', 'Lucky Bounce', 'First Bounce',
  'Trampoline', 'Spring Board', 'Soft Serve', 'Cotton Candy', 'Bubble Wrap',
  'Velvet Touch', 'Silk Road', 'Gentle Giant', 'Almost There', 'Pack Master',
];

const ADVANCED_NAMES = [
  'Blade Runner', 'Crush Hour', 'Narrow Escape', 'Moving Maze', 'No Rest',
  'Rising Heat', 'Danger Zone', 'Tight Squeeze', 'Quick Feet', 'Edge Walker',
  'Fire Dance', 'Steel Nerves', 'Blade Dance', 'Pressure Point', 'Sharp Turn',
  'Hazard Zone', 'Tricky Path', 'Double Trouble', 'Close Call', 'High Stakes',
  'Razor Edge', 'Nerve Wrack', 'Hot Pursuit', 'Wild Ride', 'Storm Chaser',
  'Blade Storm', 'Iron Will', 'Swift Run', 'Flash Point', 'Hard Knocks',
  'Tempo Change', 'Cross Fire', 'Chain React', 'Cascade', 'Spiral Up',
  'Vortex', 'Turbulence', 'Heat Wave', 'Thunder Roll', 'Lightning Path',
  'Wind Shear', 'Afterburner', 'Overdrive', 'Blitz', 'Full Throttle',
  'Nitro Boost', 'Sonic Boom', 'Warp Speed', 'Hyperspace', 'Final Push',
];

const EXPERT_NAMES = [
  'Death Corridor', 'The Labyrinth', 'Crusher Canyon', 'Blade Storm', 'The Final Run',
  'Hell Climb', 'Oblivion', 'Chaos Theory', 'Nightmare', 'Molten Core',
  'Void Walker', 'Shadow Step', 'Last Chance', 'Point Break', 'Glass Cannon',
  'Abyss', 'Perdition', 'Crucible', 'Inferno', 'Scorched Earth',
  'Dark Matter', 'Event Horizon', 'Singularity', 'Black Hole', 'Supernova',
  'Eclipse', 'Dark Side', 'Nether Run', 'Underworld', 'Purgatory',
  'Torment', 'Trial by Fire', 'No Mercy', 'Iron Gauntlet', 'Blood Moon',
  'Widow Maker', 'Soul Crusher', 'Bone Yard', 'Death Trap', 'Razor Storm',
  'Minefield', 'Armageddon', 'Doomsday', 'Zero Hour', 'Last Stand',
  'Endgame', 'Final Dawn', 'Extinction', 'Ragnarok', 'The Final Escape',
];

// ── Generator ─────────────────────────────────────────────────────────────

export function generateLevel(levelNum) {
  const rng = mulberry32(levelNum * 7919 + 42);
  const rand = () => rng();
  const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
  const randFloat = (min, max) => lerp(min, max, rand());

  // Global difficulty 0‑1 across all 150 levels
  const diff = (levelNum - 1) / 149;
  // Pack: 0 = beginner, 1 = advanced, 2 = expert
  const pack = Math.floor((levelNum - 1) / 50);
  // Progress within current pack 0‑1
  const local = ((levelNum - 1) % 50) / 49;

  // ── Parameters ────────────────────────────────────────────────────────

  // Number of platforms (excl. floor): bigger levels overall
  // Beginner: 18→30, Advanced: 28→40, Expert: 36→50
  const numPlatforms = Math.round(lerp(18, 30, local) + pack * 10);

  // Platform width range (tiles) — capped at 7 to keep gaps navigable
  const minPlatW = Math.max(2, Math.round(lerp(5, 3, diff)));
  const maxPlatW = Math.min(7, Math.max(3, Math.round(lerp(8, 5, diff))));

  // Vertical gap between platforms (tiles). 4 is comfortably within 5‑tile bounce.
  const gap = 4;

  // Level height in tiles
  const height = (numPlatforms + 1) * gap + 4;

  // First N platforms have zero hazards (safe intro zone — shorter now)
  const safeZone = pack === 0
    ? Math.round(lerp(3, 1, local))
    : Math.round(lerp(2, 0, local));

  // Per‑platform hazard probabilities — higher across the board
  const spikeChance =
    pack === 0 ? lerp(0.15, 0.55, local) :
    pack === 1 ? lerp(0.35, 0.65, local) :
                 lerp(0.5, 0.75, local);

  const movingChance =
    pack === 0 ? (local > 0.15 ? lerp(0.1, 0.35, (local - 0.15) / 0.85) : 0) :
    pack === 1 ? lerp(0.2, 0.45, local) :
                 lerp(0.3, 0.55, local);

  const bladeChance =
    pack === 0 ? (local > 0.3 ? lerp(0, 0.15, (local - 0.3) / 0.7) : 0) :
    pack === 1 ? lerp(0.1, 0.4, local) :
                 lerp(0.25, 0.5, local);

  const crusherChance =
    pack === 0 ? 0 :
    pack === 1 ? (local > 0.4 ? lerp(0, 0.15, (local - 0.4) / 0.6) : 0) :
                 lerp(0.1, 0.35, local);

  const maxSpikeW = pack === 0 ? (local > 0.4 ? 2 : 1) : Math.min(3, 1 + pack);

  // ── Generate ──────────────────────────────────────────────────────────

  const platforms = [];
  const hazards = [];
  const collectibles = [];

  // Floor
  platforms.push({ x: 0, y: height - 1, w: WIDTH, h: 1 });

  // Start position (alternate start side for variety)
  const startLeft = rand() < 0.5;
  const startX = startLeft ? 2 : WIDTH - 3;
  const startY = height - 2;

  let lastSide = startLeft ? 'left' : 'right';
  let y = height - 1 - gap;

  for (let i = 0; i < numPlatforms; i++) {
    const isLast = i === numPlatforms - 1;
    const w = isLast ? randInt(4, 6) : randInt(minPlatW, maxPlatW);

    // Side selection — zigzag with occasional center
    let side;
    if (isLast) {
      side = rand() < 0.5 ? 'left' : 'right';
    } else if (rand() < 0.12) {
      side = 'center';
    } else {
      side = lastSide === 'left' ? 'right' : 'left';
    }

    // X position
    let x;
    if (side === 'left') {
      x = randInt(0, Math.max(0, Math.floor((WIDTH - w) / 2) - 1));
    } else if (side === 'right') {
      x = randInt(Math.min(WIDTH - w, Math.ceil((WIDTH - w) / 2) + 1), WIDTH - w);
    } else {
      x = Math.max(0, Math.min(WIDTH - w, Math.round((WIDTH - w) / 2) + randInt(-1, 1)));
    }

    // Possibly make it a moving platform
    const canMove = !isLast && i >= safeZone && rand() < movingChance;
    const plat = { x, y, w, h: 1 };
    if (canMove) {
      plat.type = 'moving_h';
      plat.speed = randFloat(0.5, 0.8 + pack * 0.15);
      plat.range = randInt(2, 3 + pack);
      if (x + w + plat.range > WIDTH) plat.range = Math.max(1, WIDTH - x - w);
    }
    platforms.push(plat);

    const inSafe = i < safeZone;

    // Spike — at platform EDGE, never center. Can have spikes on BOTH edges at higher diff.
    if (!isLast && !inSafe && !canMove && rand() < spikeChance) {
      const sw = randInt(1, Math.min(maxSpikeW, Math.max(1, Math.floor(w * 0.35))));
      if (w - sw >= 3) { // ensure at least 3 safe tiles
        const atLeft = rand() < 0.5;
        const sx = atLeft ? x : x + w - sw;
        hazards.push({ type: 'spike', x: sx, y: y - 1, w: sw, dir: 'up' });

        // Second spike on the opposite edge (higher difficulty levels)
        const dualSpikeChance = pack === 0 ? (local > 0.7 ? 0.2 : 0) :
                                pack === 1 ? lerp(0.1, 0.35, local) :
                                             lerp(0.25, 0.5, local);
        if (rand() < dualSpikeChance) {
          const sw2 = randInt(1, Math.min(maxSpikeW, Math.max(1, Math.floor(w * 0.25))));
          if (w - sw - sw2 >= 2) {
            const sx2 = atLeft ? x + w - sw2 : x;
            hazards.push({ type: 'spike', x: sx2, y: y - 1, w: sw2, dir: 'up' });
          }
        }
      }
    }

    // Blade — placed in the transition gap between sides
    if (!isLast && !inSafe && rand() < bladeChance) {
      const bx = Math.round(WIDTH / 2 + (side === 'left' ? randFloat(1, 3) : randFloat(-3, -1)));
      hazards.push({
        type: 'blade',
        x: Math.max(1, Math.min(WIDTH - 2, bx)),
        y: Math.round((y - gap * 0.5) * 10) / 10,
        radius: randFloat(0.4, 0.6 + pack * 0.1),
        speed: randFloat(0.03, 0.04 + pack * 0.01),
      });
    }

    // Crusher
    if (!isLast && !inSafe && i >= safeZone + 2 && rand() < crusherChance) {
      const cx = x + randInt(1, Math.max(1, w - 3));
      hazards.push({
        type: 'crusher',
        x: cx, y: y - 2, w: 2, h: 1,
        range: randInt(2, 3),
        speed: randFloat(1.5, 2.5),
        wait: randInt(30, 50),
      });
    }

    lastSide = side;
    y -= gap;
  }

  // ── Collectibles (exactly 3, well-spread across level height) ──────────
  // Spread them at 20%, 50%, 80% of the way through the platforms
  const q1 = Math.round(platforms.length * 0.2);
  const q2 = Math.round(platforms.length * 0.5);
  const q3 = Math.round(platforms.length * 0.8);
  for (const idx of [q1, q2, q3]) {
    if (idx > 0 && idx < platforms.length) {
      const p = platforms[idx];
      // Place star slightly off-center for challenge
      const offsetX = rand() < 0.5 ? -1 : 1;
      collectibles.push({ x: Math.max(1, Math.min(WIDTH - 1, Math.round(p.x + p.w / 2) + offsetX)), y: p.y - 1 });
    }
  }
  while (collectibles.length < 3) {
    const p = platforms[Math.min(platforms.length - 2, collectibles.length + 1)];
    collectibles.push({ x: Math.round(p.x + p.w / 2), y: p.y - 1 });
  }

  // ── Exit on top platform ──────────────────────────────────────────────
  const topPlat = platforms[platforms.length - 1];
  const exitX = Math.round(topPlat.x + topPlat.w / 2);
  const exitY = topPlat.y - 2;

  // ── Time target (tight — 3 stars requires fast, clean play) ────────────
  // ~2s per platform for beginner, ~1.8s for advanced, ~1.5s for expert
  const secsPerPlatform = pack === 0 ? lerp(2.2, 1.8, local) :
                          pack === 1 ? lerp(1.8, 1.5, local) :
                                       lerp(1.5, 1.2, local);
  const timeTarget = Math.round(numPlatforms * secsPerPlatform);

  // ── Name ──────────────────────────────────────────────────────────────
  const names = pack === 0 ? BEGINNER_NAMES : pack === 1 ? ADVANCED_NAMES : EXPERT_NAMES;
  const name = names[(levelNum - 1) % 50] || `Level ${levelNum}`;

  return {
    name,
    width: WIDTH,
    height,
    tileSize: 32,
    start: { x: startX, y: startY },
    exit: { x: exitX, y: exitY },
    timeTarget,
    platforms,
    hazards,
    collectibles,
  };
}
