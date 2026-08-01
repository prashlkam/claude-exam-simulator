import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignOutButton } from '@/components/sign-out-button';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // Middleware already gates this, but a server-side check means a route can never
  // render with a missing user even if the matcher changes.
  if (!session?.user?.id) redirect('/login');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              C
            </span>
            <span className="hidden sm:inline">Exam Simulator</span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/history">History</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <span className="hidden max-w-40 truncate text-sm text-muted-foreground md:inline">
              {session.user.name ?? session.user.email}
            </span>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </Link>
  );
}
