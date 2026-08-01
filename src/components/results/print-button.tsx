'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui';

/** Print/PDF export via the browser's own dialog + the print stylesheet (PLAN.md §11.6). */
export function PrintButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Printer className="h-4 w-4" />
      <span className="hidden sm:inline">Export PDF</span>
    </Button>
  );
}
