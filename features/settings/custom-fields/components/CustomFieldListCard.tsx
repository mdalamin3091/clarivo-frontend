'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableList } from '@/shared/components/ui/SortableList';
import { useCustomFields }        from '../hooks/useCustomFields';
import { useReorderCustomFields } from '../hooks/useReorderCustomFields';
import { useCustomFieldsStore }   from '../store';
import { SortableCustomFieldItem } from './SortableCustomFieldItem';
import { CustomFieldDialog }       from './CustomFieldDialog';
import type { CustomField } from '../types';

export function CustomFieldListCard() {
  const { isLoading } = useCustomFields(); // fetches + syncs into store
  const { fields, openCreateDialog } = useCustomFieldsStore();
  const { reorder } = useReorderCustomFields();

  // Local state for optimistic reordering
  const [localFields, setLocalFields] = useState<CustomField[]>([]);

  useEffect(() => {
    setLocalFields(fields);
  }, [fields]);

  const handleReorder = (reordered: CustomField[]) => {
    setLocalFields(reordered);
    void reorder(reordered);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : localFields.length > 0 ? (
        <SortableList
          items={localFields}
          onReorder={handleReorder}
          className="space-y-2"
          renderItem={(field, dragHandleRef, dragHandleProps) => (
            <SortableCustomFieldItem
              field={field}
              dragHandleRef={dragHandleRef}
              dragHandleProps={dragHandleProps}
            />
          )}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">No custom fields yet.</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={openCreateDialog}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add your first field
          </Button>
        </div>
      )}

      {/* Dialog lives here — reads all state from store */}
      <CustomFieldDialog />
    </div>
  );
}
