'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, Map, Newspaper, ClipboardList, ArrowUpRight } from 'lucide-react';

const STATS = [
  {
    label: 'Total Feedback',
    value: '0',
    sub: 'No posts yet',
    icon: MessageSquare,
    href: '/dashboard/feedback',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    ringClass: 'hover:ring-blue-200 dark:hover:ring-blue-900',
  },
  {
    label: 'Roadmap Items',
    value: '0',
    sub: 'No items yet',
    icon: Map,
    href: '/dashboard/roadmap',
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
    ringClass: 'hover:ring-violet-200 dark:hover:ring-violet-900',
  },
  {
    label: 'Changelog Posts',
    value: '0',
    sub: 'No posts yet',
    icon: Newspaper,
    href: '/dashboard/changelog',
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    ringClass: 'hover:ring-emerald-200 dark:hover:ring-emerald-900',
  },
  {
    label: 'Active Surveys',
    value: '0',
    sub: 'No surveys yet',
    icon: ClipboardList,
    href: '/dashboard/surveys',
    iconClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    ringClass: 'hover:ring-orange-200 dark:hover:ring-orange-900',
  },
];

export function DashboardStats() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map(({ label, value, sub, icon: Icon, href, iconClass, ringClass }) => (
        <button
          key={label}
          onClick={() => router.push(href)}
          className={`group flex flex-col gap-4 rounded-xl border bg-card p-5 text-left ring-2 ring-transparent transition-all hover:shadow-sm ${ringClass}`}
        >
          <div className="flex items-start justify-between">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
