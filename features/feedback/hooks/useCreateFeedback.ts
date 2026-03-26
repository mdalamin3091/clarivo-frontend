'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { createFeedbackPost } from '../api';

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useMutation({
    mutationFn: (data: {
      boardId:      string;
      title:        string;
      description:  string;
      statusId?:    string;
      tagIds?:      string[];
      assigneeIds?: string[];
    }) => createFeedbackPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list(orgId) });
    },
  });
}
