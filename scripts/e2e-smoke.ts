/**
 * End-to-end smoke: drives a real sitting through the HTTP API the browser uses,
 * then asserts the security and scoring invariants from PLAN.md §13 and §10.
 */
import { PrismaClient } from '@prisma/client';

const BASE = 'http://localhost:3000';
const EMAIL = 'prashlkam@gmail.com';
const PASSWORD = 'exam-sim-test-2026';

const cookies: Record<string, string> = {};

const cookieHeader = () =>
  Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');

function capture(res: Response) {
  for (const [key, value] of res.headers) {
    if (key.toLowerCase() !== 'set-cookie') continue;
    for (const part of value.split(/,(?=[^;]+?=)/)) {
      const [pair] = part.split(';');
      const idx = pair.indexOf('=');
      if (idx > 0) cookies[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
    }
  }
}

async function req(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    redirect: 'manual',
    headers: { ...(init.headers ?? {}), cookie: cookieHeader() },
  });
  capture(res);
  return res;
}

const results: { name: string; ok: boolean; detail: string }[] = [];
const check = (name: string, ok: boolean, detail = '') => results.push({ name, ok, detail });

async function main() {
  const prisma = new PrismaClient();

  // --- sign in ------------------------------------------------------------
  const csrfRes = await req('/api/auth/csrf');
  const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };

  await req('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrfToken, email: EMAIL, password: PASSWORD, redirect: 'false' }),
  });

  const session = (await (await req('/api/auth/session')).json()) as { user?: { id: string } };
  check('sign in', Boolean(session.user?.id), session.user?.id ?? 'no session');
  if (!session.user?.id) return finish(prisma);

  // --- start a CCAO-F mock, timed ----------------------------------------
  const createRes = await req('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examCode: 'CCAO-F', mode: 'MOCK', timing: 'TIMED' }),
  });
  const { sessionId } = (await createRes.json()) as { sessionId: string };
  check('create mock session', Boolean(sessionId), sessionId);

  // --- SECURITY: the runner page must not contain answers -----------------
  const pageHtml = await (await req(`/exam/${sessionId}`)).text();

  const items = await prisma.sessionItem.findMany({
    where: { sessionId },
    orderBy: { position: 'asc' },
    select: {
      questionId: true,
      optionOrder: true,
      question: {
        select: {
          type: true,
          explanation: true,
          options: { select: { letter: true, isCorrect: true } },
        },
      },
    },
  });

  const leakedExplanations = items.filter((i) =>
    pageHtml.includes(i.question.explanation.slice(0, 45)),
  ).length;
  check('no rationale text in runner payload', leakedExplanations === 0, `${leakedExplanations} leaked`);
  check(
    'no isCorrect flag in runner payload',
    !/isCorrect/i.test(pageHtml),
    /isCorrect/i.test(pageHtml) ? 'found isCorrect' : 'clean',
  );

  // --- answer everything; deliberately get a known subset wrong ------------
  let expectedCorrect = 0;
  const skipEvery = 7; // leave some unanswered
  const wrongEvery = 3; // answer some incorrectly

  for (const [index, item] of items.entries()) {
    if (index % skipEvery === 0) continue; // skipped -> incorrect

    const key = item.question.options.filter((o) => o.isCorrect).map((o) => o.letter);
    const wrongPool = item.question.options.filter((o) => !o.isCorrect).map((o) => o.letter);

    let selected: string[];
    if (index % wrongEvery === 0) {
      selected = item.question.type === 'MULTI' ? wrongPool.slice(0, 2) : wrongPool.slice(0, 1);
    } else {
      selected = key;
      expectedCorrect++;
    }

    const res = await req(`/api/sessions/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: item.questionId, selectedLetters: selected }),
    });
    if (!res.ok) check(`answer q${index}`, false, `HTTP ${res.status}`);
  }

  // --- answers must survive a reload (persistence) ------------------------
  const persisted = await prisma.sessionItem.count({
    where: { sessionId, selectedLetters: { not: null } },
  });
  check('answers persisted', persisted === items.length - Math.ceil(items.length / skipEvery),
    `${persisted} saved of ${items.length}`);

  // --- reject an option that was never offered ----------------------------
  const badRes = await req(`/api/sessions/${sessionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: items[0].questionId, selectedLetters: ['A', 'B', 'C'] }),
  });
  check('rejects over-selection', badRes.status === 400, `HTTP ${badRes.status}`);

  // --- heartbeat returns authoritative time -------------------------------
  const hb = (await (
    await req(`/api/sessions/${sessionId}/heartbeat`, { method: 'POST' })
  ).json()) as { remainingSeconds: number; status: string };
  check('heartbeat returns remaining time', hb.remainingSeconds > 0 && hb.remainingSeconds <= 3600,
    `${hb.remainingSeconds}s, status=${hb.status}`);

  // --- submit -------------------------------------------------------------
  const submitted = (await (
    await req(`/api/sessions/${sessionId}/submit`, { method: 'POST' })
  ).json()) as { rawScore: number; rawTotal: number; scaledScore: number; passed: boolean };

  check('score matches expectation', submitted.rawScore === expectedCorrect,
    `got ${submitted.rawScore}, expected ${expectedCorrect} of ${submitted.rawTotal}`);

  // --- idempotent submit ---------------------------------------------------
  const again = (await (
    await req(`/api/sessions/${sessionId}/submit`, { method: 'POST' })
  ).json()) as { rawScore: number; alreadySubmitted?: boolean };
  check('submit is idempotent', again.rawScore === submitted.rawScore && Boolean(again.alreadySubmitted),
    `raw ${again.rawScore}, alreadySubmitted=${again.alreadySubmitted}`);

  // --- writes are refused after submit ------------------------------------
  const afterRes = await req(`/api/sessions/${sessionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: items[0].questionId, selectedLetters: ['A'] }),
  });
  check('answers refused after submit', afterRes.status === 409, `HTTP ${afterRes.status}`);

  // --- domain totals must reconcile with the sitting ----------------------
  const graded = await prisma.sessionItem.findMany({
    where: { sessionId },
    select: { isCorrect: true, question: { select: { domain: { select: { index: true } } } } },
  });
  const perDomain = new Map<number, { c: number; t: number }>();
  for (const g of graded) {
    const k = g.question.domain.index;
    const e = perDomain.get(k) ?? { c: 0, t: 0 };
    e.t++;
    if (g.isCorrect) e.c++;
    perDomain.set(k, e);
  }
  const domainTotal = [...perDomain.values()].reduce((s, e) => s + e.t, 0);
  const domainCorrect = [...perDomain.values()].reduce((s, e) => s + e.c, 0);
  check('domain totals reconcile',
    domainTotal === submitted.rawTotal && domainCorrect === submitted.rawScore,
    `domains ${domainCorrect}/${domainTotal} vs session ${submitted.rawScore}/${submitted.rawTotal}`);

  // --- results page renders and DOES include rationales -------------------
  const resultsHtml = await (await req(`/results/${sessionId}`)).text();
  const shown = items.filter((i) => resultsHtml.includes(i.question.explanation.slice(0, 45))).length;
  check('results page includes rationales', shown > 0, `${shown} rationales rendered`);

  console.log(`\nSitting: ${submitted.rawScore}/${submitted.rawTotal} raw, scaled ${submitted.scaledScore}, passed=${submitted.passed}`);
  console.log(`Domain allocation: [${[...perDomain.entries()].sort((a,b)=>a[0]-b[0]).map(([,e])=>e.t).join(', ')}]`);

  await finish(prisma);
}

async function finish(prisma: PrismaClient) {
  console.log('');
  let failed = 0;
  for (const r of results) {
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
    if (!r.ok) failed++;
  }
  console.log(failed === 0 ? '\nAll E2E checks passed.' : `\n${failed} check(s) failed.`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main();
