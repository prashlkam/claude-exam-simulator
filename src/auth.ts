import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { prisma, withDb } from './lib/db';
import { loginSchema } from './lib/validation';

/**
 * Full Auth.js configuration — Node runtime only (Prisma + bcrypt). PLAN.md §4.1.
 *
 * Credentials + JWT sessions, so no database adapter is required: the session lives in a
 * signed, HttpOnly cookie and the database is touched only to verify the password.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // withDb absorbs the serverless resume delay so a cold start reads as a slow
        // login rather than a failed one (PLAN.md §6.5, §6.6).
        const user = await withDb(() =>
          prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, passwordHash: true },
          }),
        );

        // Compare against a dummy hash when the user is missing so the response time
        // does not reveal whether the account exists.
        const hash = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
        const valid = await bcrypt.compare(password, hash);

        if (!user || !valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
});
