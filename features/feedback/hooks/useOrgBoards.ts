'use client';

import { useQuery } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { getOrgBoards } from '../api';

export function useOrgBoards() {
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useQuery({
    queryKey: ['boards', orgId],
    queryFn:  getOrgBoards,
    enabled:  !!orgId,
  });
}
