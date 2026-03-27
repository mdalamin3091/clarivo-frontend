'use client';

import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { PAGE_TITLES, PANEL_ROUTES } from '../constants/navigation';

export function Topbar() {
  const pathname = usePathname();
  const { toggleSidebar, topbarNode } = useUIStore();

  const title    = PAGE_TITLES[pathname] ?? 'Dashboard';
  const hasPanel = PANEL_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-5">
      <div className="flex items-center gap-3">
        {hasPanel && (
          <button
            onClick={toggleSidebar}
            title="Toggle panel"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {topbarNode}
        <ThemeToggle />
      </div>
    </header>
  );
}
