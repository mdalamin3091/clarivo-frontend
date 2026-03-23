import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { apiFetch }  from '@/lib/api';

interface OrgCustomField {
  id:   string;
  name: string;
  type: string;
}

async function fetchOrgCustomFields(): Promise<OrgCustomField[]> {
  const data = await apiFetch<{ fields: OrgCustomField[] }>('/api/v1/custom-fields');
  return data.fields;
}

export function useOrgCustomFields() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  return useQuery({
    queryKey:  ['org-custom-fields-for-board', orgId],
    queryFn:   fetchOrgCustomFields,
    enabled:   !!orgId,
    staleTime: 1000 * 60 * 5,
  });
}
