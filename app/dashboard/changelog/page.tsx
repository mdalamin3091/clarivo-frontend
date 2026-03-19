import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { getActiveOrgId, getServerHeaders } from '@/lib/session-server';
import { queryKeys } from '@/lib/query-keys';
import { getChangelogs } from '@/features/changelog/api';
import { ChangelogPage } from '@/features/changelog';
import { PageLoader } from '@/shared/components/ui/PageLoader';

export default async function ChangelogRoute() {
  const queryClient = getQueryClient();
  const [orgId, serverHeaders] = await Promise.all([getActiveOrgId(), getServerHeaders()]);

  if (orgId) {
    queryClient.prefetchQuery({
      queryKey: queryKeys.changelog.list(orgId),
      queryFn: () => getChangelogs(orgId, { headers: serverHeaders }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageLoader />}>
        <ChangelogPage />
      </Suspense>
    </HydrationBoundary>
  );
}
