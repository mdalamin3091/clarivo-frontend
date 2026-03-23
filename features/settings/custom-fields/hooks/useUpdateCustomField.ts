'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateCustomField } from '../api';
import { useCustomFieldsStore } from '../store';
import type { UpdateCustomFieldInput } from '../types';

export function useUpdateCustomField() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const { patchField, closeDialog } = useCustomFieldsStore();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCustomFieldInput }) =>
      updateCustomField(id, input),
    onSuccess: (field) => {
      patchField(field.id, field);
      closeDialog();
      toast.success('Custom field updated');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to update custom field');
      qc.invalidateQueries({ queryKey: queryKeys.customFields.list(orgId) });
    },
  });
}
