import { useQuery }   from '@tanstack/react-query';
import { useSession }  from '@/lib/auth-client';
import { apiFetch }    from '@/lib/api';
import { queryKeys }   from '@/lib/query-keys';

interface OrgTag {
  id:    string;
  name:  string;
  color: string;
}

async function fetchOrgTags(): Promise<OrgTag[]> {
  const data = await apiFetch<{ tags: OrgTag[] }>('/api/v1/tags');
  return data.tags;
}

export function useOrgTags() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useQuery({
    queryKey:  queryKeys.tags.list(orgId),
    queryFn:   fetchOrgTags,
    enabled:   !!orgId,
    staleTime: 1000 * 60 * 5,
  });
}
