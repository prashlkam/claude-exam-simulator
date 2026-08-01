import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from './register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = { title: 'Create an account' };

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Track your practice results across sittings.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
