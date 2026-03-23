import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }                       from 'sonner';
import { useSession }                  from '@/lib/auth-client';
import { queryKeys }                   from '@/lib/query-keys';
import { deleteRoadmapColumn }         from '../api';
import { useRoadmapStore }             from '../store';

interface Variables {
  roadmapId: string;
  columnId:  string;
}

export function useDeleteRoadmapColumn() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ roadmapId, columnId }: Variables) =>
      deleteRoadmapColumn(roadmapId, columnId),
    onSuccess: (roadmap) => {
      patchRoadmap(roadmap);
      toast.success('Column deleted');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: () => {
      toast.error('Failed to delete column');
    },
  });
}
