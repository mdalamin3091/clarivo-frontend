'use client';

import { useQuery } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { getFeedbackDetail } from '../api';

export function useGetFeedback(feedbackId: string | null) {
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useQuery({
    queryKey: queryKeys.feedback.detail(orgId, feedbackId ?? ''),
    queryFn:  () => getFeedbackDetail(feedbackId!),
    enabled:  !!orgId && !!feedbackId,
  });
}
