import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma, withDb } from '@/lib/db';
import { answerSchema } from '@/lib/validation';
import { loadOwnedSession } from '@/lib/runner';
import { submitSession } from '@/lib/submit';
import { QuestionType } from '@/lib/enums';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Save a selection (PLAN.md §8 — answers persist as they are chosen). */
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

  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid answer.' }, { status: 400 });

  const guard = await loadOwnedSession(id, session.user.id);
  if (!guard.ok) {
    if (guard.reason === 'expired') {
      // Time ran out while the answer was in flight — close the session and score
      // whatever was already saved.
      await submitSession(id, { expired: true });
      return NextResponse.json({ error: 'Time expired.', expired: true }, { status: 409 });
    }
    const status = guard.reason === 'not-found' ? 404 : 409;
    return NextResponse.json({ error: 'Session is not accepting answers.' }, { status });
  }

  const item = await withDb(() =>
    prisma.sessionItem.findUnique({
      where: { sessionId_questionId: { sessionId: id, questionId: parsed.data.questionId } },
      select: { id: true, optionOrder: true, question: { select: { type: true } } },
    }),
  );
  if (!item) return NextResponse.json({ error: 'Question not in this exam.' }, { status: 404 });

  // Selections must be letters actually offered for this item, and a single-response
  // item can never hold more than one.
  const offered = new Set(item.optionOrder.split(','));
  const unique = [...new Set(parsed.data.selectedLetters)];
  if (unique.some((l) => !offered.has(l))) {
    return NextResponse.json({ error: 'Unknown option.' }, { status: 400 });
  }
  const max = item.question.type === QuestionType.MULTI ? 2 : 1;
  if (unique.length > max) {
    return NextResponse.json({ error: `Select at most ${max}.` }, { status: 400 });
  }

  // Store in canonical order so the same set never produces two different strings.
  const value = unique.length > 0 ? [...unique].sort().join(',') : null;

  await withDb(() =>
    prisma.$transaction([
      prisma.sessionItem.update({
        where: { id: item.id },
        data: { selectedLetters: value, answeredAt: value ? new Date() : null },
      }),
      prisma.examSession.update({ where: { id }, data: { lastSeenAt: new Date() } }),
    ]),
  );

  return NextResponse.json({ ok: true });
}
