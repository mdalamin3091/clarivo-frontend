'use client';

import { useQuery } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { authClient } from '@/lib/auth-client';
import { queryKeys } from '@/lib/query-keys';

export function useOrgMembers() {
  const { data: org } = useActiveOrganization();
  const orgId = org?.id ?? '';

  return useQuery({
    queryKey: queryKeys.organizations.members(orgId),
    queryFn:  async () => {
      const { data, error } = await authClient.organization.listMembers({
        query: { organizationId: orgId },
      });
      if (error) throw new Error(error.message);
      return data?.members ?? [];
    },
    enabled: !!orgId,
  });
}
