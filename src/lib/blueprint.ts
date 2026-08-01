import { ExamMode } from './enums';

/**
 * Domain-proportional item allocation (PLAN.md §3.2).
 *
 * Questions are NOT drawn uniformly from the bank. Items are allocated per domain in
 * proportion to the published blueprint weights using the largest-remainder (Hare quota)
 * method, so every generated sitting mirrors the real exam's domain mix.
 */

export interface DomainWeight {
  index: number;
  name: string;
  weight: number;
  /** How many questions the bank actually holds for this domain. */
  available: number;
}

export interface DomainAllocation extends DomainWeight {
  allocated: number;
}

/** Mock sittings are half the real exam's item count, rounded up (PLAN.md §3.1). */
export const itemCountFor = (realItemCount: number, mode: ExamMode): number =>
  mode === ExamMode.REAL ? realItemCount : Math.ceil(realItemCount / 2);

/** Mock sittings get half the real duration (PLAN.md §16 assumption 2). */
export const durationFor = (realDurationMinutes: number, mode: ExamMode): number =>
  mode === ExamMode.REAL ? realDurationMinutes : Math.ceil(realDurationMinutes / 2);

/**
 * Largest-remainder allocation with two guards:
 *   - every domain receives at least 1 item (so a low-weight domain like CCDV-F's
 *     "Eval, Testing, and Debugging" at 2.6% is never silently dropped);
 *   - no domain is allocated more items than its bank actually holds.
 *
 * Returns allocations summing exactly to `total`.
 */
export function allocateByWeight(domains: DomainWeight[], total: number): DomainAllocation[] {
  if (domains.length === 0) throw new Error('allocateByWeight: no domains');

  const capacity = domains.reduce((sum, d) => sum + d.available, 0);
  if (total > capacity) {
    throw new Error(
      `allocateByWeight: requested ${total} items but the bank only holds ${capacity}`,
    );
  }
  if (total < domains.length) {
    throw new Error(
      `allocateByWeight: cannot give all ${domains.length} domains an item within ${total} items`,
    );
  }

  const weightSum = domains.reduce((sum, d) => sum + d.weight, 0);

  const exact = domains.map((d) => (d.weight / weightSum) * total);
  const alloc = exact.map((v, i) => Math.min(Math.floor(v), domains[i].available));

  // Largest-remainder: hand out the leftover items to the biggest fractional parts first.
  let remaining = total - alloc.reduce((a, b) => a + b, 0);

  const byRemainder = exact
    .map((v, i) => ({ i, remainder: v - Math.floor(v) }))
    .sort((a, b) => b.remainder - a.remainder || a.i - b.i);

  while (remaining > 0) {
    let placed = false;
    for (const { i } of byRemainder) {
      if (remaining === 0) break;
      if (alloc[i] < domains[i].available) {
        alloc[i] += 1;
        remaining -= 1;
        placed = true;
      }
    }
    if (!placed) break; // every domain is at capacity
  }

  // Guard: lift any domain sitting at zero, taking from the largest over-quota domain.
  for (let i = 0; i < alloc.length; i++) {
    if (alloc[i] > 0 || domains[i].available === 0) continue;

    let donor = -1;
    let best = -Infinity;
    for (let j = 0; j < alloc.length; j++) {
      if (j === i || alloc[j] <= 1) continue;
      const surplus = alloc[j] - exact[j];
      if (surplus > best) {
        best = surplus;
        donor = j;
      }
    }
    if (donor >= 0) {
      alloc[donor] -= 1;
      alloc[i] += 1;
    }
  }

  return domains.map((d, i) => ({ ...d, allocated: alloc[i] }));
}
