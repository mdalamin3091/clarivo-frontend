'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button }  from '@/components/ui/button';
import { Form }    from '@/components/ui/form';
import { FormInput }        from '@/shared/components/ui/FormInput';
import { FormSwitchRow }    from '@/shared/components/ui/FormSwitchRow';
import { FormOptionsInput } from '@/shared/components/ui/FormOptionsInput';
import { useCustomFieldsStore }  from '../store';
import { useCreateCustomField }  from '../hooks/useCreateCustomField';
import { useUpdateCustomField }  from '../hooks/useUpdateCustomField';
import { OPTION_TYPES, PLACEHOLDER_TYPES } from '../constants';
import { customFieldFormSchema, type CustomFieldFormValues } from '../validation';
import { FormTypeSelector } from './FormTypeSelector';
import type { CustomFieldType } from '../types';

const DEFAULT_VALUES: CustomFieldFormValues = {
  name:                 '',
  type:                 'text',
  options:              [],
  placeholder:          '',
  isRequired:           false,
  isPrivate:            false,
  showAnswerToEveryone: false,
};

export function CustomFieldDialog() {
  const { dialogOpen, editingField, closeDialog } = useCustomFieldsStore();
  const isEdit = !!editingField;

  const form = useForm<CustomFieldFormValues>({
    resolver:      zodResolver(customFieldFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const watchedType = form.watch('type');

  const { mutate: create, isPending: creating } = useCreateCustomField();
  const { mutate: update, isPending: updating  } = useUpdateCustomField();
  const isPending = creating || updating;

  // Reset form whenever the dialog opens
  useEffect(() => {
    if (dialogOpen) {
      form.reset(
        editingField
          ? {
              name:                 editingField.name,
              type:                 editingField.type,
              options:              editingField.options,
              placeholder:          editingField.placeholder ?? '',
              isRequired:           editingField.isRequired,
              isPrivate:            editingField.isPrivate,
              showAnswerToEveryone: editingField.showAnswerToEveryone,
            }
          : DEFAULT_VALUES,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  // Clear dependent fields when type changes
  const handleTypeChange = (type: CustomFieldType) => {
    if (!OPTION_TYPES.has(type))      form.setValue('options',      [],  { shouldValidate: true });
    if (!PLACEHOLDER_TYPES.has(type)) form.setValue('placeholder',  '',  { shouldValidate: false });
  };

  const onSubmit = (data: CustomFieldFormValues) => {
    const options     = OPTION_TYPES.has(data.type)      ? data.options              : [];
    const placeholder = PLACEHOLDER_TYPES.has(data.type) ? data.placeholder || undefined : undefined;

    if (isEdit) {
      update({
        id: editingField.id,
        input: {
          name:                 data.name,
          type:                 data.type,
          options,
          placeholder,
          isRequired:           data.isRequired,
          isPrivate:            data.isPrivate,
          showAnswerToEveryone: data.showAnswerToEveryone,
        },
      });
    } else {
      create({
        name:                 data.name,
        type:                 data.type,
        options:              options.length > 0 ? options : undefined,
        placeholder,
        isRequired:           data.isRequired,
        isPrivate:            data.isPrivate,
        showAnswerToEveryone: data.showAnswerToEveryone,
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            {isEdit ? 'Edit custom field' : 'Add custom field'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? 'Update the field configuration or visibility.'
              : 'Define a new metadata field for your feedback posts.'}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-1 space-y-5">

            {/* Name */}
            <FormInput
              control={form.control}
              name="name"
              label="Field name"
              inputProps={{ placeholder: 'e.g. Priority' }}
            />

            {/* Type selector — both create and edit */}
            <FormTypeSelector
              control={form.control}
              onTypeChange={handleTypeChange}
            />

            {/* Options — dropdown / multiselect only */}
            {OPTION_TYPES.has(watchedType) && (
              <FormOptionsInput
                control={form.control}
                name="options"
                label="Options"
              />
            )}

            {/* Placeholder — text / number / url only */}
            {PLACEHOLDER_TYPES.has(watchedType) && (
              <FormInput
                control={form.control}
                name="placeholder"
                label="Placeholder (optional)"
                inputProps={{ placeholder: 'e.g. Enter a value…' }}
              />
            )}

            {/* Toggles */}
            <div className="space-y-2">
              <FormSwitchRow
                control={form.control}
                name="isRequired"
                label="Required field"
                description="Users must fill in this field when submitting a feedback post."
              />
              <FormSwitchRow
                control={form.control}
                name="isPrivate"
                label="Private field"
                description="This field is only visible to your team members, not to end users."
              />
              <FormSwitchRow
                control={form.control}
                name="showAnswerToEveryone"
                label="Show answer to everyone"
                description="The value of this field will be visible to all users on your public portal."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={closeDialog} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Save changes' : 'Add field'}
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
