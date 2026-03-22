'use client';

import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStatuses }     from '../hooks/useStatuses';
import { useStatusesStore } from '../store';
import { StatusRow }    from './StatusRow';
import { StatusDialog } from './StatusDialog';

export function StatusListCard() {
  const { isLoading } = useStatuses(); // fetches + syncs into store
  const { statuses, openCreateDialog } = useStatusesStore();

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : statuses.length > 0 ? (
        <div className="space-y-2">
          {statuses.map((status) => (
            <StatusRow key={status.id} status={status} />
          ))}
        </div>
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
