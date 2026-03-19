'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getInvitation } from '../api';

export function useGetInvitation(invitationId: string) {
  return useQuery({
    queryKey: queryKeys.invitations.get(invitationId),
    queryFn: () => getInvitation(invitationId),
    retry: false,
  });
}
