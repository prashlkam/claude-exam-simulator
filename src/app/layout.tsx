import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Claude Certification Exam Simulator',
    template: '%s · Exam Simulator',
  },
  description:
    'Practice exams for the Claude Associate, Developer, and Architect Foundations certifications, with domain-weighted scoring and progress tracking.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcfb' },
    { media: '(prefers-color-scheme: dark)', color: '#101319' },
  ],
};

/**
 * Applies the stored theme before first paint so a dark-mode user never sees a
 * white flash. Runs synchronously, ahead of hydration.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
