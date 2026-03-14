// Collision detection — circle vs rect AABB
export function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return (dx * dx + dy * dy) <= (cr * cr);
}

// Returns collision details: { top, bottom, left, right, overlapX, overlapY }
export function circleRectOverlap(cx, cy, cr, rx, ry, rw, rh) {
  if (!circleRectCollision(cx, cy, cr, rx, ry, rw, rh)) return null;

  // Compute overlap on each side
  const overlapLeft = (cx + cr) - rx;
  const overlapRight = (rx + rw) - (cx - cr);
  const overlapTop = (cy + cr) - ry;
  const overlapBottom = (ry + rh) - (cy - cr);

  const minOverlapX = Math.min(overlapLeft, overlapRight);
  const minOverlapY = Math.min(overlapTop, overlapBottom);

  if (minOverlapY < minOverlapX) {
    if (overlapTop < overlapBottom) {
      return { side: 'top', overlap: overlapTop };
    } else {
      return { side: 'bottom', overlap: overlapBottom };
    }
  } else {
    if (overlapLeft < overlapRight) {
      return { side: 'left', overlap: overlapLeft };
    } else {
      return { side: 'right', overlap: overlapRight };
    }
  }
}

// Circle vs circle collision
export function circleCircleCollision(x1, y1, r1, x2, y2, r2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < (r1 + r2);
}
