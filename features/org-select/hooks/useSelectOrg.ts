'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { setActiveOrganization } from '../api';

interface Result {
  select: (orgId: string) => Promise<void>;
  isSelecting: boolean;
  selectingId: string | null;
  error: string | null;
}

/**
 * Handles org selection: sets the active org, refreshes auth store atoms,
 * and navigates to the dashboard on success.
 */
export function useSelectOrg(): Result {
  const router = useRouter();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const select = async (orgId: string) => {
    setSelectingId(orgId);
    setError(null);
    try {
      await setActiveOrganization(orgId);
      // Refresh auth store so sidebar org display updates immediately
      authClient.$store.notify('$listOrg');
      authClient.$store.notify('$activeOrgSignal');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select organization');
      setSelectingId(null);
    }
  };

  return { select, isSelecting: selectingId !== null, selectingId, error };
}
