'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Alert, Button, Input, Label, Spinner } from '@/components/ui';

/**
 * Login form with the cold-start warming state (PLAN.md §6.6).
 *
 * Azure SQL's free offer auto-pauses, so the first sign-in after an idle period waits on
 * a database resume. After 2s the button says so explicitly rather than spinning
 * silently — the delay is expected behaviour, not a fault.
 */
export function LoginForm({ next, justRegistered }: { next?: string; justRegistered?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (wakeTimer.current) clearTimeout(wakeTimer.current); }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setError(null);
    setPending(true);
    wakeTimer.current = setTimeout(() => setWaking(true), 2_000);

    try {
      const result = await signIn('credentials', {
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
        redirect: false,
      });

      if (result?.error) {
        // Generic message — never reveals whether the account exists (PLAN.md §13).
        setError('Incorrect email or password.');
        return;
      }

      router.push(next && next.startsWith('/') ? next : '/dashboard');
      router.refresh();
    } catch {
      setError('Could not sign in. Please try again.');
    } finally {
      if (wakeTimer.current) clearTimeout(wakeTimer.current);
      setWaking(false);
      setPending(false);
    }
  }

  return (
    /*
     * method="post" matters even though onSubmit always calls preventDefault: if the
     * client bundle ever fails to load, the browser's native fallback must not submit
     * as GET, which would put the password in the URL, browser history and server logs.
     */
    <form onSubmit={onSubmit} method="post" action="/login" className="flex flex-col gap-4">
      {justRegistered && (
        <Alert tone="success">Account created. Sign in to get started.</Alert>
      )}
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" disabled={pending} className="mt-1">
        {pending && <Spinner />}
        {waking ? 'Waking the database — about 30 seconds' : pending ? 'Signing in…' : 'Sign in'}
      </Button>

      {waking && (
        <p className="text-center text-xs text-muted-foreground">
          The database pauses when idle to stay within the free tier. This only happens on
          the first sign-in after a break.
        </p>
      )}
    </form>
  );
}
