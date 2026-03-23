'use client';

import { Button } from '@/components/ui/button';
import { useStatusesStore } from '../store';
import { StatusListCard } from './StatusListCard';
import { StatusSettingsCard } from './StatusSettingsCard';
import { Plus } from 'lucide-react';

export function StatusesPage() {
  const { openCreateDialog } = useStatusesStore();
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-6 p-6 pb-12">
        <div className="flex items-start justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-foreground">Statuses</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage post statuses and control how they appear on your public portal.
            </p>
          </div>
          <Button size="sm" onClick={openCreateDialog} className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            Add status
          </Button>
        </div>
        <StatusListCard />
        <StatusSettingsCard />
      </div>
    </div>
  );
}
