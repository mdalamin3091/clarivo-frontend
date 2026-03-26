'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { createFeedbackPost } from '../api';
import type { FeedbackPost } from '../types';

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useMutation({
    mutationFn: (data: Pick<FeedbackPost, 'title' | 'description'> & { boardId: string }) =>
      createFeedbackPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list(orgId) });
    },
  });
}
