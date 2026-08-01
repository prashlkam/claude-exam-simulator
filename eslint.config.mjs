import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'generated/**',
      'deploy/**',
      'scripts/_*.ts',
      'next-env.d.ts',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Guard rail from PLAN.md §6.5: route handlers and server actions must wrap database
    // work in withDb() so a serverless resume is absorbed rather than surfacing as a 500.
    files: ['src/app/**/*.ts', 'src/app/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "AwaitExpression > CallExpression > MemberExpression[object.name='prisma']",
          message:
            'Wrap database calls in withDb(() => prisma...) so a serverless resume is retried (PLAN.md §6.5).',
        },
      ],
    },
  },
];

export default config;
