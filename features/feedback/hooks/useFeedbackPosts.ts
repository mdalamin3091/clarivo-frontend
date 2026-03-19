'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getFeedbackPosts } from '../api';

export function useFeedbackPosts(orgId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.feedback.list(orgId ?? ''),
    queryFn: () => getFeedbackPosts(orgId!),
    enabled: !!orgId,
  });
}
