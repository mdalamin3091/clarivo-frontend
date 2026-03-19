'use client';

import { BarChart2, TrendingUp, Users, MousePointerClick, Eye } from 'lucide-react';

const METRIC_CARDS = [
  { label: 'Total Views',    value: '—', icon: Eye,               color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { label: 'Unique Visitors',value: '—', icon: Users,             color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
  { label: 'Votes Cast',     value: '—', icon: TrendingUp,        color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { label: 'Submissions',    value: '—', icon: MousePointerClick, color: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400' },
];

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Track engagement and activity across your workspace.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {METRIC_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <BarChart2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Analytics coming soon</h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Charts and detailed insights will appear here once your workspace starts receiving traffic.
        </p>
      </div>

    </div>
  );
}
