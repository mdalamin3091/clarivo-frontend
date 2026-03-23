'use client';

import { useEffect }              from 'react';
import { useForm }                from 'react-hook-form';
import { zodResolver }            from '@hookform/resolvers/zod';
import * as AccordionPrimitive    from '@radix-ui/react-accordion';
import { ChevronDown, GripVertical, Loader2, Trash2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button }              from '@/components/ui/button';
import { FormInput }           from '@/shared/components/ui/FormInput';
import { ColorSwatchPicker }   from '@/shared/components/ui/ColorSwatchPicker';
import { BaseFilterEditor }    from '@/shared/components/ui/BaseFilterEditor';
import { cn }                  from '@/lib/utils';
import { columnFormSchema, type ColumnFormValues } from '../validation';
import { useUpdateRoadmapColumn } from '../hooks/useUpdateRoadmapColumn';
import { useDeleteRoadmapColumn } from '../hooks/useDeleteRoadmapColumn';
import { useOrgStatuses }         from '../hooks/useOrgStatuses';
import { useOrgTags }             from '../hooks/useOrgTags';
import type { RoadmapColumn }     from '../types';

interface Props {
  column:          RoadmapColumn;
  roadmapId:       string;
  dragHandleRef:   (el: HTMLElement | null) => void;
  dragHandleProps: React.HTMLAttributes<HTMLElement>;
  isOpen:          boolean;
  onClose:         () => void;
}

export function RoadmapColumnItem({
  column,
  roadmapId,
  dragHandleRef,
  dragHandleProps,
  isOpen,
  onClose,
}: Props) {
  const { mutate: update, isPending: saving }  = useUpdateRoadmapColumn();
  const { mutate: del,    isPending: deleting } = useDeleteRoadmapColumn();
  const { data: statuses = [] }                 = useOrgStatuses();
  const { data: tags     = [] }                 = useOrgTags();

  const form = useForm<ColumnFormValues>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      name:       column.name,
      color:      column.color,
      baseFilter: column.baseFilter,
    },
  });

  // Sync form values with latest server data whenever item opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name:       column.name,
        color:      column.color,
        baseFilter: column.baseFilter,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = (values: ColumnFormValues) => {
    update(
      { roadmapId, columnId: column.id, input: values },
      { onSuccess: onClose },
    );
  };

  return (
    <AccordionPrimitive.Item
      value={column.id}
      className="rounded-lg border border-border bg-card overflow-hidden"
    >
      {/* ── Header: drag handle + dot + name trigger ──────────────────────── */}
      <AccordionPrimitive.Header className="flex items-center gap-2 px-3">
        {/* Drag handle — outside trigger so it doesn't activate accordion */}
        <button
          ref={dragHandleRef}
          {...dragHandleProps}
          type="button"
          className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Color dot */}
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: column.color }}
        />

        {/* Accordion trigger spans the rest of the row */}
        <AccordionPrimitive.Trigger
          className={cn(
            'flex flex-1 items-center justify-between py-2.5 text-sm font-medium',
            'transition-all [&[data-state=open]>svg]:rotate-180',
            'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded',
          )}
        >
          <span className="truncate text-left">{column.name}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* ── Expandable edit form ───────────────────────────────────────────── */}
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="border-t border-border px-3 pb-3 pt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormInput
                control={form.control}
                name="name"
                label="Column name"
                inputProps={{ placeholder: 'e.g. In Progress' }}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <ColorSwatchPicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="baseFilter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Column filter</FormLabel>
                    <FormControl>
                      <BaseFilterEditor
                        value={field.value}
                        onChange={field.onChange}
                        statuses={statuses}
                        tags={tags}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => del({ roadmapId, columnId: column.id })}
                  disabled={deleting || saving}
                >
                  {deleting
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Trash2  className="h-3.5 w-3.5" />}
                  Delete
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => { form.reset(); onClose(); }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    disabled={saving}
                  >
                    {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
