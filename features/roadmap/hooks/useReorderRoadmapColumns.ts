import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }                       from 'sonner';
import { useSession }                  from '@/lib/auth-client';
import { queryKeys }                   from '@/lib/query-keys';
import { reorderRoadmapColumns }       from '../api';
import { useRoadmapStore }             from '../store';
import type { RoadmapColumn }          from '../types';

interface Variables {
  roadmapId: string;
  columns:   RoadmapColumn[];
}

export function useReorderRoadmapColumns() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { reorderColumnsInRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ roadmapId, columns }: Variables) =>
      reorderRoadmapColumns(roadmapId, {
        items: columns.map((col, idx) => ({ id: col.id, order: idx + 1 })),
      }),
    onMutate: ({ roadmapId, columns }) => {
      // Optimistic update — show new order immediately
      reorderColumnsInRoadmap(roadmapId, columns);
    },
    onSuccess: (roadmap) => {
      reorderColumnsInRoadmap(roadmap.id, roadmap.columns);
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: () => {
      toast.error('Failed to reorder columns');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
  });
}
