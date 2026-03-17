'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormPasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

/**
 * Reusable password field: Label + Input (with show/hide toggle) + inline error.
 *
 * SRP  — single responsibility: a password input that can reveal its value.
 * DRY  — the show/hide state + toggle button logic lives here once, not in every form.
 */
export function FormPasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  className,
}: FormPasswordInputProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="h-12 rounded-xl border-border/60 bg-background px-4 pr-12 text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
