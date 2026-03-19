'use client';

import { usePathname } from 'next/navigation';
import { Bell, Menu } from 'lucide-react';
import { useUIStore } from '@/store/ui';

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
  const { toggleSidebar } = useUIStore();

  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-5">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger — hidden on lg since sidebar handles it */}
        <button
          onClick={toggleSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-1">
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
