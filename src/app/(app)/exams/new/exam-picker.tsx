'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Clock, InfinityIcon, Loader2 } from 'lucide-react';
import { Alert, Badge, Button, Card } from '@/components/ui';
import { ExamMode, TimingMode } from '@/lib/enums';
import { cn } from '@/lib/utils';

export interface PickerExam {
  code: string;
  title: string;
  realItemCount: number;
  mockItemCount: number;
  durationMinutes: number;
  mockDurationMinutes: number;
  bankSize: number;
  domainCount: number;
}

/**
 * Select Exam dialog (PLAN.md §9.3): exam -> length -> timing, all on one screen with a
 * live summary so the exact shape of the sitting is visible before committing.
 */
export function ExamPicker({
  exams,
  initialCode,
}: {
  exams: PickerExam[];
  initialCode?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode ?? exams[0]?.code ?? '');
  const [mode, setMode] = useState<ExamMode>(ExamMode.MOCK);
  const [timing, setTiming] = useState<TimingMode>(TimingMode.TIMED);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exam = exams.find((e) => e.code === code);
  const itemCount = exam
    ? mode === ExamMode.REAL
      ? exam.realItemCount
      : exam.mockItemCount
    : 0;
  const minutes = exam
    ? mode === ExamMode.REAL
      ? exam.durationMinutes
      : exam.mockDurationMinutes
    : 0;

  async function begin() {
    if (!exam) return;
    setError(null);
    setPending(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examCode: code, mode, timing }),
      });
      const data = (await response.json()) as { sessionId?: string; error?: string };
      if (!response.ok || !data.sessionId) {
        setError(data.error ?? 'Could not start the exam.');
        return;
      }
      router.push(`/exam/${data.sessionId}`);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <Alert tone="danger">{error}</Alert>}

      <Section step={1} title="Certification">
        <div className="grid gap-3">
          {exams.map((e) => (
            <OptionCard
              key={e.code}
              selected={e.code === code}
              onSelect={() => setCode(e.code)}
              name="exam"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="primary">{e.code}</Badge>
                  </div>
                  <p className="mt-1.5 font-medium leading-snug">{e.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {e.realItemCount} items · {e.durationMinutes} min · {e.domainCount} domains ·{' '}
                    {e.bankSize}-question bank
                  </p>
                </div>
              </div>
            </OptionCard>
          ))}
        </div>
      </Section>

      <Section step={2} title="Length">
        <div className="grid gap-3 sm:grid-cols-2">
          <OptionCard
            selected={mode === ExamMode.MOCK}
            onSelect={() => setMode(ExamMode.MOCK)}
            name="mode"
          >
            <p className="font-medium">Mock test</p>
            <p className="text-sm text-muted-foreground">Half length</p>
            <p className="mt-1.5 tabular text-sm font-medium text-primary">
              {exam?.mockItemCount ?? 0} questions
            </p>
          </OptionCard>

          <OptionCard
            selected={mode === ExamMode.REAL}
            onSelect={() => setMode(ExamMode.REAL)}
            name="mode"
          >
            <p className="font-medium">Real exam</p>
            <p className="text-sm text-muted-foreground">Full length</p>
            <p className="mt-1.5 tabular text-sm font-medium text-primary">
              {exam?.realItemCount ?? 0} questions
            </p>
          </OptionCard>
        </div>
      </Section>

      <Section step={3} title="Timing">
        <div className="grid gap-3 sm:grid-cols-2">
          <OptionCard
            selected={timing === TimingMode.UNTIMED}
            onSelect={() => setTiming(TimingMode.UNTIMED)}
            name="timing"
          >
            <p className="flex items-center gap-2 font-medium">
              <InfinityIcon className="h-4 w-4" /> Un-timed
            </p>
            <p className="text-sm text-muted-foreground">No time limit</p>
          </OptionCard>

          <OptionCard
            selected={timing === TimingMode.TIMED}
            onSelect={() => setTiming(TimingMode.TIMED)}
            name="timing"
          >
            <p className="flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4" /> Actual exam time
            </p>
            <p className="text-sm text-muted-foreground">Countdown clock</p>
            <p className="mt-1.5 tabular text-sm font-medium text-primary">{minutes} minutes</p>
          </OptionCard>
        </div>
      </Section>

      <Card className="sticky bottom-4 flex flex-col gap-3 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{code}</span> ·{' '}
          {mode === ExamMode.REAL ? 'Real Exam' : 'Mock Test'} ·{' '}
          <span className="tabular">{itemCount}</span> questions ·{' '}
          {timing === TimingMode.TIMED ? `${minutes} minutes` : 'un-timed'}
        </p>
        <Button onClick={begin} disabled={pending || !exam} size="lg" className="shrink-0">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? 'Preparing…' : 'Begin'}
        </Button>
      </Card>
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function OptionCard({
  selected,
  onSelect,
  name,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        'relative cursor-pointer rounded-lg border p-4 transition-colors',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border bg-card hover:bg-accent',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </span>
      )}
      {children}
    </label>
  );
}
