'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateStatus } from '../api';
import type { Status } from '../types';

export function useReorderStatuses() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  const reorder = async (statuses: Status[]) => {
    try {
      await Promise.all(
        statuses.map((status, index) => updateStatus(status.id, { order: index + 1 })),
      );
    } catch {
      toast.error('Failed to save new order');
      await qc.invalidateQueries({ queryKey: queryKeys.statuses.list(orgId) });
    }
  };

  return { reorder };
}
