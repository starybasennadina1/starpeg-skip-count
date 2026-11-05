import { useCallback, useState } from 'react';
import { SEED } from '../constants/config';
import { applyRound, INITIAL_MASTERY, type Mastery } from '../game/mastery';

export type Progress = {
  mapped: number;
  total: number;
  chapter: number;
  accuracy: number;
  tables: number;
  mastery: Mastery;
};

const INITIAL: Progress = {
  mapped: SEED.mapped,
  total: SEED.total,
  chapter: SEED.chapter,
  accuracy: SEED.accuracy,
  tables: SEED.tables,
  mastery: INITIAL_MASTERY,
};

/** Session-only progress — no AsyncStorage dependency is added. */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(INITIAL);

  const recordFigure = useCallback(
    (table: number, mistakes: number, accuracy: number) => {
      setProgress(p => ({
        ...p,
        mapped: Math.min(p.total, p.mapped + 1),
        accuracy: Math.round((p.accuracy * 3 + accuracy) / 4),
        mastery: applyRound(p.mastery, table, mistakes),
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setProgress({ ...INITIAL, mapped: 0, accuracy: 0, mastery: {} });
  }, []);

  return { progress, recordFigure, reset };
}

export default useProgress;
