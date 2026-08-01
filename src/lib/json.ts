import { z } from 'zod';
import { zOptionLetter } from './enums';

/**
 * Prisma's `Json` scalar is unsupported on the sqlserver provider (PLAN.md §6.1 rule 3,
 * §6.4). JSON columns are NVarChar(Max) and go through these helpers, which validate on
 * read so a malformed snapshot fails loudly at the boundary rather than silently
 * rendering a broken question.
 */

export const OptionSnapshot = z.object({
  letter: zOptionLetter,
  text: z.string(),
});

/** Exactly four options — an invariant verified across all 540 questions (PLAN.md §2.1). */
export const OptionsSnapshot = z.array(OptionSnapshot).length(4);

export type OptionSnapshot = z.infer<typeof OptionSnapshot>;
export type OptionsSnapshot = z.infer<typeof OptionsSnapshot>;

export const packJson = <T>(value: T): string => JSON.stringify(value);

export const unpackJson = <T>(raw: string, schema: z.ZodType<T>): T =>
  schema.parse(JSON.parse(raw));
