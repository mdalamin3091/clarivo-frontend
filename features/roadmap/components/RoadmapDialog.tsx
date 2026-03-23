'use client';

import { useEffect } from 'react';
import { useForm }   from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Users, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button }            from '@/components/ui/button';
import { Textarea }          from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IconPicker, isEmoji, isImageUrl } from '@/shared/components/ui/IconPicker';
import { FormInput }         from '@/shared/components/ui/FormInput';
import { BaseFilterEditor }  from '@/shared/components/ui/BaseFilterEditor';
import { useCreateRoadmap }  from '../hooks/useCreateRoadmap';
import { useUpdateRoadmap }  from '../hooks/useUpdateRoadmap';
import { useOrgBoards }      from '../hooks/useOrgBoards';
import { useRoadmapStore }   from '../store';
import { roadmapFormSchema, type RoadmapFormValues } from '../validation';
import type { Roadmap } from '../types';
import { cn } from '@/lib/utils';

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveIconType(value: string): 'predefined' | 'emoji' {
  if (isImageUrl(value) || isEmoji(value)) return 'emoji';
  return 'predefined';
}

const DEFAULT_VALUES: RoadmapFormValues = {
  name:         '',
  description:  '',
  icon:         { type: 'predefined', value: 'Map' },
  visibility:   'everyone',
  baseFilter:   '',
  copiedFromId: undefined,
};

function roadmapToValues(r: Roadmap): RoadmapFormValues {
  return {
    name:         r.name,
    description:  r.description ?? '',
    icon:         r.icon,
    visibility:   r.visibility,
    baseFilter:   r.baseFilter,
    copiedFromId: r.copiedFromId ?? undefined,
  };
}

// ── Visibility card ───────────────────────────────────────────────────────────

interface VisibilityCardProps {
  selected:    boolean;
  onSelect:    () => void;
  icon:        React.ReactNode;
  title:       string;
  description: string;
}

function VisibilityCard({ selected, onSelect, icon, title, description }: VisibilityCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col gap-3 rounded-xl border p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
          : 'border-border bg-muted/20 hover:border-muted-foreground/30 hover:bg-muted/40',
      )}
    >
      <div className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        selected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
      )}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RoadmapDialog() {
  const { dialogOpen, editingRoadmap, closeDialog, roadmaps } = useRoadmapStore();
  const isEdit = !!editingRoadmap;

  const { data: boards = [] } = useOrgBoards();

  const form = useForm<RoadmapFormValues>({
    resolver:      zodResolver(roadmapFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (dialogOpen) {
      form.reset(editingRoadmap ? roadmapToValues(editingRoadmap) : DEFAULT_VALUES);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const { mutate: create, isPending: creating } = useCreateRoadmap();
  const { mutate: update, isPending: updating  } = useUpdateRoadmap();
  const isPending = creating || updating;

  const copyOptions = roadmaps.filter(r => r.id !== editingRoadmap?.id);

  const onSubmit = (data: RoadmapFormValues) => {
    const payload = {
      name:        data.name,
      description: data.description || undefined,
      icon:        { type: deriveIconType(data.icon.value), value: data.icon.value || 'Map' },
      visibility:  data.visibility,
      baseFilter:  data.baseFilter,
      ...(data.copiedFromId ? { copiedFromId: data.copiedFromId } : {}),
    };

    if (isEdit) {
      update({ id: editingRoadmap.id, input: payload });
    } else {
      create(payload);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">
            {isEdit ? 'Edit roadmap' : 'Create a new roadmap'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? 'Update the roadmap configuration.'
              : 'Set up a new roadmap. Default columns will be created automatically.'}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-5">

            {/* Icon + Name */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium leading-none">Roadmap name &amp; icon</p>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <IconPicker
                          value={field.value.value}
                          onChange={v => field.onChange({
                            type:  deriveIconType(v || 'Map'),
                            value: v || 'Map',
                          })}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1">
                  <FormInput
                    control={form.control}
                    name="name"
                    label="Roadmap name"
                    labelClassName="sr-only"
                    inputProps={{ placeholder: 'e.g. Product Roadmap' }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe this roadmap…"
                      rows={3}
                      className="resize-none bg-muted/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who can see this roadmap?</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      <VisibilityCard
                        selected={field.value === 'everyone'}
                        onSelect={() => field.onChange('everyone')}
                        icon={<Globe className="h-4 w-4" />}
                        title="Everyone"
                        description="Visible to all users on your public portal."
                      />
                      <VisibilityCard
                        selected={field.value === 'teamOnly'}
                        onSelect={() => field.onChange('teamOnly')}
                        icon={<Users className="h-4 w-4" />}
                        title="Team only"
                        description="Visible only to your organization members."
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Base filter */}
            <FormField
              control={form.control}
              name="baseFilter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base filters for the roadmap</FormLabel>
                  <FormControl>
                    <BaseFilterEditor
                      value={field.value}
                      onChange={field.onChange}
                      boards={boards}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Copy setup — create mode only */}
            {!isEdit && copyOptions.length > 0 && (
              <FormField
                control={form.control}
                name="copiedFromId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copy setup from another roadmap <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? '__default__'}
                        onValueChange={v => field.onChange(v === '__default__' ? undefined : v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="— Start with default columns —" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__default__">— Start with default columns —</SelectItem>
                          {copyOptions.map(r => (
                            <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Copies the column structure from the selected roadmap.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={closeDialog} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Save changes' : 'Create roadmap'}
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
