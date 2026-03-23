'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { deleteTag } from '../api';
import { useTagsStore } from '../store';

export function useDeleteTag() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const removeTag = useTagsStore((s) => s.removeTag);

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onMutate: (id) => {
      removeTag(id); // optimistic remove
    },
    onSuccess: () => {
      toast.success('Tag deleted');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to delete tag');
      qc.invalidateQueries({ queryKey: queryKeys.tags.list(orgId) });
    },
  });
}
