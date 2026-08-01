import { z } from 'zod';
import { zExamMode, zTimingMode, zOptionLetter } from './enums';

/** Zod schemas for every API boundary (PLAN.md §13). */

export const emailSchema = z
  .string()
  .trim()
  .min(3, 'Enter your email address')
  .max(255, 'Email address is too long')
  .email('Enter a valid email address')
  .transform((v) => v.toLowerCase());

export const passwordSchema = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(200, 'Password is too long');

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name').max(120, 'Name is too long'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password'),
});

export const createSessionSchema = z.object({
  examCode: z.string().trim().min(1).max(16),
  mode: zExamMode,
  timing: zTimingMode,
});

export const answerSchema = z.object({
  questionId: z.string().min(1).max(30),
  /** Original letters (never display slots) — see PLAN.md §7. */
  selectedLetters: z.array(zOptionLetter).max(4),
});

export const flagSchema = z.object({
  questionId: z.string().min(1).max(30),
  flagged: z.boolean(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;

/**
 * Rough password strength for the register form's meter. Deliberately advisory —
 * the enforced rule is the 10-character minimum above.
 */
export function passwordStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (password.length >= 10) score++;
  if (password.length >= 14) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'] as const;
  const clamped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  return { score: clamped, label: labels[clamped] };
}
