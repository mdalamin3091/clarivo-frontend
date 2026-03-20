'use client';

import { useFormContext } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { Trash2, Loader2 } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/shared/components/ui/FormInput';
import { IconPicker } from './IconPicker';
import { ModuleIcon } from './ModuleIcon';
import type { ModulesFormValues } from '../validation/modules.schema';
import SelectModuleLink from './SelectModuleLink';
import { MODULE_PRESETS } from '../constants';
import type { ModulePreset } from '../types';

// Template-literal field paths need a cast to satisfy FieldPath<T>
type ModulePath = FieldPath<ModulesFormValues>;

interface ModuleItemProps {
  index:     number;
  fieldId:   string;
  onSave:    () => void;
  onDelete:  () => void;
  isPending: boolean;
}

export function ModuleItem({ index, fieldId, onSave, onDelete, isPending }: ModuleItemProps) {
  const { watch, setValue, control } = useFormContext<ModulesFormValues>();

  const name      = watch(`modules.${index}.name`       as ModulePath) as string;
  const iconValue = watch(`modules.${index}.icon.value` as ModulePath) as string;
  const link      = watch(`modules.${index}.link`       as ModulePath) as string;

  const selectedPreset =
    MODULE_PRESETS.find((p) => p.link === link) ?? MODULE_PRESETS[0];

  const handlePresetSelect = (preset: ModulePreset) => {
    setValue(`modules.${index}.link` as ModulePath, preset.link as never, { shouldDirty: true });
  };

  return (
    <AccordionItem value={fieldId} className="overflow-hidden rounded-xl border bg-muted/30">

      {/* ── Header ── */}
      <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted hover:no-underline [&>svg]:text-muted-foreground">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ModuleIcon name={iconValue} className="h-4 w-4 text-muted-foreground" />
          {name || 'Untitled Module'}
        </span>
      </AccordionTrigger>

      {/* ── Expanded body ── */}
      <AccordionContent className="space-y-3 border-t px-4 pb-4 pt-4">

        {/* Icon & name — icon picker left-aligned with the input */}
        <div className="flex items-end gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Icon</Label>
            <IconPicker
              value={iconValue}
              onChange={val =>
                setValue(`modules.${index}.icon.value` as ModulePath, val as never, { shouldDirty: true })
              }
            />
          </div>
          <FormInput
            control={control}
            name={`modules.${index}.name` as ModulePath}
            label="Name"
            inputProps={{ placeholder: 'Module name' }}
            inputClassName="h-9 rounded-lg"
            className="flex-1"
          />
        </div>

        {/* Link — preview chip above, editable input below */}
        {/* <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-xs text-foreground">
            <LinkIcon className="h-3 w-3" />
            {link || 'No link set'}
          </span>
          <FormInput
            control={control}
            name={`modules.${index}.link` as ModulePath}
            label="Link"
            inputProps={{ placeholder: '/your-link' }}
            inputClassName="h-9 rounded-lg"
          />
        </div> */}
        <SelectModuleLink
            selectedPreset={selectedPreset}
            onSelect={handlePresetSelect}
          />

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={isPending}
            className="min-w-17.5"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
