'use client';

import { format } from 'date-fns';
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { SCALE_MAX, SCALE_MIN } from '@/lib/scoring';
import { ExamMode } from '@/lib/enums';
import type { AttemptPoint } from '@/lib/results';

/** Scaled-score trend across sittings, with the pass line marked (PLAN.md §11.3). */
export function ImprovementChart({
  history,
  passingScaledScore,
}: {
  history: AttemptPoint[];
  passingScaledScore: number;
}) {
  if (history.length < 2) return null;

  const data = history.map((point, index) => ({
    label: `#${index + 1}`,
    scaled: point.scaled,
    date: format(point.submittedAt, 'd MMM yyyy'),
    mode: point.mode === ExamMode.REAL ? 'Real Exam' : 'Mock Test',
    raw: `${point.rawScore}/${point.rawTotal}`,
    isCurrent: point.isCurrent,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Improvement over time</CardTitle>
        <p className="text-sm text-muted-foreground">
          Every sitting for this certification, oldest first.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[SCALE_MIN, SCALE_MAX]}
                ticks={[100, 400, 720, 1000]}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine
                y={passingScaledScore}
                strokeDasharray="5 4"
                className="stroke-success"
                label={{
                  value: `Pass ${passingScaledScore}`,
                  position: 'insideTopRight',
                  fontSize: 11,
                  fill: 'currentColor',
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  fontSize: 12,
                }}
                formatter={(value: number) => [value, 'Scaled']}
                labelFormatter={(_label, payload) => {
                  const p = payload?.[0]?.payload as (typeof data)[number] | undefined;
                  return p ? `${p.date} · ${p.mode} · ${p.raw}` : '';
                }}
              />
              <Line
                type="monotone"
                dataKey="scaled"
                strokeWidth={2}
                className="stroke-primary"
                dot={(props) => {
                  const { cx, cy, index } = props as { cx: number; cy: number; index: number };
                  const point = data[index];
                  return (
                    <Dot
                      key={index}
                      cx={cx}
                      cy={cy}
                      r={point?.isCurrent ? 5 : 3}
                      className={point?.isCurrent ? 'fill-primary stroke-primary' : 'fill-primary'}
                    />
                  );
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
