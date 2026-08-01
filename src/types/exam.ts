import type { OptionLetter, QuestionType } from '@/lib/enums';

/** Shape emitted by scripts/ingest.ts into generated/questions.json (PLAN.md §5.2). */

export interface ParsedOption {
  letter: OptionLetter;
  text: string;
  isCorrect: boolean;
}

export interface ParsedQuestion {
  externalId: string;
  number: number;
  domainIndex: number;
  subTopic: string | null;
  type: QuestionType;
  stem: string;
  options: ParsedOption[];
  explanation: string;
  contentHash: string;
}

export interface ParsedDomain {
  index: number;
  name: string;
  weight: number;
  /** Question-number range declared by the domain heading, inclusive. */
  firstQuestion: number;
  lastQuestion: number;
  /** Count declared in the header weight table. */
  declaredCount: number;
}

export interface ParsedExam {
  code: string;
  title: string;
  sourceFile: string;
  bankSize: number;
  realItemCount: number;
  durationMinutes: number;
  passingScaledScore: number;
  domains: ParsedDomain[];
  questions: ParsedQuestion[];
}

export interface QuestionBank {
  generatedAt: string;
  exams: ParsedExam[];
}
