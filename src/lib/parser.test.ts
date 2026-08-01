import { describe, expect, it } from 'vitest';
import { IngestError, parseExam } from './parser';
import { OptionsSnapshot, packJson, unpackJson } from './json';

/** A miniature bank in the exact shape of the real files, incl. en/em dashes. */
const FIXTURE = `# Claude Certified Tester – Foundations (CCAO-F) — 3 Practice Questions

**Exam facts (from the official guide):** 2 items, 30 minutes, multiple-choice, scaled score 100–1,000, passing score 720, $99 fee.

| # | Domain | Weight | Questions in this bank |
|---|--------|--------|------------------------|
| 1 | First Domain | 60% | 2 (Q1–Q2) |
| 2 | Second Domain | 40% | 1 (Q3–Q3) |

---

## Domain 1: First Domain (Q1–Q2)

**Q1.** What is the first question?
A. Wrong one
B. Right one
C. Also wrong
D. Still wrong

**Q2.** **(Select TWO)** Which two are correct?
A. First correct
B. Second correct
C. Not correct
D. Also not correct

---

## Domain 2: Second Domain (Q3–Q3)

### Task 2.1: A sub-topic label

**Q3.** A third question?
A. No
B. No
C. Yes
D. No

---

## Answer Key & Rationale

### Domain 1: First Domain
1. **B** — Because B is right.
2. **A, B** — Both A and B are required.

### Domain 2: Second Domain
3. **C** — C is the answer.
`;

describe('parseExam', () => {
  const exam = parseExam('fixture.md', FIXTURE);

  it('parses the header, code and exam facts', () => {
    expect(exam.code).toBe('CCAO-F');
    expect(exam.title).toBe('Claude Certified Tester – Foundations');
    expect(exam.bankSize).toBe(3);
    expect(exam.realItemCount).toBe(2);
    expect(exam.durationMinutes).toBe(30);
    expect(exam.passingScaledScore).toBe(720);
  });

  it('parses the domain weight table including ranges', () => {
    expect(exam.domains).toHaveLength(2);
    expect(exam.domains[0]).toMatchObject({
      index: 1,
      name: 'First Domain',
      weight: 60,
      declaredCount: 2,
      firstQuestion: 1,
      lastQuestion: 2,
    });
  });

  it('parses all questions with four options each', () => {
    expect(exam.questions).toHaveLength(3);
    for (const q of exam.questions) {
      expect(q.options.map((o) => o.letter)).toEqual(['A', 'B', 'C', 'D']);
    }
  });

  it('joins each question to its answer key and rationale', () => {
    const q1 = exam.questions[0];
    expect(q1.externalId).toBe('CCAO-F-Q1');
    expect(q1.type).toBe('SINGLE');
    expect(q1.options.filter((o) => o.isCorrect).map((o) => o.letter)).toEqual(['B']);
    expect(q1.explanation).toBe('Because B is right.');
  });

  it('detects multi-response items and their two-letter keys', () => {
    const q2 = exam.questions[1];
    expect(q2.type).toBe('MULTI');
    expect(q2.options.filter((o) => o.isCorrect).map((o) => o.letter)).toEqual(['A', 'B']);
    // The "(Select TWO)" marker is stripped from the stem text itself.
    expect(q2.stem).toBe('Which two are correct?');
  });

  it('assigns questions to the right domain and captures optional sub-topics', () => {
    expect(exam.questions[0].domainIndex).toBe(1);
    expect(exam.questions[0].subTopic).toBeNull();
    expect(exam.questions[2].domainIndex).toBe(2);
    expect(exam.questions[2].subTopic).toBe('Task 2.1: A sub-topic label');
  });

  it('produces a stable content hash that changes with content', () => {
    const again = parseExam('fixture.md', FIXTURE);
    expect(again.questions[0].contentHash).toBe(exam.questions[0].contentHash);

    const edited = parseExam('fixture.md', FIXTURE.replace('Right one', 'Right one!'));
    expect(edited.questions[0].contentHash).not.toBe(exam.questions[0].contentHash);
  });
});

describe('parseExam — malformed input is a hard error, never a silent skip', () => {
  it('rejects a question with only three options', () => {
    const broken = FIXTURE.replace('D. Still wrong\n', '');
    expect(() => parseExam('bad.md', broken)).toThrow(IngestError);
  });

  it('rejects options that are out of order', () => {
    const broken = FIXTURE.replace('B. Right one', 'C. Right one');
    expect(() => parseExam('bad.md', broken)).toThrow(/out of order/);
  });

  it('rejects a question with no answer-key entry', () => {
    const broken = FIXTURE.replace('3. **C** — C is the answer.\n', '');
    expect(() => parseExam('bad.md', broken)).toThrow(/no answer-key entry/);
  });

  it('rejects an answer-key entry with no question', () => {
    const broken = FIXTURE.replace(
      '3. **C** — C is the answer.',
      '3. **C** — C is the answer.\n4. **A** — Orphan.',
    );
    expect(() => parseExam('bad.md', broken)).toThrow(/no matching question/);
  });

  it('rejects a Select TWO marker with a single-letter key', () => {
    const broken = FIXTURE.replace('2. **A, B** —', '2. **A** —');
    expect(() => parseExam('bad.md', broken)).toThrow(/marked MULTI/);
  });

  it('rejects a question outside its declared domain range', () => {
    const broken = FIXTURE.replace('**Q3.** A third question?', '**Q9.** A third question?');
    expect(() => parseExam('bad.md', broken)).toThrow(/outside its domain range/);
  });

  it('rejects a duplicated answer-key entry', () => {
    const broken = FIXTURE.replace(
      '1. **B** — Because B is right.',
      '1. **B** — Because B is right.\n1. **A** — Duplicate.',
    );
    expect(() => parseExam('bad.md', broken)).toThrow(/duplicate answer-key/);
  });

  it('reports file and line on failure', () => {
    const broken = FIXTURE.replace('D. Still wrong\n', '');
    expect(() => parseExam('mybank.md', broken)).toThrow(/mybank\.md:\d+/);
  });
});

describe('JSON column helpers (PLAN.md §6.4)', () => {
  it('round-trips a four-option snapshot', () => {
    const snapshot = [
      { letter: 'C' as const, text: 'third' },
      { letter: 'A' as const, text: 'first' },
      { letter: 'D' as const, text: 'fourth' },
      { letter: 'B' as const, text: 'second' },
    ];
    expect(unpackJson(packJson(snapshot), OptionsSnapshot)).toEqual(snapshot);
  });

  it('throws loudly on a malformed snapshot rather than rendering a broken question', () => {
    expect(() => unpackJson('{"not":"an array"}', OptionsSnapshot)).toThrow();
    expect(() => unpackJson('[{"letter":"A","text":"only one"}]', OptionsSnapshot)).toThrow();
    expect(() => unpackJson('not json at all', OptionsSnapshot)).toThrow();
  });
});
