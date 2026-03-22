'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { fetchBoards } from '../api';

export function useBoards() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useQuery({
    queryKey: queryKeys.boards.list(orgId),
    queryFn:  fetchBoards,
    enabled:  !!orgId,
  });
}
