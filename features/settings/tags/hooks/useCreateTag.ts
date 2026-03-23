'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { createTag } from '../api';
import { useTagsStore } from '../store';
import type { CreateTagInput } from '../types';

export function useCreateTag() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { addTag, closeDialog } = useTagsStore();

  return useMutation({
    mutationFn: (input: CreateTagInput) => createTag(input),
    onSuccess: (tag) => {
      addTag(tag);
      closeDialog();
      toast.success('Tag created');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to create tag');
      qc.invalidateQueries({ queryKey: queryKeys.tags.list(orgId) });
    },
  });
}
