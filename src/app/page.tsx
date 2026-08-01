import { redirect } from 'next/navigation';

export default function RootPage() {
  // Middleware redirects unauthenticated visitors to /login before this renders.
  redirect('/dashboard');
}
