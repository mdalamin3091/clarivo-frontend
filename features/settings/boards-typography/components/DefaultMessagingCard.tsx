'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button }   from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/shared/components/ui/FormInput';
import { useActiveOrganization } from '@/lib/auth-client';
import { useUpdateBoardGlobalSettings } from '../hooks/useUpdateBoardGlobalSettings';
import type { BoardGreeting } from '../types';

// ── Form values ───────────────────────────────────────────────────────────────

interface FormValues {
  welcomingTitle:         string;
  welcomingDescription:   string;
  postCreationButtonText: string;
}

const EMPTY: FormValues = {
  welcomingTitle:         '',
  welcomingDescription:   '',
  postCreationButtonText: '',
};

// ── Component ────────────────────────────────────────────────────────────────

export function DefaultMessagingCard() {
  const { data: org, isPending: isLoading } = useActiveOrganization();
  const { mutate, isPending } = useUpdateBoardGlobalSettings();

  const form = useForm<FormValues>({ defaultValues: EMPTY });

  // Sync form when org data arrives from get-full-organization
  useEffect(() => {
    if (!org) return;
    const extra = org as unknown as Record<string, unknown>;
    const greeting = extra?.boardGreeting as BoardGreeting | null | undefined;
    form.reset(greeting ?? EMPTY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org?.id]);

  const onSubmit = (values: FormValues) => {
    const hasContent =
      values.welcomingTitle || values.welcomingDescription || values.postCreationButtonText;

    mutate({
      boardGreeting: hasContent
        ? {
            welcomingTitle:         values.welcomingTitle,
            welcomingDescription:   values.welcomingDescription,
            postCreationButtonText: values.postCreationButtonText,
          }
        : null,
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Default messaging</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Set the default text shown on your public feedback portal. Individual boards can
          override these values in their own settings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormInput
            control={form.control}
            name="welcomingTitle"
            label="Board heading"
            inputProps={{
              placeholder: 'What would you like to see next?',
              disabled: isLoading,
            }}
          />

          <FormField
            control={form.control}
            name="welcomingDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supporting description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share your ideas, report issues, or vote on what matters most to you."
                    rows={4}
                    disabled={isLoading}
                    className="resize-none bg-muted/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            control={form.control}
            name="postCreationButtonText"
            label="Submit button label"
            inputProps={{
              placeholder: 'Share Your Idea',
              disabled: isLoading,
            }}
          />

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={isPending || isLoading || !form.formState.isDirty}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
