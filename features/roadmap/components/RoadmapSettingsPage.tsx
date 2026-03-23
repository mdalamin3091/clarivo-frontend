'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRoadmapStore } from '../store';
import { RoadmapList }    from './RoadmapList';

export function RoadmapSettingsPage() {
  const openCreateDialog = useRoadmapStore(s => s.openCreateDialog);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Roadmaps</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product roadmaps and their column structure.
          </p>
        </div>
        <Button size="sm" onClick={openCreateDialog}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add roadmap
        </Button>
      </div>

      <RoadmapList />
    </div>
  );
}
