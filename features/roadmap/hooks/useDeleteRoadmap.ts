import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }          from 'sonner';
import { useSession }     from '@/lib/auth-client';
import { queryKeys }      from '@/lib/query-keys';
import { deleteRoadmap }  from '../api';
import { useRoadmapStore } from '../store';

export function useDeleteRoadmap() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { removeRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: (id: string) => deleteRoadmap(id),
    onMutate: (id) => {
      removeRoadmap(id);
    },
    onSuccess: () => {
      toast.success('Roadmap deleted');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: (_err, id) => {
      toast.error('Failed to delete roadmap');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
  });
}
