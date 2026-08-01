import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma, withDb } from '@/lib/db';
import { SessionStatus } from '@/lib/enums';
import { GRACE_SECONDS, remainingSeconds } from '@/lib/runner';
import { submitSession } from '@/lib/submit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Heartbeat (PLAN.md §8).
 *
 * Returns the authoritative remaining time so client clock drift is corrected every 20s,
 * and keeps the database active — which is also what guarantees it cannot auto-pause
 * mid-exam (PLAN.md §6.6).
 */
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

  if (row.status !== SessionStatus.IN_PROGRESS) {
    return NextResponse.json({ status: row.status, remainingSeconds: 0, serverNow: new Date().toISOString() });
  }

  // Past the grace period the server closes the session itself, independently of
  // whether the client's own auto-submit ever fires.
  if (row.endsAt && Date.now() > row.endsAt.getTime() + GRACE_SECONDS * 1_000) {
    await submitSession(id, { expired: true });
    return NextResponse.json({
      status: SessionStatus.EXPIRED,
      remainingSeconds: 0,
      serverNow: new Date().toISOString(),
    });
  }

  await withDb(() =>
    prisma.examSession.update({ where: { id }, data: { lastSeenAt: new Date() } }),
  );

  return NextResponse.json({
    status: row.status,
    remainingSeconds: remainingSeconds(row.endsAt),
    serverNow: new Date().toISOString(),
  });
}
