'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { updateOrg } from '../api';
import type { WorkspaceFormData } from '../types';

export function useUpdateWorkspace(orgId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkspaceFormData) => updateOrg(orgId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.active(orgId ?? '') });
    },
  });
}
