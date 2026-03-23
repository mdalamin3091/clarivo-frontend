'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { fetchStatuses } from '../api';
import { useStatusesStore } from '../store';

export function useStatuses() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const setStatuses = useStatusesStore((s) => s.setStatuses);

  const query = useQuery({
    queryKey: queryKeys.statuses.list(orgId),
    queryFn:  fetchStatuses,
    enabled:  !!orgId,
  });

  // Sync server data into the Zustand store
  useEffect(() => {
    if (query.data) setStatuses(query.data);
  }, [query.data, setStatuses]);

  return query;
}
