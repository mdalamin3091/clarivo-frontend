import { useMutation, useQueryClient }  from '@tanstack/react-query';
import { toast }                        from 'sonner';
import { useSession }                   from '@/lib/auth-client';
import { queryKeys }                    from '@/lib/query-keys';
import { updateRoadmapColumn }          from '../api';
import { useRoadmapStore }              from '../store';
import type { UpdateRoadmapColumnInput } from '../types';

interface Variables {
  roadmapId: string;
  columnId:  string;
  input:     UpdateRoadmapColumnInput;
}

export function useUpdateRoadmapColumn() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ roadmapId, columnId, input }: Variables) =>
      updateRoadmapColumn(roadmapId, columnId, input),
    onSuccess: (roadmap) => {
      patchRoadmap(roadmap);
      toast.success('Column updated');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: () => {
      toast.error('Failed to update column');
    },
  });
}
