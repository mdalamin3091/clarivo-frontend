'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { createStatus } from '../api';
import { useStatusesStore } from '../store';
import type { CreateStatusInput } from '../types';

export function useCreateStatus() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { addStatus, setDefaultStatus, closeDialog } = useStatusesStore();

  return useMutation({
    mutationFn: (input: CreateStatusInput) => createStatus(input),
    onSuccess: (status) => {
      addStatus(status);
      // If the new status is default, sync the full default state in the store
      if (status.isDefault) setDefaultStatus(status.id);
      closeDialog();
      toast.success('Status created');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to create status');
      qc.invalidateQueries({ queryKey: queryKeys.statuses.list(orgId) });
    },
  });
}
