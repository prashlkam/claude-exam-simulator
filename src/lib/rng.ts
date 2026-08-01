import { randomBytes } from 'node:crypto';

/**
 * Seeded PRNG + Fisher-Yates (PLAN.md §7).
 *
 * Shuffling is server-authoritative and reproducible: the seed is stored on the session
 * and the resulting order is persisted, so a reload, a resume after a crash, and the
 * results screen all replay the exact same order.
 */

/** 16 random bytes, hex — the per-session shuffle seed. */
export const generateSeed = (): string => randomBytes(16).toString('hex');

/** Fold an arbitrary-length hex seed into a 32-bit integer. */
function seedToInt(seed: string): number {
  let h = 2166136261 >>> 0; // FNV-1a offset basis
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, well-distributed 32-bit PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

/**
 * A named stream derived from the session seed. Using a distinct label per concern
 * (question order vs. each question's option order) means adding a new shuffle later
 * cannot perturb the existing ones for an already-stored seed.
 */
export const rngFor = (seed: string, label: string): Rng =>
  mulberry32(seedToInt(`${seed}:${label}`));

/** Fisher-Yates. Returns a new array; the input is not mutated. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Draw `count` distinct items without replacement. */
export function sample<T>(items: readonly T[], count: number, rng: Rng): T[] {
  if (count >= items.length) return shuffle(items, rng);
  return shuffle(items, rng).slice(0, count);
}
