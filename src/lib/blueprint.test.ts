import { describe, expect, it } from 'vitest';
import { allocateByWeight, durationFor, itemCountFor, type DomainWeight } from './blueprint';
import { ExamMode } from './enums';

/**
 * The expected allocations below are the tables hand-computed in PLAN.md §3.2. If the
 * algorithm ever drifts from the published blueprint, these fail.
 */

const CCAO: DomainWeight[] = [
  { index: 1, name: 'Prompting and Task Execution', weight: 14, available: 22 },
  { index: 2, name: 'Output Evaluation and Validation', weight: 21, available: 34 },
  { index: 3, name: 'Product and Model Selection', weight: 12, available: 19 },
  { index: 4, name: 'Workflow Integration and Solution Design', weight: 16, available: 26 },
  { index: 5, name: 'Configuration and Knowledge Management', weight: 12, available: 19 },
  { index: 6, name: 'Governance, Risk, and Responsible Use', weight: 15, available: 24 },
  { index: 7, name: 'Troubleshooting and Optimization', weight: 10, available: 16 },
];

const CCDV: DomainWeight[] = [
  { index: 1, name: 'Agents and Workflows', weight: 14.7, available: 26 },
  { index: 2, name: 'Applications and Integration', weight: 33.1, available: 59 },
  { index: 3, name: 'Claude Code', weight: 3.1, available: 6 },
  { index: 4, name: 'Eval, Testing, and Debugging', weight: 2.6, available: 5 },
  { index: 5, name: 'Model Selection and Optimization', weight: 16.8, available: 30 },
  { index: 6, name: 'Prompt and Context Engineering', weight: 11.0, available: 20 },
  { index: 7, name: 'Security and Safety', weight: 8.1, available: 15 },
  { index: 8, name: 'Tools and MCPs', weight: 10.6, available: 19 },
];

const CCAR: DomainWeight[] = [
  { index: 1, name: 'Agentic Architecture & Orchestration', weight: 27, available: 54 },
  { index: 2, name: 'Tool Design & MCP Integration', weight: 18, available: 36 },
  { index: 3, name: 'Claude Code Configuration & Workflows', weight: 20, available: 40 },
  { index: 4, name: 'Prompt Engineering & Structured Output', weight: 20, available: 40 },
  { index: 5, name: 'Context Management & Reliability', weight: 15, available: 30 },
];

const alloc = (domains: DomainWeight[], total: number) =>
  allocateByWeight(domains, total).map((d) => d.allocated);

describe('itemCountFor / durationFor', () => {
  it('halves the real item count, rounding up (PLAN.md §3.1)', () => {
    expect(itemCountFor(60, ExamMode.REAL)).toBe(60);
    expect(itemCountFor(60, ExamMode.MOCK)).toBe(30);
    expect(itemCountFor(53, ExamMode.REAL)).toBe(53);
    expect(itemCountFor(53, ExamMode.MOCK)).toBe(27); // ceil(26.5)
  });

  it('halves the duration for mocks', () => {
    expect(durationFor(120, ExamMode.REAL)).toBe(120);
    expect(durationFor(120, ExamMode.MOCK)).toBe(60);
  });
});

describe('allocateByWeight — matches the PLAN.md §3.2 tables', () => {
  it('CCAO-F real (60) and mock (30)', () => {
    expect(alloc(CCAO, 60)).toEqual([8, 13, 7, 10, 7, 9, 6]);
    expect(alloc(CCAO, 30)).toEqual([4, 6, 4, 5, 4, 4, 3]);
  });

  it('CCDV-F real (53) and mock (27)', () => {
    expect(alloc(CCDV, 53)).toEqual([8, 17, 2, 1, 9, 6, 4, 6]);
    expect(alloc(CCDV, 27)).toEqual([4, 9, 1, 1, 4, 3, 2, 3]);
  });

  it('CCAR-F real (60) and mock (30)', () => {
    expect(alloc(CCAR, 60)).toEqual([16, 11, 12, 12, 9]);
    expect(alloc(CCAR, 30)).toEqual([8, 5, 6, 6, 5]);
  });
});

describe('allocateByWeight — invariants', () => {
  const banks = { CCAO, CCDV, CCAR };

  it('always sums exactly to the requested total', () => {
    for (const [name, bank] of Object.entries(banks)) {
      for (let total = bank.length; total <= 60; total++) {
        const sum = alloc(bank, total).reduce((a, b) => a + b, 0);
        expect(sum, `${name} @ ${total}`).toBe(total);
      }
    }
  });

  it('never gives a domain zero items', () => {
    for (const [name, bank] of Object.entries(banks)) {
      for (let total = bank.length; total <= 60; total++) {
        const counts = alloc(bank, total);
        expect(Math.min(...counts), `${name} @ ${total}`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('never exceeds what the bank holds for a domain', () => {
    for (const bank of Object.values(banks)) {
      const counts = alloc(bank, 60);
      counts.forEach((n, i) => expect(n).toBeLessThanOrEqual(bank[i].available));
    }
  });

  it('keeps the heaviest domain the largest allocation', () => {
    const counts = alloc(CCDV, 53);
    const heaviest = CCDV.reduce((a, b) => (a.weight > b.weight ? a : b));
    const heaviestIndex = CCDV.indexOf(heaviest);
    expect(Math.max(...counts)).toBe(counts[heaviestIndex]);
  });

  it('refuses a request the bank cannot satisfy', () => {
    expect(() => allocateByWeight(CCAO, 1_000)).toThrow(/only holds/);
  });

  it('refuses a total too small to cover every domain', () => {
    expect(() => allocateByWeight(CCDV, 3)).toThrow(/cannot give all/);
  });
});
