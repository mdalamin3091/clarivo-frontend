'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { createFeedbackPost } from '../api';
import type { FeedbackPost } from '../types';

export function useCreateFeedback(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Pick<FeedbackPost, 'title' | 'description'>) =>
      createFeedbackPost(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list(orgId) });
    },
  });
}
