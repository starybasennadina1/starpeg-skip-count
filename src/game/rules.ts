export type RuleKind = 'skip' | 'odd' | 'even' | 'multiply';

export type Rule =
  | { kind: 'skip'; step: number }
  | { kind: 'multiply'; step: number }
  | { kind: 'odd' }
  | { kind: 'even' };

export function satisfies(rule: Rule, value: number): boolean {
  switch (rule.kind) {
    case 'skip':
    case 'multiply':
      return value > 0 && value % rule.step === 0;
    case 'odd':
      return Math.abs(value % 2) === 1;
    case 'even':
      return value % 2 === 0;
    default:
      return false;
  }
}

export function ruleTitle(rule: Rule): string {
  switch (rule.kind) {
    case 'skip':
      return 'COUNT BY ' + rule.step + 's';
    case 'multiply':
      return 'TABLE OF ' + rule.step;
    case 'odd':
      return 'ODD NUMBERS';
    case 'even':
      return 'EVEN NUMBERS';
    default:
      return 'FIND THE PATTERN';
  }
}

export function ruleShort(rule: Rule): string {
  switch (rule.kind) {
    case 'skip':
      return 'SKIP BY ' + rule.step;
    case 'multiply':
      return 'TIMES ' + rule.step;
    case 'odd':
      return 'ODDS ONLY';
    case 'even':
      return 'EVENS ONLY';
    default:
      return 'PATTERN';
  }
}

/** Ascending preview of the rule, e.g. "4 · 8 · 12 · 16". Bullet is a safe glyph. */
export function ruleSequence(rule: Rule): string {
  const step = rule.kind === 'skip' || rule.kind === 'multiply' ? rule.step : 2;
  const start = rule.kind === 'odd' ? 1 : step;
  const out: number[] = [];
  for (let i = 0; i < 4; i++) {
    out.push(start + i * step);
  }
  return out.join(' · ') + ' · ...';
}

/** Three worked rows, plain ASCII only (rule #15). */
export function exampleRows(rule: Rule): string[] {
  if (rule.kind === 'skip' || rule.kind === 'multiply') {
    return [1, 2, 3].map(i => rule.step + ' x ' + i + ' = ' + rule.step * i);
  }
  if (rule.kind === 'odd') {
    return ['1 is odd', '1 + 2 = 3 is odd', '3 + 2 = 5 is odd'];
  }
  return ['2 is even', '2 + 2 = 4 is even', '4 + 2 = 6 is even'];
}

/** The single correct chain: matching pegs, lowest value to highest. */
export function solutionFor<T extends { value: number; id: number }>(
  rule: Rule,
  pegs: readonly T[],
): number[] {
  return pegs
    .filter(p => satisfies(rule, p.value))
    .slice()
    .sort((a, b) => a.value - b.value)
    .map(p => p.id);
}
