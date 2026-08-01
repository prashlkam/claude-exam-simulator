import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getRunnerSession } from '@/lib/runner';
import { SessionStatus } from '@/lib/enums';
import { ExamRunner } from '@/components/exam/exam-runner';

export const metadata: Metadata = { title: 'Exam in progress' };
export const dynamic = 'force-dynamic';

export default async function ExamPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const auth_ = await auth();
  if (!auth_?.user?.id) redirect('/login');

  const { sessionId } = await params;
  const session = await getRunnerSession(sessionId, auth_.user.id);

  if (!session) notFound();

  // A finished sitting always shows results, never the runner.
  if (session.status !== SessionStatus.IN_PROGRESS) {
    redirect(`/results/${sessionId}`);
  }

  return <ExamRunner session={session} />;
}
