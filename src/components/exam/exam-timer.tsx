'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatClock } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * Countdown driven by the server-supplied deadline (PLAN.md §8).
 *
 * `skewMs` corrects for a client clock that disagrees with the server, and the heartbeat
 * re-syncs it every 20s. The client never decides when time is up — it only renders it
 * and asks the server to submit.
 */
export function ExamTimer({
  endsAt,
  skewMs,
  onExpire,
  startedAt,
}: {
  endsAt: string | null;
  skewMs: number;
  onExpire: () => void;
  startedAt: string;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  const serverNow = now + skewMs;

  useEffect(() => {
    if (!endsAt || fired) return;
    if (serverNow >= new Date(endsAt).getTime()) {
      setFired(true);
      onExpire();
    }
  }, [serverNow, endsAt, fired, onExpire]);

  if (!endsAt) {
    const elapsed = Math.max(0, Math.round((serverNow - new Date(startedAt).getTime()) / 1000));
    return (
      <div
        className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-sm text-muted-foreground"
        aria-label="Elapsed time"
      >
        <Clock className="h-3.5 w-3.5" />
        <span className="tabular font-medium">{formatClock(elapsed)}</span>
        <span className="hidden sm:inline">elapsed</span>
      </div>
    );
  }

  const remaining = Math.max(0, Math.round((new Date(endsAt).getTime() - serverNow) / 1000));
  const critical = remaining <= 120;
  const low = remaining <= 600;

  return (
    <div
      role="timer"
      aria-live={critical ? 'assertive' : 'off'}
      aria-label={`Time remaining: ${formatClock(remaining)}`}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
        critical
          ? 'animate-pulse bg-danger-muted text-danger'
          : low
            ? 'bg-warning-muted text-warning'
            : 'bg-muted text-foreground',
      )}
    >
      <Clock className="h-3.5 w-3.5" />
      <span className="tabular tracking-tight">{formatClock(remaining)}</span>
    </div>
  );
}
