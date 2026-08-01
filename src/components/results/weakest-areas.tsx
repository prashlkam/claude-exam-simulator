import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { DomainRow } from '@/lib/results';

/**
 * Top 3 domains by WEIGHTED points lost (PLAN.md §11.4).
 *
 * Ranking by weighted loss rather than raw percentage is the point: a 55% score in a
 * 33%-weight domain costs far more than a 40% score in a 3%-weight one.
 */
export function WeakestAreas({ domains }: { domains: DomainRow[] }) {
  const weakest = [...domains]
    .filter((d) => d.total > 0 && d.percent < 100)
    .sort((a, b) => b.weightedPointsLost - a.weightedPointsLost)
    .slice(0, 3);

  if (weakest.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Where to study next</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-success">
            A clean sweep — every domain answered correctly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where to study next</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ranked by blueprint-weighted marks lost, so the highest-value gaps come first.
        </p>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-3">
          {weakest.map((d, rank) => (
            <li key={d.domainId} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                {rank + 1}
              </span>
              <div>
                <p className="font-medium leading-snug">
                  <span className="text-muted-foreground">D{d.index}</span> {d.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {d.weight}% of the exam and you scored {d.percent.toFixed(0)}% (
                  {d.correct}/{d.total}) —{' '}
                  <span className="font-medium text-foreground">
                    {d.weightedPointsLost.toFixed(1)} weighted marks lost
                  </span>
                  .
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <Target className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Closing the first gap alone would move your scaled score the most.
        </p>
      </CardContent>
    </Card>
  );
}
