'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ICON_MAP, isEmoji, isImageUrl } from './icon-picker-data';
import { IconsTab }  from './icon-picker/IconsTab';
import { EmojisTab } from './icon-picker/EmojisTab';
import { ImageTab }  from './icon-picker/ImageTab';

// Re-export utilities so consumers import from one place
export { ICON_MAP, isEmoji, isImageUrl };

// ── Types ──────────────────────────────────────────────────────────────────────

export interface IconPickerProps {
  value:    string;
  onChange: (value: string) => void;
}

type Tab = 'icons' | 'emojis' | 'image';
const TABS: Tab[] = ['icons', 'emojis', 'image'];

// ── Component ──────────────────────────────────────────────────────────────────

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState<Tab>('icons');

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setTab('icons');
  };

  const isImageValue  = isImageUrl(value);
  const isEmojiValue  = !isImageValue && isEmoji(value);
  const IconComponent = !isImageValue && !isEmojiValue ? (ICON_MAP[value] ?? null) : null;

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isImageValue ? (
            <Image src={value} alt="icon" width={20} height={20} className="rounded object-cover" unoptimized />
          ) : isEmojiValue ? (
            <span className="text-base leading-none">{value}</span>
          ) : IconComponent ? (
            React.createElement(IconComponent, { className: 'h-4 w-4 text-foreground' })
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-72 overflow-hidden p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* ── Tab bar ── */}
        <div className="flex items-center border-b">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2 text-xs font-medium capitalize transition-colors',
                tab === t
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleSelect('')}
            title="Remove icon"
            className="flex items-center gap-1 px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        </div>

        {/* ── Tab content ── */}
        {tab === 'icons'  && <IconsTab  value={value} onSelect={handleSelect} />}
        {tab === 'emojis' && <EmojisTab onSelect={handleSelect} />}
        {tab === 'image'  && <ImageTab  value={value} onSelect={handleSelect} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
