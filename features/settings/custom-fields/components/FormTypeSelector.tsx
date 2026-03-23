'use client';

import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { TYPE_OPTIONS } from '../constants';
import type { CustomFieldType } from '../types';
import type { CustomFieldFormValues } from '../validation';

interface FormTypeSelectorProps {
  control:       Control<CustomFieldFormValues>;
  onTypeChange?: (type: CustomFieldType) => void;
}

/**
 * Card-grid type selector wired to react-hook-form.
 * Calls onTypeChange so the parent can clear dependent fields (options, placeholder).
 */
export function FormTypeSelector({ control, onTypeChange }: FormTypeSelectorProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field type</FormLabel>
          <FormControl>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(({ type, label, Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    field.onChange(type);
                    onTypeChange?.(type);
                  }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center transition-all',
                    field.value === type
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                      : 'border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/40',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
