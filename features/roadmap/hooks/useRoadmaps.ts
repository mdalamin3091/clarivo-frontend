import { useEffect } from 'react';
import { useQuery }  from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { queryKeys }  from '@/lib/query-keys';
import { fetchRoadmaps } from '../api';
import { useRoadmapStore } from '../store';

export function useRoadmaps() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const setRoadmaps = useRoadmapStore(s => s.setRoadmaps);

  const query = useQuery({
    queryKey: queryKeys.roadmaps.list(orgId),
    queryFn:  fetchRoadmaps,
    enabled:  !!orgId,
  });

  useEffect(() => {
    if (query.data) setRoadmaps(query.data);
  }, [query.data, setRoadmaps]);

  return query;
}
