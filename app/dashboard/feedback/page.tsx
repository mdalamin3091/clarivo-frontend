import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { getActiveOrgId, getServerHeaders } from '@/lib/session-server';
import { queryKeys } from '@/lib/query-keys';
import { getFeedbackPosts } from '@/features/feedback/api';
import { FeedbackPage } from '@/features/feedback';
import { PageLoader } from '@/shared/components/ui/PageLoader';

export default async function FeedbackRoute() {
  const queryClient = getQueryClient();
  const [orgId, serverHeaders] = await Promise.all([getActiveOrgId(), getServerHeaders()]);

  if (orgId) {
    queryClient.prefetchQuery({
      queryKey: queryKeys.feedback.list(orgId),
      queryFn: () => getFeedbackPosts(orgId, { headers: serverHeaders }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageLoader />}>
        <FeedbackPage />
      </Suspense>
    </HydrationBoundary>
  );
}
