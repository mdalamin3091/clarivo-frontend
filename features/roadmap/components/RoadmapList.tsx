'use client';

import { Loader2 }   from 'lucide-react';
import { SortableList }      from '@/shared/components/ui/SortableList';
import { useRoadmaps }       from '../hooks/useRoadmaps';
import { useReorderRoadmaps } from '../hooks/useReorderRoadmaps';
import { useRoadmapStore }   from '../store';
import { RoadmapCard }       from './RoadmapCard';
import { RoadmapDialog }     from './RoadmapDialog';
import type { Roadmap }      from '../types';

export function RoadmapList() {
  const { isPending, isError } = useRoadmaps();
  const roadmaps = useRoadmapStore(s => s.roadmaps);
  const { mutate: reorder }   = useReorderRoadmaps();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Failed to load roadmaps. Please refresh.
      </p>
    );
  }

  return (
    <>
      {roadmaps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">No roadmaps yet. Create your first one.</p>
        </div>
      ) : (
        <SortableList<Roadmap>
          items={roadmaps}
          onReorder={reorder}
          className="gap-3"
          renderItem={(roadmap, dragHandleRef, dragHandleProps) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              dragHandleRef={dragHandleRef}
              dragHandleProps={dragHandleProps}
            />
          )}
        />
      )}

      <RoadmapDialog />
    </>
  );
}
