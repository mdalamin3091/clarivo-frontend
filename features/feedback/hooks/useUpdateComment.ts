'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { updateComment } from '../api';

export function useUpdateComment(feedbackId: string) {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: unknown }) =>
      updateComment(feedbackId, commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.detail(orgId, feedbackId) });
    },
  });
}
