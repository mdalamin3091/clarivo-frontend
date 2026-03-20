'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateOrgBranding } from '../api';
import type { BrandingFormData } from '../types';

export function useUpdateBranding(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (data: BrandingFormData) => updateOrgBranding(data),
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
