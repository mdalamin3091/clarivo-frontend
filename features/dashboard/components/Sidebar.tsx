'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { MODULE_ICONS, BOTTOM_ICONS } from '../constants/navigation';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { ProfileMenu } from './ProfileMenu';
import { SidebarPanel } from './SidebarPanel';

export function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const railBtn = (href: string, exact?: boolean) =>
    `flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
      isActive(href, exact)
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`;

  return (
    <TooltipProvider delayDuration={300}>
      <aside className="flex h-screen shrink-0">

        {/* Column 1 — Icon Rail */}
        <div className="flex w-12 flex-col items-center border-r bg-card py-3 gap-0.5">
          <WorkspaceSwitcher />

          {/* Module nav icons */}
          <div className="flex flex-1 flex-col items-center gap-0.5 pt-1">
            {MODULE_ICONS.map(({ label, href, icon: Icon, exact }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <button onClick={() => router.push(href)} className={railBtn(href, exact)}>
                    <Icon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right"><p>{label}</p></TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Bottom icons + profile */}
          <div className="flex flex-col items-center gap-0.5">
            {BOTTOM_ICONS.map(({ label, href, icon: Icon }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <button onClick={() => router.push(href)} className={railBtn(href)}>
                    <Icon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right"><p>{label}</p></TooltipContent>
              </Tooltip>
            ))}
            <ProfileMenu />
          </div>
        </div>

        {/* Column 2 — Dynamic Panel */}
        <SidebarPanel />

      </aside>
    </TooltipProvider>
  );
}
