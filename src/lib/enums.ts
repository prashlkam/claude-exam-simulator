import { z } from 'zod';

/**
 * SQL Server has no native enum type and Prisma doesn't support `enum` on the
 * sqlserver provider (PLAN.md §6.1 rule 2, §6.3).
 *
 * Const objects give the same autocomplete, exhaustiveness checking and Zod
 * integration that Prisma enums would, so application code reads identically to
 * how it would against Postgres. The database enforces the same values via CHECK
 * constraints added in the `add_check_constraints` migration.
 */

export const ExamMode = { MOCK: 'MOCK', REAL: 'REAL' } as const;
export const TimingMode = { TIMED: 'TIMED', UNTIMED: 'UNTIMED' } as const;
export const QuestionType = { SINGLE: 'SINGLE', MULTI: 'MULTI' } as const;
export const SessionStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  EXPIRED: 'EXPIRED',
  ABANDONED: 'ABANDONED',
} as const;

export type ExamMode = (typeof ExamMode)[keyof typeof ExamMode];
export type TimingMode = (typeof TimingMode)[keyof typeof TimingMode];
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export const zExamMode = z.nativeEnum(ExamMode);
export const zTimingMode = z.nativeEnum(TimingMode);
export const zQuestionType = z.nativeEnum(QuestionType);
export const zSessionStatus = z.nativeEnum(SessionStatus);

/**
 * Prisma's typed client returns bare `string` for these columns. These casts are the
 * single boundary where that happens — nothing downstream sees an unnarrowed string.
 */
export const asExamMode = (v: string): ExamMode => zExamMode.parse(v);
export const asTimingMode = (v: string): TimingMode => zTimingMode.parse(v);
export const asQuestionType = (v: string): QuestionType => zQuestionType.parse(v);
export const asSessionStatus = (v: string): SessionStatus => zSessionStatus.parse(v);

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;
export type OptionLetter = (typeof OPTION_LETTERS)[number];
export const zOptionLetter = z.enum(OPTION_LETTERS);
