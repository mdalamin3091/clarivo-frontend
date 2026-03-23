import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }          from 'sonner';
import { useSession }     from '@/lib/auth-client';
import { queryKeys }      from '@/lib/query-keys';
import { createRoadmap }  from '../api';
import { useRoadmapStore } from '../store';
import type { CreateRoadmapInput } from '../types';

export function useCreateRoadmap() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { addRoadmap, closeDialog } = useRoadmapStore();

  return useMutation({
    mutationFn: (input: CreateRoadmapInput) => createRoadmap(input),
    onSuccess: (roadmap) => {
      addRoadmap(roadmap);
      closeDialog();
      toast.success('Roadmap created');
      void qc.invalidateQueries({ queryKey: queryKeys.roadmaps.list(orgId) });
    },
    onError: () => {
      toast.error('Failed to create roadmap');
    },
  });
}
