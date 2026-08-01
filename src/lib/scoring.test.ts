import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PASS_THRESHOLD,
  SCALE_MAX,
  SCALE_MIN,
  SCALE_PASS,
  domainBreakdown,
  isAnswerCorrect,
  scaledScore,
  scoreBand,
  scoreSession,
} from './scoring';
import type { OptionLetter } from './enums';

const L = (s: string) => s.split(',') as OptionLetter[];

describe('isAnswerCorrect', () => {
  it('grades single-response items', () => {
    expect(isAnswerCorrect(L('B'), L('B'))).toBe(true);
    expect(isAnswerCorrect(L('A'), L('B'))).toBe(false);
  });

  it('is all-or-nothing for multi-response items (PLAN.md §10)', () => {
    expect(isAnswerCorrect(L('A,B'), L('A,B'))).toBe(true);
    expect(isAnswerCorrect(L('B,A'), L('A,B'))).toBe(true); // order must not matter
    expect(isAnswerCorrect(L('A'), L('A,B'))).toBe(false); // partial gets no credit
    expect(isAnswerCorrect(L('A,C'), L('A,B'))).toBe(false);
    expect(isAnswerCorrect(L('A,B,C'), L('A,B'))).toBe(false); // superset gets no credit
  });

  it('treats unanswered as incorrect', () => {
    expect(isAnswerCorrect([], L('B'))).toBe(false);
    expect(isAnswerCorrect(null, L('B'))).toBe(false);
    expect(isAnswerCorrect(undefined, L('A,B'))).toBe(false);
  });

  it('does not let a duplicated selection satisfy a two-answer key', () => {
    expect(isAnswerCorrect(L('A,A'), L('A,B'))).toBe(false);
  });
});

describe('scaledScore', () => {
  it('hits the three documented anchors (PLAN.md §10.1)', () => {
    expect(scaledScore(0, 100)).toBe(SCALE_MIN);
    expect(scaledScore(72, 100)).toBe(SCALE_PASS);
    expect(scaledScore(100, 100)).toBe(SCALE_MAX);
  });

  it('is monotonic across the whole range', () => {
    let previous = -1;
    for (let correct = 0; correct <= 60; correct++) {
      const value = scaledScore(correct, 60);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('stays within bounds and straddles the pass mark correctly', () => {
    for (let correct = 0; correct <= 53; correct++) {
      const value = scaledScore(correct, 53);
      expect(value).toBeGreaterThanOrEqual(SCALE_MIN);
      expect(value).toBeLessThanOrEqual(SCALE_MAX);
      const shouldPass = correct / 53 >= DEFAULT_PASS_THRESHOLD;
      expect(value >= SCALE_PASS).toBe(shouldPass);
    }
  });

  it('handles an empty exam without dividing by zero', () => {
    expect(scaledScore(0, 0)).toBe(SCALE_MIN);
  });
});

describe('scoreBand', () => {
  it('bands at 80 and 60 (PLAN.md §11.2)', () => {
    expect(scoreBand(80)).toBe('strong');
    expect(scoreBand(79.9)).toBe('fair');
    expect(scoreBand(60)).toBe('fair');
    expect(scoreBand(59.9)).toBe('weak');
  });
});

describe('domainBreakdown', () => {
  const domains = [
    { id: 'd1', index: 1, name: 'Heavy', weight: 33 },
    { id: 'd2', index: 2, name: 'Light', weight: 3 },
  ];

  it('ranks weighted loss above raw percentage', () => {
    const items = [
      // Heavy domain: 1/2 correct -> 50%
      { questionId: 'a', domainId: 'd1', isCorrect: true, answered: true },
      { questionId: 'b', domainId: 'd1', isCorrect: false, answered: true },
      // Light domain: 0/1 correct -> 0%
      { questionId: 'c', domainId: 'd2', isCorrect: false, answered: false },
    ];

    const [heavy, light] = domainBreakdown(items, domains);

    expect(heavy.percent).toBe(50);
    expect(light.percent).toBe(0);
    // Light scored worse, but the heavy domain costs far more weighted marks.
    expect(heavy.weightedPointsLost).toBeGreaterThan(light.weightedPointsLost);
    expect(heavy.weightedPointsLost).toBeCloseTo(16.5);
    expect(light.weightedPointsLost).toBeCloseTo(3);
  });

  it('reconciles with the session total', () => {
    const items = [
      { questionId: 'a', domainId: 'd1', isCorrect: true, answered: true },
      { questionId: 'b', domainId: 'd1', isCorrect: false, answered: true },
      { questionId: 'c', domainId: 'd2', isCorrect: true, answered: true },
    ];
    const result = scoreSession(items, domains);
    expect(result.rawScore).toBe(2);
    expect(result.rawTotal).toBe(3);
    expect(result.domains.reduce((s, d) => s + d.total, 0)).toBe(3);
    expect(result.domains.reduce((s, d) => s + d.correct, 0)).toBe(2);
  });
});
