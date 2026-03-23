import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }          from 'sonner';
import { useSession }     from '@/lib/auth-client';
import { queryKeys }      from '@/lib/query-keys';
import { updateRoadmap }  from '../api';
import { useRoadmapStore } from '../store';
import type { UpdateRoadmapInput } from '../types';

export function useUpdateRoadmap() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchRoadmap, closeDialog } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoadmapInput }) =>
      updateRoadmap(id, input),
    onSuccess: (roadmap) => {
      patchRoadmap(roadmap);
      closeDialog();
      toast.success('Roadmap updated');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: () => {
      toast.error('Failed to update roadmap');
    },
  });
}
