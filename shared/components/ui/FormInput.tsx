import { ComponentProps } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  inputProps?: Omit<ComponentProps<typeof Input>, 'name' | 'className'>;
}

/**
 * Reusable form field: Label + Input + inline validation error.
 *
 * SRP  — renders exactly one labelled text input with its error message.
 * DRY  — eliminates the FormField→FormItem→FormLabel→FormControl→Input→FormMessage
 *        boilerplate that would otherwise repeat for every field.
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  labelClassName,
  inputClassName,
  inputProps,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <Input
              {...inputProps}
              {...field}
              className={cn(
                'h-12 rounded-xl border-border/60 bg-muted/60 px-4 text-sm',
                'placeholder:text-muted-foreground/50',
                'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
                inputClassName,
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
