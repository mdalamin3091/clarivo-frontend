'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { createBoard } from '../api';
import type { CreateBoardInput } from '../types';

export function useCreateBoard(onSuccess?: () => void) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useMutation({
    mutationFn: (input: CreateBoardInput) => createBoard(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
      onSuccess?.();
    },
  });
}
