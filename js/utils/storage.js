// LocalStorage persistence for progress, stars, and settings
const STORAGE_KEY = 'escape_it_save';

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { unlockedLevel: 1, levels: {}, muted: false };
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) { /* ignore */ }
}

export function getUnlockedLevel() {
  return getStore().unlockedLevel;
}

export function getLevelData(levelNum) {
  const store = getStore();
  return store.levels[levelNum] || { stars: 0, bestTime: Infinity };
}

export function saveLevelResult(levelNum, stars, time) {
  const store = getStore();
  if (!store.levels[levelNum]) store.levels[levelNum] = { stars: 0, bestTime: Infinity };
  const existing = store.levels[levelNum];
  existing.stars = Math.max(existing.stars, stars);
  if (time < existing.bestTime) existing.bestTime = time;
  if (levelNum >= store.unlockedLevel) {
    store.unlockedLevel = levelNum + 1;
  }
  saveStore(store);
}

export function getTotalStars() {
  const store = getStore();
  let total = 0;
  for (const key of Object.keys(store.levels)) {
    total += store.levels[key].stars || 0;
  }
  return total;
}

export function isMuted() {
  return getStore().muted;
}

export function setMuted(muted) {
  const store = getStore();
  store.muted = muted;
  saveStore(store);
}

export function resetProgress() {
  saveStore({ unlockedLevel: 1, levels: {}, muted: false });
}
