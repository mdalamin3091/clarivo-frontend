import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { SwitchRow } from './SwitchRow';

interface FormSwitchRowProps<T extends FieldValues> {
  control:     Control<T>;
  name:        FieldPath<T>;
  label:       string;
  description: string;
}

/**
 * Reusable form field: SwitchRow wired to react-hook-form.
 *
 * SRP  — renders exactly one labelled switch toggle with its error state.
 * DRY  — eliminates FormField→FormItem→FormControl→SwitchRow boilerplate.
 */
export function FormSwitchRow<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: FormSwitchRowProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <SwitchRow
              checked={!!field.value}
              onChange={field.onChange}
              label={label}
              description={description}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
