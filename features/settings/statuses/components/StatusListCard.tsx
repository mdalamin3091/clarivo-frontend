'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableList } from '@/shared/components/ui/SortableList';
import { useStatuses }         from '../hooks/useStatuses';
import { useReorderStatuses }  from '../hooks/useReorderStatuses';
import { useStatusesStore }    from '../store';
import { SortableStatusItem }  from './SortableStatusItem';
import { StatusDialog }        from './StatusDialog';
import type { Status } from '../types';

export function StatusListCard() {
  const { isLoading } = useStatuses(); // fetches + syncs into store
  const { statuses, openCreateDialog } = useStatusesStore();
  const { reorder } = useReorderStatuses();

  // Local state for optimistic reordering
  const [localStatuses, setLocalStatuses] = useState<Status[]>([]);

  useEffect(() => {
    setLocalStatuses(statuses);
  }, [statuses]);

  const handleReorder = (reordered: Status[]) => {
    setLocalStatuses(reordered);
    void reorder(reordered);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : localStatuses.length > 0 ? (
        <SortableList
          items={localStatuses}
          onReorder={handleReorder}
          className="space-y-2"
          renderItem={(status, dragHandleRef, dragHandleProps) => (
            <SortableStatusItem
              status={status}
              dragHandleRef={dragHandleRef}
              dragHandleProps={dragHandleProps}
            />
          )}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">No statuses yet.</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={openCreateDialog}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add your first status
          </Button>
        </div>
      )}

      {/* Dialog lives here — reads all state from store */}
      <StatusDialog />
    </div>
  );
}
