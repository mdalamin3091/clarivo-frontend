'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, BookOpen } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { modulesFormSchema, type ModulesFormValues } from '../validation/modules.schema';
import { useOrgModules } from '../hooks/useOrgModules';
import { useUpdateModules } from '../hooks/useUpdateModules';
import { ModuleItem } from './ModuleItem';
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  useEffect(() => {
    if (menus) form.reset({ modules: menus });
  }, [orgId]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveAll = () => mutate(form.getValues().modules);

  const handleAdd = (menu: PortalMenuItem) => {
    append(menu);
    mutate(form.getValues().modules);
  };

  const handleDelete = (index: number) => {
    const updated = form.getValues().modules.filter((_, i) => i !== index);
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

      {/* ── Section header — outside the card ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Customize / disable modules</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Reorder, customize, or remove links from your public portal and widgets.
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

        {/* Module list */}
        <div className="space-y-2">
          {fields.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No modules yet. Add one to get started.
            </p>
          ) : (
            fields.map((field, index) => (
              <ModuleItem
                key={field.id}
                index={index}
                fieldId={field.id}
                onSave={saveAll}
                onDelete={() => handleDelete(index)}
                isPending={isPending}
              />
            ))
          )}
        </div>

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
      />
    </FormProvider>
  );
}
