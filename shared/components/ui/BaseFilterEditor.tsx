'use client';

import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SORT_OPTIONS,
  parseBaseFilter,
  buildBaseFilter,
  type SortOption,
} from '@/features/roadmap/lib/baseFilter';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FilterBoard {
  id:   string;
  name: string;
}

export interface FilterStatus {
  id:    string;
  name:  string;
  color: string;
}

export interface FilterTag {
  id:    string;
  name:  string;
  color: string;
}

interface BaseFilterEditorProps {
  value:     string;
  onChange:  (v: string) => void;
  boards?:   FilterBoard[];
  statuses?: FilterStatus[];
  tags?:     FilterTag[];
}

// ── Active chip ───────────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ── Colour dot for status / tag items ────────────────────────────────────────

function ColorDot({ color }: { color: string }) {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />;
}

// ── Main component ────────────────────────────────────────────────────────────

export function BaseFilterEditor({
  value,
  onChange,
  boards,
  statuses,
  tags,
}: BaseFilterEditorProps) {
  const params = parseBaseFilter(value);

  const update = (patch: Partial<typeof params>) =>
    onChange(buildBaseFilter({ ...params, ...patch }));

  const currentBoard  = boards?.find(b => b.id === params.boardId);
  const currentStatus = statuses?.find(s => s.id === params.statusId);
  const currentTag    = tags?.find(t => t.id === params.tagId);

  return (
    <div className="space-y-3">

      {/* ── Active filter chips ──────────────────────────────────────────────── */}
      {(currentBoard || currentStatus || currentTag) && (
        <div className="flex flex-wrap gap-1.5">
          {currentBoard  && (
            <FilterChip label={`Board: ${currentBoard.name}`}   onRemove={() => update({ boardId:  undefined })} />
          )}
          {currentStatus && (
            <FilterChip label={`Status: ${currentStatus.name}`} onRemove={() => update({ statusId: undefined })} />
          )}
          {currentTag    && (
            <FilterChip label={`Tag: ${currentTag.name}`}       onRemove={() => update({ tagId:    undefined })} />
          )}
        </div>
      )}

      {/* ── Sort order ───────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Order posts by</p>
        <Select
          value={params.sort ?? ''}
          onValueChange={v => update({ sort: (v || undefined) as SortOption | undefined })}
        >
          <SelectTrigger className="h-9 rounded-lg border-border/60 bg-muted/60 text-sm hover:bg-muted">
            <SelectValue placeholder="Select sort order" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {opt.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* ── Board filter ─────────────────────────────────────────────────────── */}
      {boards && boards.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Filter by board</p>
          <Select
            value={params.boardId ?? '__all__'}
            onValueChange={v => update({ boardId: v === '__all__' ? undefined : v })}
          >
            <SelectTrigger className="h-9 rounded-lg border-border/60 bg-muted/60 text-sm hover:bg-muted">
              <SelectValue placeholder="All boards" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All boards</SelectItem>
              {boards.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── Status filter ────────────────────────────────────────────────────── */}
      {statuses && statuses.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Filter by status</p>
          <Select
            value={params.statusId ?? '__all__'}
            onValueChange={v => update({ statusId: v === '__all__' ? undefined : v })}
          >
            <SelectTrigger className="h-9 rounded-lg border-border/60 bg-muted/60 text-sm hover:bg-muted">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All statuses</SelectItem>
              {statuses.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <ColorDot color={s.color} />
                    {s.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── Tag filter ───────────────────────────────────────────────────────── */}
      {tags && tags.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Filter by tag</p>
          <Select
            value={params.tagId ?? '__all__'}
            onValueChange={v => update({ tagId: v === '__all__' ? undefined : v })}
          >
            <SelectTrigger className="h-9 rounded-lg border-border/60 bg-muted/60 text-sm hover:bg-muted">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All tags</SelectItem>
              {tags.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  <div className="flex items-center gap-2">
                    <ColorDot color={t.color} />
                    {t.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
