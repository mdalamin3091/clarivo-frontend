'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { deleteBoard } from '../api';
import { useBoardsStore } from '../store';

export function useDeleteBoard() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const removeBoard = useBoardsStore((s) => s.removeBoard);

  return useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onMutate: (id) => {
      removeBoard(id); // optimistic remove
    },
    onSuccess: () => {
      toast.success('Board deleted');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to delete board');
      qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
    },
  });
}
