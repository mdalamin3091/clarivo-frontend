'use client';

import { List, Plus } from 'lucide-react';

export function RoadmapListPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Roadmap — List</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            View all roadmap items in a sortable list.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="rounded-xl border bg-card">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_120px_120px] gap-4 border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Title</span>
          <span>Status</span>
          <span>Votes</span>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <List className="h-6 w-6 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">No roadmap items yet</p>
        </div>
      </div>
    </div>
  );
}
