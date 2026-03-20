import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  control:     Control<T>;
  name:        FieldPath<T>;
  label:       string;
  options:     SelectOption[];
  placeholder?: string;
  className?:  string;
}

/**
 * Reusable form field: Label + Select + inline validation error.
 *
 * SRP  — renders exactly one labelled select with its error message.
 * DRY  — eliminates the FormField→FormItem→FormLabel→Select→FormMessage
 *        boilerplate that would otherwise repeat for every select field.
 */
export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  className,
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
