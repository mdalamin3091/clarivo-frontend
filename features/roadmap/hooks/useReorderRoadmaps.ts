import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }                       from 'sonner';
import { useSession }                  from '@/lib/auth-client';
import { queryKeys }                   from '@/lib/query-keys';
import { reorderRoadmaps }             from '../api';
import { useRoadmapStore }             from '../store';
import type { Roadmap }                from '../types';

export function useReorderRoadmaps() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { reorderRoadmaps: setRoadmaps } = useRoadmapStore();

  return useMutation({
    mutationFn: (roadmaps: Roadmap[]) =>
      reorderRoadmaps({
        items: roadmaps.map((r, idx) => ({ id: r.id, order: idx + 1 })),
      }),
    onMutate: (roadmaps) => {
      // Optimistic update
      setRoadmaps(roadmaps);
    },
    onSuccess: (roadmaps) => {
      setRoadmaps(roadmaps);
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: () => {
      toast.error('Failed to reorder roadmaps');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
  });
}
