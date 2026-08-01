import { prisma, withDb } from './db';
import { SessionStatus, type OptionLetter } from './enums';
import { isAnswerCorrect, scaledScore, didPass, DEFAULT_PASS_THRESHOLD } from './scoring';

/**
 * Grade and close a sitting (PLAN.md §10).
 *
 * Idempotent: submitting an already-submitted session returns the stored result rather
 * than regrading, so a double-click or a retried auto-submit cannot change a score.
 */

export interface SubmitResult {
  rawScore: number;
  rawTotal: number;
  scaledScore: number;
  passed: boolean;
}

export async function submitSession(
  sessionId: string,
  opts: { expired?: boolean } = {},
): Promise<SubmitResult> {
  const session = await withDb(() =>
    prisma.examSession.findUniqueOrThrow({
      where: { id: sessionId },
      select: {
        id: true,
        status: true,
        rawScore: true,
        rawTotal: true,
        scaledScore: true,
        passed: true,
        exam: { select: { passingScaledScore: true } },
        items: {
          select: {
            id: true,
            selectedLetters: true,
            question: {
              select: { options: { where: { isCorrect: true }, select: { letter: true } } },
            },
          },
        },
      },
    }),
  );

  if (session.status !== SessionStatus.IN_PROGRESS) {
    return {
      rawScore: session.rawScore ?? 0,
      rawTotal: session.rawTotal ?? 0,
      scaledScore: session.scaledScore ?? 0,
      passed: session.passed ?? false,
    };
  }

  const correctIds: string[] = [];
  const incorrectIds: string[] = [];

  for (const item of session.items) {
    const selected = item.selectedLetters
      ? (item.selectedLetters.split(',').filter(Boolean) as OptionLetter[])
      : [];
    const key = item.question.options.map((o) => o.letter as OptionLetter);
    (isAnswerCorrect(selected, key) ? correctIds : incorrectIds).push(item.id);
  }

  const rawTotal = session.items.length;
  const rawScore = correctIds.length;
  const scaled = scaledScore(rawScore, rawTotal, DEFAULT_PASS_THRESHOLD);
  const passed = didPass(scaled, session.exam.passingScaledScore);

  await withDb(() =>
    prisma.$transaction([
      // Two bulk updates rather than one per item — 2 round trips instead of 60.
      prisma.sessionItem.updateMany({
        where: { id: { in: correctIds } },
        data: { isCorrect: true },
      }),
      prisma.sessionItem.updateMany({
        where: { id: { in: incorrectIds } },
        data: { isCorrect: false },
      }),
      prisma.examSession.update({
        where: { id: sessionId },
        data: {
          status: opts.expired ? SessionStatus.EXPIRED : SessionStatus.SUBMITTED,
          submittedAt: new Date(),
          rawScore,
          rawTotal,
          scaledScore: scaled,
          passed,
        },
      }),
    ]),
  );

  return { rawScore, rawTotal, scaledScore: scaled, passed };
}
