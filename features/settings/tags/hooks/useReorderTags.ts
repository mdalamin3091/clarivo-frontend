'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateTag } from '../api';
import type { Tag } from '../types';

/**
 * Fires PATCH /api/v1/tags/:id { order } for every tag in the reordered list
 * in parallel (same pattern as useReorderBoards), then invalidates the cache.
 */
export function useReorderTags() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  const reorder = async (tags: Tag[]) => {
    try {
      await Promise.all(
        tags.map((tag, index) => updateTag(tag.id, { order: index + 1 })),
      );
    } catch {
      toast.error('Failed to save new order');
      await qc.invalidateQueries({ queryKey: queryKeys.tags.list(orgId) });
    }
  };

  return { reorder };
}
