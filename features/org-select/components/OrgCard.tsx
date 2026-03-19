'use client';

import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { OrgListItem } from '../types';

interface Props {
  org: OrgListItem;
  isSelecting: boolean;
  onSelect: () => void;
}

export function OrgCard({ org, isSelecting, onSelect }: Props) {
  const initial = org.name.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isSelecting}
      className="group flex w-full items-center gap-4 rounded-xl border bg-card px-5 py-4 text-left transition-all hover:border-primary/30 hover:shadow-sm disabled:opacity-60"
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
        {org.logo ? (
          <Image src={org.logo} alt={org.name} width={40} height={40} className="rounded-xl object-cover" />
        ) : (
          initial
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{org.name}</p>
        <p className="truncate text-xs text-muted-foreground">clarivo.app/{org.slug}</p>
      </div>

      {/* Action icon */}
      {isSelecting ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" />
      )}
    </button>
  );
}
