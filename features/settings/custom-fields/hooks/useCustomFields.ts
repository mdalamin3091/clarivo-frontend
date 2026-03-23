'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { fetchCustomFields } from '../api';
import { useCustomFieldsStore } from '../store';

export function useCustomFields() {
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const setFields = useCustomFieldsStore((s) => s.setFields);

  const query = useQuery({
    queryKey: queryKeys.customFields.list(orgId),
    queryFn:  fetchCustomFields,
    enabled:  !!orgId,
  });

  useEffect(() => {
    if (query.data) setFields(query.data);
  }, [query.data, setFields]);

  return query;
}
