import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            C
          </span>
          <span className="text-lg font-semibold tracking-tight">Claude Exam Simulator</span>
          <span className="text-sm text-muted-foreground">
            Practice exams for the Claude Foundations certifications
          </span>
        </Link>
        {children}
      </div>
      <p className="mt-8 max-w-sm text-center text-xs text-muted-foreground">
        An independent study tool. Not affiliated with or endorsed by Anthropic.
      </p>
    </main>
  );
}
