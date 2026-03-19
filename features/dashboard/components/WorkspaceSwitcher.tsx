'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, Loader2, Plus } from 'lucide-react';
import { authClient, useListOrganizations, useActiveOrganization } from '@/lib/auth-client';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { orgColor } from '../utils/orgColor';

export function WorkspaceSwitcher() {
  const router = useRouter();
  const { data: orgs }      = useListOrganizations();
  const { data: activeOrg } = useActiveOrganization();

  const [open,      setOpen]      = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const handleSwitch = async (orgId: string) => {
    if (orgId === activeOrg?.id) return;
    setSwitching(orgId);
    await authClient.organization.setActive({ organizationId: orgId });
    setSwitching(null);
    setOpen(false);
  };

  const activeColor  = activeOrg ? orgColor(activeOrg.name) : 'bg-indigo-500';
  const activeLetter = activeOrg?.name.charAt(0).toUpperCase() ?? '?';

  return (
    <div ref={ref} className="relative mb-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen((o) => !o)}
            className={`group relative flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-white transition-opacity hover:opacity-85 ${activeColor}`}
          >
            {activeLetter}
            <ChevronDown className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-card text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{activeOrg?.name ?? 'Switch workspace'}</p>
        </TooltipContent>
      </Tooltip>

      {open && (
        <div className="absolute left-full top-0 z-50 ml-3 w-60 overflow-hidden rounded-xl border bg-popover shadow-xl">
          <div className="border-b px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Workspaces
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {orgs && orgs.length > 0 ? (
              <ul className="space-y-0.5">
                {orgs.map((org) => {
                  const isActive    = org.id === activeOrg?.id;
                  const isSwitching = switching === org.id;
                  return (
                    <li key={org.id}>
                      <button
                        onClick={() => handleSwitch(org.id)}
                        disabled={isSwitching}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors disabled:opacity-50 ${
                          isActive
                            ? 'bg-accent font-medium text-foreground'
                            : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-bold text-white ${orgColor(org.name)}`}>
                          {isSwitching
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : org.name.charAt(0).toUpperCase()
                          }
                        </div>
                        <span className="flex-1 truncate">{org.name}</span>
                        {isActive && !isSwitching && (
                          <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-2 py-2 text-xs text-muted-foreground">No workspaces yet.</p>
            )}
          </div>

          <div className="border-t p-1">
            <button
              onClick={() => { setOpen(false); router.push('/onboarding'); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-dashed border-border">
                <Plus className="h-3.5 w-3.5" />
              </div>
              Create workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
