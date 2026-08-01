import { allocateByWeight, durationFor, itemCountFor, type DomainWeight } from './blueprint';
import { ExamMode, TimingMode, type OptionLetter } from './enums';
import { generateSeed, rngFor, sample, shuffle } from './rng';
import { packJson } from './json';
import { prisma, withDb } from './db';

/**
 * Build a sitting (PLAN.md §3.2, §7).
 *
 * Question selection is domain-proportional; question order and per-question option order
 * are shuffled with a seeded PRNG and PERSISTED, so a reload, a resume after a crash, and
 * the results screen all replay the identical order.
 */

export interface BuiltSession {
  sessionId: string;
  itemCount: number;
  durationMinutes: number | null;
  endsAt: Date | null;
}

export async function createExamSession(params: {
  userId: string;
  examCode: string;
  mode: ExamMode;
  timing: TimingMode;
}): Promise<BuiltSession> {
  const { userId, examCode, mode, timing } = params;

  const exam = await withDb(() =>
    prisma.exam.findUnique({
      where: { code: examCode },
      select: {
        id: true,
        realItemCount: true,
        durationMinutes: true,
        domains: {
          select: {
            id: true,
            index: true,
            name: true,
            weight: true,
            _count: { select: { questions: true } },
          },
          orderBy: { index: 'asc' },
        },
      },
    }),
  );

  if (!exam) throw new Error(`Unknown exam code: ${examCode}`);

  const itemCount = itemCountFor(exam.realItemCount, mode);

  const weights: DomainWeight[] = exam.domains.map((d) => ({
    index: d.index,
    name: d.name,
    weight: d.weight,
    available: d._count.questions,
  }));
  const allocations = allocateByWeight(weights, itemCount);
  const domainIdByIndex = new Map(exam.domains.map((d) => [d.index, d.id]));

  const seed = generateSeed();

  // --- pick questions, domain by domain -----------------------------------
  const picked: { id: string; stem: string; options: { letter: string; text: string }[] }[] = [];

  for (const allocation of allocations) {
    if (allocation.allocated === 0) continue;
    const domainId = domainIdByIndex.get(allocation.index)!;

    const pool = await withDb(() =>
      prisma.question.findMany({
        where: { domainId },
        select: {
          id: true,
          stem: true,
          options: { select: { letter: true, text: true }, orderBy: { letter: 'asc' } },
        },
        orderBy: { number: 'asc' },
      }),
    );

    const chosen = sample(pool, allocation.allocated, rngFor(seed, `domain:${allocation.index}`));
    picked.push(...chosen);
  }

  // --- shuffle question order and each question's options -----------------
  const ordered = shuffle(picked, rngFor(seed, 'questions'));

  const now = new Date();
  const durationMinutes =
    timing === TimingMode.TIMED ? durationFor(exam.durationMinutes, mode) : null;
  const endsAt = durationMinutes ? new Date(now.getTime() + durationMinutes * 60_000) : null;

  const sessionId = await withDb(async () => {
    const created = await prisma.examSession.create({
      data: {
        userId,
        examId: exam.id,
        mode,
        timing,
        itemCount: ordered.length,
        durationMinutes,
        seed,
        startedAt: now,
        endsAt,
        lastSeenAt: now,
      },
      select: { id: true },
    });

    await prisma.sessionItem.createMany({
      data: ordered.map((question, position) => {
        const optionOrder = shuffle(
          question.options.map((o) => o.letter as OptionLetter),
          rngFor(seed, `options:${question.id}`),
        );

        // Snapshot in DISPLAY order so the results screen shows exactly what was seen.
        const byLetter = new Map(question.options.map((o) => [o.letter, o.text]));
        const snapshot = optionOrder.map((letter) => ({
          letter,
          text: byLetter.get(letter) ?? '',
        }));

        return {
          sessionId: created.id,
          questionId: question.id,
          position,
          optionOrder: optionOrder.join(','),
          stemSnapshot: question.stem,
          optionsSnapshot: packJson(snapshot),
        };
      }),
    });

    return created.id;
  });

  return { sessionId, itemCount: ordered.length, durationMinutes, endsAt };
}
