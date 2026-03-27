'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { updateFeedbackPost } from '../api';

export function useUpdateFeedback() {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useMutation({
    mutationFn: ({ id, data }: {
      id: string;
      data: {
        title?:          string;
        description?:    string;
        boardId?:        string;
        statusId?:       string | null;
        tagIds?:         string[];
        assigneeIds?:    string[];
        eta?:            string | null;
        postVisibility?: 'public' | 'private';
        enableComment?:  boolean;
      };
    }) => updateFeedbackPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list(orgId) });
    },
  });
}
