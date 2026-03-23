'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { deleteCustomField } from '../api';
import { useCustomFieldsStore } from '../store';

export function useDeleteCustomField() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';
  const removeField = useCustomFieldsStore((s) => s.removeField);

  return useMutation({
    mutationFn: (id: string) => deleteCustomField(id),
    onMutate: (id) => {
      removeField(id); // optimistic remove
    },
    onSuccess: () => {
      toast.success('Custom field deleted');
    },
    onError: (error) => {
      toast.error((error as Error).message ?? 'Failed to delete custom field');
      qc.invalidateQueries({ queryKey: queryKeys.customFields.list(orgId) });
    },
  });
}
