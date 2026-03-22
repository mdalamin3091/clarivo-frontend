'use client';

import { useEffect, useState } from 'react';
import { Loader2, Globe, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconPicker, isEmoji, isImageUrl } from '@/shared/components/ui/IconPicker';
import { SwitchRow } from '@/shared/components/ui/SwitchRow';
import { useCreateBoard } from '../hooks/useCreateBoard';
import { useUpdateBoard }  from '../hooks/useUpdateBoard';
import type { Board, BoardSorting, BoardVisibility, CreateBoardInput } from '../types';
import { cn } from '@/lib/utils';

// ── Helpers ──────────────────────────────────────────────────────────────────

function deriveIconType(value: string): 'predefined' | 'emoji' {
  if (isImageUrl(value) || isEmoji(value)) return 'emoji';
  return 'predefined';
}

// ── Visibility option card ───────────────────────────────────────────────────

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

// ── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name:                     string;
  iconValue:                string;
  visibility:               BoardVisibility;
  defaultSorting:           BoardSorting;
  allowSubscribe:           boolean;
  disableFollowupQuestions: boolean;
  disableEndUserPosting:    boolean;
  welcomingTitle:           string;
  welcomingDescription:     string;
  postCreationButtonText:   string;
}

const DEFAULT_MESSAGES = {
  welcomingTitle:         'What would you like to see next?',
  welcomingDescription:   'Share your ideas, report bugs, or vote on what matters most to you.',
  postCreationButtonText: 'Share Your Idea',
};

function emptyForm(): FormState {
  return {
    name:                     '',
    iconValue:                'MessageSquare',
    visibility:               'public',
    defaultSorting:           'trending',
    allowSubscribe:           true,
    disableFollowupQuestions: false,
    disableEndUserPosting:    false,
    ...DEFAULT_MESSAGES,
  };
}

function boardToForm(board: Board): FormState {
  return {
    name:                     board.name,
    iconValue:                board.icon.value,
    visibility:               board.visibility,
    defaultSorting:           board.defaultSorting,
    allowSubscribe:           board.allowSubscribe,
    disableFollowupQuestions: board.disableFollowupQuestions,
    disableEndUserPosting:    board.disableEndUserPosting,
    welcomingTitle:           board.greeting?.welcomingTitle           ?? DEFAULT_MESSAGES.welcomingTitle,
    welcomingDescription:     board.greeting?.welcomingDescription     ?? DEFAULT_MESSAGES.welcomingDescription,
    postCreationButtonText:   board.greeting?.postCreationButtonText   ?? DEFAULT_MESSAGES.postCreationButtonText,
  };
}

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  board?:       Board;
}

// ── Component ────────────────────────────────────────────────────────────────

export function BoardDialog({ open, onOpenChange, board }: Props) {
  const isEdit = !!board;
  const [form, setForm]           = useState<FormState>(emptyForm);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(isEdit ? boardToForm(board) : emptyForm());
      setNameError('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => onOpenChange(false);

  const { mutate: create, isPending: creating } = useCreateBoard(handleClose);
  const { mutate: update, isPending: updating }  = useUpdateBoard(handleClose);
  const isPending = creating || updating;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) { setNameError('Please enter a name for this board.'); return; }
    setNameError('');

    const payload: CreateBoardInput = {
      name,
      icon:                     { type: deriveIconType(form.iconValue), value: form.iconValue || 'MessageSquare' },
      visibility:               form.visibility,
      defaultSorting:           form.defaultSorting,
      allowSubscribe:           form.allowSubscribe,
      disableFollowupQuestions: form.disableFollowupQuestions,
      disableEndUserPosting:    form.disableEndUserPosting,
      greeting: {
        welcomingTitle:         form.welcomingTitle,
        welcomingDescription:   form.welcomingDescription,
        postCreationButtonText: form.postCreationButtonText,
      },
    };

    if (isEdit) {
      update({ id: board.id, input: payload });
    } else {
      create(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <form onSubmit={handleSubmit} className="mt-2 space-y-6">

          {/* Name & icon */}
          <div className="space-y-1.5">
            <Label>Board name &amp; icon</Label>
            <div className="flex items-center gap-2">
              <IconPicker
                value={form.iconValue}
                onChange={v => set('iconValue', v || 'MessageSquare')}
              />
              <Input
                placeholder="e.g. Bug Reports"
                value={form.name}
                onChange={e => { set('name', e.target.value); if (nameError) setNameError(''); }}
                className="flex-1"
              />
            </div>
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Who can see this board?</p>
            <div className="grid grid-cols-2 gap-3">
              <VisibilityCard
                selected={form.visibility === 'public'}
                onSelect={() => set('visibility', 'public')}
                icon={<Globe className="h-4 w-4" />}
                title="Public"
                description="Visible to everyone — including users who visit your public portal."
              />
              <VisibilityCard
                selected={form.visibility === 'private'}
                onSelect={() => set('visibility', 'private')}
                icon={<Lock className="h-4 w-4" />}
                title="Team only"
                description="Visible only to members of your organization. Great for internal tracking."
              />
            </div>
          </div>

          {/* Restrict end user actions — accordion */}
          <Accordion
            type="single"
            collapsible
            className="rounded-lg border border-border overflow-hidden mb-4"
          >
            <AccordionItem value="restrict" className="border-0 bg-muted/30">
              <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-foreground hover:no-underline bg-muted/50 hover:bg-muted data-[state=open]:bg-muted/20">
                Restrict end user actions (Optional)
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <p className="mb-3 text-xs text-muted-foreground mt-2">
                  Control what regular users can do on this board.
                </p>
                <div className="space-y-3">
                  <SwitchRow
                    checked={form.disableFollowupQuestions}
                    onChange={v => set('disableFollowupQuestions', v)}
                    label="Skip follow-up questions"
                    description="After a user upvotes a post, Clarivo normally asks them a few quick questions. Turn this off to keep things simple."
                  />
                  <SwitchRow
                    checked={form.disableEndUserPosting}
                    onChange={v => set('disableEndUserPosting', v)}
                    label="Lock posting to team members"
                    description="Only your team can submit new posts. Users can still browse, vote, and leave comments."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Customize board messaging — accordion */}
          <Accordion
            type="single"
            collapsible
            className="rounded-lg border border-border overflow-hidden mb-4"
          >
            <AccordionItem value="messaging" className="border-0 bg-muted/30">
              <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-foreground hover:no-underline bg-muted/50 hover:bg-muted data-[state=open]:bg-muted/20">
                Customize board messaging (Optional)
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <p className="mb-4 text-xs text-muted-foreground mt-2">
                  Override the default welcome text shown at the top of this board. Leave blank to
                  use your global defaults.
                </p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bd-title">Heading text</Label>
                    <Input
                      id="bd-title"
                      placeholder={DEFAULT_MESSAGES.welcomingTitle}
                      value={form.welcomingTitle}
                      onChange={e => set('welcomingTitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bd-desc">Supporting description</Label>
                    <Textarea
                      id="bd-desc"
                      placeholder={DEFAULT_MESSAGES.welcomingDescription}
                      value={form.welcomingDescription}
                      onChange={e => set('welcomingDescription', e.target.value)}
                      rows={3}
                      className="resize-none bg-muted/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bd-btn">Submit button label</Label>
                    <Input
                      id="bd-btn"
                      placeholder={DEFAULT_MESSAGES.postCreationButtonText}
                      value={form.postCreationButtonText}
                      onChange={e => set('postCreationButtonText', e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Create board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
