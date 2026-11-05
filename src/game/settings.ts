import { useSyncExternalStore } from 'react';

export type Settings = {
  grade: 'G1' | 'G2' | 'G3';
  sound: boolean;
  reducedMotion: boolean;
};

let state: Settings = { grade: 'G2', sound: true, reducedMotion: false };
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  if (state[key] === value) {
    return;
  }
  state = { ...state, [key]: value };
  listeners.forEach(l => l());
}

export function getSettings(): Settings {
  return state;
}

/** Selector hook — components subscribe to one field, not the whole store. */
export function useSetting<K extends keyof Settings>(key: K): Settings[K] {
  return useSyncExternalStore(
    subscribe,
    () => state[key],
    () => state[key],
  );
}

/** 1 normally, 0 when reduced motion is on — every duration multiplies by it. */
export function useAnimScale(): number {
  const reduced = useSetting('reducedMotion');
  return reduced ? 0 : 1;
}

export function animScale(): number {
  return state.reducedMotion ? 0 : 1;
}
