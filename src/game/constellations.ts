import type { Rule } from './rules';

export type Peg = {
  id: number;
  col: number;
  row: number;
  value: number;
};

export type Constellation = {
  id: number;
  index: number;
  name: string;
  rule: Rule;
  table: number;
  pegs: Peg[];
  story: string[];
};

/** Hand-authored layouts on the 5 x 6 cell grid — never two pegs in one cell. */
export const CONSTELLATIONS: Constellation[] = [
  {
    id: 1,
    index: 13,
    name: 'THE LANTERN FOX',
    rule: { kind: 'skip', step: 4 },
    table: 4,
    pegs: [
      { id: 1, col: 0, row: 4, value: 4 },
      { id: 2, col: 1, row: 2, value: 8 },
      { id: 3, col: 2, row: 0, value: 12 },
      { id: 4, col: 3, row: 2, value: 16 },
      { id: 5, col: 4, row: 4, value: 20 },
      { id: 6, col: 1, row: 5, value: 7 },
      { id: 7, col: 3, row: 5, value: 9 },
      { id: 8, col: 2, row: 3, value: 13 },
      { id: 9, col: 0, row: 1, value: 18 },
      { id: 10, col: 4, row: 1, value: 21 },
      { id: 11, col: 2, row: 5, value: 15 },
    ],
    story: [
      'The Lantern Fox walks the long edge of the night,',
      'counting four steps between every lamp she lights,',
      'so the smaller stars can find their way home.',
    ],
  },
  {
    id: 2,
    index: 14,
    name: 'THE SILVER KITE',
    rule: { kind: 'skip', step: 3 },
    table: 3,
    pegs: [
      { id: 1, col: 2, row: 5, value: 3 },
      { id: 2, col: 0, row: 3, value: 6 },
      { id: 3, col: 2, row: 2, value: 9 },
      { id: 4, col: 4, row: 3, value: 12 },
      { id: 5, col: 2, row: 0, value: 15 },
      { id: 6, col: 1, row: 1, value: 8 },
      { id: 7, col: 3, row: 1, value: 10 },
      { id: 8, col: 0, row: 5, value: 7 },
      { id: 9, col: 4, row: 5, value: 11 },
      { id: 10, col: 1, row: 4, value: 13 },
      { id: 11, col: 3, row: 4, value: 14 },
    ],
    story: [
      'The Silver Kite was tied to the moon by a child',
      'who let the string out three stars at a time',
      'until the whole sky was holding on.',
    ],
  },
  {
    id: 3,
    index: 15,
    name: 'THE NIGHT HERON',
    rule: { kind: 'even' },
    table: 2,
    pegs: [
      { id: 1, col: 0, row: 5, value: 2 },
      { id: 2, col: 1, row: 3, value: 6 },
      { id: 3, col: 2, row: 1, value: 10 },
      { id: 4, col: 3, row: 0, value: 14 },
      { id: 5, col: 4, row: 2, value: 18 },
      { id: 6, col: 0, row: 2, value: 5 },
      { id: 7, col: 1, row: 0, value: 7 },
      { id: 8, col: 2, row: 4, value: 9 },
      { id: 9, col: 3, row: 3, value: 11 },
      { id: 10, col: 4, row: 5, value: 13 },
      { id: 11, col: 2, row: 5, value: 15 },
    ],
    story: [
      'The Night Heron only ever stands on even stones,',
      'two by two across the cold river of the sky,',
      'and never once gets her feathers wet.',
    ],
  },
  {
    id: 4,
    index: 16,
    name: 'THE EMBER SERPENT',
    rule: { kind: 'multiply', step: 6 },
    table: 6,
    pegs: [
      { id: 1, col: 0, row: 0, value: 6 },
      { id: 2, col: 1, row: 2, value: 12 },
      { id: 3, col: 2, row: 4, value: 18 },
      { id: 4, col: 3, row: 2, value: 24 },
      { id: 5, col: 4, row: 0, value: 30 },
      { id: 6, col: 0, row: 4, value: 8 },
      { id: 7, col: 1, row: 5, value: 14 },
      { id: 8, col: 2, row: 0, value: 20 },
      { id: 9, col: 3, row: 5, value: 26 },
      { id: 10, col: 4, row: 4, value: 32 },
      { id: 11, col: 2, row: 2, value: 21 },
    ],
    story: [
      'The Ember Serpent sheds a scale every sixth night',
      'and each one cools into a small orange star,',
      'which is why that corner of the sky is warm.',
    ],
  },
];

export function constellationAt(i: number): Constellation {
  return CONSTELLATIONS[i % CONSTELLATIONS.length];
}

/** Star Log entries — the first `mapped` are discovered. */
export const LOG_ENTRIES: { id: number; name: string }[] = [
  { id: 1, name: 'DUSK HARE' },
  { id: 2, name: 'TIN WHALE' },
  { id: 3, name: 'PAPER BOAT' },
  { id: 4, name: 'SLOW BEAR' },
  { id: 5, name: 'GLASS MOTH' },
  { id: 6, name: 'OLD CRANE' },
  { id: 7, name: 'RIVER CAT' },
  { id: 8, name: 'NORTH KEY' },
  { id: 9, name: 'SEED LAMP' },
  { id: 10, name: 'LONG ROAD' },
  { id: 11, name: 'CLAY BIRD' },
  { id: 12, name: 'SALT FOX' },
  { id: 13, name: 'LANTERN FOX' },
  { id: 14, name: 'SILVER KITE' },
  { id: 15, name: 'NIGHT HERON' },
];
