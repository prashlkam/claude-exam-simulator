'use client';

import { Check, Flag } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { QuestionType, type OptionLetter } from '@/lib/enums';
import type { RunnerItem } from '@/lib/runner';
import { cn } from '@/lib/utils';

/**
 * A single exam item (PLAN.md §9.4).
 *
 * Displayed labels are always A-D by slot; the underlying original letters are what get
 * persisted, so scoring never depends on display order (PLAN.md §7).
 *
 * No feedback of any kind is shown during the exam — this is a simulator, not a trainer.
 */
export function QuestionCard({
  item,
  index,
  total,
  onSelect,
  onToggleFlag,
  onClear,
}: {
  item: RunnerItem;
  index: number;
  total: number;
  onSelect: (letters: OptionLetter[]) => void;
  onToggleFlag: () => void;
  onClear: () => void;
}) {
  const isMulti = item.type === QuestionType.MULTI;
  const selected = new Set(item.selectedLetters);

  function toggle(letter: OptionLetter) {
    if (!isMulti) {
      onSelect(selected.has(letter) ? [] : [letter]);
      return;
    }
    const next = new Set(selected);
    if (next.has(letter)) {
      next.delete(letter);
    } else {
      // Multi-response items in these banks always ask for exactly two.
      if (next.size >= 2) return;
      next.add(letter);
    }
    onSelect([...next]);
  }

  const atMultiLimit = isMulti && selected.size >= 2;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="tabular text-sm font-medium text-muted-foreground">
            Question {index + 1} of {total}
          </span>
          {isMulti && <Badge tone="primary">Select TWO</Badge>}
        </div>
        <Button
          variant={item.flagged ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleFlag}
          aria-pressed={item.flagged}
        >
          <Flag className={cn('h-4 w-4', item.flagged && 'fill-warning text-warning')} />
          <span className="hidden sm:inline">{item.flagged ? 'Flagged' : 'Flag'}</span>
        </Button>
      </div>

      <h2 className="text-lg leading-relaxed font-medium">{item.stem}</h2>

      <div
        role={isMulti ? 'group' : 'radiogroup'}
        aria-label="Answer options"
        className="flex flex-col gap-2.5"
      >
        {item.options.map((option, slot) => {
          const displayLetter = String.fromCharCode(65 + slot);
          const isSelected = selected.has(option.letter);
          const blocked = atMultiLimit && !isSelected;

          return (
            <button
              key={option.letter}
              type="button"
              role={isMulti ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              aria-disabled={blocked}
              onClick={() => toggle(option.letter)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border bg-card hover:bg-accent',
                blocked && 'opacity-55',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center text-xs font-semibold',
                  isMulti ? 'rounded' : 'rounded-full',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground',
                )}
              >
                {isSelected ? <Check className="h-3.5 w-3.5" /> : displayLetter}
              </span>
              <span className="pt-0.5 leading-relaxed">{option.text}</span>
            </button>
          );
        })}
      </div>

      {isMulti && (
        <p className="text-xs text-muted-foreground">
          This item requires exactly two answers. Both must be correct to score.
        </p>
      )}

      {selected.size > 0 && (
        <div>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            Clear selection
          </Button>
        </div>
      )}
    </div>
  );
}
