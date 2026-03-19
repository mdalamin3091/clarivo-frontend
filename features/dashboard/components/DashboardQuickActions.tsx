'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, Map, Newspaper, ClipboardList, ArrowUpRight } from 'lucide-react';

const QUICK_ACTIONS = [
  {
    label: 'Collect Feedback',
    desc: 'Create a feedback board and let users vote on ideas.',
    icon: MessageSquare,
    href: '/dashboard/feedback',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    label: 'Plan your Roadmap',
    desc: "Share what you're building and keep users in the loop.",
    icon: Map,
    href: '/dashboard/roadmap',
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
  },
  {
    label: 'Post a Changelog',
    desc: 'Announce new features, fixes, and improvements.',
    icon: Newspaper,
    href: '/dashboard/changelog',
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  },
  {
    label: 'Run a Survey',
    desc: 'Get structured, actionable feedback from your users.',
    icon: ClipboardList,
    href: '/dashboard/surveys',
    iconClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  },
];

export function DashboardQuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {QUICK_ACTIONS.map(({ label, desc, icon: Icon, href, iconClass }) => (
        <button
          key={label}
          onClick={() => router.push(href)}
          className="group flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/25 hover:shadow-sm"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
