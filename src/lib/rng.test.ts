import { describe, expect, it } from 'vitest';
import { generateSeed, mulberry32, rngFor, sample, shuffle } from './rng';
import { OPTION_LETTERS, type OptionLetter } from './enums';

describe('seeded shuffling (PLAN.md §7)', () => {
  const items = Array.from({ length: 60 }, (_, i) => i);

  it('is deterministic for a given seed and label', () => {
    const a = shuffle(items, rngFor('deadbeef', 'questions'));
    const b = shuffle(items, rngFor('deadbeef', 'questions'));
    expect(a).toEqual(b);
  });

  it('differs across seeds', () => {
    const a = shuffle(items, rngFor('seed-one', 'questions'));
    const b = shuffle(items, rngFor('seed-two', 'questions'));
    expect(a).not.toEqual(b);
  });

  it('uses independent streams per label, so adding a shuffle cannot perturb existing ones', () => {
    const questions = shuffle(items, rngFor('same-seed', 'questions'));
    const options = shuffle(items, rngFor('same-seed', 'options:abc'));
    expect(questions).not.toEqual(options);
  });

  it('is a true permutation — never drops or duplicates', () => {
    const result = shuffle(items, rngFor(generateSeed(), 'x'));
    expect(result).toHaveLength(items.length);
    expect([...result].sort((a, b) => a - b)).toEqual(items);
  });

  it('does not mutate its input', () => {
    const original = [...items];
    shuffle(items, rngFor('s', 'l'));
    expect(items).toEqual(original);
  });

  it('actually reorders (not an identity shuffle)', () => {
    const result = shuffle(items, rngFor('reorder-check', 'q'));
    expect(result).not.toEqual(items);
  });
});

describe('sample', () => {
  it('draws without replacement', () => {
    const pool = Array.from({ length: 30 }, (_, i) => i);
    const drawn = sample(pool, 8, rngFor('abc', 'd'));
    expect(drawn).toHaveLength(8);
    expect(new Set(drawn).size).toBe(8);
  });

  it('returns everything when asked for more than the pool holds', () => {
    const pool = [1, 2, 3];
    expect(sample(pool, 10, rngFor('abc', 'd')).sort()).toEqual([1, 2, 3]);
  });
});

describe('option letter round-trip (PLAN.md §7)', () => {
  it('maps a display slot back to the original letter', () => {
    const order = shuffle([...OPTION_LETTERS], rngFor('sess', 'options:q1'));

    // The UI labels slots A-D in order; the stored value must be the ORIGINAL letter.
    const displayed = order.map((originalLetter, slot) => ({
      shownAs: String.fromCharCode(65 + slot),
      original: originalLetter,
    }));

    // Picking the third thing on screen stores whatever original letter sits there.
    const picked = displayed[2];
    expect(picked.shownAs).toBe('C');
    expect(OPTION_LETTERS).toContain(picked.original as OptionLetter);

    // Every original letter appears exactly once across the display slots.
    expect([...order].sort()).toEqual([...OPTION_LETTERS]);
  });
});

describe('mulberry32', () => {
  it('produces values in [0, 1)', () => {
    const rng = mulberry32(12345);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('is reasonably uniform across ten buckets', () => {
    const rng = mulberry32(99);
    const buckets = new Array(10).fill(0);
    const n = 20_000;
    for (let i = 0; i < n; i++) buckets[Math.floor(rng() * 10)]++;
    for (const count of buckets) {
      expect(count).toBeGreaterThan(n / 10 - 400);
      expect(count).toBeLessThan(n / 10 + 400);
    }
  });
});

describe('generateSeed', () => {
  it('returns 32 hex characters and does not repeat', () => {
    const seeds = new Set(Array.from({ length: 200 }, generateSeed));
    expect(seeds.size).toBe(200);
    for (const s of seeds) expect(s).toMatch(/^[0-9a-f]{32}$/);
  });
});
