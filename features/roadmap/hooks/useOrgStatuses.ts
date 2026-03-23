import { useQuery }   from '@tanstack/react-query';
import { useSession }  from '@/lib/auth-client';
import { apiFetch }    from '@/lib/api';
import { queryKeys }   from '@/lib/query-keys';

interface OrgStatus {
  id:    string;
  name:  string;
  color: string;
}

async function fetchOrgStatuses(): Promise<OrgStatus[]> {
  const data = await apiFetch<{ statuses: OrgStatus[] }>('/api/v1/statuses');
  return data.statuses;
}

export function useOrgStatuses() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useQuery({
    queryKey:  queryKeys.statuses.list(orgId),
    queryFn:   fetchOrgStatuses,
    enabled:   !!orgId,
    staleTime: 1000 * 60 * 5,
  });
}
