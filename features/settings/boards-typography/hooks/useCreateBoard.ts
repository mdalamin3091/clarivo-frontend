'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { createBoard } from '../api';
import { useBoardsStore } from '../store';
import type { CreateBoardInput } from '../types';

export function useCreateBoard() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { addBoard, closeDialog } = useBoardsStore();

  return useMutation({
    mutationFn: (input: CreateBoardInput) => createBoard(input),
    onSuccess: (board) => {
      addBoard(board);
      closeDialog();
      toast.success('Board created');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to create board');
      qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
    },
  });
}
