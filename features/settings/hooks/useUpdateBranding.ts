'use client';

import { useMutation } from '@tanstack/react-query';
import { updateOrgBranding } from '../api';
import type { BrandingFormData } from '../types';

export function useUpdateBranding(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: (data: BrandingFormData) => updateOrgBranding(data),
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
