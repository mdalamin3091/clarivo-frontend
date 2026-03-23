'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { createCustomField } from '../api';
import { useCustomFieldsStore } from '../store';
import type { CreateCustomFieldInput } from '../types';

export function useCreateCustomField() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { addField, closeDialog } = useCustomFieldsStore();

  return useMutation({
    mutationFn: (input: CreateCustomFieldInput) => createCustomField(input),
    onSuccess: (field) => {
      addField(field);
      closeDialog();
      toast.success('Custom field created');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to create custom field');
      qc.invalidateQueries({ queryKey: queryKeys.customFields.list(orgId) });
    },
  });
}
