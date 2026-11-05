import { useCallback, useMemo, useState } from 'react';
import type { Constellation } from '../game/constellations';
import { solutionFor } from '../game/rules';

export type Resolution = 'accept' | 'reject' | 'ignore';

export type ChainState = {
  chain: number[];
  mistakes: number;
  rejects: number;
  lastRejectedId: number | null;
  rejectTick: number;
  solution: number[];
  nextPegId: number | null;
  complete: boolean;
};

/**
 * The chain is never truncated and nothing is decremented on a wrong tap —
 * a rejection only twinkles and bumps the mistake counter for the accuracy figure.
 */
export function useChain(constellation: Constellation) {
  const solution = useMemo(
    () => solutionFor(constellation.rule, constellation.pegs),
    [constellation],
  );

  const [chain, setChain] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [rejects, setRejects] = useState(0);
  const [lastRejectedId, setLastRejectedId] = useState<number | null>(null);
  const [rejectTick, setRejectTick] = useState(0);

  const nextPegId = chain.length < solution.length ? solution[chain.length] : null;
  const complete = chain.length > 0 && chain.length === solution.length;

  const resolve = useCallback(
    (pegId: number): Resolution => {
      if (chain.indexOf(pegId) !== -1) {
        return 'ignore';
      }
      const expected = solution[chain.length];
      if (expected === undefined) {
        return 'ignore';
      }
      if (pegId === expected) {
        setChain(prev => (prev.indexOf(pegId) === -1 ? [...prev, pegId] : prev));
        setRejects(0);
        setLastRejectedId(null);
        return 'accept';
      }
      setMistakes(m => m + 1);
      setRejects(r => r + 1);
      setLastRejectedId(pegId);
      setRejectTick(t => t + 1);
      return 'reject';
    },
    [chain, solution],
  );

  const reset = useCallback(() => {
    setChain([]);
    setMistakes(0);
    setRejects(0);
    setLastRejectedId(null);
  }, []);

  const revealAll = useCallback(() => {
    setChain(solution.slice());
    setLastRejectedId(null);
  }, [solution]);

  return {
    chain,
    mistakes,
    rejects,
    lastRejectedId,
    rejectTick,
    solution,
    nextPegId,
    complete,
    resolve,
    reset,
    revealAll,
  };
}

export default useChain;
