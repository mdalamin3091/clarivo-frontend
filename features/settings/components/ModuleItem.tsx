'use client';

import { useFormContext } from 'react-hook-form';
import { Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconPicker } from './IconPicker';
import { ModuleIcon } from './ModuleIcon';
import type { ModulesFormValues } from '../validation/modules.schema';

interface ModuleItemProps {
  index:     number;
  fieldId:   string;
  onSave:    () => void;
  onDelete:  () => void;
  isPending: boolean;
}

export function ModuleItem({ index, fieldId, onSave, onDelete, isPending }: ModuleItemProps) {
  const { register, watch, setValue } = useFormContext<ModulesFormValues>();

  const name      = watch(`modules.${index}.name`);
  const iconValue = watch(`modules.${index}.icon.value`);
  const link      = watch(`modules.${index}.link`);

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
        <AccordionContent className="space-y-4 border-t px-4 pb-4 pt-4">

          {/* Icon & name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Icon &amp; name</Label>
            <div className="flex items-center gap-2">
              <IconPicker
                value={iconValue}
                onChange={val => setValue(`modules.${index}.icon.value`, val, { shouldDirty: true })}
              />
              <Input
                {...register(`modules.${index}.name`)}
                placeholder="Module name"
                className="h-9 flex-1 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Link */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Link</Label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-xs text-foreground">
                <LinkIcon className="h-3 w-3" />
                {link || 'No link set'}
              </span>
              <Input
                {...register(`modules.${index}.link`)}
                placeholder="/your-link"
                className="h-9 min-w-0 flex-1 rounded-lg bg-muted/60 text-sm"
              />
            </div>
          </div>

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
