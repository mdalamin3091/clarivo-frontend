'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { deleteBoard } from '../api';

export function useDeleteBoard() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
    },
  });
}
