'use client';

import { useMutation } from '@tanstack/react-query';
import { useActiveOrganization } from '@/lib/auth-client';
import { updateBoardGlobalSettings, type UpdateBoardGlobalInput } from '../api';

export function useUpdateBoardGlobalSettings(onSuccess?: () => void) {
  const { data: activeOrg, refetch } = useActiveOrganization();

  return useMutation({
    mutationFn: (input: UpdateBoardGlobalInput) => updateBoardGlobalSettings(activeOrg!.id, input),
    onSuccess: async () => {
      await refetch();
      onSuccess?.();
    },
  });
}
