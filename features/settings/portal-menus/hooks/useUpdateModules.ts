'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updatePortalMenus } from '../api';
import type { PortalMenuItem } from '../types';

export function useUpdateModules(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (menus: PortalMenuItem[]) => updatePortalMenus(menus),
    onSuccess: () => {
      toast.success('Portal menus saved', {
        description: 'Your public portal menu has been updated.',
      });
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error('Failed to save portal menus', {
        description: err.message ?? 'Something went wrong. Please try again.',
      });
    },
  });
}
