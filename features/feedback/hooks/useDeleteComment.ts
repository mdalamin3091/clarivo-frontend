'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { deleteComment } from '../api';

export function useDeleteComment(feedbackId: string) {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(feedbackId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.detail(orgId, feedbackId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list(orgId) });
    },
  });
}
