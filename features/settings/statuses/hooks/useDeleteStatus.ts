'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { deleteStatus } from '../api';
import { useStatusesStore } from '../store';

export function useDeleteStatus() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const removeStatus = useStatusesStore((s) => s.removeStatus);

  return useMutation({
    mutationFn: (id: string) => deleteStatus(id),
    onMutate: (id) => {
      // Optimistic remove
      removeStatus(id);
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to delete status');
      qc.invalidateQueries({ queryKey: queryKeys.statuses.list(orgId) });
    },
    onSuccess: () => {
      toast.success('Status deleted');
    },
  });
}
