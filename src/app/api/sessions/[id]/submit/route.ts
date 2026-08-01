import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma, withDb } from '@/lib/db';
import { SessionStatus } from '@/lib/enums';
import { GRACE_SECONDS } from '@/lib/runner';
import { submitSession } from '@/lib/submit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Grade and close the sitting (PLAN.md §10). */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const { id } = await params;

  const row = await withDb(() =>
    prisma.examSession.findUnique({
      where: { id },
      select: { id: true, userId: true, status: true, endsAt: true },
    }),
  );

  if (!row || row.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  // Already closed — submitSession is idempotent and returns the stored result.
  if (row.status !== SessionStatus.IN_PROGRESS) {
    const result = await submitSession(id);
    return NextResponse.json({ ok: true, ...result, alreadySubmitted: true });
  }

  const expired = Boolean(row.endsAt && Date.now() > row.endsAt.getTime() + GRACE_SECONDS * 1_000);
  const result = await submitSession(id, { expired });

  return NextResponse.json({ ok: true, ...result, expired });
}
