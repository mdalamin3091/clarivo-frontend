'use client';

import {
  LayoutGrid,
  Tag,
  User,
  Globe,
  Lock,
  MessageSquare,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react';
import { Controller, type Control, type UseFormWatch } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { SearchableSelect } from '@/shared/components/ui/SearchableSelect';
import { MultiSearchableSelect } from '@/shared/components/ui/MultiSearchableSelect';
import { DatePicker } from '@/shared/components/ui/DatePicker';
import { SectionAccordion } from '@/shared/components/ui/SectionAccordion';
import { RichEditor } from '@/shared/components/editor';
import { FileText } from 'lucide-react';
import type { DrawerFormValues } from '../../validation';

// ─── FieldRow ─────────────────────────────────────────────────────────────────

function FieldRow({
  icon, label, children,
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="flex w-32 shrink-0 items-center gap-2 pt-2 text-sm text-muted-foreground">
        <span className="shrink-0">{icon}</span>
        {label}
      </div>
      <div className="flex flex-1 min-w-0 justify-end">{children}</div>
    </div>
  );
}

// ─── Option types (mirrors what the orchestrator builds) ──────────────────────

interface SelectOption {
  value: string;
  label: string;
  color?: string;
  icon?:  React.ReactNode;
}

interface Props {
  control:        Control<DrawerFormValues>;
  watch:          UseFormWatch<DrawerFormValues>;
  boardOptions:   SelectOption[];
  statusOptions:  SelectOption[];
  tagOptions:     SelectOption[];
  memberOptions:  SelectOption[];
  currentStatus:  { color: string } | undefined;
}

// ─── DrawerFieldsSection ──────────────────────────────────────────────────────

export function DrawerFieldsSection({
  control, watch, boardOptions, statusOptions, tagOptions, memberOptions, currentStatus,
}: Props) {
  const visibility = watch('visibility');

  return (
    <div className="px-5 space-y-4 pb-6">
      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          Description
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichEditor
              value={field.value as Parameters<typeof RichEditor>[0]['value']}
              onChange={field.onChange}
              placeholder="Add a description…"
              className="min-h-32 rounded-xl border border-border bg-muted/20 [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:min-h-24"
            />
          )}
        />
      </div>

      {/* Fields accordion */}
      <SectionAccordion
        title={
          <span className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            Fields
          </span>
        }
        badge="7"
        defaultOpen={true}
        contentClassName="px-4 pt-1 pb-3"
      >
        {/* Status */}
        <FieldRow
          icon={
            currentStatus
              ? <span className="h-3 w-3 rounded-full block shrink-0" style={{ backgroundColor: currentStatus.color }} />
              : <span className="h-3 w-3 rounded-full block shrink-0 bg-muted-foreground/30" />
          }
          label="Status"
        >
          <Controller
            name="statusId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Set status"
                clearable
                triggerClassName="h-7 border-0 bg-transparent px-2 text-sm hover:bg-accent"
              />
            )}
          />
        </FieldRow>

        {/* Board */}
        <FieldRow icon={<LayoutGrid className="h-3.5 w-3.5" />} label="Board">
          <Controller
            name="boardId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                options={boardOptions}
                value={field.value}
                onChange={(v) => v && field.onChange(v)}
                placeholder="Select board"
                clearable={false}
                triggerClassName="h-7 border-0 bg-transparent px-2 text-sm hover:bg-accent"
              />
            )}
          />
        </FieldRow>

        {/* Tags */}
        <FieldRow icon={<Tag className="h-3.5 w-3.5" />} label="Tags">
          <Controller
            name="tagIds"
            control={control}
            render={({ field }) => (
              <MultiSearchableSelect
                options={tagOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Add tags"
                searchPlaceholder="Search tags…"
                maxDisplay={10}
                align="end"
              />
            )}
          />
        </FieldRow>

        {/* Assignees */}
        <FieldRow icon={<User className="h-3.5 w-3.5" />} label="Assignees">
          <Controller
            name="assigneeIds"
            control={control}
            render={({ field }) => (
              <MultiSearchableSelect
                options={memberOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Assign members"
                searchPlaceholder="Search members…"
                maxDisplay={10}
                align="end"
              />
            )}
          />
        </FieldRow>

        {/* ETA */}
        <FieldRow icon={<Calendar className="h-3.5 w-3.5" />} label="ETA">
          <Controller
            name="eta"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Not set"
                side="left"
                align="end"
              />
            )}
          />
        </FieldRow>

        {/* Visibility */}
        <FieldRow
          icon={visibility === 'public' ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          label="Visibility"
        >
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(field.value === 'public' ? 'private' : 'public')}
                className="h-7 rounded-md px-2 text-sm text-foreground hover:bg-accent transition-colors"
              >
                {field.value === 'public' ? 'Public' : 'Private'}
              </button>
            )}
          />
        </FieldRow>

        {/* Enable Comments */}
        <FieldRow icon={<MessageSquare className="h-3.5 w-3.5" />} label="Comments">
          <Controller
            name="enableComment"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2 pt-1">
                <span className={cn('text-xs', field.value ? 'text-foreground' : 'text-muted-foreground')}>
                  {field.value ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="scale-75 origin-right"
                />
              </div>
            )}
          />
        </FieldRow>
      </SectionAccordion>
    </div>
  );
}
