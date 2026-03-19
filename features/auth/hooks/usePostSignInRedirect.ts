'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';

/**
 * Returns an async `redirect()` function that checks how many orgs the
 * signed-in user belongs to and navigates accordingly:
 *  - 0 orgs  → /onboarding  (create first org)
 *  - 1 org   → auto-select it → /dashboard  (skip the picker)
 *  - 2+ orgs → /org-select  (show the picker)
 *
 * Always invalidates the workspace list cache before navigating so
 * WorkspaceSwitcher never renders stale data from a previous session.
 */
export function usePostSignInRedirect() {
  const router      = useRouter();
  const queryClient = useQueryClient();

  const redirect = useCallback(async () => {
    const { data: orgs } = await authClient.organization.list();
    const list = orgs ?? [];

    // Seed the TanStack Query cache with the fresh list so WorkspaceSwitcher
    // doesn't need to re-fetch on mount and never shows stale session data.
    queryClient.setQueryData(queryKeys.workspaces.list(), list);

    if (list.length === 0) {
      router.replace('/onboarding');
    } else if (list.length === 1) {
      await authClient.organization.setActive({ organizationId: list[0].id });
      authClient.$store.notify('$activeOrgSignal');
      router.replace('/dashboard');
    } else {
      router.replace('/org-select');
    }
  }, [router, queryClient]);

  return { redirect };
}
