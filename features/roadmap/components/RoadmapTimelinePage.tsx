'use client';

import { CalendarDays, Plus } from 'lucide-react';

export function RoadmapTimelinePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Roadmap — Timeline</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            View your roadmap items on a timeline.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950">
          <CalendarDays className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Timeline view coming soon</h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Add items to your roadmap and they&apos;ll appear here on a Gantt-style timeline.
        </p>
      </div>
    </div>
  );
}
