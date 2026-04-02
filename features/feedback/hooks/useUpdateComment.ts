'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { updateCommentInTree } from '@/shared/components/comments/utils';
import type { CommentData } from '@/shared/components/comments/types';
import { updateComment } from '../api';
import type { FeedbackDetail } from '../types';

export function useUpdateComment(feedbackId: string) {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';
  const key   = queryKeys.feedback.detail(orgId, feedbackId);

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: unknown }) =>
      updateComment(feedbackId, commentId, { content }),

    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<FeedbackDetail>(key);

      queryClient.setQueryData<FeedbackDetail>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: updateCommentInTree(
            old.comments as unknown as CommentData[],
            commentId,
            (c) => ({ ...c, content, isEdited: true, updatedAt: new Date().toISOString() }),
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
