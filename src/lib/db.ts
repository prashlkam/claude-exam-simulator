import { PrismaClient } from '@prisma/client';

/**
 * Prisma singleton + transient-fault retry (PLAN.md §6.5).
 *
 * Azure SQL's free offer is serverless with auto-pause left at the 1-hour minimum, so
 * the FIRST query after an idle period can take 30-60s while the database resumes.
 * `withDb()` absorbs that so no route handler has to think about it.
 */

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma;

/** Prisma error codes that mean "the server isn't reachable yet", not "your query is wrong". */
const TRANSIENT_PRISMA = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);

/**
 * Azure SQL transient error numbers: resume-in-progress, throttling, failover.
 * https://learn.microsoft.com/azure/azure-sql/database/troubleshoot-common-errors-issues
 */
const TRANSIENT_SQL = new Set([4060, 10928, 10929, 40197, 40501, 40613, 49918, 49919, 49920]);

function isTransient(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;

  const code = (err as { code?: unknown }).code;
  if (typeof code === 'string' && TRANSIENT_PRISMA.has(code)) return true;

  // Prisma surfaces the raw SQL Server error number in the message for P2010/unknown errors.
  const message = (err as { message?: unknown }).message;
  if (typeof message === 'string') {
    for (const n of TRANSIENT_SQL) {
      if (message.includes(String(n))) return true;
    }
    // tiberius/connection-level failures during a resume
    if (/connection (reset|closed|refused)|ECONNREFUSED|ETIMEDOUT|socket hang up/i.test(message)) {
      return true;
    }
  }
  return false;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class DatabaseWakingError extends Error {
  constructor(cause?: unknown) {
    super('The database is resuming from auto-pause. Please try again in a moment.');
    this.name = 'DatabaseWakingError';
    this.cause = cause;
  }
}

/**
 * Run a database operation, retrying transient failures with jittered exponential backoff.
 * Non-transient errors (constraint violations, bad queries) are rethrown untouched and
 * immediately — this never masks a real bug.
 *
 * @param budgetMs total wall-clock budget. Default 75s comfortably covers a serverless resume.
 */
export async function withDb<T>(fn: () => Promise<T>, budgetMs = 75_000): Promise<T> {
  const deadline = Date.now() + budgetMs;
  let delay = 1_000;

  for (;;) {
    try {
      return await fn();
    } catch (err) {
      if (!isTransient(err)) throw err;

      const wait = delay + Math.random() * 250;
      if (Date.now() + wait > deadline) throw new DatabaseWakingError(err);

      await sleep(wait);
      delay = Math.min(delay * 2, 15_000); // 1s -> 2 -> 4 -> 8 -> 15 -> 15 ...
    }
  }
}

/**
 * Probe used by /api/health and the login screen so "warming up" is distinguishable
 * from "broken" (PLAN.md §6.5, §6.6).
 */
export async function probeDb(): Promise<'up' | 'resuming' | 'down'> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'up';
  } catch (err) {
    return isTransient(err) ? 'resuming' : 'down';
  }
}

/** Touch the database so it is already awake before a sitting starts (PLAN.md §6.6). */
export async function warmDb(): Promise<void> {
  try {
    await withDb(() => prisma.$queryRaw`SELECT 1`, 60_000);
  } catch {
    // Warming is best-effort; the caller's own query will surface any real failure.
  }
}

export { isTransient };
