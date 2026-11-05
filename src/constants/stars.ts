export type Star = {
  /** 0..1 fractions of the container box */
  x: number;
  y: number;
  r: number;
  o: number;
  /** twinkle phase offset in ms */
  delay: number;
};

/** Deterministic LCG so the starfield is identical on every mount/render. */
function makeField(count: number, seed: number): Star[] {
  let s = seed >>> 0;
  const next = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const out: Star[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: next(),
      y: next(),
      r: 0.5 + next() * 1.2,
      o: 0.25 + next() * 0.55,
      delay: Math.floor(next() * 8) * 400,
    });
  }
  return out;
}

const CACHE: Record<string, Star[]> = {};

export function starField(count: number, seed = 20261105): Star[] {
  const key = count + ':' + seed;
  if (!CACHE[key]) {
    CACHE[key] = makeField(count, seed);
  }
  return CACHE[key];
}
