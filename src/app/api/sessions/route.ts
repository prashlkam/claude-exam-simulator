import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma, withDb, DatabaseWakingError } from '@/lib/db';
import { createSessionSchema } from '@/lib/validation';
import { createExamSession } from '@/lib/selection';
import { SessionStatus } from '@/lib/enums';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Start a sitting (PLAN.md §9.3). */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid exam options.' }, { status: 400 });
  }

  try {
    // Only one sitting at a time — abandon any earlier one rather than leaving
    // two live timers competing.
    await withDb(() =>
      prisma.examSession.updateMany({
        where: { userId: session.user.id, status: SessionStatus.IN_PROGRESS },
        data: { status: SessionStatus.ABANDONED },
      }),
    );

    const built = await createExamSession({
      userId: session.user.id,
      examCode: parsed.data.examCode,
      mode: parsed.data.mode,
      timing: parsed.data.timing,
    });

    return NextResponse.json({ sessionId: built.sessionId }, { status: 201 });
  } catch (err) {
    if (err instanceof DatabaseWakingError) {
      return NextResponse.json(
        { error: 'The database is starting up. Please try again in a moment.', waking: true },
        { status: 503 },
      );
    }
    console.error('createExamSession failed', err);
    return NextResponse.json({ error: 'Could not start the exam.' }, { status: 500 });
  }
}
