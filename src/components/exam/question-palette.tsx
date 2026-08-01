'use client';

import type { RunnerItem } from '@/lib/runner';
import { cn } from '@/lib/utils';

/** Numbered jump grid, colour-coded by state (PLAN.md §9.4). */
export function QuestionPalette({
  items,
  current,
  onJump,
  className,
}: {
  items: RunnerItem[];
  current: number;
  onJump: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="grid grid-cols-8 gap-1.5 lg:grid-cols-6">
        {items.map((item, index) => {
          const answered = item.selectedLetters.length > 0;
          const isCurrent = index === current;
          return (
            <button
              key={item.questionId}
              type="button"
              onClick={() => onJump(index)}
              aria-current={isCurrent ? 'true' : undefined}
              aria-label={`Question ${index + 1}${answered ? ', answered' : ', unanswered'}${
                item.flagged ? ', flagged' : ''
              }`}
              className={cn(
                'tabular relative flex h-8 items-center justify-center rounded text-xs font-medium transition-colors',
                isCurrent && 'ring-2 ring-ring ring-offset-1 ring-offset-background',
                answered
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:bg-accent',
              )}
            >
              {index + 1}
              {item.flagged && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-warning ring-2 ring-background" />
              )}
            </button>
          );
        })}
      </div>

      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
          <dt>Answered</dt>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-border bg-card" />
          <dt>Unanswered</dt>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
          <dt>Flagged</dt>
        </div>
      </dl>
    </div>
  );
}
