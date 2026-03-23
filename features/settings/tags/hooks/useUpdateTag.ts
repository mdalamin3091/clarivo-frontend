'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateTag } from '../api';
import { useTagsStore } from '../store';
import type { UpdateTagInput } from '../types';

export function useUpdateTag() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchTag, closeDialog } = useTagsStore();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTagInput }) =>
      updateTag(id, input),
    onSuccess: (tag) => {
      patchTag(tag.id, tag);
      closeDialog();
      toast.success('Tag updated');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to update tag');
      qc.invalidateQueries({ queryKey: queryKeys.tags.list(orgId) });
    },
  });
}
