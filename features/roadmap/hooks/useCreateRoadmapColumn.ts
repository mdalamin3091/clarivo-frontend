import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }                       from 'sonner';
import { useSession }                  from '@/lib/auth-client';
import { queryKeys }                   from '@/lib/query-keys';
import { createRoadmapColumn }         from '../api';
import { useRoadmapStore }             from '../store';

export function useCreateRoadmapColumn() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: (roadmapId: string) => createRoadmapColumn(roadmapId),
    onSuccess: (roadmap) => {
      patchRoadmap(roadmap);
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: () => {
      toast.error('Failed to add column');
    },
  });
}
