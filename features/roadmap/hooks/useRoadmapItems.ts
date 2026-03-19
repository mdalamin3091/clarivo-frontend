'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getRoadmapItems } from '../api';

export function useRoadmapItems(orgId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.roadmap.list(orgId ?? ''),
    queryFn: () => getRoadmapItems(orgId!),
    enabled: !!orgId,
  });
}
