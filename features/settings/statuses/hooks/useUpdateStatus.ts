'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateStatus } from '../api';
import { useStatusesStore } from '../store';
import type { UpdateStatusInput } from '../types';

export function useUpdateStatus() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchStatus, closeDialog } = useStatusesStore();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStatusInput }) =>
      updateStatus(id, input),
    onSuccess: (status) => {
      patchStatus(status.id, status);
      closeDialog();
      toast.success('Status updated');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to update status');
      qc.invalidateQueries({ queryKey: queryKeys.statuses.list(orgId) });
    },
  });
}
