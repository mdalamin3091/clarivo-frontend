'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from '@/lib/auth-client';
import { updateCustomField } from '../api';
import type { CustomField } from '../types';

export function useReorderCustomFields() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const orgId = session?.session?.activeOrganizationId ?? '';

  const reorder = async (fields: CustomField[]) => {
    try {
      await Promise.all(
        fields.map((field, index) => updateCustomField(field.id, { order: index + 1 })),
      );
    } catch {
      toast.error('Failed to save new order');
      await qc.invalidateQueries({ queryKey: queryKeys.customFields.list(orgId) });
    }
  };

  return { reorder };
}
