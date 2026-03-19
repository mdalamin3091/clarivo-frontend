'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { usePostSignInRedirect } from '@/features/auth/hooks/usePostSignInRedirect';

/**
 * Landing page after Google OAuth redirect.
 * Checks org count and routes: 0 → onboarding, 1 → dashboard (auto-select), 2+ → org-select.
 */
export default function AuthCallbackPage() {
  const { data: session, isPending } = useSession();
  const { redirect } = usePostSignInRedirect();

  useEffect(() => {
    if (!isPending && session) {
      redirect();
    }
  }, [session, isPending, redirect]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
