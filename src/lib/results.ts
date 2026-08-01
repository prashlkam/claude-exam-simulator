import { prisma, withDb } from './db';
import { OptionsSnapshot, unpackJson } from './json';
import { SessionStatus, type ExamMode, type OptionLetter, type QuestionType, type TimingMode } from './enums';
import { domainBreakdown, scoreBand, type DomainScore, type ScoreBand } from './scoring';

/**
 * Results read model (PLAN.md §11).
 *
 * Only reachable once a session is closed. Correct answers and rationales are attached
 * here — and nowhere else — which is why the runner projection (lib/runner.ts) reads a
 * different, snapshot-only shape.
 */

export interface ReviewItem {
  questionId: string;
  position: number;
  stem: string;
  type: QuestionType;
  /** Display order, exactly as it was shown during the exam. */
  options: { letter: OptionLetter; text: string }[];
  selectedLetters: OptionLetter[];
  correctLetters: OptionLetter[];
  isCorrect: boolean;
  answered: boolean;
  flagged: boolean;
  explanation: string;
  domainName: string;
  domainIndex: number;
  subTopic: string | null;
}

export interface DomainRow extends DomainScore {
  band: ScoreBand;
  /** Percentage-point change against the previous sitting, null if this is the first. */
  delta: number | null;
}

export interface AttemptPoint {
  sessionId: string;
  scaled: number;
  rawScore: number;
  rawTotal: number;
  mode: ExamMode;
  submittedAt: Date;
  isCurrent: boolean;
}

export interface ResultsView {
  sessionId: string;
  examCode: string;
  examTitle: string;
  mode: ExamMode;
  timing: TimingMode;
  status: string;
  passingScaledScore: number;

  rawScore: number;
  rawTotal: number;
  rawPercent: number;
  scaled: number;
  passed: boolean;

  startedAt: Date;
  submittedAt: Date | null;
  elapsedSeconds: number;
  allowedSeconds: number | null;

  domains: DomainRow[];
  previous: { scaled: number; submittedAt: Date } | null;
  scaledDelta: number | null;
  history: AttemptPoint[];
  items: ReviewItem[];
}

export async function getResults(
  sessionId: string,
  userId: string,
): Promise<ResultsView | null> {
  const session = await withDb(() =>
    prisma.examSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        examId: true,
        mode: true,
        timing: true,
        status: true,
        rawScore: true,
        rawTotal: true,
        scaledScore: true,
        passed: true,
        startedAt: true,
        submittedAt: true,
        durationMinutes: true,
        exam: {
          select: {
            code: true,
            title: true,
            passingScaledScore: true,
            domains: {
              select: { id: true, index: true, name: true, weight: true },
              orderBy: { index: 'asc' },
            },
          },
        },
        items: {
          orderBy: { position: 'asc' },
          select: {
            questionId: true,
            position: true,
            stemSnapshot: true,
            optionsSnapshot: true,
            selectedLetters: true,
            isCorrect: true,
            flagged: true,
            question: {
              select: {
                type: true,
                explanation: true,
                subTopic: true,
                domainId: true,
                domain: { select: { index: true, name: true } },
                options: { where: { isCorrect: true }, select: { letter: true } },
              },
            },
          },
        },
      },
    }),
  );

  if (!session || session.userId !== userId) return null;
  if (session.status === SessionStatus.IN_PROGRESS) return null;

  const items: ReviewItem[] = session.items.map((item) => {
    const selected = item.selectedLetters
      ? (item.selectedLetters.split(',').filter(Boolean) as OptionLetter[])
      : [];
    return {
      questionId: item.questionId,
      position: item.position,
      stem: item.stemSnapshot,
      type: item.question.type as QuestionType,
      options: unpackJson(item.optionsSnapshot, OptionsSnapshot),
      selectedLetters: selected,
      correctLetters: item.question.options.map((o) => o.letter as OptionLetter),
      isCorrect: item.isCorrect ?? false,
      answered: selected.length > 0,
      flagged: item.flagged,
      explanation: item.question.explanation,
      domainName: item.question.domain.name,
      domainIndex: item.question.domain.index,
      subTopic: item.question.subTopic,
    };
  });

  const graded = session.items.map((i) => ({
    questionId: i.questionId,
    domainId: i.question.domainId,
    isCorrect: i.isCorrect ?? false,
    answered: Boolean(i.selectedLetters),
  }));

  const currentDomains = domainBreakdown(graded, session.exam.domains);

  // --- previous sitting, for deltas ---------------------------------------
  const priorSessions = await withDb(() =>
    prisma.examSession.findMany({
      where: {
        userId,
        examId: session.examId,
        status: { in: [SessionStatus.SUBMITTED, SessionStatus.EXPIRED] },
        submittedAt: { not: null },
      },
      orderBy: { submittedAt: 'asc' },
      select: {
        id: true,
        scaledScore: true,
        rawScore: true,
        rawTotal: true,
        mode: true,
        submittedAt: true,
      },
    }),
  );

  const currentIndex = priorSessions.findIndex((s) => s.id === session.id);
  const previousRow = currentIndex > 0 ? priorSessions[currentIndex - 1] : null;

  let previousDomains: DomainScore[] = [];
  if (previousRow) {
    const prevItems = await withDb(() =>
      prisma.sessionItem.findMany({
        where: { sessionId: previousRow.id },
        select: {
          questionId: true,
          isCorrect: true,
          selectedLetters: true,
          question: { select: { domainId: true } },
        },
      }),
    );
    previousDomains = domainBreakdown(
      prevItems.map((i) => ({
        questionId: i.questionId,
        domainId: i.question.domainId,
        isCorrect: i.isCorrect ?? false,
        answered: Boolean(i.selectedLetters),
      })),
      session.exam.domains,
    );
  }

  const previousByDomain = new Map(previousDomains.map((d) => [d.domainId, d]));

  const domains: DomainRow[] = currentDomains.map((d) => {
    const prev = previousByDomain.get(d.domainId);
    return {
      ...d,
      band: scoreBand(d.percent),
      delta: prev && prev.total > 0 ? d.percent - prev.percent : null,
    };
  });

  const rawScore = session.rawScore ?? 0;
  const rawTotal = session.rawTotal ?? session.items.length;
  const scaled = session.scaledScore ?? 0;

  const elapsedSeconds = session.submittedAt
    ? Math.max(0, Math.round((session.submittedAt.getTime() - session.startedAt.getTime()) / 1000))
    : 0;

  return {
    sessionId: session.id,
    examCode: session.exam.code,
    examTitle: session.exam.title,
    mode: session.mode as ExamMode,
    timing: session.timing as TimingMode,
    status: session.status,
    passingScaledScore: session.exam.passingScaledScore,

    rawScore,
    rawTotal,
    rawPercent: rawTotal === 0 ? 0 : (rawScore / rawTotal) * 100,
    scaled,
    passed: session.passed ?? false,

    startedAt: session.startedAt,
    submittedAt: session.submittedAt,
    elapsedSeconds,
    allowedSeconds: session.durationMinutes ? session.durationMinutes * 60 : null,

    domains,
    previous:
      previousRow && previousRow.scaledScore !== null && previousRow.submittedAt
        ? { scaled: previousRow.scaledScore, submittedAt: previousRow.submittedAt }
        : null,
    scaledDelta:
      previousRow && previousRow.scaledScore !== null ? scaled - previousRow.scaledScore : null,
    history: priorSessions
      .filter((s) => s.scaledScore !== null && s.submittedAt !== null)
      .map((s) => ({
        sessionId: s.id,
        scaled: s.scaledScore!,
        rawScore: s.rawScore ?? 0,
        rawTotal: s.rawTotal ?? 0,
        mode: s.mode as ExamMode,
        submittedAt: s.submittedAt!,
        isCurrent: s.id === session.id,
      })),
    items,
  };
}
