'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getChangelogs } from '../api';

export function useChangelogs(orgId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.changelog.list(orgId ?? ''),
    queryFn: () => getChangelogs(orgId!),
    enabled: !!orgId,
  });
}
