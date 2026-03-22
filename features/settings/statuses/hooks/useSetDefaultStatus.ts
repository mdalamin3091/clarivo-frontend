'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { setDefaultStatus } from '../api';
import { useStatusesStore } from '../store';

export function useSetDefaultStatus() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const setDefault = useStatusesStore((s) => s.setDefaultStatus);

  return useMutation({
    mutationFn: (id: string) => setDefaultStatus(id),
    onMutate: (id) => {
      // Optimistic update — instantly reflects in UI
      setDefault(id);
    },
    onSuccess: () => {
      toast.success('Default status updated');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to update default status');
      qc.invalidateQueries({ queryKey: queryKeys.statuses.list(orgId) });
    },
  });
}
