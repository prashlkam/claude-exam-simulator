import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import type { ParsedQuestion, QuestionBank } from '../src/types/exam';

/**
 * Idempotent seed (PLAN.md §5.4).
 *
 * Upserts on `externalId`. When a question's `contentHash` changes the row is updated and
 * `revision` bumped; historical SessionItem rows keep their own stem/option snapshots, so
 * past results never mutate or break.
 *
 * Safe to run on every App Service boot (PLAN.md §12.4) — once loaded it is a no-op.
 */

const ROOT = resolve(import.meta.dirname, '..');
const BANK_FILE = join(ROOT, 'generated', 'questions.json');

const prisma = new PrismaClient();

/** cuid-shaped id that fits the NVarChar(30) key columns. */
const newId = (): string => `c${Date.now().toString(36)}${randomBytes(8).toString('hex')}`.slice(0, 25);

async function main() {
  let bank: QuestionBank;
  try {
    bank = JSON.parse(readFileSync(BANK_FILE, 'utf8')) as QuestionBank;
  } catch {
    console.error(`Could not read ${BANK_FILE}. Run \`npm run ingest\` first.`);
    process.exit(1);
  }

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const exam of bank.exams) {
    const examRow = await prisma.exam.upsert({
      where: { code: exam.code },
      create: {
        id: newId(),
        code: exam.code,
        title: exam.title,
        realItemCount: exam.realItemCount,
        durationMinutes: exam.durationMinutes,
        passingScaledScore: exam.passingScaledScore,
        bankSize: exam.bankSize,
      },
      update: {
        title: exam.title,
        realItemCount: exam.realItemCount,
        durationMinutes: exam.durationMinutes,
        passingScaledScore: exam.passingScaledScore,
        bankSize: exam.bankSize,
      },
    });

    const domainIdByIndex = new Map<number, string>();
    for (const d of exam.domains) {
      const row = await prisma.domain.upsert({
        where: { examId_index: { examId: examRow.id, index: d.index } },
        create: {
          id: newId(),
          examId: examRow.id,
          index: d.index,
          name: d.name,
          weight: d.weight,
        },
        update: { name: d.name, weight: d.weight },
      });
      domainIdByIndex.set(d.index, row.id);
    }

    const existing = await prisma.question.findMany({
      where: { examId: examRow.id },
      select: { id: true, externalId: true, contentHash: true },
    });
    const existingByExternalId = new Map(existing.map((q) => [q.externalId, q]));

    const toCreate: ParsedQuestion[] = [];
    const toUpdate: { id: string; q: ParsedQuestion }[] = [];

    for (const q of exam.questions) {
      const prev = existingByExternalId.get(q.externalId);
      if (!prev) toCreate.push(q);
      else if (prev.contentHash !== q.contentHash) toUpdate.push({ id: prev.id, q });
      else unchanged++;
    }

    // --- new questions -----------------------------------------------------
    if (toCreate.length > 0) {
      const withIds = toCreate.map((q) => ({ id: newId(), q }));

      await prisma.question.createMany({
        data: withIds.map(({ id, q }) => ({
          id,
          externalId: q.externalId,
          examId: examRow.id,
          domainId: domainIdByIndex.get(q.domainIndex)!,
          number: q.number,
          subTopic: q.subTopic,
          type: q.type,
          stem: q.stem,
          explanation: q.explanation,
          contentHash: q.contentHash,
        })),
      });

      await prisma.option.createMany({
        data: withIds.flatMap(({ id, q }) =>
          q.options.map((o) => ({
            id: newId(),
            questionId: id,
            letter: o.letter,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        ),
      });

      created += toCreate.length;
    }

    // --- changed questions -------------------------------------------------
    for (const { id, q } of toUpdate) {
      await prisma.$transaction([
        prisma.question.update({
          where: { id },
          data: {
            domainId: domainIdByIndex.get(q.domainIndex)!,
            number: q.number,
            subTopic: q.subTopic,
            type: q.type,
            stem: q.stem,
            explanation: q.explanation,
            contentHash: q.contentHash,
            revision: { increment: 1 },
          },
        }),
        prisma.option.deleteMany({ where: { questionId: id } }),
        prisma.option.createMany({
          data: q.options.map((o) => ({
            id: newId(),
            questionId: id,
            letter: o.letter,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        }),
      ]);
      updated++;
    }

    console.log(
      `  ${exam.code.padEnd(8)} ${String(exam.questions.length).padStart(3)} questions ` +
        `(${exam.domains.length} domains)`,
    );
  }

  const totals = await prisma.question.count();
  console.log(
    `\nSeed complete — created ${created}, updated ${updated}, unchanged ${unchanged}. ` +
      `Database holds ${totals} questions.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
