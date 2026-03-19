'use client';

import { Map, Plus } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { useRoadmapItems } from '../hooks/useRoadmapItems';
import type { RoadmapStatus } from '../types';

const COLUMNS: { label: string; color: string; status: RoadmapStatus }[] = [
  { label: 'Planned',     color: 'bg-slate-400', status: 'planned' },
  { label: 'In Progress', color: 'bg-blue-400',  status: 'in-progress' },
  { label: 'Completed',  color: 'bg-green-400', status: 'completed' },
];

export function RoadmapPage() {
  const { data: org }   = useActiveOrganization();
  const { data: items } = useRoadmapItems(org?.id);

  const byStatus = (status: RoadmapStatus) =>
    items?.filter((i) => i.status === status) ?? [];

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Roadmap</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Plan and share what you&apos;re building with your users.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map(({ label, color, status }) => {
          const columnItems = byStatus(status);
          return (
            <div key={status} className="flex flex-col rounded-xl border bg-card">
              <div className="flex items-center gap-2 border-b px-4 py-3">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{columnItems.length}</span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
                <Map className="h-6 w-6 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">
                  {columnItems.length === 0 ? 'No items yet' : `${columnItems.length} item${columnItems.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
