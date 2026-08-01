# Claude Certification Exam Simulator

Practice exams for the three Claude Foundations certifications, with blueprint-weighted
question selection, a server-authoritative timer, and a domain-level results dashboard
that tracks improvement across sittings.

Built to [PLAN.md](PLAN.md) — that document is the spec; this file is how to run it.

| Exam | Bank | Real exam | Mock | Domains |
|---|---|---|---|---|
| CCAO-F — Associate | 160 Q | 60 items / 120 min | 30 items / 60 min | 7 |
| CCDV-F — Developer | 180 Q | 53 items / 120 min | 27 items / 60 min | 8 |
| CCAR-F — Architect | 200 Q | 60 items / 120 min | 30 items / 60 min | 5 |

**540 questions total**, parsed from `data/*.md`. The markdown is treated as a read-only
source of truth and is never modified.

---

## Quick start

Requires **Node 22+** and a container runtime (Docker or Podman) for local SQL Server.

```bash
cp .env.example .env
```

Generate a signing secret and paste it into `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Then bring everything up — starts SQL Server, waits for it, migrates, parses the banks,
validates them, and seeds:

```bash
npm install && npm run setup
```

```bash
npm run dev
```

Open http://localhost:3000, create an account, and start an exam.

> **Podman users:** the compose provider needs the API socket running —
> `systemctl --user start podman.socket`.

---

## How it works

**Question selection is domain-proportional, not random.** Items are allocated per domain
by blueprint weight using the largest-remainder method, so every sitting mirrors the real
exam's domain mix. A CCDV-F real exam always yields `[8, 17, 2, 1, 9, 6, 4, 6]` across its
eight domains. Guards enforce at least one item per domain and never exceed a domain's
available pool.

**Shuffling is server-authoritative and reproducible.** Each session stores a 16-byte seed;
question order and per-question option order are derived from it and *persisted*. A reload,
a resume after a crash, and the results screen all replay the identical order. Displayed
labels are always A–D by slot, but the original letters are what get stored, so scoring
never depends on display order.

**Correct answers cannot leak into a live exam.** The runner projection reads option text
only from `SessionItem.optionsSnapshot`, which by construction contains `{letter, text}`
and nothing else. The `Option` table — the only place `isCorrect` lives — is never queried
by the runner, and neither is `Question.explanation`. An automated check asserts this.

**The timer is server-side.** `endsAt` is computed and stored at session creation. The
client only renders the countdown; a 20-second heartbeat returns authoritative remaining
time to correct clock drift, and the server independently expires and grades a session
past its deadline regardless of whether the client's auto-submit fires.

**Scoring.** Multi-response items are all-or-nothing; unanswered counts as incorrect; no
negative marking. The 100–1000 scaled score is a documented piecewise-linear approximation
anchored at 0%→100, 72%→720, 100%→1000, and is labelled as approximate in the UI.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run setup` | Full local bootstrap (db up → wait → migrate → ingest → validate → seed) |
| `npm run ingest` | Parse `data/*.md` → `generated/questions.json` |
| `npm run validate` | Assert the 9 question-bank invariants (exits non-zero on failure) |
| `npm run seed` | Idempotent upsert of the banks into the database |
| `npm test` | Unit tests (60) |
| `npm run test:e2e` | End-to-end smoke against a running dev server |
| `npm run verify` | typecheck + lint + validate + unit tests |
| `npm run db:up` / `db:down` | Start/stop local SQL Server |
| `npm run db:reset` | Drop and recreate the database |

`npm run validate` is the gate that matters: it re-derives every domain allocation and
fails the build if a question was dropped, mis-keyed, or fell outside its domain range.
It runs in CI before anything is deployed.

---

## Database notes (SQL Server / Azure SQL)

The schema follows four conventions the `sqlserver` Prisma provider requires. They're
documented in `prisma/schema.prisma` and PLAN.md §6.1; the two that fail loudly if
forgotten:

- **Every string PK, FK, and unique key needs an explicit `@db.NVarChar(n)`.** Prisma
  defaults `String` to `nvarchar(1000)` = 2000 bytes, over SQL Server's 900-byte index key
  limit, and `migrate dev` fails on the first table.
- **Every relation sets `onUpdate: NoAction`.** `Exam → Domain → Question` and
  `Exam → Question` are two update-cascade paths to one table, which SQL Server rejects
  with *"may cause cycles or multiple cascade paths."*

Enums are strings plus `CHECK` constraints (SQL Server has no enum type); the allowed
values live in `src/lib/enums.ts` and are mirrored in a migration. JSON columns are
`NVarChar(Max)` validated on read by `src/lib/json.ts`.

All database access goes through `withDb()` in `src/lib/db.ts`, which retries transient
failures with jittered backoff. This exists because Azure SQL's free tier is serverless
and auto-pauses: the first query after an idle period can take 30–60s while the database
resumes. That delay lands on **login only** — once a sitting is live the heartbeat keeps
the database active, so it cannot pause mid-exam.

---

## Deploying to Azure App Service

See PLAN.md §12 for the full runbook. In short:

1. **Azure SQL Database free offer** — General Purpose Serverless. Set the overage
   behaviour to *auto-pause*, not *continue and bill*, and leave auto-pause at the 1-hour
   minimum (that's what keeps it inside the free quota). Enable *Allow Azure services* on
   the firewall.
2. **App Service (Linux, Node 22, B1+, Always On)**. Startup command:
   `bash /home/site/wwwroot/startup.sh`. Health check: `/api/health`.
3. **App Settings**: `DATABASE_URL` (Key Vault reference), `AUTH_SECRET`, `AUTH_URL`,
   `NODE_ENV=production`, `RUN_MIGRATIONS_ON_START=true`,
   `SCM_DO_BUILD_DURING_DEPLOYMENT=false`.
4. Push to `main` — `.github/workflows/azure-deploy.yml` builds a prebuilt standalone
   artifact and deploys via OIDC. Migrations and seeding run from `startup.sh` on the app
   itself, not from CI, because the runner's IP is dynamic and would need firewall
   allowlisting on every deploy.

Prisma's `sqlserver` connector does not support Azure AD / managed-identity auth, so use
SQL authentication with the password as a Key Vault reference.

---

## Disclaimer

An independent study tool. Not affiliated with or endorsed by Anthropic. The question
banks in `data/` are original practice material written against the published exam
guides — they are not drawn from any live exam item bank.
