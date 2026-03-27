'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { toggleCommentVote } from '../api';

export function useToggleCommentVote(feedbackId: string) {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useMutation({
    mutationFn: ({ commentId, type }: { commentId: string; type: 'upvote' | 'downvote' }) =>
      toggleCommentVote(feedbackId, commentId, { type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.detail(orgId, feedbackId) });
    },
  });
}
