'use client';

import { useState } from 'react';
import { Globe, Lock, Loader2 } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useUpdateAccessibility } from '../hooks/useUpdateAccessibility';
import { ConfirmAccessibilityDialog } from './ConfirmAccessibilityDialog';
import type { OrgAccessibility } from '../types';

// ── Option card config ─────────────────────────────────────────────────────────

const OPTIONS: {
  value:       OrgAccessibility;
  icon:        React.ElementType;
  label:       string;
  description: string;
}[] = [
  {
    value:       'public',
    icon:        Globe,
    label:       'Public',
    description: 'Anyone can view your portal without signing in. Ideal for open feedback and changelogs.',
  },
  {
    value:       'private',
    icon:        Lock,
    label:       'Private',
    description: 'Only invited members can access your portal. Best for internal teams and closed betas.',
  },
];

// ── Inner stateful component — remounted via key={org?.id} when org changes ────

interface AccessibilityOptionsProps {
  initialValue: OrgAccessibility;
}

function AccessibilityOptions({ initialValue }: AccessibilityOptionsProps) {
  const { refetch }           = useActiveOrganization();
  const { mutate, isPending } = useUpdateAccessibility(() => { void refetch(); });

  const [selected,      setSelected]      = useState<OrgAccessibility>(initialValue);
  const [pendingTarget, setPendingTarget] = useState<OrgAccessibility | null>(null);

  const handleCardClick = (value: OrgAccessibility) => {
    if (value === selected || isPending) return;
    setPendingTarget(value);
  };

  const handleConfirm = () => {
    if (!pendingTarget) return;
    const target = pendingTarget;
    setPendingTarget(null);
    setSelected(target);
    mutate({ accessibility: target });
  };

  const handleCancel = () => setPendingTarget(null);

  return (
    <>
      <div className="space-y-6 rounded-xl border bg-card p-6">

        {/* ── Option cards ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OPTIONS.map(({ value, icon: Icon, label, description }) => {
            const isActive = selected === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleCardClick(value)}
                disabled={isPending}
                className={cn(
                  'flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/40 hover:bg-muted/40',
                  isPending && 'cursor-not-allowed opacity-60',
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}>
                    {label}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                {/* Active indicator dot */}
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    'h-2 w-2 rounded-full border-2',
                    isActive ? 'border-primary bg-primary' : 'border-muted-foreground/30',
                  )} />
                  <span className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-primary' : 'text-muted-foreground/50',
                  )}>
                    {isActive ? 'Selected' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Info banner ── */}
        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Note: </span>
            Changing access settings takes effect immediately for new visitors. Existing sessions are not affected.
          </p>
        </div>

        {/* ── Saving indicator ── */}
        {isPending && (
          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving…
          </div>
        )}
      </div>

      {/* ── Confirmation dialog ── */}
      {pendingTarget && (
        <ConfirmAccessibilityDialog
          open
          target={pendingTarget}
          isPending={isPending}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

// ── Shell — waits for org data then mounts inner component with key ────────────

export function AccessibilityForm() {
  const { data: org, isPending: isLoading } = useActiveOrganization();

  const extra       = org as unknown as Record<string, unknown>;
  const serverValue = (extra?.accessibility as OrgAccessibility | undefined) ?? 'public';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AccessibilityOptions
      key={org?.id}
      initialValue={serverValue}
    />
  );
}
