'use client';

import { useMemo, useState } from 'react';
import { Check, Flag, Info, X } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { QuestionType } from '@/lib/enums';
import type { ReviewItem } from '@/lib/results';
import { cn } from '@/lib/utils';

type Filter = 'incorrect' | 'skipped' | 'flagged' | 'all';

/** Wrong-answer review with rationales (PLAN.md §11.5). */
export function AnswerReview({ items }: { items: ReviewItem[] }) {
  const [filter, setFilter] = useState<Filter>('incorrect');
  const [domain, setDomain] = useState<string>('all');

  const domains = useMemo(
    () =>
      [...new Map(items.map((i) => [i.domainIndex, i.domainName])).entries()].sort(
        (a, b) => a[0] - b[0],
      ),
    [items],
  );

  const counts = useMemo(
    () => ({
      incorrect: items.filter((i) => !i.isCorrect && i.answered).length,
      skipped: items.filter((i) => !i.answered).length,
      flagged: items.filter((i) => i.flagged).length,
      all: items.length,
    }),
    [items],
  );

  const visible = useMemo(() => {
    return items.filter((item) => {
      if (domain !== 'all' && String(item.domainIndex) !== domain) return false;
      switch (filter) {
        case 'incorrect':
          return !item.isCorrect && item.answered;
        case 'skipped':
          return !item.answered;
        case 'flagged':
          return item.flagged;
        case 'all':
          return true;
      }
    });
  }, [items, filter, domain]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'incorrect', label: `Incorrect (${counts.incorrect})` },
    { key: 'skipped', label: `Skipped (${counts.skipped})` },
    { key: 'flagged', label: `Flagged (${counts.flagged})` },
    { key: 'all', label: `All (${counts.all})` },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Answer review</CardTitle>
        <p className="text-sm text-muted-foreground">
          Options are shown in the order you saw them, with the official rationale.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? 'primary' : 'outline'}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            aria-label="Filter by domain"
            className="h-9 rounded-md border border-input bg-card px-2.5 text-sm"
          >
            <option value="all">All domains</option>
            {domains.map(([index, name]) => (
              <option key={index} value={String(index)}>
                D{index} · {name}
              </option>
            ))}
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-md bg-success-muted px-4 py-6 text-center text-sm text-success">
            {filter === 'incorrect'
              ? 'Nothing incorrect here — well done.'
              : 'No questions match this filter.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {visible.map((item) => (
              <ReviewCard key={item.questionId} item={item} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const selected = new Set(item.selectedLetters);
  const correct = new Set(item.correctLetters);

  return (
    <li className="rounded-lg border border-border p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="tabular text-xs text-muted-foreground">Q{item.position + 1}</span>
        <Badge tone="outline">D{item.domainIndex}</Badge>
        <span className="text-xs text-muted-foreground">{item.domainName}</span>
        {item.type === QuestionType.MULTI && <Badge tone="primary">Select TWO</Badge>}
        {item.flagged && (
          <Badge tone="warning">
            <Flag className="mr-1 inline h-3 w-3" />
            Flagged
          </Badge>
        )}
        <span className="ml-auto">
          {item.isCorrect ? (
            <Badge tone="success">Correct</Badge>
          ) : item.answered ? (
            <Badge tone="danger">Incorrect</Badge>
          ) : (
            <Badge tone="neutral">Skipped</Badge>
          )}
        </span>
      </div>

      <p className="mb-3 leading-relaxed font-medium">{item.stem}</p>

      <ul className="mb-3 flex flex-col gap-1.5">
        {item.options.map((option, slot) => {
          const isCorrect = correct.has(option.letter);
          const wasSelected = selected.has(option.letter);
          return (
            <li
              key={option.letter}
              className={cn(
                'flex items-start gap-2.5 rounded-md border px-3 py-2 text-sm',
                isCorrect
                  ? 'border-success/35 bg-success-muted'
                  : wasSelected
                    ? 'border-danger/35 bg-danger-muted'
                    : 'border-transparent bg-muted/50',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                  isCorrect
                    ? 'bg-success text-white'
                    : wasSelected
                      ? 'bg-danger text-white'
                      : 'border border-border text-muted-foreground',
                )}
              >
                {isCorrect ? (
                  <Check className="h-3 w-3" />
                ) : wasSelected ? (
                  <X className="h-3 w-3" />
                ) : (
                  String.fromCharCode(65 + slot)
                )}
              </span>
              <span className="pt-px leading-relaxed">{option.text}</span>
              {wasSelected && (
                <span className="ml-auto shrink-0 self-center text-[11px] font-medium text-muted-foreground">
                  your answer
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2.5 rounded-md bg-muted px-3 py-2.5 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="leading-relaxed">{item.explanation}</p>
          {item.subTopic && (
            <p className="mt-1.5 text-xs text-muted-foreground">{item.subTopic}</p>
          )}
        </div>
      </div>
    </li>
  );
}
