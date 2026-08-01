'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { DomainRow } from '@/lib/results';
import { cn } from '@/lib/utils';

/** Radar overlay + per-domain table with deltas (PLAN.md §11.2). */
export function DomainBreakdown({
  domains,
  hasPrevious,
}: {
  domains: DomainRow[];
  hasPrevious: boolean;
}) {
  const chartData = domains.map((d) => ({
    domain: `D${d.index}`,
    fullName: d.name,
    current: Number(d.percent.toFixed(1)),
    previous: d.delta !== null ? Number((d.percent - d.delta).toFixed(1)) : null,
  }));

  const bandClasses = {
    strong: 'text-success',
    fair: 'text-warning',
    weak: 'text-danger',
  } as const;

  const barClasses = {
    strong: 'bg-success',
    fair: 'bg-warning',
    weak: 'bg-danger',
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Weighted by the published blueprint. Domains are listed in blueprint order.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius="72%">
              <PolarGrid className="stroke-border" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              {hasPrevious && (
                <Radar
                  name="Previous"
                  dataKey="previous"
                  className="fill-muted-foreground stroke-muted-foreground"
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )}
              <Radar
                name="This attempt"
                dataKey="current"
                className="fill-primary stroke-primary"
                fillOpacity={0.28}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {hasPrevious && (
          <div className="flex justify-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm bg-primary" /> This attempt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm bg-muted-foreground/40" /> Previous
            </span>
          </div>
        )}

        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Domain</th>
                <th className="pb-2 px-3 text-right font-medium">Weight</th>
                <th className="pb-2 px-3 text-right font-medium">Score</th>
                <th className="pb-2 px-3 text-right font-medium">%</th>
                {hasPrevious && <th className="pb-2 px-3 text-right font-medium">Δ</th>}
                <th className="pb-2 pl-3 font-medium">Strength</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.domainId} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3">
                    <span className="text-muted-foreground">D{d.index}</span>{' '}
                    <span className="font-medium">{d.name}</span>
                  </td>
                  <td className="tabular px-3 py-2.5 text-right text-muted-foreground">
                    {d.weight}%
                  </td>
                  <td className="tabular px-3 py-2.5 text-right">
                    {d.correct}/{d.total}
                  </td>
                  <td className={cn('tabular px-3 py-2.5 text-right font-medium', bandClasses[d.band])}>
                    {d.percent.toFixed(0)}%
                  </td>
                  {hasPrevious && (
                    <td className="tabular px-3 py-2.5 text-right">
                      {d.delta === null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className={d.delta >= 0 ? 'text-success' : 'text-danger'}>
                          {d.delta >= 0 ? '+' : ''}
                          {d.delta.toFixed(0)}
                        </span>
                      )}
                    </td>
                  )}
                  <td className="py-2.5 pl-3">
                    <div className="h-2 w-full min-w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full rounded-full', barClasses[d.band])}
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
