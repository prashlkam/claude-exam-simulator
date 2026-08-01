'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ListChecks, Loader2 } from 'lucide-react';
import { Alert, Badge, Button, Card, ProgressBar } from '@/components/ui';
import { ExamTimer } from './exam-timer';
import { QuestionCard } from './question-card';
import { QuestionPalette } from './question-palette';
import { ReviewSubmit } from './review-submit';
import { ExamMode, type OptionLetter } from '@/lib/enums';
import type { RunnerSession, RunnerItem } from '@/lib/runner';

const HEARTBEAT_MS = 20_000;

/**
 * Exam runner (PLAN.md §8, §9.4).
 *
 * Answers save as they are chosen (optimistic UI + a per-question in-flight guard), so a
 * browser crash loses nothing. The timer is server-authoritative; this component only
 * renders the deadline and asks the server to submit when it passes.
 */
export function ExamRunner({ session }: { session: RunnerSession }) {
  const router = useRouter();

  const [items, setItems] = useState<RunnerItem[]>(session.items);
  const [current, setCurrent] = useState(() => {
    const firstUnanswered = session.items.findIndex((i) => i.selectedLetters.length === 0);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Server clock offset, refreshed by each heartbeat (PLAN.md §8).
  const [skewMs, setSkewMs] = useState(
    () => new Date(session.serverNow).getTime() - Date.now(),
  );

  const submittedRef = useRef(false);
  const item = items[current];

  const answeredCount = useMemo(
    () => items.filter((i) => i.selectedLetters.length > 0).length,
    [items],
  );
  const flaggedCount = useMemo(() => items.filter((i) => i.flagged).length, [items]);

  // --- persistence -------------------------------------------------------
  const saveAnswer = useCallback(
    async (questionId: string, letters: OptionLetter[]) => {
      try {
        const response = await fetch(`/api/sessions/${session.id}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, selectedLetters: letters }),
        });
        if (response.status === 409) {
          const data = (await response.json()) as { expired?: boolean };
          if (data.expired) {
            setNotice('Time expired. Your answers were submitted automatically.');
            router.push(`/results/${session.id}`);
          }
        }
      } catch {
        setNotice('Could not save that answer. Check your connection — it will retry on the next change.');
      }
    },
    [session.id, router],
  );

  const select = useCallback(
    (letters: OptionLetter[]) => {
      setItems((prev) =>
        prev.map((i, idx) => (idx === current ? { ...i, selectedLetters: letters } : i)),
      );
      void saveAnswer(items[current].questionId, letters);
    },
    [current, items, saveAnswer],
  );

  const toggleFlag = useCallback(() => {
    const target = items[current];
    const flagged = !target.flagged;
    setItems((prev) => prev.map((i, idx) => (idx === current ? { ...i, flagged } : i)));
    void fetch(`/api/sessions/${session.id}/flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: target.questionId, flagged }),
    }).catch(() => undefined);
  }, [current, items, session.id]);

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/sessions/${session.id}/submit`, { method: 'POST' });
      if (!response.ok) throw new Error('submit failed');
      router.push(`/results/${session.id}`);
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
      setNotice('Could not submit. Please try again.');
    }
  }, [session.id, router]);

  // --- heartbeat ---------------------------------------------------------
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const response = await fetch(`/api/sessions/${session.id}/heartbeat`, { method: 'POST' });
        if (!response.ok) return;
        const data = (await response.json()) as { status: string; serverNow: string };
        setSkewMs(new Date(data.serverNow).getTime() - Date.now());
        if (data.status === 'EXPIRED' || data.status === 'SUBMITTED') {
          submittedRef.current = true;
          router.push(`/results/${session.id}`);
        }
      } catch {
        // Offline — the countdown keeps running from the last known deadline.
      }
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [session.id, router]);

  // --- keyboard ----------------------------------------------------------
  useEffect(() => {
    if (reviewing) return;
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const key = event.key.toUpperCase();
      const letterIndex = ['A', 'B', 'C', 'D'].indexOf(key);
      const numberIndex = ['1', '2', '3', '4'].indexOf(event.key);
      const slot = letterIndex !== -1 ? letterIndex : numberIndex;

      if (slot !== -1 && items[current]?.options[slot]) {
        event.preventDefault();
        const letter = items[current].options[slot].letter;
        const currentSelection = items[current].selectedLetters;
        if (items[current].type === 'MULTI') {
          const set = new Set(currentSelection);
          if (set.has(letter)) set.delete(letter);
          else if (set.size < 2) set.add(letter);
          select([...set]);
        } else {
          select(currentSelection.includes(letter) ? [] : [letter]);
        }
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrent((c) => Math.min(items.length - 1, c + 1));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrent((c) => Math.max(0, c - 1));
      } else if (key === 'F') {
        event.preventDefault();
        toggleFlag();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        setCurrent((c) => Math.min(items.length - 1, c + 1));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, items, reviewing, select, toggleFlag]);

  // Warn on accidental tab close while a sitting is live.
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (submittedRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  if (reviewing) {
    return (
      <ReviewSubmit
        items={items}
        answered={answeredCount}
        flagged={flaggedCount}
        submitting={submitting}
        onJump={(index) => {
          setCurrent(index);
          setReviewing(false);
        }}
        onBack={() => setReviewing(false)}
        onSubmit={submit}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {notice && <Alert tone="warning">{notice}</Alert>}

      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="primary">{session.examCode}</Badge>
        <Badge tone="outline">
          {session.mode === ExamMode.REAL ? 'Real Exam' : 'Mock Test'}
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <ExamTimer
            endsAt={session.endsAt}
            startedAt={session.startedAt}
            skewMs={skewMs}
            onExpire={submit}
          />
          <Button variant="outline" size="sm" onClick={() => setReviewing(true)}>
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline">Review &amp; submit</span>
          </Button>
        </div>
      </div>

      <div>
        <ProgressBar value={answeredCount} max={items.length} />
        <p className="mt-1.5 tabular text-xs text-muted-foreground">
          {answeredCount} of {items.length} answered
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
        <Card className="p-6">
          {item && (
            <QuestionCard
              item={item}
              index={current}
              total={items.length}
              onSelect={select}
              onToggleFlag={toggleFlag}
              onClear={() => select([])}
            />
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            {current === items.length - 1 ? (
              <Button onClick={() => setReviewing(true)}>
                Review &amp; submit <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setCurrent((c) => Math.min(items.length - 1, c + 1))}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>

        <Card className="h-fit p-4 lg:sticky lg:top-20">
          <QuestionPalette items={items} current={current} onJump={setCurrent} />
        </Card>
      </div>

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-4 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Grading your exam…</span>
          </div>
        </div>
      )}
    </div>
  );
}
