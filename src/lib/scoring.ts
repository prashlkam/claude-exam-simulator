import type { OptionLetter } from './enums';

/**
 * Scoring (PLAN.md §10).
 *
 * Pure functions — no database access — so they are directly unit-testable and the
 * results screen and the submit handler cannot disagree about a score.
 */

/** Raw fraction correct that maps to the 720 pass mark. Configurable per exam. */
export const DEFAULT_PASS_THRESHOLD = 0.72;

export const SCALE_MIN = 100;
export const SCALE_MAX = 1000;
export const SCALE_PASS = 720;

/**
 * Multi-response items are all-or-nothing: the selected set must equal the key set
 * exactly. Unanswered counts as incorrect. No negative marking.
 */
export function isAnswerCorrect(
  selected: readonly OptionLetter[] | null | undefined,
  correct: readonly OptionLetter[],
): boolean {
  if (!selected || selected.length === 0) return false;
  if (selected.length !== correct.length) return false;
  const want = new Set(correct);
  if (want.size !== correct.length) return false;
  const got = new Set(selected);
  if (got.size !== selected.length) return false;
  for (const letter of got) if (!want.has(letter)) return false;
  return true;
}

/**
 * Piecewise-linear scaled score anchored on the pass mark (PLAN.md §10.1).
 *
 * The real exams use an undisclosed equating model, so this is explicitly an
 * approximation and is labelled as such in the UI. Anchors: 0% -> 100,
 * `passThreshold` -> 720, 100% -> 1000.
 */
export function scaledScore(
  rawScore: number,
  rawTotal: number,
  passThreshold: number = DEFAULT_PASS_THRESHOLD,
): number {
  if (rawTotal <= 0) return SCALE_MIN;
  const p = Math.min(1, Math.max(0, rawScore / rawTotal));

  if (p <= passThreshold) {
    if (passThreshold === 0) return SCALE_PASS;
    return Math.round(SCALE_MIN + (SCALE_PASS - SCALE_MIN) * (p / passThreshold));
  }
  return Math.round(
    SCALE_PASS + (SCALE_MAX - SCALE_PASS) * ((p - passThreshold) / (1 - passThreshold)),
  );
}

export const didPass = (scaled: number, passingScaledScore = SCALE_PASS): boolean =>
  scaled >= passingScaledScore;

export interface DomainScore {
  domainId: string;
  index: number;
  name: string;
  weight: number;
  total: number;
  correct: number;
  percent: number;
  /**
   * Blueprint-weighted percentage points lost in this domain. Ranking by this — rather
   * than by raw percent — surfaces the domains where study time actually pays off.
   */
  weightedPointsLost: number;
}

export interface GradedItem {
  questionId: string;
  domainId: string;
  isCorrect: boolean;
  answered: boolean;
}

export interface DomainMeta {
  id: string;
  index: number;
  name: string;
  weight: number;
}

export function domainBreakdown(items: GradedItem[], domains: DomainMeta[]): DomainScore[] {
  return domains
    .map((d) => {
      const inDomain = items.filter((i) => i.domainId === d.id);
      const total = inDomain.length;
      const correct = inDomain.filter((i) => i.isCorrect).length;
      const percent = total === 0 ? 0 : (correct / total) * 100;
      return {
        domainId: d.id,
        index: d.index,
        name: d.name,
        weight: d.weight,
        total,
        correct,
        percent,
        weightedPointsLost: total === 0 ? 0 : ((total - correct) / total) * d.weight,
      };
    })
    .sort((a, b) => a.index - b.index);
}

/** Colour band for a domain row (PLAN.md §11.2). */
export type ScoreBand = 'strong' | 'fair' | 'weak';

export const scoreBand = (percent: number): ScoreBand =>
  percent >= 80 ? 'strong' : percent >= 60 ? 'fair' : 'weak';

export interface SessionScore {
  rawScore: number;
  rawTotal: number;
  rawPercent: number;
  scaled: number;
  passed: boolean;
  domains: DomainScore[];
}

export function scoreSession(
  items: GradedItem[],
  domains: DomainMeta[],
  passingScaledScore = SCALE_PASS,
  passThreshold = DEFAULT_PASS_THRESHOLD,
): SessionScore {
  const rawTotal = items.length;
  const rawScore = items.filter((i) => i.isCorrect).length;
  const scaled = scaledScore(rawScore, rawTotal, passThreshold);

  return {
    rawScore,
    rawTotal,
    rawPercent: rawTotal === 0 ? 0 : (rawScore / rawTotal) * 100,
    scaled,
    passed: didPass(scaled, passingScaledScore),
    domains: domainBreakdown(items, domains),
  };
}
