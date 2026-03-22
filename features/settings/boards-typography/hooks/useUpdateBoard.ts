'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateBoard } from '../api';
import type { UpdateBoardInput } from '../types';

export function useUpdateBoard(onSuccess?: () => void) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBoardInput }) =>
      updateBoard(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
      onSuccess?.();
    },
  });
}
