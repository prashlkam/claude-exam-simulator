# Claude Certification Exam Simulator — Implementation Plan

**Version:** 1.1
**Date:** 2026-08-01
**Stack:** Next.js 15 (App Router) + TypeScript + Prisma + **Azure SQL Database** + Tailwind,
deployed to **Azure App Service (Linux)**

> **Changelog v1.1** — database changed from PostgreSQL to **Azure SQL Database (free offer,
> serverless)**. Affects §4, §6, §12, §13, §14, §15, §16. Everything else is unchanged.

---

## 1. Goal

A web application that lets a registered user sit realistic practice exams for the three Claude
certifications, under either mock (half-length) or full-length conditions, timed or untimed, and
then review a detailed, domain-weighted results dashboard that tracks improvement across sessions.

---

## 2. Source data — verified analysis

All three banks live in [`data/`](data/) and were parsed and validated during planning. **The format is
completely regular**, which means a deterministic parser is viable with zero manual cleanup.

| File | Exam code | Bank size | Domains | Real exam | Time | Pass |
|---|---|---|---|---|---|---|
| [`CCAO-F_Practice_Questions.md`](data/CCAO-F_Practice_Questions.md) | CCAO-F (Associate – Foundations) | 160 Q | 7 | 60 items | 120 min | 720 |
| [`CCDV-F_Practice_Questions.md`](data/CCDV-F_Practice_Questions.md) | CCDV-F (Developer – Foundations) | 180 Q | 8 | 53 items | 120 min | 720 |
| [`CCAR-F_Practice_Questions.md`](data/CCAR-F_Practice_Questions.md) | CCAR-F (Architect – Foundations) | 200 Q | 5 | 60 items | 120 min | 720 |

**Total: 540 questions.**

### 2.1 Verified structural invariants

These were checked programmatically against all three files and hold without exception:

- Every question stem matches `**Qn.** <text>` and is **immediately** followed by exactly four
  option lines `A.` `B.` `C.` `D.` — 540 stems, 540 × 4 = 2160 options, no fifth option anywhere,
  no code fences, no multi-line stems.
- Every question has exactly one answer-key line of the form
  `n. **B** — rationale` or `n. **A, B** — rationale`. Counts match the stems exactly
  (160/160, 180/180, 200/200) with **zero** non-conforming lines.
- Multi-response items are marked `**(Select TWO)**` at the start of the stem and correspond
  1:1 with two-letter answer keys: CCAO-F 7↔7, CCDV-F 8↔8, CCAR-F 0↔0.
- Domain sections are `## Domain N: <Name> (Qx–Qy)`, contiguous and covering the whole bank.
- The header of each file contains a domain-weight table and an "Exam facts" line carrying the
  real item count, duration, and passing score.

### 2.2 Structural differences to handle

- **CCAR-F** has a third level of headings (`### Task 1.1: …`) inside each domain; CCDV-F has
  unnamed skill sub-headings (`### Agent Architecture`); CCAO-F has none. The parser must treat
  `###` inside a domain as an **optional** sub-topic label, not a required one.
- **CCDV-F weights are fractional** (`14.7%`, `33.1%`, `3.1%` …) while the others are integers.
  Parse as float.
- Files mix **en dash** (`–`, in `Q1–Q22`) and **em dash** (`—`, in answer rationales). Normalize
  Unicode dashes before regex matching.
- CCAR-F is scenario-flavoured but every item is self-contained — no shared scenario preamble to
  keep together when shuffling. **Shuffling is safe for all three banks.**

---

## 3. Exam configuration & question selection

### 3.1 Length and time

| Exam | Real items | Real time | Mock items (50%) | Mock time |
|---|---|---|---|---|
| CCAO-F | 60 | 120 min | 30 | 60 min |
| CCDV-F | 53 | 120 min | **27** (⌈26.5⌉) | 60 min |
| CCAR-F | 60 | 120 min | 30 | 60 min |

Untimed mode uses the same item counts with no deadline.

### 3.2 Domain-proportional sampling

Questions are **not** drawn uniformly at random from the bank — they are allocated per domain in
proportion to the published blueprint weights, using the **largest-remainder (Hare quota) method**,
so every generated exam mirrors the real blueprint. A guard enforces **≥ 1 item per domain**.

Worked allocations (computed during planning; the app derives these at runtime):

**CCAO-F**

| Domain | Weight | Bank | Real (60) | Mock (30) |
|---|---|---|---|---|
| 1 Prompting and Task Execution | 14% | 22 | 8 | 4 |
| 2 Output Evaluation and Validation | 21% | 34 | 13 | 6 |
| 3 Product and Model Selection | 12% | 19 | 7 | 4 |
| 4 Workflow Integration and Solution Design | 16% | 26 | 10 | 5 |
| 5 Configuration and Knowledge Management | 12% | 19 | 7 | 4 |
| 6 Governance, Risk, and Responsible Use | 15% | 24 | 9 | 4 |
| 7 Troubleshooting and Optimization | 10% | 16 | 6 | 3 |
| **Total** | 100% | 160 | **60** | **30** |

**CCDV-F**

| Domain | Weight | Bank | Real (53) | Mock (27) |
|---|---|---|---|---|
| 1 Agents and Workflows | 14.7% | 26 | 8 | 4 |
| 2 Applications and Integration | 33.1% | 59 | 17 | 9 |
| 3 Claude Code | 3.1% | 6 | 2 | 1 |
| 4 Eval, Testing, and Debugging | 2.6% | 5 | 1 | 1 |
| 5 Model Selection and Optimization | 16.8% | 30 | 9 | 4 |
| 6 Prompt and Context Engineering | 11.0% | 20 | 6 | 3 |
| 7 Security and Safety | 8.1% | 15 | 4 | 2 |
| 8 Tools and MCPs | 10.6% | 19 | 6 | 3 |
| **Total** | 100% | 180 | **53** | **27** |

**CCAR-F**

| Domain | Weight | Bank | Real (60) | Mock (30) |
|---|---|---|---|---|
| 1 Agentic Architecture & Orchestration | 27% | 54 | 16 | 8 |
| 2 Tool Design & MCP Integration | 18% | 36 | 11 | 5 |
| 3 Claude Code Configuration & Workflows | 20% | 40 | 12 | 6 |
| 4 Prompt Engineering & Structured Output | 20% | 40 | 12 | 6 |
| 5 Context Management & Reliability | 15% | 30 | 9 | 5 |
| **Total** | 100% | 200 | **60** | **30** |

Every bank comfortably exceeds its allocation in every domain, so a single sitting never exhausts a
domain's pool.

### 3.3 Anti-repeat bias (nice-to-have, Phase 6)

When selecting within a domain, prefer questions the user has seen least recently / answered
incorrectly, using a weighted draw rather than a hard exclusion. Keeps sittings fresh without
breaking the blueprint proportions.

---

## 4. Architecture

```
┌───────────────────────────────────────────────────────────┐
│  Next.js 15 App Router (single deployable)                │
│                                                           │
│  React Server Components ──► pages, dashboards            │
│  Client Components       ──► exam runner, timer, charts   │
│  Route Handlers (/api)   ──► auth, session, answers       │
│  Server Actions          ──► form submits                 │
└───────────────┬───────────────────────────────────────────┘
                │ Prisma Client
        ┌───────▼────────┐
        │ Azure SQL      │  prod: Azure SQL Database, free offer (GP serverless)
        │ Database       │  dev:  mssql/server:2022 in Docker — same engine,
        └────────────────┘        same Prisma provider, same migration history
                ▲
                │ one-time seed
        ┌───────┴────────┐
        │ scripts/ingest │  data/*.md ──► validated JSON ──► DB
        └────────────────┘
```

### 4.1 Technology choices

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router, **Node runtime** (not Edge) | Prisma + bcrypt need Node; App Service runs Node natively |
| Language | TypeScript, `strict: true` | |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix primitives | Accessible dialogs/radio groups out of the box |
| DB access | Prisma 6, `sqlserver` provider | Migrations, type-safe queries |
| Database | **Azure SQL Database** — free offer, General Purpose **serverless** | Free for the life of the subscription (not a 12-month trial); see §12.2 |
| DB resiliency | `withDb()` retry wrapper in `lib/db.ts` (§6.5) | Serverless auto-pause means the first query after idle can take ~30–60 s |
| DB ergonomics | `lib/enums.ts` + `lib/json.ts` shims (§6.3, §6.4) | Restores enum and JSON ergonomics that the `sqlserver` provider lacks |
| Auth | Auth.js v5 (NextAuth) — Credentials provider + Prisma adapter, JWT session strategy | Standard, well-documented, cookie-based |
| Password hashing | `bcryptjs` (cost 12) or `argon2` | |
| Validation | Zod on every API boundary | |
| Charts | Recharts | Radar, bar, line — all needed for the dashboard |
| Tables | TanStack Table (results review only) | |
| Testing | Vitest (unit), Playwright (E2E) | |
| Time | `date-fns` | |

### 4.2 Repository layout

```
Claude-Exam-Simulator/
├── data/                              # source markdown (read-only, unmodified)
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                        # loads generated/questions.json into DB
├── scripts/
│   ├── ingest.ts                      # data/*.md -> generated/questions.json
│   └── validate.ts                    # invariant checks, exits non-zero on failure
├── generated/
│   └── questions.json                 # build artifact, git-ignored
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (auth)/register/page.tsx
│   │   ├── (app)/dashboard/page.tsx
│   │   ├── (app)/exams/new/page.tsx           # Select Exam dialog
│   │   ├── (app)/exam/[sessionId]/page.tsx    # runner
│   │   ├── (app)/results/[sessionId]/page.tsx
│   │   ├── (app)/history/page.tsx
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── api/register/route.ts
│   │   ├── api/sessions/route.ts
│   │   ├── api/sessions/[id]/answer/route.ts
│   │   ├── api/sessions/[id]/heartbeat/route.ts
│   │   ├── api/sessions/[id]/submit/route.ts
│   │   └── api/health/route.ts
│   ├── components/
│   │   ├── exam/{QuestionCard,QuestionPalette,ExamTimer,ReviewPanel,SubmitDialog}.tsx
│   │   ├── results/{ScoreHero,DomainBreakdown,ImprovementChart,WrongAnswerList}.tsx
│   │   └── ui/                        # shadcn
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts                      # Prisma singleton + withDb() transient-retry wrapper
│   │   ├── enums.ts                   # const-object "enums" (SQL Server has no enum type)
│   │   ├── json.ts                    # typed NVarChar(Max) JSON column helpers
│   │   ├── rng.ts                     # seeded PRNG + Fisher–Yates
│   │   ├── blueprint.ts               # largest-remainder allocation
│   │   ├── selection.ts               # build a sitting
│   │   ├── scoring.ts                 # raw + scaled + domain breakdown
│   │   └── validation.ts              # zod schemas
│   └── types/
├── e2e/                               # Playwright
├── .github/workflows/azure-deploy.yml
├── docker-compose.yml                 # local SQL Server 2022 (same engine as prod)
├── startup.sh                         # App Service startup: migrate → seed → serve
├── .env.example
└── PLAN.md
```

---

## 5. Data ingestion pipeline

`scripts/ingest.ts` is a **build-time** step. The markdown is never parsed at request time.

### 5.1 Parse rules (derived from the verified format)

Normalize `–`/`—`/`−` and NBSP first, then match line-by-line with a small state machine:

| Element | Pattern |
|---|---|
| Title / code | `^# (?<title>.+?) \((?<code>CC[A-Z]{2}-F)\) — (?<n>\d+) Practice Questions$` |
| Exam facts | `(?<items>\d+) items, (?<minutes>\d+) minutes` and `passing score (?<pass>\d+)` |
| Weight table row | `^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*([\d.]+)%\s*\|\s*(\d+)\s*\(Q(\d+)-Q(\d+)\)\s*\|$` |
| Domain section | `^## Domain (\d+): (.+?) \(Q(\d+)-Q(\d+)\)$` |
| Sub-topic (optional) | `^### (?:Task [\d.]+: )?(.+)$` while in a domain |
| Question stem | `^\*\*Q(\d+)\.\*\*\s*(?:\*\*\(Select TWO\)\*\*\s*)?(.+)$` |
| Option | `^([A-D])\.\s+(.+)$` |
| Answer key start | `^## Answer Key & Rationale$` |
| Answer line | `^(\d+)\. \*\*([A-D](?:, [A-D])*)\*\* - (.+)$` |

### 5.2 Emitted shape

```jsonc
{
  "code": "CCAO-F",
  "title": "Claude Certified Associate – Foundations",
  "realItemCount": 60, "durationMinutes": 120, "passingScaledScore": 720,
  "domains": [
    { "index": 1, "name": "Prompting and Task Execution", "weight": 14.0 }
  ],
  "questions": [
    {
      "externalId": "CCAO-F-Q1",          // stable across re-ingests
      "number": 1,
      "domainIndex": 1,
      "subTopic": null,                    // "Task 1.1: …" for CCAR-F
      "type": "SINGLE",                    // or "MULTI"
      "stem": "Which combination of elements …",
      "options": [
        { "letter": "A", "text": "A single-sentence request …", "isCorrect": false },
        { "letter": "B", "text": "Clear task, relevant context …", "isCorrect": true }
      ],
      "explanation": "Clarity, context, constraints, and format together drive quality; …",
      "contentHash": "sha256:…"            // stem+options+answer, for change detection
    }
  ]
}
```

### 5.3 Validation gate (`scripts/validate.ts`, runs in CI)

Fail the build if any of these break:

1. `questions.length` === header count === answer-key entry count.
2. Every question has exactly 4 options, letters A–D, all non-empty, all distinct.
3. Every question number has exactly one answer-key entry; no orphans on either side.
4. `type === "MULTI"` ⟺ answer key has ≥ 2 letters ⟺ stem carried `(Select TWO)`.
5. Answer letters ⊆ {A,B,C,D}.
6. Domain ranges are contiguous, non-overlapping, and cover `1..n`.
7. Domain weights sum to 100 ± 0.5.
8. For each exam and each domain: `bankCount >= realExamAllocation`.
9. `externalId` values are globally unique.

### 5.4 Re-ingest / drift handling

Seeding is **idempotent and upsert-based on `externalId`**. If a question's `contentHash` changes,
the row is updated and a `revision` counter bumped; historical `Answer` rows keep a denormalized
snapshot of the stem/options they were actually shown (§6), so past results never mutate or break.

---

## 6. Data model (Prisma, `sqlserver` provider)

### 6.1 Four mapping rules — apply these and SQL Server never surprises you

The `sqlserver` provider differs from Postgres in exactly four ways that touch this schema. Each has
a mechanical fix applied uniformly below, so no case-by-case thinking is needed later.

| # | Postgres idiom | What we use instead | Why — and what breaks without it |
|---|---|---|---|
| 1 | `String @id` / `@unique` / FK with no length | **Always** an explicit `@db.NVarChar(n)` | Prisma defaults `String` to `nvarchar(1000)` = 2000 bytes, over SQL Server's **900-byte index key limit**. Without this, `migrate dev` fails immediately on every PK and unique index. |
| 2 | `enum QuestionType { … }` | `String @db.NVarChar(n)` + const-object union in `lib/enums.ts` + a `CHECK` constraint | SQL Server has no native enum type; Prisma doesn't support `enum` on this provider. |
| 3 | `Json` | `String @db.NVarChar(Max)` + `lib/json.ts` helpers | Prisma's `Json` scalar is unsupported on `sqlserver`. |
| 4 | Prisma's implicit `onUpdate: Cascade` | **Explicit `onUpdate: NoAction` on every relation** | `Exam → Domain → Question` *and* `Exam → Question` are two update-cascade paths to the same table; SQL Server rejects this with *"may cause cycles or multiple cascade paths."* IDs are immutable cuids, so update-cascade has no value anyway. |

Also: `@db.Text` → `@db.NVarChar(Max)`, and drop any `mode: 'insensitive'` filters (SQL Server's
default collation is already case-insensitive, and Prisma rejects the flag on this provider).

`onDelete: Cascade` is kept on the two parent-child relations that have a **single** delete path
(`Question → Option`, `ExamSession → SessionItem`); everything else stays at Prisma's default
restrict.

### 6.2 Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid()) @db.NVarChar(30)
  email         String    @unique @db.NVarChar(255)
  name          String?   @db.NVarChar(120)
  passwordHash  String    @db.NVarChar(255)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  sessions      ExamSession[]
}

model Exam {
  id                 String @id @default(cuid()) @db.NVarChar(30)
  code               String @unique @db.NVarChar(16)   // CCAO-F | CCDV-F | CCAR-F
  title              String @db.NVarChar(200)
  realItemCount      Int
  durationMinutes    Int
  passingScaledScore Int    @default(720)
  domains            Domain[]
  questions          Question[]
}

model Domain {
  id        String @id @default(cuid()) @db.NVarChar(30)
  examId    String @db.NVarChar(30)
  index     Int
  name      String @db.NVarChar(200)
  weight    Float
  exam      Exam       @relation(fields: [examId], references: [id], onUpdate: NoAction)
  questions Question[]
  @@unique([examId, index])
}

model Question {
  id          String  @id @default(cuid()) @db.NVarChar(30)
  externalId  String  @unique @db.NVarChar(64)   // "CCAO-F-Q1"
  examId      String  @db.NVarChar(30)
  domainId    String  @db.NVarChar(30)
  number      Int
  subTopic    String? @db.NVarChar(300)
  type        String  @db.NVarChar(10)           // QuestionType: SINGLE | MULTI
  stem        String  @db.NVarChar(Max)
  explanation String  @db.NVarChar(Max)
  contentHash String  @db.NVarChar(80)
  revision    Int     @default(1)
  options     Option[]
  exam        Exam    @relation(fields: [examId],   references: [id], onUpdate: NoAction)
  domain      Domain  @relation(fields: [domainId], references: [id], onUpdate: NoAction)
  @@index([examId, domainId])
}

model Option {
  id         String   @id @default(cuid()) @db.NVarChar(30)
  questionId String   @db.NVarChar(30)
  letter     String   @db.NVarChar(1)            // original A–D
  text       String   @db.NVarChar(Max)
  isCorrect  Boolean
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  @@unique([questionId, letter])
}

model ExamSession {
  id          String    @id @default(cuid()) @db.NVarChar(30)
  userId      String    @db.NVarChar(30)
  examId      String    @db.NVarChar(30)
  mode        String    @db.NVarChar(10)         // ExamMode:      MOCK | REAL
  timing      String    @db.NVarChar(10)         // TimingMode:    TIMED | UNTIMED
  status      String    @db.NVarChar(16) @default("IN_PROGRESS")
                                                 // SessionStatus: IN_PROGRESS | SUBMITTED | EXPIRED | ABANDONED
  itemCount   Int
  seed        String    @db.NVarChar(64)         // reproducible shuffle
  startedAt   DateTime  @default(now())
  endsAt      DateTime?                          // null when UNTIMED — server authority
  submittedAt DateTime?
  lastSeenAt  DateTime  @default(now())
  rawScore    Int?
  rawTotal    Int?
  scaledScore Int?
  passed      Boolean?
  items       SessionItem[]
  user        User @relation(fields: [userId], references: [id], onUpdate: NoAction)
  exam        Exam @relation(fields: [examId], references: [id], onUpdate: NoAction)
  @@index([userId, examId, submittedAt])
}

model SessionItem {
  id              String    @id @default(cuid()) @db.NVarChar(30)
  sessionId       String    @db.NVarChar(30)
  questionId      String    @db.NVarChar(30)
  position        Int                             // shuffled question order, 0-based
  optionOrder     String    @db.NVarChar(16)      // e.g. "C,A,D,B"
  selectedLetters String?   @db.NVarChar(16)      // e.g. "B" or "A,C" (original letters)
  flagged         Boolean   @default(false)
  isCorrect       Boolean?
  answeredAt      DateTime?
  // snapshot so historical results survive bank edits
  stemSnapshot    String    @db.NVarChar(Max)
  optionsSnapshot String    @db.NVarChar(Max)     // JSON string — see lib/json.ts
  session         ExamSession @relation(fields: [sessionId],  references: [id], onDelete: Cascade, onUpdate: NoAction)
  question        Question    @relation(fields: [questionId], references: [id], onUpdate: NoAction)
  @@unique([sessionId, questionId])
  @@index([sessionId, position])
}
```

### 6.3 `lib/enums.ts` — enum ergonomics without native enums

Const objects give the same autocomplete, exhaustiveness checking, and Zod integration that Prisma
enums would have. Application code is written exactly as it would be against Postgres.

```ts
export const ExamMode      = { MOCK: 'MOCK', REAL: 'REAL' } as const;
export const TimingMode    = { TIMED: 'TIMED', UNTIMED: 'UNTIMED' } as const;
export const QuestionType  = { SINGLE: 'SINGLE', MULTI: 'MULTI' } as const;
export const SessionStatus = {
  IN_PROGRESS: 'IN_PROGRESS', SUBMITTED: 'SUBMITTED',
  EXPIRED: 'EXPIRED', ABANDONED: 'ABANDONED',
} as const;

export type ExamMode      = (typeof ExamMode)[keyof typeof ExamMode];
export type TimingMode    = (typeof TimingMode)[keyof typeof TimingMode];
export type QuestionType  = (typeof QuestionType)[keyof typeof QuestionType];
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

// z.nativeEnum accepts const objects — API boundaries validate identically to Postgres.
export const zExamMode = z.nativeEnum(ExamMode);
```

The database enforces them too. A hand-written migration adds `CHECK` constraints so an invalid
value can't be written even by raw SQL:

```sql
ALTER TABLE [ExamSession] ADD CONSTRAINT [CK_ExamSession_mode]
  CHECK ([mode] IN ('MOCK','REAL'));
ALTER TABLE [ExamSession] ADD CONSTRAINT [CK_ExamSession_timing]
  CHECK ([timing] IN ('TIMED','UNTIMED'));
ALTER TABLE [ExamSession] ADD CONSTRAINT [CK_ExamSession_status]
  CHECK ([status] IN ('IN_PROGRESS','SUBMITTED','EXPIRED','ABANDONED'));
ALTER TABLE [Question]    ADD CONSTRAINT [CK_Question_type]
  CHECK ([type] IN ('SINGLE','MULTI'));
```

Prisma's typed client returns `string` for these columns; a thin `select` mapper in the repository
layer casts once to the union type, so nothing downstream sees a bare `string`.

### 6.4 `lib/json.ts` — one JSON column, fully typed

Only `SessionItem.optionsSnapshot` is JSON, so the surface area is tiny and worth validating.

```ts
export const OptionSnapshot = z.object({
  letter: z.enum(['A', 'B', 'C', 'D']),
  text: z.string(),
});
export const OptionsSnapshot = z.array(OptionSnapshot).length(4);
export type OptionsSnapshot = z.infer<typeof OptionsSnapshot>;

export const packJson = <T>(v: T): string => JSON.stringify(v);
export const unpackJson = <T>(raw: string, schema: z.ZodType<T>): T =>
  schema.parse(JSON.parse(raw));
```

Reads go through `unpackJson(item.optionsSnapshot, OptionsSnapshot)`, so a malformed snapshot fails
loudly at the boundary instead of silently rendering a broken question.

### 6.5 `lib/db.ts` — Prisma singleton + transient-fault retry

Serverless auto-pause (§12.2) means the **first** query after an idle period can take 30–60 s while
the database resumes. `withDb()` absorbs that so no route handler has to think about it.

```ts
export const prisma = globalThis.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;

// Prisma codes + Azure SQL transient error numbers (resume / throttle / failover)
const TRANSIENT_PRISMA = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);
const TRANSIENT_SQL    = new Set([4060, 10928, 10929, 40197, 40501, 40613, 49918, 49919, 49920]);

export async function withDb<T>(fn: () => Promise<T>, budgetMs = 75_000): Promise<T> {
  const deadline = Date.now() + budgetMs;
  let delay = 1_000;
  for (;;) {
    try { return await fn(); }
    catch (err) {
      if (!isTransient(err) || Date.now() + delay > deadline) throw err;
      await sleep(delay + Math.random() * 250);      // jitter
      delay = Math.min(delay * 2, 15_000);            // 1s → 2 → 4 → 8 → 15 → 15 …
    }
  }
}
```

Usage rules that keep this effortless:

- Every route handler and server action wraps its DB work in `withDb(...)` — enforced by an ESLint
  rule that flags bare `prisma.` calls outside `lib/`.
- `withDb` is **not** used on the exam runner's hot path in a way that could stall a submit past the
  deadline: the submit handler passes a shorter budget and, on exhaustion, still honours the stored
  `endsAt` when it eventually lands, so no time is ever lost to a database stall.
- `/api/health` distinguishes `db: 'up'` from `db: 'resuming'` so the App Service health probe and
  the login screen can tell "warming up" apart from "broken."

### 6.6 Cold-start UX

The resume delay is confined to **login** — the first DB touch of a visit. Once a session is live,
the 20-second heartbeat and per-answer autosaves keep the database continuously active, far inside
the 1-hour auto-pause window, so **it cannot pause mid-exam**.

- The login button enters a *"Waking the database — about 30 seconds"* state after 2 s of waiting,
  rather than spinning silently or erroring.
- `/dashboard` and `/exams/new` prefetch a trivial query, so the DB is always warm before a sitting
  starts.
- A serialized `E2E: cold start` test asserts that a paused-DB login succeeds and shows the warming
  copy instead of a 500.

---

## 7. Shuffling — server-authoritative and reproducible

- On session creation the server generates a random `seed` (16 bytes, hex) and stores it.
- A **seeded PRNG** (`mulberry32`) drives **Fisher–Yates** for:
  1. the order of selected questions → written to `SessionItem.position`;
  2. the order of options within each question → written to `SessionItem.optionOrder` as a
     permutation of original letters, e.g. `"C,A,D,B"` means displayed slot 1 = original C.
- **The order is persisted, not recomputed on each render.** Reloading the page, resuming after a
  crash, or viewing the results screen all replay the exact same order.
- Displayed labels are always A/B/C/D by slot; the stored `selectedLetters` are always mapped
  **back to original letters** before persisting, so scoring never depends on display order.
- The client is served options **without** `isCorrect` and without the explanation while the session
  is `IN_PROGRESS`. Correct answers and rationales are only returned after submit.

---

## 8. Timer

- `endsAt = startedAt + durationMinutes` is computed and stored **server-side** at session creation.
  The client never decides when time is up.
- Client renders a countdown from `endsAt` (delivered once, plus a server-time offset to correct
  clock skew). Visual states: normal → **amber at 10 min** → **red + pulse at 2 min**.
- A **heartbeat** (`POST /api/sessions/:id/heartbeat`, every 20 s) updates `lastSeenAt` and returns
  authoritative `remainingSeconds`, correcting any client drift.
- **Auto-submit:** when the client hits zero it calls submit; independently, the server rejects any
  answer/submit arriving after `endsAt + 30 s` grace and marks the session `EXPIRED`, scoring
  whatever was saved. A background sweep also expires stale `IN_PROGRESS` sessions.
- Answers are saved **as they are chosen** (optimistic UI + debounced `POST .../answer`), so a
  browser crash loses nothing.
- Untimed sessions have `endsAt = null`; the header shows elapsed time instead, and total elapsed
  is still recorded for the results screen.
- Resume: `/dashboard` surfaces any `IN_PROGRESS` session with a **Resume** button.

---

## 9. Screens

### 9.1 Register / Login
- `/register` — name, email, password, confirm. Client + server Zod validation, password strength
  meter, min 10 chars. Duplicate-email error is **generic** ("could not create account") to avoid
  account enumeration.
- `/login` — email + password, "remember me", inline error, link to register.
- Both are centered card layouts with the product mark; redirect to `/dashboard` on success.
- Middleware protects every route under `(app)`; unauthenticated hits redirect to `/login?next=…`.

### 9.2 Dashboard `/dashboard`
- **Resume banner** if an `IN_PROGRESS` session exists.
- Three exam cards (CCAO-F / CCDV-F / CCAR-F) each showing: best scaled score, attempts, last
  attempt date, weakest domain, and a **Start exam** button.
- Sparkline of the last 5 scaled scores per exam.

### 9.3 Select Exam dialog `/exams/new` (modal, Radix Dialog)
Three-step, one screen:
1. **Exam** — radio cards for the three certifications (title, code, bank size).
2. **Length** — `Mock Test (half length)` vs `Real Exam (full length)`; each shows the live item
   count for the chosen exam (e.g. "27 questions" vs "53 questions").
3. **Timing** — `Un-timed` vs `Actual Exam Time (120 min)`.

Footer shows a live summary line — *"CCDV-F · Real Exam · 53 questions · 120 minutes"* — and a
**Begin** button. `POST /api/sessions` → redirect to `/exam/:id`.

### 9.4 Exam runner `/exam/[sessionId]`
- **Header:** exam code, mode chips, `Question 14 of 53`, progress bar, **timer**, `Flag for review`,
  `Review & submit`.
- **Body:** stem (with a `Select TWO` badge on multi-response items), option list rendered as
  Radix RadioGroup (single) or CheckboxGroup (multi, capped at 2 with a hint when a third is
  clicked). Large click targets covering the whole row.
- **Footer:** `Previous` / `Next`, and `Clear selection`.
- **Question palette** (collapsible sidebar / bottom sheet on mobile): numbered grid colour-coded
  answered / unanswered / flagged; click to jump.
- **Keyboard:** `1–4` or `A–D` select, `←/→` navigate, `F` flag, `Enter` next.
- **Review & submit** screen: counts of answered / unanswered / flagged, a grid to jump back, and a
  confirm dialog that explicitly warns about unanswered items.
- **No feedback of any kind is shown during the exam** — this is a simulator, not a quiz trainer.

### 9.5 Results `/results/[sessionId]`
See §11.

### 9.6 History `/history`
Filterable table of all sittings: date, exam, mode, timing, raw score, scaled score, pass/fail,
duration. Row → results screen. Compare-two-sittings toggle.

---

## 10. Scoring

- **Single-response:** correct iff the selected letter equals the key.
- **Multi-response:** **all-or-nothing** — the selected set must equal the key set exactly. (This
  matches how AWS/Azure-style certification items are scored; the rule is stated in the UI.)
- Unanswered = incorrect. No negative marking.
- `rawScore` / `rawTotal` → `rawPercent`.

### 10.1 Scaled score (100–1000, pass 720)

The real exams report a scaled score from an undisclosed equating model. The simulator uses a
**documented piecewise-linear approximation** anchored on the pass mark, with a configurable raw
pass threshold `P` (default **0.72**):

```
p = rawScore / rawTotal
scaled = p <= P
       ? round(100 + (720 - 100) * (p / P))
       : round(720 + (1000 - 720) * ((p - P) / (1 - P)))
```

The results screen shows the raw score prominently and labels the scaled score
*"approximate — this simulator is not equated to the live exam."*

### 10.2 Domain breakdown
For each domain: items presented, correct, percent, blueprint weight, and **weighted contribution**
to the overall score. Domains are ranked so the biggest weighted losses surface first.

### 10.3 Improvement
Compared against the user's **previous submitted session for the same exam** (any mode), plus a
trend across all sessions. Deltas are shown per domain and overall. Mock and Real sittings are
distinguishable in the chart so the user can read them separately.

---

## 11. Results dashboard specification

1. **Score hero** — large scaled score, radial gauge with the 720 pass line marked, `PASSED` /
   `NOT PASSED` badge, raw score (`38 / 53 — 71.7%`), time taken vs allowed, mode chips, and delta
   vs previous attempt (`+64 since 24 Jul`).
2. **Domain breakdown** —
   - a **radar chart** (this attempt vs previous attempt overlay), and
   - a **table**: Domain | Weight | Correct/Total | % | Δ vs last | strength bar.
   Rows colour-coded: ≥80% green, 60–79% amber, <60% red.
3. **Improvement over time** — line chart of scaled score per sitting for this exam, with the 720
   pass line as a reference; hover shows date/mode/raw. A second toggle switches to per-domain
   trend lines.
4. **Weakest areas** — top 3 domains by *weighted* points lost, each with a one-line recommendation
   ("Domain 2 is 33% of the exam and you scored 55% — highest-value area to study").
5. **Wrong answer review** — one card per incorrect item:
   - question stem (from the snapshot, in the order it was shown),
   - all four options with **your answer** marked red and the **correct answer** marked green,
   - the **explanation/rationale** from the answer key,
   - domain + sub-topic tags.
   Filters: *incorrect only* (default) / *flagged* / *all*, and a domain filter. Also a
   "Skipped" section for unanswered items.
6. **Actions** — `Retake this exam`, `Practice my weakest domain` (Phase 6), `Export PDF`
   (print stylesheet in v1), `Back to dashboard`.

---

## 12. Azure App Service readiness

### 12.1 Runtime
- **Linux App Service**, Node 22 LTS, plan B1 or higher (**Always On** required so the timer sweep
  and cold starts behave).
- `next.config.ts` → `output: 'standalone'`, producing `.next/standalone/server.js`.
- Startup command: `bash /home/site/wwwroot/startup.sh` (which ends in `node server.js`). Next binds
  `process.env.PORT`, which App Service injects — do **not** hardcode 3000.
- Add `/api/health` returning `{ status, db: 'up' }`; wire it to App Service **Health check**.
- All routes use the Node runtime; no Edge runtime anywhere (Prisma/bcrypt are incompatible).

### 12.2 Database — Azure SQL Database (free offer)

**Not SQLite:** SQLite on App Service would live on `/home`, an **Azure Files (SMB) share**, where
SQLite's file locking is unreliable — a known data-corruption footgun. Azure SQL avoids this
entirely and costs nothing.

**Provisioning**

- **Azure SQL Database free offer** — General Purpose, **Serverless**, standard-series (Gen5).
  Roughly 100,000 vCore-seconds of compute + 32 GB storage per month, **one per subscription**,
  free for the life of the subscription rather than a 12-month trial. Confirm current limits at
  provisioning time; Microsoft has revised them before.
- Set the free-offer overage behaviour to **"auto-pause until next month"**, *not* "continue and
  bill." This makes a surprise invoice structurally impossible. Add an Azure **budget alert at $1**
  as a second net.
- Leave **auto-pause delay at the 1-hour minimum**. This is what keeps you inside the quota:
  at the 0.5 vCore floor, a database that never pauses burns the entire monthly allowance in about
  2.3 days. Pausing between study sessions is the whole economic model.
- Backups: the free offer's default 7-day PITR retention is sufficient. The question banks are
  reproducible from `data/` via `npm run seed`, so only user/session data is genuinely at risk.

**Networking**

- Server-level firewall: enable **"Allow Azure services and resources to access this server"** — this
  covers App Service's outbound IPs without pinning them. Tighten to a **Private Endpoint + VNet
  integration** later if the app ever holds data worth that effort.
- Connection string always carries `encrypt=true; trustServerCertificate=false`.
- You do **not** normally allowlist your workstation — local development runs against Docker, not the
  cloud database.

**Authentication — use SQL auth, not managed identity**

Prisma's `sqlserver` connector does not support Azure AD / managed-identity token authentication.
Plan on **SQL authentication** with the password stored as a **Key Vault reference** in App Settings
(§12.3). This is the one place where the Azure-native "passwordless" pattern isn't available; don't
burn time trying to make it work.

**Connection string** — note the JDBC-style format this provider uses, *not* a URL:

```
sqlserver://<server>.database.windows.net:1433;database=examsim;user=<user>;password=<pw>;encrypt=true;trustServerCertificate=false;connectTimeout=60;pool_timeout=60;connection_limit=5
```

`connectTimeout=60` is essential — the default is far too short to survive a serverless resume, and
without it `withDb()` retries against a connection that was never given a chance to succeed.

**Local development — identical engine, zero drift**

`docker-compose.yml` runs `mcr.microsoft.com/mssql/server:2022-latest` (needs ~2 GB RAM allocated).
Dev and prod share one Prisma provider, one schema, and one migration history, so a migration that
applies locally applies in Azure. `npm run db:up` starts it; `npm run db:reset` recreates and
reseeds in one command.

```
DATABASE_URL="sqlserver://localhost:1433;database=examsim;user=sa;password=Local_Dev_Pw1;encrypt=true;trustServerCertificate=true"
```

(`trustServerCertificate=true` is correct for the local container's self-signed cert, and correct
*only* there — production keeps it `false`.)

### 12.3 Configuration
All secrets via **App Settings**, ideally as **Key Vault references**; nothing in the repo.

| Setting | Purpose |
|---|---|
| `DATABASE_URL` | Azure SQL connection string — store as a **Key Vault reference**, `@Microsoft.KeyVault(...)` |
| `RUN_MIGRATIONS_ON_START` | `true` — gate for the startup script (§12.4) |
| `AUTH_SECRET` | Auth.js signing key |
| `AUTH_URL` | `https://<app>.azurewebsites.net` |
| `NODE_ENV` | `production` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `false` (we deploy a prebuilt artifact) |
| `WEBSITES_PORT` | not needed for Node; Next reads `PORT` |

- **HTTPS Only = On**; session cookies `Secure`, `HttpOnly`, `SameSite=Lax`.
- `trustHost: true` in Auth.js so it honours the App Service proxy headers.

### 12.4 Deployment (`.github/workflows/azure-deploy.yml`)
1. Checkout, Node 22, `npm ci`.
2. `npm run ingest && npm run validate` — **the build fails if the question banks don't parse.**
3. `npx prisma generate`, `npm run build`, `npm test`.
4. Assemble the standalone bundle: `.next/standalone` + `.next/static` + `public` + `prisma/`
   (schema **and** migrations) + `startup.sh` + the `prisma` and `@prisma/client` packages.
   Standalone output does not include the Prisma CLI, so it must be added explicitly for step 7.
5. Azure login via **OIDC federated credentials** (no publish-profile secrets).
6. `azure/webapps-deploy@v3`.
7. **Migrations run from the app, not from CI.** `startup.sh` executes
   `prisma migrate deploy` → `npm run seed` → `node server.js`.

Running migrations at startup rather than from the GitHub runner is deliberate and is what makes
this seamless: the runner's IP is dynamic, so a CI-side migration would require temporarily
allowlisting it on the SQL firewall on every deploy. The App Service is already inside the
"Allow Azure services" rule, so it just works.

```bash
#!/usr/bin/env bash
set -euo pipefail
if [ "${RUN_MIGRATIONS_ON_START:-false}" = "true" ]; then
  # The database may be auto-paused; retry until it resumes.
  for attempt in 1 2 3 4 5; do
    if node_modules/.bin/prisma migrate deploy --schema prisma/schema.prisma; then break; fi
    echo "migrate deploy failed (attempt $attempt) — database may be resuming; retrying in 20s"
    sleep 20
  done
  node scripts/seed.js   # idempotent upsert on externalId; safe on every boot
fi
exec node server.js
```

Because seeding is upsert-based (§5.4), re-running it on every boot is a no-op once the banks are
loaded — no drift, no manual post-deploy step, and a fresh database self-populates on first start.

### 12.5 Observability
Application Insights (Node auto-instrumentation), structured JSON logs to stdout (App Service
captures them), and a `/api/health` probe. Optional: log-based alert on 5xx rate.

---

## 13. Security

- bcrypt cost 12 (or argon2id); never log passwords.
- Rate-limit `/api/register` and login (per IP + per email, e.g. 5 attempts / 15 min). In-memory
  limiter for a single instance; swap to Redis if scaled out.
- Generic auth error messages (no account enumeration).
- Zod validation + type narrowing on every route handler; every session-scoped route asserts
  `session.userId === examSession.userId` before doing anything.
- **Correct answers and explanations are never sent to the client for an `IN_PROGRESS` session.**
  Enforced at the query layer (a dedicated `selectForRunner` projection), with an E2E test that
  greps the network payload for the rationale text.
- CSRF handled by Auth.js; Server Actions have built-in origin checks.
- Security headers via `next.config.ts`: CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS.
- Dependabot + `npm audit` in CI.
- **Database:** SQL password lives only in Key Vault, surfaced to App Service as a Key Vault
  reference — never in the repo, never in the workflow file, never in a `.env` that is committed.
  `.env.example` carries placeholders only. Connections always use `encrypt=true` with
  `trustServerCertificate=false` in production. The SQL firewall permits Azure services only; there
  are no public IP allowances.
- `CHECK` constraints (§6.3) mean the enum-as-string columns are enforced at the database level, so
  a compromised or buggy code path still cannot write an out-of-range `status` or `mode`.

---

## 14. Build phases

| Phase | Deliverable | Acceptance criteria |
|---|---|---|
| **P0 — Foundation** | Next.js + TS + Tailwind + shadcn scaffold, **Docker SQL Server 2022**, Prisma `sqlserver` schema + `CHECK`-constraint migration, `lib/db.ts` / `enums.ts` / `json.ts`, health route | `npm run dev` serves a styled page; `prisma migrate dev` succeeds with **no 900-byte index errors and no "multiple cascade paths" error**; a `CHECK` constraint rejects an invalid `mode`; `withDb()` retries a simulated `P1001` |
| **P1 — Ingestion** | `scripts/ingest.ts`, `scripts/validate.ts`, `prisma/seed.ts` | All 540 questions in the DB; all 9 invariants pass; re-running seed changes nothing |
| **P2 — Auth** | Register, login, logout, protected layout, middleware | Can register, log out, log back in; protected routes redirect; rate limiting works |
| **P3 — Session creation** | Select Exam dialog, `lib/blueprint.ts`, `lib/selection.ts`, `lib/rng.ts`, `POST /api/sessions` | A CCDV-F Real sitting yields exactly 53 items matching the §3.2 table; two sittings have different order; same seed reproduces order exactly |
| **P4 — Runner** | Question card, palette, navigation, autosave, timer, heartbeat, submit | Answers survive a hard refresh; timer is server-authoritative; auto-submit fires at zero; runner payload contains no `isCorrect` |
| **P5 — Scoring + results** | `lib/scoring.ts`, results dashboard, wrong-answer review, history page | Domain math matches a hand-checked fixture; multi-response all-or-nothing verified; deltas correct across two sittings |
| **P6 — Polish** | Improvement charts, weakest-area guidance, anti-repeat selection, print/PDF, dark mode, a11y pass, empty/error states | Lighthouse a11y ≥ 95; keyboard-only full run possible |
| **P7 — Azure** | `output: standalone`, `startup.sh`, GitHub Actions + OIDC, **Azure SQL free-offer database**, Key Vault reference, firewall, App Settings, health check, App Insights | Green deploy from `main`; migrations + seed run automatically on boot against an empty database; register + full sitting + results work on the live URL; a **cold start after auto-pause** shows the warming state and then succeeds; overage behaviour is set to pause and a budget alert exists |

---

## 15. Testing

- **Unit (Vitest):** parser against fixture markdown incl. malformed cases; largest-remainder
  allocation (all three exams, both modes, sums exact, ≥1 per domain); seeded shuffle determinism;
  option-letter round-trip (display slot → original letter); scoring incl. multi-response,
  unanswered, and the scaled-score anchors (0%→100, 72%→720, 100%→1000).
- **Integration:** session creation honours blueprint; answer endpoint rejects a foreign user;
  submit after `endsAt` marks `EXPIRED`.
- **E2E (Playwright):** register → start CCAO-F mock timed → answer, flag, navigate, reload
  mid-exam → submit → results show correct domain breakdown → second sitting shows a delta.
- **Security regression:** assert the runner API response body never contains `isCorrect: true`
  or any explanation string.
- **Database resiliency:** `withDb()` retries on each transient Prisma code and Azure SQL error
  number, backs off with jitter, gives up at the budget, and rethrows non-transient errors
  untouched; a paused-database login renders the warming state rather than a 500; `CHECK`
  constraints reject out-of-range enum writes via raw SQL; `unpackJson` throws on a malformed
  `optionsSnapshot` instead of rendering a broken question.
- **Schema guard:** a CI check runs `prisma migrate diff` against a clean SQL Server container to
  confirm migrations apply from scratch — this is what catches an accidentally reintroduced
  unannotated `String @unique` or update-cascade path before it reaches Azure.

---

## 16. Assumptions & open decisions

1. **Mock = 50% of the *real exam* item count**, not 50% of the bank. CCDV-F's 53 rounds up to 27.
2. **Mock timing** = 50% of the real duration (60 min). Alternative — full 120 min for mocks — is a
   one-line config change if preferred.
3. **Multi-response scoring is all-or-nothing.** Partial credit is a config flag if you want it.
4. **The scaled score is an approximation**, clearly labelled as such; the 72% raw pass threshold is
   an assumption and is configurable per exam.
5. Question banks are treated as **read-only source of truth**; the app never edits `data/`.
6. English only, single tenant, no payment, no proctoring.
7. **The database is the Azure SQL free offer, and staying free is a design constraint.** Auto-pause
   is left at the 1-hour minimum and overage behaviour is set to pause rather than bill. The
   consequence is an accepted ~30–60 s resume delay on the first login after an idle period, which
   §6.5–6.6 confine to the login screen and keep out of any live exam. If the app ever becomes
   multi-user with unpredictable traffic, revisit this — a paid provisioned tier removes the delay,
   and the only code change is the connection string.
8. Prisma's `sqlserver` provider drives four schema conventions (§6.1). They are mechanical and
   applied uniformly; the shims in §6.3–6.5 mean application code reads the same as it would
   against Postgres.

## 17. Future enhancements (out of scope for v1)

Practice mode with immediate feedback and explanations; per-domain drill sessions; spaced repetition
on missed items; bookmarking; study-notes per question; CSV/PDF export of the full report; admin UI
for editing questions; leaderboards; email results.
