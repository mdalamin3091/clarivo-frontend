'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateOrgAccessibility } from '../api';
import type { AccessibilityFormData } from '../types';

export function useUpdateAccessibility(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (data: AccessibilityFormData) => updateOrgAccessibility(data),
    onSuccess: () => {
      toast.success('Access settings saved', {
        description: 'Your organization access has been updated.',
      });
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error('Failed to save access settings', {
        description: err.message ?? 'Something went wrong. Please try again.',
      });
    },
  });
}
