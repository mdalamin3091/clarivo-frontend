'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Search, Upload, X } from 'lucide-react';
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
import { apiFetch } from '@/lib/api';
import { LUCIDE_ICONS, ICON_MAP, isEmoji } from './icon-picker-data';

// Re-export so consumers (e.g. ModuleIcon) can import from one place
export { ICON_MAP, isEmoji };

/** True when the string is an image data URL or HTTP(S) URL */
export function isImageUrl(str: string): boolean {
  if (!str) return false;
  return (
    str.startsWith('data:image/') ||
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(str)
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface IconPickerProps {
  value:    string;
  onChange: (value: string) => void;
}

type Tab = 'icons' | 'emojis' | 'image';
const TABS: Tab[] = ['icons', 'emojis', 'image'];

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

// ── ImageTab ───────────────────────────────────────────────────────────────────

interface ImageTabProps {
  value:    string;
  onSelect: (url: string) => void;
}

function ImageTab({ value, onSelect }: ImageTabProps) {
  const inputRef                    = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const preview = isImageUrl(value) ? value : '';

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setError(null);
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const data = await apiFetch<{ url: string }>('/api/v1/upload/image?type=logo', {
        method: 'POST',
        body: form,
      });
      onSelect(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-3 p-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <>
          <div className="flex items-center justify-center rounded-lg border bg-muted/40 p-4">
            <img
              src={preview}
              alt="Icon preview"
              className="h-12 w-12 rounded object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 rounded-md border py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {isUploading ? 'Uploading…' : 'Change image'}
            </button>
            <button
              type="button"
              onClick={() => onSelect('')}
              disabled={isUploading}
              className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        </>
      ) : (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
            isUploading && 'pointer-events-none opacity-60',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40',
          )}
        >
          <Upload className={cn('h-6 w-6 text-muted-foreground', isUploading && 'animate-bounce')} />
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {isUploading ? 'Uploading…' : 'Click or drag image here'}
            </p>
            <p className="text-xs text-muted-foreground/60">PNG, JPG, WebP, SVG · max 5 MB</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
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
            <img src={value} alt="icon" className="h-5 w-5 rounded object-cover" />
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
