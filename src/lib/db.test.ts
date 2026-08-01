import { describe, expect, it, vi } from 'vitest';
import { DatabaseWakingError, isTransient, withDb } from './db';

/** Serverless resume resilience (PLAN.md §6.5, §15). */

const prismaError = (code: string) => Object.assign(new Error(`prisma ${code}`), { code });

describe('isTransient', () => {
  it('recognises the Prisma connectivity codes', () => {
    for (const code of ['P1001', 'P1002', 'P1008', 'P1017', 'P2024']) {
      expect(isTransient(prismaError(code)), code).toBe(true);
    }
  });

  it('recognises Azure SQL resume/throttle/failover error numbers', () => {
    for (const n of [4060, 10928, 10929, 40197, 40501, 40613, 49918, 49919, 49920]) {
      expect(isTransient(new Error(`Mssql error ${n}: database unavailable`)), String(n)).toBe(true);
    }
  });

  it('recognises socket-level failures during a resume', () => {
    expect(isTransient(new Error('connection reset by peer'))).toBe(true);
    expect(isTransient(new Error('ECONNREFUSED 10.0.0.1:1433'))).toBe(true);
  });

  it('does NOT treat real application errors as transient', () => {
    expect(isTransient(prismaError('P2002'))).toBe(false); // unique constraint
    expect(isTransient(prismaError('P2025'))).toBe(false); // record not found
    expect(isTransient(new Error('syntax error near WHERE'))).toBe(false);
    expect(isTransient(null)).toBe(false);
    expect(isTransient('a string')).toBe(false);
  });
});

describe('withDb', () => {
  it('returns immediately when the operation succeeds', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    await expect(withDb(fn)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries a transient failure and then succeeds', async () => {
    vi.useFakeTimers();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(prismaError('P1001'))
      .mockRejectedValueOnce(prismaError('P1001'))
      .mockResolvedValue('awake');

    const promise = withDb(fn);
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(promise).resolves.toBe('awake');
    expect(fn).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it('rethrows a non-transient error immediately, without retrying', async () => {
    const fn = vi.fn().mockRejectedValue(prismaError('P2002'));
    await expect(withDb(fn)).rejects.toMatchObject({ code: 'P2002' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('gives up at the budget with a DatabaseWakingError', async () => {
    vi.useFakeTimers();
    const fn = vi.fn().mockRejectedValue(prismaError('P1001'));

    const promise = withDb(fn, 5_000);
    const assertion = expect(promise).rejects.toBeInstanceOf(DatabaseWakingError);
    await vi.advanceTimersByTimeAsync(20_000);
    await assertion;

    vi.useRealTimers();
  });

  it('backs off exponentially rather than hammering a resuming database', async () => {
    vi.useFakeTimers();
    const delays: number[] = [];
    let last = Date.now();
    const fn = vi.fn().mockImplementation(() => {
      delays.push(Date.now() - last);
      last = Date.now();
      return Promise.reject(prismaError('P1001'));
    });

    const promise = withDb(fn, 40_000).catch(() => undefined);
    await vi.advanceTimersByTimeAsync(60_000);
    await promise;

    // First call is immediate; subsequent gaps grow (1s -> 2s -> 4s ...).
    expect(delays[1]).toBeGreaterThanOrEqual(1_000);
    expect(delays[2]).toBeGreaterThan(delays[1]);
    expect(delays[3]).toBeGreaterThan(delays[2]);
    vi.useRealTimers();
  });
});
