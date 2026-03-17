import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { OnboardingClient } from './_components/OnboardingClient';

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <OnboardingClient />
    </Suspense>
  );
}
