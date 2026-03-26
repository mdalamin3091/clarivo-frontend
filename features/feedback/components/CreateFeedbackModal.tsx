/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Tag, User, Calendar, LayoutGrid, X } from 'lucide-react';
import type { JSONContent } from 'novel';
import { toast } from 'sonner';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from '@/lib/auth-client';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { RichEditor } from '@/shared/components/editor';
import { SearchableSelect } from '@/shared/components/ui/SearchableSelect';
import { cn } from '@/lib/utils';
import { useFeedbackModalStore } from '../store';
import { useCreateFeedback } from '../hooks/useCreateFeedback';
import { useOrgBoards } from '../hooks/useOrgBoards';
import { useOrgStatuses } from '../hooks/useOrgStatuses';

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  title:      z.string().min(1, 'Please enter a title for your post.'),
  boardId:    z.string().min(1, 'Please select a board.'),
  createMore: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
      {initials}
    </div>
  );
}

function MetaIconButton({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {icon}
    </button>
  );
}

// ─── CreateFeedbackModal ──────────────────────────────────────────────────────

export function CreateFeedbackModal() {
  const { isOpen, close } = useFeedbackModalStore();
  const { data: session }  = useSession();

  const { data: boards   = [] } = useOrgBoards();
  const { data: statuses = [] } = useOrgStatuses();

  const [description, setDescription] = useState<JSONContent | undefined>(undefined);
  const [statusId,    setStatusId]    = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', boardId: '', createMore: false },
  });

  // Pre-select first board when boards load
  useEffect(() => {
    if (boards.length > 0) {
      setValue('boardId', boards[0].id);
    }
  }, [boards, setValue]);

  const [boardId, createMore] = useWatch({ control, name: ['boardId', 'createMore'] });

  const { mutate: createPost, isPending } = useCreateFeedback();

  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setDescription(undefined);
      setStatusId(null);
    }
  }, [isOpen, reset]);

  const userName = session?.user?.name ?? 'User';

  // Map boards → SelectOption
  const boardOptions = boards.map((b) => ({
    value: b.id,
    label: b.name,
    icon:  b.icon?.type === 'emoji'
      ? <span className="text-sm">{b.icon.value}</span>
      : <LayoutGrid className="h-3.5 w-3.5 text-primary" />,
  }));

  // Map statuses → SelectOption
  const statusOptions = statuses.map((s) => ({
    value: s.id,
    label: s.name,
    color: s.color,
  }));

  const onSubmit = (data: FormValues) => {
    createPost(
      {
        boardId:     data.boardId,
        title:       data.title,
        description: description ? JSON.stringify(description) : '',
        ...(statusId ? { statusId } : {}),
      },
      {
        onSuccess: () => {
          toast.success('Post created successfully.');
          if (data.createMore) {
            reset();
            if (boards.length > 0) setValue('boardId', boards[0].id);
            setDescription(undefined);
            setStatusId(null);
          } else {
            close();
          }
        },
        onError: () => {
          toast.error('Failed to create post. Please try again.');
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="gap-0 max-w-2xl rounded-2xl p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Create feedback post</DialogTitle>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserAvatar name={userName} />
            <ChevronRight className="h-3.5 w-3.5" />
            {/* Board selector */}
            <SearchableSelect
              options={boardOptions}
              value={boardId}
              onChange={(id) => id && setValue('boardId', id)}
              placeholder="Select board"
              searchPlaceholder="Search boards…"
              clearable={false}
              triggerClassName="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
            />
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title input */}
          <div className="px-5">
            <input
              {...register('title')}
              type="text"
              placeholder="Title of your post"
              className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
            )}
            {errors.boardId && (
              <p className="mt-1 text-xs text-destructive">{errors.boardId.message}</p>
            )}
          </div>

          {/* Rich editor */}
          <div className="px-5 pb-1">
            <RichEditor
              value={description}
              onChange={setDescription}
              placeholder="Post description or type '/' for commands…"
              className="min-h-35 border-none bg-transparent shadow-none [&_.ProseMirror]:min-h-25 [&_.ProseMirror]:px-0"
            />
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            {/* Left: metadata actions */}
            <div className="flex items-center gap-1.5">
              {/* Status selector */}
              <SearchableSelect
                options={statusOptions}
                value={statusId}
                onChange={setStatusId}
                placeholder="Set status"
                searchPlaceholder="Search status…"
              />
              <MetaIconButton icon={<Tag className="h-4 w-4" />} title="Add tag" />
              <MetaIconButton icon={<User className="h-4 w-4" />} title="Assign owner" />
              <MetaIconButton icon={<Calendar className="h-4 w-4" />} title="Set date" />
            </div>

            {/* Right: create more + submit */}
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
                <Switch
                  checked={createMore}
                  onCheckedChange={(val) => setValue('createMore', val)}
                  className="scale-90"
                />
                Create more
              </label>
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  'rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity',
                  'hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                {isPending ? 'Submitting…' : 'Submit Post'}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
