import { format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import { SCALE_MAX, SCALE_MIN } from '@/lib/scoring';
import { ExamMode, TimingMode } from '@/lib/enums';
import { formatDuration } from '@/lib/utils';
import type { ResultsView } from '@/lib/results';

/** Score hero with a radial gauge and the pass line marked (PLAN.md §11.1). */
export function ScoreHero({ results }: { results: ResultsView }) {
  const {
    scaled,
    passed,
    rawScore,
    rawTotal,
    rawPercent,
    passingScaledScore,
    scaledDelta,
    previous,
  } = results;

  const fraction = (scaled - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  const passFraction = (passingScaledScore - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);

  // 3/4 arc (270°) starting bottom-left.
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const arc = 0.75;
  const dash = circumference * arc;

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
        <div className="relative shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200" role="img"
               aria-label={`Scaled score ${scaled} out of ${SCALE_MAX}. Pass mark ${passingScaledScore}.`}>
            <g transform="rotate(135 100 100)">
              <circle
                cx="100" cy="100" r={radius} fill="none" strokeWidth="14" strokeLinecap="round"
                className="stroke-muted"
                strokeDasharray={`${dash} ${circumference}`}
              />
              <circle
                cx="100" cy="100" r={radius} fill="none" strokeWidth="14" strokeLinecap="round"
                className={passed ? 'stroke-success' : 'stroke-danger'}
                strokeDasharray={`${dash * Math.max(0, Math.min(1, fraction))} ${circumference}`}
              />
              {/* Pass-mark tick */}
              <circle
                cx="100" cy="100" r={radius} fill="none" strokeWidth="18" strokeLinecap="butt"
                className="stroke-foreground/50"
                strokeDasharray={`2 ${circumference}`}
                strokeDashoffset={-dash * passFraction}
              />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="tabular text-4xl font-bold tracking-tight">{scaled}</span>
            <span className="text-xs text-muted-foreground">of {SCALE_MAX}</span>
            <span className="tabular mt-1 text-xs text-muted-foreground">
              pass {passingScaledScore}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-4 text-center md:items-start md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge tone={passed ? 'success' : 'danger'} className="px-3 py-1 text-sm">
              {passed ? 'PASSED' : 'NOT PASSED'}
            </Badge>
            <Badge tone="primary">{results.examCode}</Badge>
            <Badge tone="outline">
              {results.mode === ExamMode.REAL ? 'Real Exam' : 'Mock Test'}
            </Badge>
            <Badge tone="outline">
              {results.timing === TimingMode.TIMED ? 'Timed' : 'Un-timed'}
            </Badge>
            {results.status === 'EXPIRED' && <Badge tone="warning">Time expired</Badge>}
          </div>

          <div>
            <p className="tabular text-2xl font-semibold">
              {rawScore} / {rawTotal}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                {rawPercent.toFixed(1)}% correct
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDuration(results.elapsedSeconds)} taken
              {results.allowedSeconds && ` of ${formatDuration(results.allowedSeconds)} allowed`}
            </p>
          </div>

          {scaledDelta !== null && previous && (
            <p
              className={`flex items-center gap-1.5 text-sm font-medium ${
                scaledDelta >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {scaledDelta >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="tabular">
                {scaledDelta >= 0 ? '+' : ''}
                {scaledDelta}
              </span>
              <span className="font-normal text-muted-foreground">
                since {format(previous.submittedAt, 'd MMM')}
              </span>
            </p>
          )}

          <p className="max-w-md text-xs text-muted-foreground">
            The scaled score is an approximation — this simulator is not equated to the live
            exam. Treat the raw percentage and the domain breakdown as the reliable signals.
          </p>
        </div>
      </div>
    </Card>
  );
}
