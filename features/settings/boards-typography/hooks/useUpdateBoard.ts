'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateBoard } from '../api';
import { useBoardsStore } from '../store';
import type { UpdateBoardInput } from '../types';

export function useUpdateBoard() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchBoard, closeDialog } = useBoardsStore();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBoardInput }) =>
      updateBoard(id, input),
    onSuccess: (board) => {
      patchBoard(board.id, board);
      closeDialog();
      toast.success('Board updated');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to update board');
      qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
    },
  });
}
