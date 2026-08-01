import { SCALE_MAX, SCALE_MIN } from '@/lib/scoring';

/**
 * Inline scaled-score trend (PLAN.md §9.2). Pure SVG — no chart library on the
 * dashboard's critical path.
 */
export function Sparkline({
  values,
  passLine,
  width = 260,
  height = 40,
}: {
  values: number[];
  passLine?: number;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;

  const pad = 3;
  const span = SCALE_MAX - SCALE_MIN;
  const x = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v: number) =>
    height - pad - ((Math.min(SCALE_MAX, Math.max(SCALE_MIN, v)) - SCALE_MIN) / span) * (height - pad * 2);

  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values.at(-1)!;
  const improving = last >= values[0];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-10 w-full"
      role="img"
      aria-label={`Scaled scores: ${values.join(', ')}`}
      preserveAspectRatio="none"
    >
      {passLine !== undefined && (
        <line
          x1={0}
          x2={width}
          y1={y(passLine)}
          y2={y(passLine)}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="3 3"
          className="text-muted-foreground/40"
        />
      )}
      <polyline
        points={points}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={improving ? 'stroke-success' : 'stroke-danger'}
      />
      <circle
        cx={x(values.length - 1)}
        cy={y(last)}
        r={2.5}
        className={improving ? 'fill-success' : 'fill-danger'}
      />
    </svg>
  );
}
