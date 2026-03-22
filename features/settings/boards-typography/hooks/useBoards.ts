'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { fetchBoards } from '../api';
import { useBoardsStore } from '../store';

export function useBoards() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const setBoards = useBoardsStore((s) => s.setBoards);

  const query = useQuery({
    queryKey: queryKeys.boards.list(orgId),
    queryFn:  fetchBoards,
    enabled:  !!orgId,
  });

  useEffect(() => {
    if (query.data) setBoards(query.data);
  }, [query.data, setBoards]);

  return query;
}
