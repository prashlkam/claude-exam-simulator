import { NextResponse } from 'next/server';
import { probeDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * App Service health probe (PLAN.md §12.1).
 *
 * Distinguishes `resuming` from `down` so a serverless auto-pause resume is not
 * mistaken for an outage — the probe stays 200 while the database is waking.
 */
export async function GET() {
  const db = await probeDb();
  const healthy = db === 'up' || db === 'resuming';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      db,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
