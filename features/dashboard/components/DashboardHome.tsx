'use client';

import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Map,
  Newspaper,
  ClipboardList,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

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
    desc: 'Share what you\'re building and keep users in the loop.',
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

export function DashboardHome() {
  const router = useRouter();
  const { data: session } = useSession();
  const firstName = session?.user.name?.split(' ')[0] ?? 'there';

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">

      {/* ── Welcome ── */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Welcome back, {firstName} 👋
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your workspace activity.
        </p>
      </div>

      {/* ── Stats grid ── */}
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

      {/* ── Quick actions ── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Get started</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ label, desc, icon: Icon, href, iconClass }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="group flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/25 hover:shadow-sm"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
              >
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
      </div>

    </div>
  );
}
