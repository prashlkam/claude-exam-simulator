import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma, withDb } from '@/lib/db';
import { flagSchema } from '@/lib/validation';
import { loadOwnedSession } from '@/lib/runner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Toggle "flag for review" (PLAN.md §9.4). */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = flagSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  const guard = await loadOwnedSession(id, session.user.id);
  if (!guard.ok) {
    const status = guard.reason === 'not-found' ? 404 : 409;
    return NextResponse.json({ error: 'Session is not editable.' }, { status });
  }

  await withDb(() =>
    prisma.sessionItem.updateMany({
      where: { sessionId: id, questionId: parsed.data.questionId },
      data: { flagged: parsed.data.flagged },
    }),
  );

  return NextResponse.json({ ok: true });
}
