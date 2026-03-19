'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/feedback': 'Feedback',
  '/dashboard/roadmap': 'Roadmap',
  '/dashboard/changelog': 'Changelog',
  '/dashboard/surveys': 'Surveys',
  '/dashboard/members': 'Members',
  '/dashboard/settings': 'Settings',
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
}
