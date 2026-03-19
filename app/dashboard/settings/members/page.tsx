import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { getActiveOrgId, getServerHeaders } from '@/lib/session-server';
import { queryKeys } from '@/lib/query-keys';
import { getOrgMembers } from '@/features/settings/api';
import { SettingsMembersPage } from '@/features/settings';
import { PageLoader } from '@/shared/components/ui/PageLoader';

export default async function SettingsMembersRoute() {
  const queryClient = getQueryClient();
  const [orgId, serverHeaders] = await Promise.all([getActiveOrgId(), getServerHeaders()]);

  if (orgId) {
    queryClient.prefetchQuery({
      queryKey: queryKeys.organizations.members(orgId),
      queryFn: () => getOrgMembers(orgId, { headers: serverHeaders }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageLoader />}>
        <SettingsMembersPage />
      </Suspense>
    </HydrationBoundary>
  );
}
