import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { getActiveOrgId, getServerHeaders } from '@/lib/session-server';
import { queryKeys } from '@/lib/query-keys';
import { getSurveys } from '@/features/surveys/api';
import { SurveysPage } from '@/features/surveys';
import { PageLoader } from '@/shared/components/ui/PageLoader';

export default async function SurveysRoute() {
  const queryClient = getQueryClient();
  const [orgId, serverHeaders] = await Promise.all([getActiveOrgId(), getServerHeaders()]);

  if (orgId) {
    queryClient.prefetchQuery({
      queryKey: queryKeys.surveys.list(orgId),
      queryFn: () => getSurveys(orgId, { headers: serverHeaders }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageLoader />}>
        <SurveysPage />
      </Suspense>
    </HydrationBoundary>
  );
}
