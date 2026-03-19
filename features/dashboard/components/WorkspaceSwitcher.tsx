'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';
import { authClient, useListOrganizations, useActiveOrganization } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client';

// Deterministic color from org name for the avatar background
const ORG_COLORS = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-cyan-500',
];

function orgColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ORG_COLORS[hash % ORG_COLORS.length];
}

interface Props {
  collapsed: boolean;
}

export function WorkspaceSwitcher({ collapsed }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: orgs, isPending: orgsLoading } = useListOrganizations();
  const { data: activeOrg } = useActiveOrganization();

  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSwitch = async (orgId: string) => {
    if (orgId === activeOrg?.id) { setOpen(false); return; }
    setSwitching(orgId);
    await authClient.organization.setActive({ organizationId: orgId });
    setSwitching(null);
    setOpen(false);
    router.refresh();
  };

  // Determine display name: active org name, or fallback to first org, or user name
  const displayName = activeOrg?.name ?? orgs?.[0]?.name ?? session?.user.name ?? 'Workspace';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const avatarColor = activeOrg ? orgColor(activeOrg.name) : 'bg-primary';

  return (
    <div ref={ref} className="relative px-2 py-2">
      <button
        onClick={() => setOpen((o) => !o)}
        title={collapsed ? displayName : undefined}
        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-accent ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        {/* Org avatar */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${avatarColor}`}
        >
          {displayInitial}
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
              {orgs && orgs.length > 1 && (
                <p className="text-[11px] text-muted-foreground">{orgs.length} workspaces</p>
              )}
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute z-50 rounded-xl border bg-popover shadow-lg ${
            collapsed
              ? 'left-full top-0 ml-2 w-56'
              : 'left-0 right-0 top-full mt-1'
          }`}
        >
          {/* Header */}
          <div className="border-b px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your workspaces
            </p>
          </div>

          {/* Org list */}
          <div className="max-h-56 overflow-y-auto p-1">
            {orgsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : orgs && orgs.length > 0 ? (
              orgs.map((org) => {
                const isActive = org.id === activeOrg?.id;
                const isSwitching = switching === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSwitch(org.id)}
                    disabled={isSwitching}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent disabled:opacity-60"
                  >
                    {/* Org avatar */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${orgColor(org.name)}`}
                    >
                      {isSwitching ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        org.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{org.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">/{org.slug}</p>
                    </div>
                    {isActive && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-3 text-sm text-muted-foreground">No workspaces found.</p>
            )}
          </div>

          {/* Footer — create new workspace */}
          <div className="border-t p-1">
            <button
              onClick={() => { setOpen(false); router.push('/onboarding'); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border">
                <Plus className="h-3.5 w-3.5" />
              </div>
              Create new workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
