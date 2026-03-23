'use client';

import { Map } from 'lucide-react';

// Placeholder — full roadmap board view will be built in a later phase.
export function RoadmapPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Map className="h-10 w-10 text-muted-foreground/30" />
      <div>
        <p className="text-sm font-medium text-foreground">Roadmap board coming soon</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your roadmaps under Settings → Roadmaps.
        </p>
      </div>
    </div>
  );
}
