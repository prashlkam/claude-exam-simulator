import { createHash } from 'node:crypto';
import { OPTION_LETTERS, QuestionType, type OptionLetter } from './enums';
import type {
  ParsedDomain,
  ParsedExam,
  ParsedOption,
  ParsedQuestion,
} from '../types/exam';

/**
 * Markdown -> validated JSON (PLAN.md §5).
 *
 * This is a BUILD-TIME step. The markdown in data/ is never parsed at request time and
 * is never modified.
 *
 * The source format is completely regular (verified across all 540 questions), so the
 * parser is a strict line-by-line state machine: anything unexpected is a hard error with
 * a file:line reference rather than a silent skip. A silently dropped question would
 * corrupt every blueprint allocation downstream.
 */

/**
 * Source files mix en dash (Q1–Q22) and em dash (answer rationales). Rather than mutate
 * the text — which would alter question content — every pattern accepts any dash.
 */
const DASH = '[\\u2010-\\u2015\\u2212-]';

const RE_TITLE = new RegExp(
  `^#\\s+(?<title>.+?)\\s+\\((?<code>CC[A-Z]{2}-F)\\)\\s+${DASH}\\s+(?<bank>\\d+)\\s+Practice Questions\\s*$`,
);
const RE_ITEMS = /(?<items>\d+)\s+items,\s*(?<minutes>\d+)\s+minutes/;
const RE_PASS = /passing score\s+(?<pass>\d+)/;
const RE_WEIGHT_ROW = new RegExp(
  `^\\|\\s*(?<index>\\d+)\\s*\\|\\s*(?<name>[^|]+?)\\s*\\|\\s*(?<weight>[\\d.]+)%\\s*\\|` +
    `\\s*(?<count>\\d+)\\s*\\(Q(?<first>\\d+)${DASH}Q(?<last>\\d+)\\)\\s*\\|\\s*$`,
);
const RE_DOMAIN = new RegExp(
  `^##\\s+Domain\\s+(?<index>\\d+):\\s*(?<name>.+?)\\s*\\(Q(?<first>\\d+)${DASH}Q(?<last>\\d+)\\)\\s*$`,
);
const RE_SUBTOPIC = /^###\s+(?<label>.+?)\s*$/;
const RE_QUESTION = /^\*\*Q(?<number>\d+)\.\*\*\s*(?<multi>\*\*\(Select TWO\)\*\*)?\s*(?<stem>.+?)\s*$/;
const RE_OPTION = /^(?<letter>[A-D])\.\s+(?<text>.+?)\s*$/;
const RE_ANSWER_KEY_START = /^##\s+Answer Key/;
const RE_ANSWER = new RegExp(
  `^(?<number>\\d+)\\.\\s+\\*\\*(?<letters>[A-D](?:,\\s*[A-D])*)\\*\\*\\s*${DASH}\\s*(?<rationale>.+?)\\s*$`,
);

export class IngestError extends Error {
  constructor(file: string, line: number, message: string) {
    super(`${file}:${line} — ${message}`);
    this.name = 'IngestError';
  }
}

interface RawQuestion {
  number: number;
  domainIndex: number;
  subTopic: string | null;
  type: QuestionType;
  stem: string;
  options: { letter: OptionLetter; text: string }[];
  line: number;
}

export function parseExam(file: string, source: string): ParsedExam {
  // Normalise only line endings and non-breaking spaces; dashes are matched, not rewritten.
  const lines = source.replace(/\r\n?/g, '\n').replace(/ /g, ' ').split('\n');

  let title: string | undefined;
  let code: string | undefined;
  let bankSize = 0;
  let realItemCount = 0;
  let durationMinutes = 0;
  let passingScaledScore = 720;

  const weightRows: ParsedDomain[] = [];
  const questions: RawQuestion[] = [];
  const answers = new Map<number, { letters: OptionLetter[]; rationale: string; line: number }>();

  let currentDomain: { index: number; first: number; last: number } | null = null;
  let currentSubTopic: string | null = null;
  let inAnswerKey = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;

    if (!title) {
      const m = RE_TITLE.exec(line);
      if (m?.groups) {
        title = m.groups.title;
        code = m.groups.code;
        bankSize = Number(m.groups.bank);
        continue;
      }
    }

    if (!realItemCount && line.includes('Exam facts')) {
      const items = RE_ITEMS.exec(line);
      if (!items?.groups) {
        throw new IngestError(file, lineNo, 'Exam facts line is missing "N items, M minutes"');
      }
      realItemCount = Number(items.groups.items);
      durationMinutes = Number(items.groups.minutes);
      const pass = RE_PASS.exec(line);
      if (pass?.groups) passingScaledScore = Number(pass.groups.pass);
      continue;
    }

    if (RE_ANSWER_KEY_START.test(line)) {
      inAnswerKey = true;
      currentDomain = null;
      currentSubTopic = null;
      continue;
    }

    if (!inAnswerKey) {
      const weight = RE_WEIGHT_ROW.exec(line);
      if (weight?.groups) {
        weightRows.push({
          index: Number(weight.groups.index),
          name: weight.groups.name,
          weight: Number(weight.groups.weight),
          declaredCount: Number(weight.groups.count),
          firstQuestion: Number(weight.groups.first),
          lastQuestion: Number(weight.groups.last),
        });
        continue;
      }

      const domain = RE_DOMAIN.exec(line);
      if (domain?.groups) {
        currentDomain = {
          index: Number(domain.groups.index),
          first: Number(domain.groups.first),
          last: Number(domain.groups.last),
        };
        currentSubTopic = null;
        continue;
      }

      // `###` inside a domain is an OPTIONAL sub-topic label: CCAR-F uses
      // "Task 1.1: …", CCDV-F uses skill names, CCAO-F has none. (PLAN.md §2.2)
      const sub = RE_SUBTOPIC.exec(line);
      if (sub?.groups && currentDomain) {
        currentSubTopic = sub.groups.label;
        continue;
      }

      const question = RE_QUESTION.exec(line);
      if (question?.groups) {
        if (!currentDomain) {
          throw new IngestError(file, lineNo, 'question appears before any domain heading');
        }
        const number = Number(question.groups.number);
        if (number < currentDomain.first || number > currentDomain.last) {
          throw new IngestError(
            file,
            lineNo,
            `Q${number} falls outside its domain range Q${currentDomain.first}-Q${currentDomain.last}`,
          );
        }

        // Options must be the next four non-blank lines. Verified true for all 540 items.
        const options: { letter: OptionLetter; text: string }[] = [];
        let j = i + 1;
        while (j < lines.length && options.length < 4) {
          const candidate = lines[j];
          if (candidate.trim() === '') {
            j++;
            continue;
          }
          const opt = RE_OPTION.exec(candidate);
          if (!opt?.groups) {
            throw new IngestError(
              file,
              j + 1,
              `expected option ${OPTION_LETTERS[options.length]} for Q${number}, got: ${candidate.slice(0, 60)}`,
            );
          }
          const expected = OPTION_LETTERS[options.length];
          if (opt.groups.letter !== expected) {
            throw new IngestError(
              file,
              j + 1,
              `Q${number} options out of order: expected ${expected}, got ${opt.groups.letter}`,
            );
          }
          options.push({ letter: opt.groups.letter as OptionLetter, text: opt.groups.text });
          j++;
        }
        if (options.length !== 4) {
          throw new IngestError(file, lineNo, `Q${number} has ${options.length} options, expected 4`);
        }

        questions.push({
          number,
          domainIndex: currentDomain.index,
          subTopic: currentSubTopic,
          type: question.groups.multi ? QuestionType.MULTI : QuestionType.SINGLE,
          stem: question.groups.stem,
          options,
          line: lineNo,
        });

        i = j - 1; // resume after the options
        continue;
      }
    } else {
      const answer = RE_ANSWER.exec(line);
      if (answer?.groups) {
        const number = Number(answer.groups.number);
        if (answers.has(number)) {
          throw new IngestError(file, lineNo, `duplicate answer-key entry for Q${number}`);
        }
        const letters = answer.groups.letters
          .split(',')
          .map((l) => l.trim() as OptionLetter)
          .sort();
        answers.set(number, { letters, rationale: answer.groups.rationale, line: lineNo });
      }
    }
  }

  if (!title || !code) throw new IngestError(file, 1, 'could not parse the title line');
  if (!realItemCount) throw new IngestError(file, 1, 'could not parse the "Exam facts" line');
  if (weightRows.length === 0) throw new IngestError(file, 1, 'no domain weight table rows found');

  // Join questions to their answer-key entries.
  const parsed: ParsedQuestion[] = questions.map((q) => {
    const answer = answers.get(q.number);
    if (!answer) {
      throw new IngestError(file, q.line, `Q${q.number} has no answer-key entry`);
    }

    const isMulti = answer.letters.length > 1;
    if (isMulti !== (q.type === QuestionType.MULTI)) {
      throw new IngestError(
        file,
        q.line,
        `Q${q.number} is marked ${q.type} but the answer key gives ${answer.letters.length} letter(s)`,
      );
    }

    const options: ParsedOption[] = q.options.map((o) => ({
      letter: o.letter,
      text: o.text,
      isCorrect: answer.letters.includes(o.letter),
    }));

    const contentHash =
      'sha256:' +
      createHash('sha256')
        .update(
          [q.stem, ...q.options.map((o) => `${o.letter}. ${o.text}`), answer.letters.join(',')].join(
            '\n',
          ),
        )
        .digest('hex')
        .slice(0, 32);

    return {
      externalId: `${code}-Q${q.number}`,
      number: q.number,
      domainIndex: q.domainIndex,
      subTopic: q.subTopic,
      type: q.type,
      stem: q.stem,
      options,
      explanation: answer.rationale,
      contentHash,
    };
  });

  // Orphan answers (a key entry with no matching question) would mean a lost question.
  for (const number of answers.keys()) {
    if (!questions.some((q) => q.number === number)) {
      throw new IngestError(
        file,
        answers.get(number)!.line,
        `answer-key entry for Q${number} has no matching question`,
      );
    }
  }

  return {
    code,
    title,
    sourceFile: file,
    bankSize,
    realItemCount,
    durationMinutes,
    passingScaledScore,
    domains: weightRows,
    questions: parsed,
  };
}

