'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useActiveOrganization } from '@/lib/auth-client';
import { updateOrgAccessibility } from '../api';
import type { AccessibilityFormData } from '../types';

export function useUpdateAccessibility(onSuccess?: () => void) {
  const { data: activeOrg } = useActiveOrganization();

  return useMutation({
    mutationFn: (data: AccessibilityFormData) => updateOrgAccessibility(activeOrg!.id, data),
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
