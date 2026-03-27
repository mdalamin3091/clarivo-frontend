'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { addComment } from '../api';

export function useAddComment(feedbackId: string) {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useMutation({
    mutationFn: (body: { content: unknown; parentId?: string }) =>
      addComment(feedbackId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.detail(orgId, feedbackId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list(orgId) });
    },
  });
}
