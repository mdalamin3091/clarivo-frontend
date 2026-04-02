'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { addReplyToTree } from '@/shared/components/comments/utils';
import type { CommentData } from '@/shared/components/comments/types';
import { addComment } from '../api';
import type { FeedbackDetail } from '../types';

interface AuthorInfo {
  memberId: string;
  role:     string;
  userId:   string;
  name:     string;
}

export function useAddComment(feedbackId: string, authorInfo: AuthorInfo | null) {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';
  const key   = queryKeys.feedback.detail(orgId, feedbackId);

  return useMutation({
    mutationFn: (body: { content: unknown; parentId?: string }) =>
      addComment(feedbackId, body),

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<FeedbackDetail>(key);

      if (authorInfo) {
        const optimistic: CommentData = {
          id:        `temp-${Date.now()}`,
          authorId:  authorInfo.memberId,
          parentId:  body.parentId ?? null,
          content:   body.content,
          isEdited:  false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author:    { id: authorInfo.memberId, role: authorInfo.role, user: { id: authorInfo.userId, name: authorInfo.name, image: null } },
          votes:     { upvotes: 0, downvotes: 0 },
          myVote:    null,
          replies:   [],
        };

        queryClient.setQueryData<FeedbackDetail>(key, (old) => {
          if (!old) return old;
          if (body.parentId) {
            return {
              ...old,
              comments: addReplyToTree(old.comments as unknown as CommentData[], body.parentId, optimistic) as unknown as typeof old.comments,
            };
          }
          return { ...old, comments: [...old.comments, optimistic as unknown as typeof old.comments[number]] };
        });
      }

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list(orgId) });
    },
  });
}
