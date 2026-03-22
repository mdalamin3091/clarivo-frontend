'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button }  from '@/components/ui/button';
import { Switch }  from '@/components/ui/switch';
import { Form }    from '@/components/ui/form';
import { FormSelect } from '@/shared/components/ui/FormSelect';
import { useActiveOrganization } from '@/lib/auth-client';
import { useUpdateBoardGlobalSettings } from '../hooks/useUpdateBoardGlobalSettings';
import { BoardList } from './BoardList';
import type { BoardSorting } from '../types';

// ── Constants ────────────────────────────────────────────────────────────────

const SORTING_OPTIONS = [
  { value: 'trending', label: 'Trending'     },
  { value: 'recent',   label: 'Recent posts' },
  { value: 'top',      label: 'Top voted'    },
  { value: 'oldest',   label: 'Oldest first' },
];

interface FormValues {
  defaultSorting:  BoardSorting;
  hideLeaderBoard: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

export function FeedbackModuleCard() {
  const { data: org, isPending: isLoading } = useActiveOrganization();
  const { mutate, isPending } = useUpdateBoardGlobalSettings();

  const extra = org as unknown as Record<string, unknown>;

  const form = useForm<FormValues>({
    defaultValues: { defaultSorting: 'trending', hideLeaderBoard: false },
  });

  // Sync form when org data arrives from get-full-organization
  useEffect(() => {
    if (!org) return;
    form.reset({
      defaultSorting:  (extra?.defaultSorting as BoardSorting) ?? 'trending',
      hideLeaderBoard: (extra?.hideLeaderBoard as boolean)      ?? false,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org?.id]);

  const onSubmit = (values: FormValues) => mutate(values);

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <BoardList />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Default sorting */}
          <div className="space-y-1">
            <FormSelect
              control={form.control}
              name="defaultSorting"
              label="Global post sorting"
              options={SORTING_OPTIONS}
              placeholder="Select sorting"
              className="w-56"
            />
            <p className="text-xs text-muted-foreground">
              Default order posts appear across all boards. Users can change this on their end.
            </p>
          </div>

          {/* Leaderboard toggle */}
          <Controller
            control={form.control}
            name="hideLeaderBoard"
            render={({ field }) => (
              <div className="flex items-start justify-between gap-6 rounded-lg border border-border bg-muted/20 px-4 py-3.5">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">Show user leaderboard</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Display a ranked list of your most active contributors on the public portal.
                    Turning this off hides it for everyone.
                  </p>
                </div>
                <Switch
                  checked={!field.value}
                  onCheckedChange={v => field.onChange(!v)}
                  disabled={isLoading}
                  className="mt-0.5 shrink-0"
                />
              </div>
            )}
          />

          <div className="flex justify-end">
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
