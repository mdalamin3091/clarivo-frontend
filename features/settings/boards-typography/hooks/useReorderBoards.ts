'use client';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateBoard } from '../api';
import type { Board } from '../types';

/**
 * Fires PATCH /api/v1/boards/:id for every board in the reordered list in
 * parallel (one request per board), then invalidates the boards list query.
 */
export function useReorderBoards() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  const reorder = async (boards: Board[]) => {
    await Promise.all(
      boards.map((board, index) =>
        updateBoard(board.id, { order: index + 1 }),
      ),
    );
    await qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
  };

  return { reorder };
}
