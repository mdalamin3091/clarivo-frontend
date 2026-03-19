import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { getActiveOrgId, getServerHeaders } from '@/lib/session-server';
import { queryKeys } from '@/lib/query-keys';
import { getRoadmapItems } from '@/features/roadmap/api';
import { RoadmapPage } from '@/features/roadmap';
import { PageLoader } from '@/shared/components/ui/PageLoader';

export default async function RoadmapRoute() {
  const queryClient = getQueryClient();
  const [orgId, serverHeaders] = await Promise.all([getActiveOrgId(), getServerHeaders()]);

  if (orgId) {
    queryClient.prefetchQuery({
      queryKey: queryKeys.roadmap.list(orgId),
      queryFn: () => getRoadmapItems(orgId, { headers: serverHeaders }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageLoader />}>
        <RoadmapPage />
      </Suspense>
    </HydrationBoundary>
  );
}
