import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { allocateByWeight, itemCountFor, type DomainWeight } from '../src/lib/blueprint';
import { ExamMode, OPTION_LETTERS, QuestionType } from '../src/lib/enums';
import type { QuestionBank } from '../src/types/exam';

/**
 * Validation gate (PLAN.md §5.3). Runs in CI — a non-zero exit fails the build.
 *
 * These invariants are what make the parser trustworthy: a question silently dropped or
 * mis-keyed would corrupt every blueprint allocation and every score downstream.
 */

const ROOT = resolve(import.meta.dirname, '..');
const BANK_FILE = join(ROOT, 'generated', 'questions.json');

const failures: string[] = [];
const checks: string[] = [];

const fail = (msg: string) => failures.push(msg);
const pass = (msg: string) => checks.push(msg);

function main() {
  let bank: QuestionBank;
  try {
    bank = JSON.parse(readFileSync(BANK_FILE, 'utf8')) as QuestionBank;
  } catch {
    console.error(`Could not read ${BANK_FILE}. Run \`npm run ingest\` first.`);
    process.exit(1);
  }

  const seenExternalIds = new Set<string>();

  for (const exam of bank.exams) {
    const label = exam.code;

    // 1. Question count matches the count declared in the file's own title line.
    if (exam.questions.length !== exam.bankSize) {
      fail(`${label}: parsed ${exam.questions.length} questions but the title declares ${exam.bankSize}`);
    } else {
      pass(`${label}: ${exam.questions.length} questions match the declared bank size`);
    }

    // 2 + 5. Option structure and answer-key letters.
    let optionProblems = 0;
    let keyProblems = 0;
    for (const q of exam.questions) {
      if (q.options.length !== 4) {
        fail(`${label} ${q.externalId}: ${q.options.length} options, expected 4`);
        optionProblems++;
        continue;
      }
      const letters = q.options.map((o) => o.letter);
      if (letters.join('') !== OPTION_LETTERS.join('')) {
        fail(`${label} ${q.externalId}: options are ${letters.join('')}, expected ABCD`);
        optionProblems++;
      }
      if (q.options.some((o) => o.text.trim() === '')) {
        fail(`${label} ${q.externalId}: has an empty option`);
        optionProblems++;
      }
      const texts = new Set(q.options.map((o) => o.text.trim()));
      if (texts.size !== 4) {
        fail(`${label} ${q.externalId}: has duplicate option text`);
        optionProblems++;
      }
      if (q.stem.trim() === '') {
        fail(`${label} ${q.externalId}: has an empty stem`);
        optionProblems++;
      }

      // 3. Exactly one answer key, expressed as at least one correct option + a rationale.
      const correct = q.options.filter((o) => o.isCorrect);
      if (correct.length === 0) {
        fail(`${label} ${q.externalId}: no correct option`);
        keyProblems++;
      }
      if (q.explanation.trim() === '') {
        fail(`${label} ${q.externalId}: no explanation`);
        keyProblems++;
      }

      // 4. MULTI <=> more than one correct option.
      const isMulti = correct.length > 1;
      if (isMulti !== (q.type === QuestionType.MULTI)) {
        fail(
          `${label} ${q.externalId}: type is ${q.type} but has ${correct.length} correct option(s)`,
        );
        keyProblems++;
      }

      // 9. Globally unique external IDs.
      if (seenExternalIds.has(q.externalId)) {
        fail(`${q.externalId}: duplicate external id`);
      }
      seenExternalIds.add(q.externalId);
    }
    if (optionProblems === 0) pass(`${label}: all questions have 4 distinct, non-empty A-D options`);
    if (keyProblems === 0) pass(`${label}: every question has a valid key and rationale`);

    // 6. Domain ranges are contiguous, non-overlapping, and cover 1..n.
    const domains = [...exam.domains].sort((a, b) => a.index - b.index);
    let cursor = 1;
    let rangeOk = true;
    for (const d of domains) {
      if (d.firstQuestion !== cursor) {
        fail(
          `${label} domain ${d.index} (${d.name}): starts at Q${d.firstQuestion}, expected Q${cursor}`,
        );
        rangeOk = false;
      }
      if (d.lastQuestion < d.firstQuestion) {
        fail(`${label} domain ${d.index}: inverted range`);
        rangeOk = false;
      }
      cursor = d.lastQuestion + 1;
    }
    if (cursor - 1 !== exam.bankSize) {
      fail(`${label}: domain ranges cover Q1-Q${cursor - 1} but the bank has ${exam.bankSize}`);
      rangeOk = false;
    }
    if (rangeOk) pass(`${label}: ${domains.length} domain ranges are contiguous and cover the bank`);

    // Declared per-domain counts match what was actually parsed into each domain.
    let countsOk = true;
    for (const d of domains) {
      const actual = exam.questions.filter((q) => q.domainIndex === d.index).length;
      if (actual !== d.declaredCount) {
        fail(
          `${label} domain ${d.index} (${d.name}): weight table declares ${d.declaredCount} questions, parsed ${actual}`,
        );
        countsOk = false;
      }
    }
    if (countsOk) pass(`${label}: per-domain question counts match the weight table`);

    // 7. Weights sum to 100 (+/- 0.5).
    const weightSum = domains.reduce((s, d) => s + d.weight, 0);
    if (Math.abs(weightSum - 100) > 0.5) {
      fail(`${label}: domain weights sum to ${weightSum.toFixed(1)}%, expected 100%`);
    } else {
      pass(`${label}: domain weights sum to ${weightSum.toFixed(1)}%`);
    }

    // 8. Every domain's bank can cover its real-exam allocation (and its mock allocation).
    const weights: DomainWeight[] = domains.map((d) => ({
      index: d.index,
      name: d.name,
      weight: d.weight,
      available: exam.questions.filter((q) => q.domainIndex === d.index).length,
    }));

    for (const mode of [ExamMode.REAL, ExamMode.MOCK] as const) {
      const total = itemCountFor(exam.realItemCount, mode);
      try {
        const alloc = allocateByWeight(weights, total);
        const sum = alloc.reduce((s, a) => s + a.allocated, 0);
        if (sum !== total) {
          fail(`${label} ${mode}: allocation sums to ${sum}, expected ${total}`);
          continue;
        }
        const short = alloc.filter((a) => a.allocated > a.available);
        if (short.length > 0) {
          for (const a of short) {
            fail(
              `${label} ${mode} domain ${a.index}: needs ${a.allocated} items but the bank holds ${a.available}`,
            );
          }
          continue;
        }
        const empty = alloc.filter((a) => a.allocated === 0);
        if (empty.length > 0) {
          fail(`${label} ${mode}: domain(s) ${empty.map((e) => e.index).join(', ')} got 0 items`);
          continue;
        }
        pass(
          `${label} ${mode}: ${total} items allocate as [${alloc.map((a) => a.allocated).join(', ')}]`,
        );
      } catch (err) {
        fail(`${label} ${mode}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  const total = bank.exams.reduce((s, e) => s + e.questions.length, 0);

  console.log(`\nValidating ${total} questions across ${bank.exams.length} exams\n`);
  for (const c of checks) console.log(`  ok   ${c}`);
  if (failures.length > 0) {
    console.log('');
    for (const f of failures) console.error(`  FAIL ${f}`);
    console.error(`\n${failures.length} invariant(s) violated.`);
    process.exit(1);
  }
  console.log(`\nAll invariants hold. ${total} questions are safe to seed.`);
}

main();
