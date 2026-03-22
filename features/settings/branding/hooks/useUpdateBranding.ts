'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useActiveOrganization } from '@/lib/auth-client';
import { updateOrgBranding } from '../api';
import type { BrandingFormData } from '../types';

export function useUpdateBranding(onSuccess?: () => void) {
  const { data: activeOrg } = useActiveOrganization();

  return useMutation({
    mutationFn: (data: BrandingFormData) => updateOrgBranding(activeOrg!.id, data),
    onSuccess: () => {
      toast.success('Branding saved', {
        description: 'Your branding settings have been updated.',
      });
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error('Failed to save branding', {
        description: err.message ?? 'Something went wrong. Please try again.',
      });
    },
  });
}
