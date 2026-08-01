import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseExam } from '../src/lib/parser';
import { QuestionType } from '../src/lib/enums';
import type { ParsedExam, QuestionBank } from '../src/types/exam';

/**
 * Markdown -> validated JSON (PLAN.md §5).
 *
 * Build-time only. The markdown in data/ is never parsed at request time and is never
 * modified. The parser itself lives in src/lib/parser.ts so it can be unit-tested.
 */

const ROOT = resolve(import.meta.dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'generated');
const OUT_FILE = join(OUT_DIR, 'questions.json');

function main() {
  const files = readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.error(`No markdown files found in ${DATA_DIR}`);
    process.exit(1);
  }

  const exams: ParsedExam[] = [];
  for (const file of files) {
    const source = readFileSync(join(DATA_DIR, file), 'utf8');
    const exam = parseExam(file, source);
    exams.push(exam);
    const multi = exam.questions.filter((q) => q.type === QuestionType.MULTI).length;
    console.log(
      `  ${exam.code.padEnd(8)} ${String(exam.questions.length).padStart(3)} questions · ` +
        `${exam.domains.length} domains · ${multi} multi-response · ` +
        `real exam ${exam.realItemCount} items / ${exam.durationMinutes} min`,
    );
  }

  const bank: QuestionBank = { generatedAt: new Date().toISOString(), exams };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(bank, null, 2), 'utf8');

  const total = exams.reduce((sum, e) => sum + e.questions.length, 0);
  console.log(`\nIngested ${total} questions from ${files.length} files -> generated/questions.json`);
}

main();
