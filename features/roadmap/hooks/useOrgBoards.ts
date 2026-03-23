import { useQuery }   from '@tanstack/react-query';
import { useSession }  from '@/lib/auth-client';
import { apiFetch }    from '@/lib/api';
import { queryKeys }   from '@/lib/query-keys';

interface OrgBoard {
  id:   string;
  name: string;
}

async function fetchOrgBoards(): Promise<OrgBoard[]> {
  const data = await apiFetch<{ boards: OrgBoard[] }>('/api/v1/boards');
  return data.boards;
}

export function useOrgBoards() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useQuery({
    queryKey:  queryKeys.boards.list(orgId),
    queryFn:   fetchOrgBoards,
    enabled:   !!orgId,
    staleTime: 1000 * 60 * 5,
  });
}
