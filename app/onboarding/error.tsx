'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Something went wrong loading onboarding.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <Loader2 className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
