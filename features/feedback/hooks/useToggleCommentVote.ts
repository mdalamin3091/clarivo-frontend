'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { updateCommentInTree } from '@/shared/components/comments/utils';
import type { CommentData } from '@/shared/components/comments/types';
import { toggleCommentVote } from '../api';
import type { FeedbackDetail } from '../types';

export function useToggleCommentVote(feedbackId: string) {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';
  const key   = queryKeys.feedback.detail(orgId, feedbackId);

  return useMutation({
    mutationFn: ({ commentId, type }: { commentId: string; type: 'upvote' | 'downvote' }) =>
      toggleCommentVote(feedbackId, commentId, { type }),

    onMutate: async ({ commentId, type }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<FeedbackDetail>(key);

      queryClient.setQueryData<FeedbackDetail>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: updateCommentInTree(
            old.comments as unknown as CommentData[],
            commentId,
            (c) => {
              const wasVoted = c.myVote === type;
              const wasDiff  = c.myVote !== null && c.myVote !== type;
              return {
                ...c,
                myVote: wasVoted ? null : type,
                votes: {
                  upvotes: type === 'upvote'
                    ? wasVoted ? c.votes.upvotes - 1 : c.votes.upvotes + 1
                    : wasDiff ? c.votes.upvotes - 1 : c.votes.upvotes,
                  downvotes: type === 'downvote'
                    ? wasVoted ? c.votes.downvotes - 1 : c.votes.downvotes + 1
                    : wasDiff ? c.votes.downvotes - 1 : c.votes.downvotes,
                },
              };
            },
          ) as unknown as typeof old.comments,
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
