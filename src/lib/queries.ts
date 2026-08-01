import { prisma, withDb } from './db';
import { SessionStatus, type ExamMode, type TimingMode } from './enums';

/** Read models for the dashboard and history screens (PLAN.md §9.2, §9.6). */

export interface ExamOverview {
  id: string;
  code: string;
  title: string;
  realItemCount: number;
  mockItemCount: number;
  durationMinutes: number;
  bankSize: number;
  domainCount: number;
  attempts: number;
  bestScaled: number | null;
  lastScaled: number | null;
  lastAttemptAt: Date | null;
  lastPassed: boolean | null;
  /** Most recent scaled scores, oldest first — drives the sparkline. */
  recentScores: number[];
  weakestDomain: { name: string; percent: number } | null;
}

interface DomainAggRow {
  examId: string;
  domainId: string;
  name: string;
  correct: number;
  total: number;
}

export async function getExamOverviews(userId: string): Promise<ExamOverview[]> {
  const [exams, sessions, domainAgg] = await withDb(() =>
    Promise.all([
      prisma.exam.findMany({
        orderBy: { code: 'asc' },
        select: {
          id: true,
          code: true,
          title: true,
          realItemCount: true,
          durationMinutes: true,
          bankSize: true,
          _count: { select: { domains: true } },
        },
      }),
      prisma.examSession.findMany({
        where: { userId, status: SessionStatus.SUBMITTED },
        orderBy: { submittedAt: 'asc' },
        select: { examId: true, scaledScore: true, passed: true, submittedAt: true },
      }),
      // Per-domain aggregate across every submitted sitting. Prisma cannot group by a
      // field on a related model, so this is a raw query.
      prisma.$queryRaw<DomainAggRow[]>`
        SELECT d.[examId]                                        AS [examId],
               d.[id]                                            AS [domainId],
               d.[name]                                          AS [name],
               SUM(CASE WHEN si.[isCorrect] = 1 THEN 1 ELSE 0 END) AS [correct],
               COUNT(*)                                          AS [total]
        FROM [SessionItem] si
        JOIN [ExamSession] es ON es.[id] = si.[sessionId]
        JOIN [Question]    q  ON q.[id]  = si.[questionId]
        JOIN [Domain]      d  ON d.[id]  = q.[domainId]
        WHERE es.[userId] = ${userId} AND es.[status] = 'SUBMITTED'
        GROUP BY d.[examId], d.[id], d.[name]
      `,
    ]),
  );

  const weakestByExam = new Map<string, { name: string; percent: number }>();
  for (const row of domainAgg) {
    const total = Number(row.total);
    if (total === 0) continue;
    const percent = (Number(row.correct) / total) * 100;
    const current = weakestByExam.get(row.examId);
    if (!current || percent < current.percent) {
      weakestByExam.set(row.examId, { name: row.name, percent });
    }
  }

  return exams.map((exam) => {
    const mine = sessions.filter((s) => s.examId === exam.id);
    const scores = mine.map((s) => s.scaledScore).filter((s): s is number => s !== null);
    const last = mine.at(-1);

    return {
      id: exam.id,
      code: exam.code,
      title: exam.title,
      realItemCount: exam.realItemCount,
      mockItemCount: Math.ceil(exam.realItemCount / 2),
      durationMinutes: exam.durationMinutes,
      bankSize: exam.bankSize,
      domainCount: exam._count.domains,
      attempts: mine.length,
      bestScaled: scores.length > 0 ? Math.max(...scores) : null,
      lastScaled: last?.scaledScore ?? null,
      lastAttemptAt: last?.submittedAt ?? null,
      lastPassed: last?.passed ?? null,
      recentScores: scores.slice(-5),
      weakestDomain: weakestByExam.get(exam.id) ?? null,
    };
  });
}

export interface ResumableSession {
  id: string;
  examCode: string;
  examTitle: string;
  mode: ExamMode;
  timing: TimingMode;
  itemCount: number;
  answered: number;
  endsAt: Date | null;
  startedAt: Date;
}

export async function getResumableSession(userId: string): Promise<ResumableSession | null> {
  const session = await withDb(() =>
    prisma.examSession.findFirst({
      where: { userId, status: SessionStatus.IN_PROGRESS },
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        mode: true,
        timing: true,
        itemCount: true,
        endsAt: true,
        startedAt: true,
        exam: { select: { code: true, title: true } },
        _count: { select: { items: { where: { selectedLetters: { not: null } } } } },
      },
    }),
  );

  if (!session) return null;

  return {
    id: session.id,
    examCode: session.exam.code,
    examTitle: session.exam.title,
    mode: session.mode as ExamMode,
    timing: session.timing as TimingMode,
    itemCount: session.itemCount,
    answered: session._count.items,
    endsAt: session.endsAt,
    startedAt: session.startedAt,
  };
}

export interface HistoryRow {
  id: string;
  examCode: string;
  mode: ExamMode;
  timing: TimingMode;
  status: string;
  rawScore: number | null;
  rawTotal: number | null;
  scaledScore: number | null;
  passed: boolean | null;
  submittedAt: Date | null;
  startedAt: Date;
  durationSeconds: number | null;
}

export async function getHistory(userId: string): Promise<HistoryRow[]> {
  const rows = await withDb(() =>
    prisma.examSession.findMany({
      where: { userId, status: { in: [SessionStatus.SUBMITTED, SessionStatus.EXPIRED] } },
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        mode: true,
        timing: true,
        status: true,
        rawScore: true,
        rawTotal: true,
        scaledScore: true,
        passed: true,
        startedAt: true,
        submittedAt: true,
        exam: { select: { code: true } },
      },
    }),
  );

  return rows.map((r) => ({
    id: r.id,
    examCode: r.exam.code,
    mode: r.mode as ExamMode,
    timing: r.timing as TimingMode,
    status: r.status,
    rawScore: r.rawScore,
    rawTotal: r.rawTotal,
    scaledScore: r.scaledScore,
    passed: r.passed,
    startedAt: r.startedAt,
    submittedAt: r.submittedAt,
    durationSeconds: r.submittedAt
      ? Math.round((r.submittedAt.getTime() - r.startedAt.getTime()) / 1000)
      : null,
  }));
}
