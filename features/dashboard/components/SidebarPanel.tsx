'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Circle, Code2, HelpCircle } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { getPanel } from '../constants/navigation';

export function SidebarPanel() {
  const router   = useRouter();
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  const panel = getPanel(pathname);

  if (!panel || !sidebarOpen) return null;

  return (
    <div className="flex h-screen w-52 flex-col border-r bg-card">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {panel.heading}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-2 py-2">
        {panel.sections.map((section) => (
          <div key={section.title}>
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === pathname ||
                  item.href === pathname + (typeof window !== 'undefined' ? window.location.search : '');
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => router.push(item.href)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                        active
                          ? 'bg-accent font-medium text-foreground'
                          : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      {item.color ? (
                        <span className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} />
                      ) : (
                        <Circle className="h-2 w-2 shrink-0 text-muted-foreground/40" />
                      )}
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t px-2 py-2">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Resources
        </p>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Code2 className="h-3.5 w-3.5 shrink-0" />
          Install Widget &amp; Embed
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <HelpCircle className="h-3.5 w-3.5 shrink-0" />
          Help Center
        </button>
      </div>
    </div>
  );
}
