import { prisma, withDb } from './db';
import { OptionsSnapshot, unpackJson } from './json';
import {
  SessionStatus,
  type ExamMode,
  type OptionLetter,
  type QuestionType,
  type TimingMode,
} from './enums';

/**
 * Runner read model (PLAN.md §7, §13).
 *
 * SECURITY: this projection reads option text ONLY from SessionItem.optionsSnapshot,
 * which by construction holds `{ letter, text }` and nothing else. The Option table —
 * the only place `isCorrect` lives — is never touched here, and neither is
 * Question.explanation. Correct answers therefore cannot reach an in-progress runner
 * even by accident.
 */

/** Grace period before a late answer/submit is rejected (PLAN.md §8). */
export const GRACE_SECONDS = 30;

export interface RunnerItem {
  questionId: string;
  position: number;
  stem: string;
  type: QuestionType;
  /** Display order — already shuffled and persisted. */
  options: { letter: OptionLetter; text: string }[];
  selectedLetters: OptionLetter[];
  flagged: boolean;
}

export interface RunnerSession {
  id: string;
  examCode: string;
  examTitle: string;
  mode: ExamMode;
  timing: TimingMode;
  itemCount: number;
  status: string;
  startedAt: string;
  endsAt: string | null;
  /** Server clock at render time, so the client can correct for skew (PLAN.md §8). */
  serverNow: string;
  items: RunnerItem[];
}

const parseSelected = (raw: string | null): OptionLetter[] =>
  raw ? (raw.split(',').filter(Boolean) as OptionLetter[]) : [];

export async function getRunnerSession(
  sessionId: string,
  userId: string,
): Promise<RunnerSession | null> {
  const session = await withDb(() =>
    prisma.examSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        mode: true,
        timing: true,
        itemCount: true,
        status: true,
        startedAt: true,
        endsAt: true,
        exam: { select: { code: true, title: true } },
        items: {
          orderBy: { position: 'asc' },
          select: {
            questionId: true,
            position: true,
            stemSnapshot: true,
            optionsSnapshot: true,
            selectedLetters: true,
            flagged: true,
            question: { select: { type: true } },
          },
        },
      },
    }),
  );

  // Ownership check before anything is returned (PLAN.md §13).
  if (!session || session.userId !== userId) return null;

  return {
    id: session.id,
    examCode: session.exam.code,
    examTitle: session.exam.title,
    mode: session.mode as ExamMode,
    timing: session.timing as TimingMode,
    itemCount: session.itemCount,
    status: session.status,
    startedAt: session.startedAt.toISOString(),
    endsAt: session.endsAt?.toISOString() ?? null,
    serverNow: new Date().toISOString(),
    items: session.items.map((item) => ({
      questionId: item.questionId,
      position: item.position,
      stem: item.stemSnapshot,
      type: item.question.type as QuestionType,
      options: unpackJson(item.optionsSnapshot, OptionsSnapshot),
      selectedLetters: parseSelected(item.selectedLetters),
      flagged: item.flagged,
    })),
  };
}

export interface OwnedSession {
  id: string;
  userId: string;
  status: string;
  endsAt: Date | null;
  examId: string;
}

/**
 * Shared guard for every session-scoped mutation. Returns a discriminated result rather
 * than throwing so each route can map it to the right status code.
 */
export async function loadOwnedSession(
  sessionId: string,
  userId: string,
): Promise<
  | { ok: true; session: OwnedSession }
  | { ok: false; reason: 'not-found' | 'not-in-progress' | 'expired' }
> {
  const session = await withDb(() =>
    prisma.examSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, status: true, endsAt: true, examId: true },
    }),
  );

  // A foreign session is reported as not-found so ids cannot be probed.
  if (!session || session.userId !== userId) return { ok: false, reason: 'not-found' };

  if (session.status !== SessionStatus.IN_PROGRESS) {
    return { ok: false, reason: 'not-in-progress' };
  }

  // Server-authoritative deadline: the client never decides when time is up.
  if (session.endsAt && Date.now() > session.endsAt.getTime() + GRACE_SECONDS * 1_000) {
    return { ok: false, reason: 'expired' };
  }

  return { ok: true, session };
}

export function remainingSeconds(endsAt: Date | null): number | null {
  if (!endsAt) return null;
  return Math.max(0, Math.round((endsAt.getTime() - Date.now()) / 1000));
}
