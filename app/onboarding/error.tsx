'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
      <p className="text-sm font-medium text-muted-foreground">
        Something went wrong loading onboarding.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
