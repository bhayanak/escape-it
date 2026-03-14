// Physics helpers
import { GRAVITY, BOUNCE_FORCE, PLAYER_FRICTION, PLAYER_MAX_SPEED } from '../utils/constants.js';

export function applyGravity(entity) {
  entity.vy += GRAVITY;
}

export function applyFriction(entity) {
  entity.vx *= PLAYER_FRICTION;
  if (Math.abs(entity.vx) < 0.1) entity.vx = 0;
}

export function clampSpeed(entity) {
  if (entity.vx > PLAYER_MAX_SPEED) entity.vx = PLAYER_MAX_SPEED;
  if (entity.vx < -PLAYER_MAX_SPEED) entity.vx = -PLAYER_MAX_SPEED;
}

export function bounce(entity) {
  entity.vy = BOUNCE_FORCE;
}
