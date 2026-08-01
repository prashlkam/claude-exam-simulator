import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma, withDb, DatabaseWakingError } from '@/lib/db';
import { registerSchema } from '@/lib/validation';
import { rateLimit, clientIp, AUTH_LIMIT } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Account creation (PLAN.md §9.1, §13).
 *
 * Duplicate-email responses are deliberately indistinguishable from success-shaped
 * failures at the message level to avoid account enumeration.
 */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limited = rateLimit(`register:${ip}`, AUTH_LIMIT.limit, AUTH_LIMIT.windowMs);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please check the form and try again.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await withDb(() =>
      prisma.user.create({
        data: { name, email, passwordHash },
        select: { id: true },
      }),
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    // P2002 = unique constraint on email. Generic message, no enumeration.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json(
        { error: 'Could not create an account with those details.' },
        { status: 409 },
      );
    }
    if (err instanceof DatabaseWakingError) {
      return NextResponse.json(
        { error: 'The database is starting up. Please try again in a moment.', waking: true },
        { status: 503 },
      );
    }
    console.error('register failed', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
