import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { auth } from '@/auth';
import { getResults } from '@/lib/results';
import { Button } from '@/components/ui';
import { ScoreHero } from '@/components/results/score-hero';
import { DomainBreakdown } from '@/components/results/domain-breakdown';
import { ImprovementChart } from '@/components/results/improvement-chart';
import { WeakestAreas } from '@/components/results/weakest-areas';
import { AnswerReview } from '@/components/results/answer-review';
import { PrintButton } from '@/components/results/print-button';

export const metadata: Metadata = { title: 'Results' };
export const dynamic = 'force-dynamic';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { sessionId } = await params;
  const results = await getResults(sessionId, session.user.id);

  if (!results) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </Button>
        <div className="ml-auto flex gap-2">
          <PrintButton />
          <Button asChild size="sm">
            <Link href={`/exams/new?exam=${results.examCode}`}>
              <RotateCcw className="h-4 w-4" /> Retake
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{results.examTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {results.submittedAt
            ? `Submitted ${format(results.submittedAt, "d MMM yyyy 'at' HH:mm")}`
            : 'Not submitted'}
        </p>
      </div>

      <ScoreHero results={results} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DomainBreakdown domains={results.domains} hasPrevious={results.previous !== null} />
        <div className="flex flex-col gap-6">
          <WeakestAreas domains={results.domains} />
          <ImprovementChart
            history={results.history}
            passingScaledScore={results.passingScaledScore}
          />
        </div>
      </div>

      <AnswerReview items={results.items} />
    </div>
  );
}
