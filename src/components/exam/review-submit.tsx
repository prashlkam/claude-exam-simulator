'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronLeft, Loader2 } from 'lucide-react';
import { Alert, Button, Card, CardContent } from '@/components/ui';
import { QuestionPalette } from './question-palette';
import type { RunnerItem } from '@/lib/runner';

/** Review screen + confirm dialog (PLAN.md §9.4). */
export function ReviewSubmit({
  items,
  answered,
  flagged,
  submitting,
  onJump,
  onBack,
  onSubmit,
}: {
  items: RunnerItem[];
  answered: number;
  flagged: number;
  submitting: boolean;
  onJump: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const unanswered = items.length - answered;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-3">
          <ChevronLeft className="h-4 w-4" /> Back to questions
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Review &amp; submit</h1>
        <p className="mt-1 text-muted-foreground">
          Check anything you left blank or flagged before submitting.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Summary label="Answered" value={answered} total={items.length} tone="success" />
        <Summary label="Unanswered" value={unanswered} total={items.length} tone={unanswered > 0 ? 'danger' : 'neutral'} />
        <Summary label="Flagged" value={flagged} total={items.length} tone={flagged > 0 ? 'warning' : 'neutral'} />
      </div>

      {unanswered > 0 && (
        <Alert tone="warning">
          <span className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {unanswered} question{unanswered === 1 ? '' : 's'} left unanswered. Unanswered
              items are scored as incorrect — there is no penalty for guessing.
            </span>
          </span>
        </Alert>
      )}

      <Card className="p-4">
        <QuestionPalette items={items} current={-1} onJump={onJump} />
      </Card>

      {confirming ? (
        <Card className="border-primary/40">
          <CardContent className="flex flex-col gap-4 p-5">
            <div>
              <p className="font-medium">Submit this exam?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You cannot change your answers afterwards.
                {unanswered > 0 && (
                  <>
                    {' '}
                    <span className="font-medium text-danger">
                      {unanswered} unanswered question{unanswered === 1 ? '' : 's'} will be marked
                      incorrect.
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={onSubmit} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Submitting…' : 'Yes, submit'}
              </Button>
              <Button variant="outline" onClick={() => setConfirming(false)} disabled={submitting}>
                Keep working
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => setConfirming(true)}>
            Submit exam
          </Button>
          <Button size="lg" variant="outline" onClick={onBack}>
            Keep working
          </Button>
        </div>
      )}
    </div>
  );
}

function Summary({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: 'success' | 'danger' | 'warning' | 'neutral';
}) {
  const tones = {
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    neutral: 'text-foreground',
  } as const;
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`tabular mt-1 text-2xl font-semibold ${tones[tone]}`}>{value}</p>
      <p className="tabular text-xs text-muted-foreground">of {total}</p>
    </Card>
  );
}
