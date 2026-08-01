import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { auth } from '@/auth';
import { getHistory } from '@/lib/queries';
import { ExamMode, TimingMode } from '@/lib/enums';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { formatDuration } from '@/lib/utils';

export const metadata: Metadata = { title: 'History' };
export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const rows = await getHistory(session.user.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="mt-1 text-muted-foreground">
          Every completed sitting. Select one to see its full breakdown.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <p className="text-muted-foreground">You haven&apos;t completed an exam yet.</p>
            <Button asChild>
              <Link href="/exams/new">Start your first exam</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Exam</th>
                  <th className="px-3 py-3 font-medium">Mode</th>
                  <th className="px-3 py-3 font-medium">Timing</th>
                  <th className="px-3 py-3 text-right font-medium">Raw</th>
                  <th className="px-3 py-3 text-right font-medium">Scaled</th>
                  <th className="px-3 py-3 text-right font-medium">Time</th>
                  <th className="px-5 py-3 text-right font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent"
                  >
                    <td className="px-5 py-3">
                      <Link href={`/results/${row.id}`} className="block hover:underline">
                        {row.submittedAt ? format(row.submittedAt, 'd MMM yyyy, HH:mm') : '—'}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone="primary">{row.examCode}</Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {row.mode === ExamMode.REAL ? 'Real' : 'Mock'}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {row.timing === TimingMode.TIMED ? 'Timed' : 'Un-timed'}
                    </td>
                    <td className="tabular px-3 py-3 text-right">
                      {row.rawScore ?? '—'}/{row.rawTotal ?? '—'}
                    </td>
                    <td className="tabular px-3 py-3 text-right font-medium">
                      {row.scaledScore ?? '—'}
                    </td>
                    <td className="tabular px-3 py-3 text-right text-muted-foreground">
                      {row.durationSeconds !== null ? formatDuration(row.durationSeconds) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {row.status === 'EXPIRED' && <Badge tone="warning">Expired</Badge>}{' '}
                      <Badge tone={row.passed ? 'success' : 'danger'}>
                        {row.passed ? 'Passed' : 'Not passed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
