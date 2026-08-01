import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Clock, PlayCircle } from 'lucide-react';
import { auth } from '@/auth';
import { getExamOverviews, getResumableSession } from '@/lib/queries';
import { SCALE_PASS } from '@/lib/scoring';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Sparkline } from '@/components/results/sparkline';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [exams, resumable] = await Promise.all([
    getExamOverviews(session.user.id),
    getResumableSession(session.user.id),
  ]);

  const firstName = session.user.name?.split(' ')[0] ?? 'there';

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="mt-1 text-muted-foreground">
          Choose a certification to practise. Every sitting mirrors the real blueprint&apos;s
          domain mix.
        </p>
      </div>

      {resumable && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">
                  You have an exam in progress — {resumable.examCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {resumable.answered} of {resumable.itemCount} answered · started{' '}
                  {formatDistanceToNow(resumable.startedAt, { addSuffix: true })}
                  {resumable.endsAt && ' · timed'}
                </p>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <Link href={`/exam/${resumable.id}`}>
                Resume <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <Badge tone="primary">{exam.code}</Badge>
                {exam.lastPassed !== null && (
                  <Badge tone={exam.lastPassed ? 'success' : 'danger'}>
                    {exam.lastPassed ? 'Passed' : 'Not passed'}
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-1 leading-snug">{exam.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {exam.realItemCount} items · {exam.durationMinutes} min · {exam.domainCount} domains
                · {exam.bankSize}-question bank
              </p>
            </CardHeader>

            <CardContent className="mt-auto flex flex-col gap-4">
              {exam.attempts === 0 ? (
                <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                  No attempts yet. A mock test is {exam.mockItemCount} questions.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <Stat label="Attempts" value={String(exam.attempts)} />
                    <Stat
                      label="Best"
                      value={exam.bestScaled !== null ? String(exam.bestScaled) : '—'}
                      tone={
                        exam.bestScaled !== null && exam.bestScaled >= SCALE_PASS
                          ? 'success'
                          : undefined
                      }
                    />
                    <Stat
                      label="Last"
                      value={exam.lastScaled !== null ? String(exam.lastScaled) : '—'}
                    />
                  </div>

                  {exam.recentScores.length > 1 && (
                    <Sparkline values={exam.recentScores} passLine={SCALE_PASS} />
                  )}

                  {exam.weakestDomain && (
                    <p className="text-xs text-muted-foreground">
                      Weakest area:{' '}
                      <span className="font-medium text-foreground">
                        {exam.weakestDomain.name}
                      </span>{' '}
                      ({exam.weakestDomain.percent.toFixed(0)}%)
                    </p>
                  )}

                  {exam.lastAttemptAt && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last attempt {formatDistanceToNow(exam.lastAttemptAt, { addSuffix: true })}
                    </p>
                  )}
                </div>
              )}

              <Button asChild className="w-full">
                <Link href={`/exams/new?exam=${exam.code}`}>Start exam</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'success';
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`tabular text-lg font-semibold ${tone === 'success' ? 'text-success' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
