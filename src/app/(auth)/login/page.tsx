import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Continue to your practice dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm next={params.next} justRegistered={params.registered === '1'} />
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
