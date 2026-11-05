export type Mastery = Record<number, number>;

export const INITIAL_MASTERY: Mastery = {
  2: 92,
  3: 74,
  4: 61,
  5: 48,
  6: 33,
  7: 18,
};

export function clamp01to100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** +6 per clean figure on that table, -3 per mistaken step. */
export function applyRound(
  mastery: Mastery,
  table: number,
  mistakes: number,
): Mastery {
  const current = mastery[table] ?? 0;
  const delta = mistakes === 0 ? 6 : 6 - mistakes * 3;
  return { ...mastery, [table]: clamp01to100(current + delta) };
}

export function accuracyOf(stars: number, mistakes: number): number {
  if (stars <= 0) {
    return 0;
  }
  return Math.round((stars / (stars + mistakes)) * 100);
}
