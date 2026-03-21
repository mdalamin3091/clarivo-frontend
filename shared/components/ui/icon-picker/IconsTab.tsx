'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LUCIDE_ICONS } from '../icon-picker-data';

interface IconsTabProps {
  value:    string;
  onSelect: (name: string) => void;
}

export function IconsTab({ value, onSelect }: IconsTabProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return LUCIDE_ICONS;
    return LUCIDE_ICONS.filter(
      ({ label, name, keywords = [] }) =>
        label.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q)  ||
        keywords.some((k) => k.includes(q)),
    );
  }, [search]);

  return (
    <>
      <div className="flex h-9 items-center gap-2 border-b px-3">
        <Search className="size-4 shrink-0 opacity-50" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search icons..."
          className="placeholder:text-muted-foreground flex h-10 w-full bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          onKeyDown={(e) => e.stopPropagation()}
        />
      </div>

      <div className="max-h-64 overflow-y-auto p-2">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-7 gap-1">
            {filtered.map((icon) => (
              <button
                key={icon.name}
                type="button"
                title={icon.label}
                onClick={() => onSelect(icon.name)}
                className={cn(
                  'flex items-center justify-center rounded p-2 transition-colors hover:bg-muted',
                  value === icon.name && 'bg-primary/10 text-primary',
                )}
              >
                {React.createElement(icon.component, { className: 'h-4 w-4' })}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">No icons found.</p>
        )}
      </div>
    </>
  );
}
