import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe half of the Auth.js configuration.
 *
 * Middleware runs on the Edge runtime, where Prisma and bcrypt cannot load. This file
 * therefore contains NO providers and NO database access — only the session-cookie check
 * and redirect rules. The full config (src/auth.ts) adds the Credentials provider and
 * runs on Node. (PLAN.md §12.1)
 */

const PUBLIC_ROUTES = ['/login', '/register'];

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true, // honour App Service proxy headers (PLAN.md §12.3)
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = request.nextUrl;

      const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

      if (isPublic) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', request.nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        const url = new URL('/login', request.nextUrl);
        if (pathname !== '/') url.searchParams.set('next', pathname);
        return Response.redirect(url);
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
