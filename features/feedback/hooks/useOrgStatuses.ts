'use client';

import { useQuery } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export interface StatusOption {
  id:        string;
  name:      string;
  color:     string;
  isDefault: boolean;
}

export function useOrgStatuses() {
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useQuery({
    queryKey: queryKeys.statuses.list(orgId),
    queryFn:  () => apiFetch<{ statuses: StatusOption[] }>('/api/v1/statuses').then((d) => d.statuses),
    enabled:  !!orgId,
  });
}
