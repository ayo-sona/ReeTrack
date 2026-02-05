'use client';

import { AlertCircle } from 'lucide-react';

export function ErrorAlert() {
  return (
    <div className="rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-red-500/10">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          Unable to load analytics. The analytics API endpoint may not be implemented yet.
        </p>
      </div>
    </div>
  );
}