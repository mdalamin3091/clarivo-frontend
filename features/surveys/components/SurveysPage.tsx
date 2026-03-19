'use client';

import { ClipboardList, Plus } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { useSurveys } from '../hooks/useSurveys';

const STATS: { label: string; key: string; color: string }[] = [
  { label: 'Active', key: 'active', color: 'text-green-600 dark:text-green-400' },
  { label: 'Draft',  key: 'draft',  color: 'text-slate-500' },
  { label: 'Closed', key: 'closed', color: 'text-red-500' },
];

export function SurveysPage() {
  const { data: org }     = useActiveOrganization();
  const { data: surveys } = useSurveys(org?.id);

  const countByStatus = (key: string) =>
    surveys?.filter((s) => s.status === key).length ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Surveys</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Get structured, actionable feedback from your users.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          New Survey
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ label, key, color }) => (
          <div key={key} className="rounded-xl border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{countByStatus(key)}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {(!surveys || surveys.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950">
            <ClipboardList className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No surveys yet</h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Create your first survey to gather structured feedback from users.
          </p>
          <button className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            Create first survey
          </button>
        </div>
      )}
    </div>
  );
}
