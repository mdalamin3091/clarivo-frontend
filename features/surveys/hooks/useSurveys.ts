'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getSurveys } from '../api';

export function useSurveys(orgId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.surveys.list(orgId ?? ''),
    queryFn: () => getSurveys(orgId!),
    enabled: !!orgId,
  });
}
