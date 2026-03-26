'use client';

import { useQuery } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

interface TagOption {
  id:    string;
  name:  string;
  color: string;
}

export function useOrgTags() {
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useQuery({
    queryKey: queryKeys.tags.list(orgId),
    queryFn:  () => apiFetch<{ tags: TagOption[] }>('/api/v1/tags').then((d) => d.tags),
    enabled:  !!orgId,
  });
}
