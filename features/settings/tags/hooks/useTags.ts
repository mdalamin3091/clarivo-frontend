'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { fetchTags } from '../api';
import { useTagsStore } from '../store';

export function useTags() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const setTags = useTagsStore((s) => s.setTags);

  const query = useQuery({
    queryKey: queryKeys.tags.list(orgId),
    queryFn:  fetchTags,
    enabled:  !!orgId,
  });

  useEffect(() => {
    if (query.data) setTags(query.data);
  }, [query.data, setTags]);

  return query;
}
