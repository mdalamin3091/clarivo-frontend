'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateBoard } from '../api';
import type { Board } from '../types';

/**
 * Fires PATCH /api/v1/boards/:id { order } for every board in the reordered
 * list in parallel (same pattern as useReorderTags), then invalidates the cache.
 */
export function useReorderBoards() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  const reorder = async (boards: Board[]) => {
    try {
      await Promise.all(
        boards.map((board, index) => updateBoard(board.id, { order: index + 1 })),
      );
    } catch {
      toast.error('Failed to save new order');
      await qc.invalidateQueries({ queryKey: queryKeys.boards.list(orgId) });
    }
  };

  return { reorder };
}
