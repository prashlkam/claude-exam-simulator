import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma, withDb, warmDb } from '@/lib/db';
import { ExamPicker, type PickerExam } from './exam-picker';

export const metadata: Metadata = { title: 'Choose an exam' };
export const dynamic = 'force-dynamic';

export default async function NewExamPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const params = await searchParams;

  // Prewarm so the database is awake before the sitting starts (PLAN.md §6.6).
  void warmDb();

  const rows = await withDb(() =>
    prisma.exam.findMany({
      orderBy: { code: 'asc' },
      select: {
        code: true,
        title: true,
        realItemCount: true,
        durationMinutes: true,
        bankSize: true,
        _count: { select: { domains: true } },
      },
    }),
  );

  const exams: PickerExam[] = rows.map((e) => ({
    code: e.code,
    title: e.title,
    realItemCount: e.realItemCount,
    mockItemCount: Math.ceil(e.realItemCount / 2),
    durationMinutes: e.durationMinutes,
    mockDurationMinutes: Math.ceil(e.durationMinutes / 2),
    bankSize: e.bankSize,
    domainCount: e._count.domains,
  }));

  const initial = exams.some((e) => e.code === params.exam) ? params.exam : exams[0]?.code;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Choose an exam</h1>
      <p className="mt-1 text-muted-foreground">
        Questions are drawn to match each certification&apos;s published domain weights.
      </p>
      <div className="mt-6">
        <ExamPicker exams={exams} initialCode={initial} />
      </div>
    </div>
  );
}
