'use client';

import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';

/**
 * Fetches the current user's workspace list via TanStack Query.
 * Using TanStack Query (instead of the better-auth nanostore atom) gives us
 * explicit cache invalidation — so the list is always fresh after org switch.
 */
export function useWorkspaceList() {
  return useQuery({
    queryKey: queryKeys.workspaces.list(),
    queryFn: async () => {
      const { data } = await authClient.organization.list();
      return data ?? [];
    },
    staleTime: 30_000,
  });
}
