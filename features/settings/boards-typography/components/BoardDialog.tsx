'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Globe, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SectionAccordion } from '@/shared/components/ui/SectionAccordion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// FormLabel is used by FormInput/FormSwitchRow internally; kept here for FormField wrappers below
import { Button }   from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IconPicker, isEmoji, isImageUrl } from '@/shared/components/ui/IconPicker';
import { FormInput }     from '@/shared/components/ui/FormInput';
import { FormSwitchRow } from '@/shared/components/ui/FormSwitchRow';
import { useCreateBoard }    from '../hooks/useCreateBoard';
import { useUpdateBoard }    from '../hooks/useUpdateBoard';
import { useOrgCustomFields } from '../hooks/useOrgCustomFields';
import { useBoardsStore }    from '../store';
import { TYPE_LABELS }       from '../constants/customFieldLabels';
import { boardFormSchema, type BoardFormValues } from '../validation';
import type { Board } from '../types';
import { cn } from '@/lib/utils';

// ── Helpers ──────────────────────────────────────────────────────────────────

function deriveIconType(value: string): 'predefined' | 'emoji' {
  if (isImageUrl(value) || isEmoji(value)) return 'emoji';
  return 'predefined';
}

const DEFAULT_MESSAGES = {
  welcomingTitle:         'What would you like to see next?',
  welcomingDescription:   'Share your ideas, report bugs, or vote on what matters most to you.',
  postCreationButtonText: 'Share Your Idea',
};

const DEFAULT_VALUES: BoardFormValues = {
  name:                     '',
  iconValue:                'MessageSquare',
  visibility:               'public',
  defaultSorting:           'trending',
  allowSubscribe:           true,
  disableFollowupQuestions: false,
  disableEndUserPosting:    false,
  customFieldIds:           [],
  ...DEFAULT_MESSAGES,
};

function boardToValues(board: Board): BoardFormValues {
  return {
    name:                     board.name,
    iconValue:                board.icon.value,
    visibility:               board.visibility,
    defaultSorting:           board.defaultSorting,
    allowSubscribe:           board.allowSubscribe,
    disableFollowupQuestions: board.disableFollowupQuestions,
    disableEndUserPosting:    board.disableEndUserPosting,
    customFieldIds:           board.customFields.map(f => f.id),
    welcomingTitle:           board.greeting?.welcomingTitle         ?? DEFAULT_MESSAGES.welcomingTitle,
    welcomingDescription:     board.greeting?.welcomingDescription   ?? DEFAULT_MESSAGES.welcomingDescription,
    postCreationButtonText:   board.greeting?.postCreationButtonText ?? DEFAULT_MESSAGES.postCreationButtonText,
  };
}

// ── Visibility card ───────────────────────────────────────────────────────────

interface VisibilityCardProps {
  selected:    boolean;
  onSelect:    () => void;
  icon:        React.ReactNode;
  title:       string;
  description: string;
}

function VisibilityCard({ selected, onSelect, icon, title, description }: VisibilityCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col gap-3 rounded-xl border p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
          : 'border-border bg-muted/20 hover:border-muted-foreground/30 hover:bg-muted/40',
      )}
    >
      <div className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        selected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
      )}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function BoardDialog() {
  const { dialogOpen, editingBoard, closeDialog } = useBoardsStore();
  const isEdit = !!editingBoard;

  const form = useForm<BoardFormValues>({
    resolver:      zodResolver(boardFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Reset form whenever dialog opens
  useEffect(() => {
    if (dialogOpen) {
      form.reset(editingBoard ? boardToValues(editingBoard) : DEFAULT_VALUES);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const { mutate: create, isPending: creating } = useCreateBoard();
  const { mutate: update, isPending: updating  } = useUpdateBoard();
  const isPending = creating || updating;

  const { data: orgCustomFields = [] } = useOrgCustomFields();

  const onSubmit = (data: BoardFormValues) => {
    const payload = {
      name:                     data.name,
      icon:                     { type: deriveIconType(data.iconValue), value: data.iconValue || 'MessageSquare' },
      visibility:               data.visibility,
      defaultSorting:           data.defaultSorting,
      allowSubscribe:           data.allowSubscribe,
      disableFollowupQuestions: data.disableFollowupQuestions,
      disableEndUserPosting:    data.disableEndUserPosting,
      greeting: {
        welcomingTitle:         data.welcomingTitle,
        welcomingDescription:   data.welcomingDescription,
        postCreationButtonText: data.postCreationButtonText,
      },
      customFieldIds: data.customFieldIds,
    };

    if (isEdit) {
      update({ id: editingBoard.id, input: payload });
    } else {
      create(payload);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-thin sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">
            {isEdit ? 'Edit board settings' : 'Create a new board'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? 'Adjust the configuration for this board at any time.'
              : 'Set up a new board to start collecting feedback from your users.'}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-6">

            {/* Name & icon */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium leading-none">Board name &amp; icon</p>
              <div className="flex items-center gap-2">

                {/* Icon picker — custom UI wired to RHF */}
                <FormField
                  control={form.control}
                  name="iconValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <IconPicker
                          value={field.value}
                          onChange={v => field.onChange(v || 'MessageSquare')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Name */}
                <div className="flex-1">
                  <FormInput
                    control={form.control}
                    name="name"
                    label="Board name"
                    labelClassName="sr-only"
                    inputProps={{ placeholder: 'e.g. Bug Reports' }}
                  />
                </div>
              </div>
            </div>

            {/* Visibility */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who can see this board?</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      <VisibilityCard
                        selected={field.value === 'public'}
                        onSelect={() => field.onChange('public')}
                        icon={<Globe className="h-4 w-4" />}
                        title="Public"
                        description="Visible to everyone — including users who visit your public portal."
                      />
                      <VisibilityCard
                        selected={field.value === 'private'}
                        onSelect={() => field.onChange('private')}
                        icon={<Lock className="h-4 w-4" />}
                        title="Team only"
                        description="Visible only to members of your organization. Great for internal tracking."
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Restrict end user actions */}
            <SectionAccordion title="Restrict end user actions (Optional)">
              <p className="mb-3 text-xs text-muted-foreground mt-2">
                Control what regular users can do on this board.
              </p>
              <div className="space-y-3">
                <FormSwitchRow
                  control={form.control}
                  name="disableFollowupQuestions"
                  label="Skip follow-up questions"
                  description="After a user upvotes a post, Clarivo normally asks them a few quick questions. Turn this off to keep things simple."
                />
                <FormSwitchRow
                  control={form.control}
                  name="disableEndUserPosting"
                  label="Lock posting to team members"
                  description="Only your team can submit new posts. Users can still browse, vote, and leave comments."
                />
              </div>
            </SectionAccordion>

            {/* Customize board messaging */}
            <SectionAccordion title="Customize board messaging (Optional)">
              <p className="mb-4 text-xs text-muted-foreground mt-2">
                Override the default welcome text shown at the top of this board. Leave blank to
                use your global defaults.
              </p>
              <div className="space-y-4">
                <FormInput
                  control={form.control}
                  name="welcomingTitle"
                  label="Heading text"
                  inputProps={{ placeholder: DEFAULT_MESSAGES.welcomingTitle }}
                />
                <FormField
                  control={form.control}
                  name="welcomingDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supporting description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={DEFAULT_MESSAGES.welcomingDescription}
                          rows={3}
                          className="resize-none bg-muted/40"
                          {...field}
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
                  inputProps={{ placeholder: DEFAULT_MESSAGES.postCreationButtonText }}
                />
              </div>
            </SectionAccordion>

            {/* Custom fields */}
            <FormField
              control={form.control}
              name="customFieldIds"
              render={({ field }) => (
                <SectionAccordion
                  title="Custom fields (optional)"
                  badge={field.value.length > 0 ? `${field.value.length} selected` : undefined}
                >
                  {orgCustomFields.length === 0 ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      No custom fields yet. Create some in{' '}
                      <span className="font-medium">Settings → Custom Fields</span>.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted-foreground mb-3">
                        Select which custom fields users must fill in when submitting a post to this board.
                      </p>
                      {orgCustomFields.map((cf) => {
                        const checked = field.value.includes(cf.id);
                        const toggle  = () => field.onChange(
                          checked
                            ? field.value.filter((x: string) => x !== cf.id)
                            : [...field.value, cf.id],
                        );
                        return (
                          <button
                            key={cf.id}
                            type="button"
                            onClick={toggle}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all',
                              checked
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                : 'border-border bg-muted/20 hover:border-muted-foreground/30 hover:bg-muted/40',
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                                checked
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/40 bg-background',
                              )}
                            >
                              {checked && (
                                <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current">
                                  <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <span className="flex-1 text-sm font-medium text-foreground">{cf.name}</span>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                              {TYPE_LABELS[cf.type] ?? cf.type}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </SectionAccordion>
              )}
            />

            {/* Footer actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={closeDialog} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Save changes' : 'Create board'}
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
