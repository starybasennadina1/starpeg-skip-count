import { BOARD_FRAME, CELL, SNAP_RADIUS } from '../constants/config';

export type Point = { x: number; y: number };

export function cellCentre(col: number, row: number): Point {
  return {
    x: BOARD_FRAME + col * CELL + CELL / 2,
    y: BOARD_FRAME + row * CELL + CELL / 2,
  };
}

export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Nearest entry within SNAP_RADIUS, or null. */
export function nearest<T extends { centre: Point }>(
  items: readonly T[],
  p: Point,
  radius: number = SNAP_RADIUS,
): T | null {
  let best: T | null = null;
  let bestD = radius;
  for (let i = 0; i < items.length; i++) {
    const d = distance(items[i].centre, p);
    if (d <= bestD) {
      bestD = d;
      best = items[i];
    }
  }
  return best;
}
