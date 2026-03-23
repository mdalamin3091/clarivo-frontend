'use client';

import { useRef } from 'react';
import { X } from 'lucide-react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface FormOptionsInputProps<T extends FieldValues> {
  control: Control<T>;
  name:    FieldPath<T>;
  label?:  string;
}

/**
 * Reusable form field: chip-tag input for string[] arrays wired to react-hook-form.
 *
 * - Press Enter or comma to add an option.
 * - Press Backspace on empty input to remove the last chip.
 * - Click × on a chip to remove it.
 */
export function FormOptionsInput<T extends FieldValues>({
  control,
  name,
  label = 'Options',
}: FormOptionsInputProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const values: string[] = Array.isArray(field.value) ? field.value : [];

        const commit = () => {
          const raw = inputRef.current?.value.trim() ?? '';
          if (!raw) return;
          if (!values.includes(raw)) field.onChange([...values, raw]);
          if (inputRef.current) inputRef.current.value = '';
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && inputRef.current?.value === '' && values.length > 0) {
            field.onChange(values.slice(0, -1));
          }
        };

        const removeOption = (opt: string) =>
          field.onChange(values.filter((v) => v !== opt));

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div
                className="flex min-h-10 flex-wrap gap-1.5 cursor-text rounded-md border border-input bg-background px-3 py-2"
                onClick={() => inputRef.current?.focus()}
              >
                {values.map((opt) => (
                  <span
                    key={opt}
                    className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                  >
                    {opt}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeOption(opt); }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  onBlur={commit}
                  placeholder={values.length === 0 ? 'Type an option and press Enter…' : ''}
                  className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </FormControl>
            <p className="text-xs text-muted-foreground">Press Enter or comma to add an option.</p>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
