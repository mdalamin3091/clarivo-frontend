'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from '@/components/ui/emoji-picker';
import { cn } from '@/lib/utils';
import { LUCIDE_ICONS, ICON_MAP, isEmoji } from './icon-picker-data';

// Re-export so consumers (e.g. ModuleIcon) can import from one place
export { ICON_MAP, isEmoji };

// ── Types ──────────────────────────────────────────────────────────────────────

export interface IconPickerProps {
  value:    string;
  onChange: (value: string) => void;
}

type Tab = 'icons' | 'emojis' | 'custom';
const TABS: Tab[] = ['icons', 'emojis', 'custom'];

// ── IconsTab ───────────────────────────────────────────────────────────────────

interface IconsTabProps {
  value:    string;
  onSelect: (val: string) => void;
}

function IconsTab({ value, onSelect }: IconsTabProps) {
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
          className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          onKeyDown={(e) => e.stopPropagation()}
        />
      </div>

      <div className="max-h-64 overflow-y-auto p-2">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-8 gap-0.5">
            {filtered.map((icon) => (
              <button
                key={icon.name}
                type="button"
                title={icon.label}
                onClick={() => onSelect(icon.name)}
                className={cn(
                  'flex items-center justify-center rounded p-1.5 transition-colors hover:bg-muted',
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

// ── EmojisTab ──────────────────────────────────────────────────────────────────

interface EmojisTabProps {
  onSelect: (emoji: string) => void;
}

function EmojisTab({ onSelect }: EmojisTabProps) {
  return (
    <EmojiPicker
      className="h-75 w-full rounded-none"
      onEmojiSelect={({ emoji }) => onSelect(emoji)}
    >
      <EmojiPickerSearch
        placeholder="Search emojis..."
        onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
      />
      <EmojiPickerContent />
      <EmojiPickerFooter />
    </EmojiPicker>
  );
}

// ── CustomTab ──────────────────────────────────────────────────────────────────

interface CustomTabProps {
  value:    string;
  onChange: (val: string) => void;
  onClear:  () => void;
}

function CustomTab({ value, onChange, onClear }: CustomTabProps) {
  return (
    <div className="space-y-3 p-3">
      <p className="text-xs text-muted-foreground">
        Paste any emoji or custom character below.
      </p>
      <input
        value={isEmoji(value) ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste emoji here…"
        className="w-full rounded-md border bg-muted/40 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        onKeyDown={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1.5 text-xs text-destructive hover:underline"
      >
        <X className="h-3 w-3" />
        Remove icon
      </button>
    </div>
  );
}

// ── IconPicker ─────────────────────────────────────────────────────────────────

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

  const isEmojiValue  = isEmoji(value);
  const IconComponent = !isEmojiValue ? (ICON_MAP[value] ?? null) : null;

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isEmojiValue ? (
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
        {tab === 'custom' && (
          <CustomTab
            value={value}
            onChange={onChange}
            onClear={() => handleSelect('')}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
