'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, Circle, Code2, HelpCircle } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { cn } from '@/lib/utils';
import { getPanel } from '../constants/navigation';
import type { AnyPanelSection, ModuleGroup } from '../constants/navigation';

// ── Collapsible module group ───────────────────────────────────────────────────

function ModuleGroupRow({
  group,
  pathname,
  onNavigate,
}: {
  group:      ModuleGroup;
  pathname:   string;
  onNavigate: (href: string) => void;
}) {
  const [open, setOpen] = useState(group.defaultOpen ?? false);
  const Icon = group.icon;

  const isGroupActive = group.items.some((item) => pathname.startsWith(item.href));

  return (
    <div>
      {/* Group header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
          isGroupActive
            ? 'text-foreground font-medium'
            : 'text-foreground/70 hover:bg-accent hover:text-foreground',
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronRight
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </button>

      {/* Submenu — always in DOM, height animated via grid-rows trick */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <ul className="overflow-hidden mt-0.5 space-y-0.5 border-l border-border ml-4.5 pl-3">
          {group.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <button
                  onClick={() => onNavigate(item.href)}
                  className={cn(
                    'flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                    active
                      ? 'bg-accent font-medium text-foreground'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ── Section renderer ───────────────────────────────────────────────────────────

function PanelSection({
  section,
  pathname,
  onNavigate,
}: {
  section:    AnyPanelSection;
  pathname:   string;
  onNavigate: (href: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {section.title}
      </p>

      {section.kind === 'modules' ? (
        <div className="space-y-0.5">
          {section.groups.map((group) => (
            <ModuleGroupRow
              key={group.label}
              group={group}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-0.5">
          {section.items.map((item) => {
            const active =
              item.href === pathname ||
              item.href === pathname + (typeof window !== 'undefined' ? window.location.search : '');
            return (
              <li key={item.href}>
                <button
                  onClick={() => onNavigate(item.href)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                    active
                      ? 'bg-accent font-medium text-foreground'
                      : 'text-foreground/80 hover:bg-accent hover:text-foreground',
                  )}
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
      )}
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────────

export function SidebarPanel() {
  const router   = useRouter();
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  const panel = getPanel(pathname);

  if (!panel || !sidebarOpen) return null;

  return (
    <div className="flex h-screen w-60 flex-col border-r bg-card">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {panel.heading}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-2 py-2 scrollbar-thin">
        {panel.sections.map((section) => (
          <PanelSection
            key={section.title}
            section={section}
            pathname={pathname}
            onNavigate={(href) => router.push(href)}
          />
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
