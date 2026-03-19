'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { setActiveOrganization } from '../api';

interface Result {
  select: (orgId: string) => Promise<void>;
  isSelecting: boolean;
  selectingId: string | null;
  error: string | null;
}

/**
 * Handles org selection: sets the active org, invalidates the workspace list
 * cache so WorkspaceSwitcher shows fresh data immediately on dashboard mount,
 * and navigates to the dashboard on success.
 */
export function useSelectOrg(): Result {
  const router      = useRouter();
  const queryClient = useQueryClient();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const select = async (orgId: string) => {
    setSelectingId(orgId);
    setError(null);
    try {
      await setActiveOrganization(orgId);
      // Invalidate TanStack Query cache so WorkspaceSwitcher re-fetches fresh list
      await queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
      // Refresh better-auth atoms for active org display
      authClient.$store.notify('$activeOrgSignal');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select organization');
      setSelectingId(null);
    }
  };

  return { select, isSelecting: selectingId !== null, selectingId, error };
}
