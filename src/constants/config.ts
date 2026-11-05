import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Rule #13 — EXACTLY 8000ms, never less. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 320;

/** Brief requirement: the stretchy line snaps to a peg within 40px. */
export const SNAP_RADIUS = 40;

/** Tap-vs-drag discrimination for the PanResponder. */
export const TAP_TRAVEL_PX = 12;

/** Figure trace on completion (brief requirement). */
export const FIGURE_TRACE_MS = 1000;
export const SHIMMER_MS = 900;

/** After this long without any progress the sky reveals the figure itself
 *  (assist for young players — progress is never taken away). */
export const IDLE_REVEAL_MS = 40000;
export const IDLE_HINT_MS = 4000;

/** Board geometry (rules #4, #5). */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const COLS = 5;
export const ROWS = 6;

/** Header (116) + floating control bar (92 + 10 + 48) + bottom inset (24) + slack. */
export const HEADER_H = 116;
export const FLOATING_H = 92 + 10 + 48;
export const GAME_AREA_H = SCREEN_H - HEADER_H - FLOATING_H - 24 - 24;

const CELL_BY_W = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / COLS);
const CELL_BY_H = Math.floor((GAME_AREA_H - 2 * BOARD_FRAME) / ROWS);

export const CELL = Math.max(44, Math.min(CELL_BY_W, CELL_BY_H));
export const BOARD_W = CELL * COLS + 2 * BOARD_FRAME;
export const BOARD_H = CELL * ROWS + 2 * BOARD_FRAME;

/** Peg visuals scale with the cell so halos never collide. */
export const PEG_HALO = Math.min(54, CELL - 4);
export const PEG_DISC = Math.round(Math.min(34, PEG_HALO * 0.64));

/** Starfield densities per screen (rule: same component, different densities). */
export const STARS_LOADER = 26;
export const STARS_MENU = 34;
export const STARS_BOARD = 18;
export const STARS_RESULT = 30;

/** Demo seed progress so every screen shows real-looking numbers. */
export const SEED = {
  mapped: 12,
  total: 120,
  chapter: 2,
  accuracy: 86,
  tables: 7,
  practiceRuns: 4,
};

export const PRACTICE_QUESTIONS = 10;
