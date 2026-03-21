'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, BookOpen } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useActiveOrganization } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { modulesFormSchema, type ModulesFormValues } from '../validation/modules.schema';
import { useOrgModules } from '../hooks/useOrgModules';
import { useUpdateModules } from '../hooks/useUpdateModules';
import { SortableModuleItem } from './SortableModuleItem';
import { AddModuleDialog } from './AddModuleDialog';
import type { PortalMenuItem } from '../types';

export function SetupModulesForm() {
  const [dialogOpen, setDialogOpen]       = useState(false);
  const { refetch }                       = useActiveOrganization();
  const { data: menus, orgId, isLoading } = useOrgModules();
  const { mutate, isPending }             = useUpdateModules(() => { void refetch(); });

  const form = useForm<ModulesFormValues>({
    resolver: zodResolver(modulesFormSchema) as never,
    defaultValues: { modules: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  // Sort by order when data arrives
  useEffect(() => {
    if (menus) {
      const sorted = [...menus].sort((a, b) => a.order - b.order);
      form.reset({ modules: sorted });
    }
  }, [orgId]); // eslint-disable-line react-hooks/exhaustive-deps

  // dnd-kit: require 5px drag distance to avoid clashing with accordion clicks
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const reindexOrders = (modules: PortalMenuItem[]): PortalMenuItem[] =>
    modules.map((m, i) => ({ ...m, order: i + 1 }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex(f => f.id === active.id);
    const newIndex = fields.findIndex(f => f.id === over.id);

    // Compute reordered array BEFORE calling move() — move() updates the form
    // store synchronously, so getValues() after it would return already-moved data
    // causing arrayMove to be applied twice and producing the wrong position.
    const reordered = reindexOrders(arrayMove(form.getValues().modules, oldIndex, newIndex));
    move(oldIndex, newIndex);
    form.setValue('modules', reordered);
    mutate(reordered);
  };

  const findDuplicateModule = (menus: PortalMenuItem[]): PortalMenuItem | null => {
    const links = menus.map(m => m.link.toLowerCase().trim());
    const dupeIndex = links.findIndex((link, i) => links.indexOf(link) !== i);
    return dupeIndex !== -1 ? (menus[dupeIndex] ?? null) : null;
  };

  const saveAll = () => {
    const modules = reindexOrders(form.getValues().modules);
    const duplicate = findDuplicateModule(modules);
    if (duplicate) {
      toast.error('Duplicate link', {
        description: `"${duplicate.name}" already has this link assigned.`,
      });
      return;
    }
    mutate(modules);
  };

  const handleAdd = (menu: PortalMenuItem) => {
    const updated = reindexOrders([...form.getValues().modules, menu]);
    append(updated[updated.length - 1]!);
    mutate(updated);
  };

  const handleDelete = (index: number) => {
    const updated = reindexOrders(
      form.getValues().modules.filter((_, i) => i !== index),
    );
    remove(index);
    mutate(updated);
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>

      {/* ── Section header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Customize / disable modules</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Drag to reorder, customize, or remove links from your public portal.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="shrink-0 gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add link / module
        </Button>
      </div>

      {/* ── Card: module list + footer ── */}
      <div className="rounded-xl border bg-card p-6 space-y-4">

        {fields.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No modules yet. Add one to get started.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <Accordion type="single" collapsible className="space-y-2">
                {fields.map((field, index) => (
                  <SortableModuleItem
                    key={field.id}
                    id={field.id}
                    index={index}
                    fieldId={field.id}
                    onSave={saveAll}
                    onDelete={() => handleDelete(index)}
                    isPending={isPending}
                  />
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>
        )}

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Have a question about customizing modules?
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" />
            View documentation
          </button>
        </div>
      </div>

      <AddModuleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
        existingLinks={form.getValues('modules').map(m => m.link)}
        existingCount={fields.length}
      />
    </FormProvider>
  );
}
