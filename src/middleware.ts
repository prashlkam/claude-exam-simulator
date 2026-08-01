import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * Route protection (PLAN.md §9.1).
 *
 * Built from the edge-safe config only — no Prisma, no bcrypt. The `authorized` callback
 * in auth.config.ts decides redirects from the session cookie alone.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    /*
     * Everything except:
     *  - /api routes (they do their own auth checks and must return JSON, not redirects)
     *  - Next.js internals and static assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
