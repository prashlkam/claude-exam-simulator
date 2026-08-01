'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Input, Label, Spinner } from '@/components/ui';
import { passwordStrength, registerSchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string[]>>;

export function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [password, setPassword] = useState('');

  const strength = passwordStrength(password);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      confirmPassword: String(form.get('confirmPassword') ?? ''),
    };

    setError(null);
    setFieldErrors({});

    // Validate client-side with the same schema the server uses.
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as FieldErrors);
      return;
    }

    setPending(true);
    const wakeTimer = setTimeout(() => setWaking(true), 2_000);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        error?: string;
        fieldErrors?: FieldErrors;
        waking?: boolean;
      };

      if (!response.ok) {
        setError(data.error ?? 'Could not create your account.');
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        return;
      }

      router.push('/login?registered=1');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      clearTimeout(wakeTimer);
      setWaking(false);
      setPending(false);
    }
  }

  const strengthTone = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-warning', 'bg-success'][
    strength.score
  ];

  return (
    /* method="post" — see the note in login-form.tsx; a no-JS fallback must never put
       credentials into a query string. */
    <form
      onSubmit={onSubmit}
      method="post"
      action="/register"
      className="flex flex-col gap-4"
      noValidate
    >
      {error && <Alert tone="danger">{error}</Alert>}

      <Field label="Name" id="name" errors={fieldErrors.name}>
        <Input id="name" name="name" autoComplete="name" required autoFocus />
      </Field>

      <Field label="Email" id="email" errors={fieldErrors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Password" id="password" errors={fieldErrors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby="password-strength"
        />
        {password.length > 0 && (
          <div className="mt-1.5 flex items-center gap-2" id="password-strength">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', strengthTone)}
                style={{ width: `${((strength.score + 1) / 5) * 100}%` }}
              />
            </div>
            <span className="w-16 text-right text-xs text-muted-foreground">{strength.label}</span>
          </div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">At least 10 characters.</p>
      </Field>

      <Field label="Confirm password" id="confirmPassword" errors={fieldErrors.confirmPassword}>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </Field>

      <Button type="submit" disabled={pending} className="mt-1">
        {pending && <Spinner />}
        {waking ? 'Waking the database…' : pending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  errors,
  children,
}: {
  label: string;
  id: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {errors?.[0] && <p className="text-xs text-danger">{errors[0]}</p>}
    </div>
  );
}
