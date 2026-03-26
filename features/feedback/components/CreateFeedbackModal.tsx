/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Radio, Tag, User, Calendar, ChevronDown, LayoutGrid } from 'lucide-react';
import type { JSONContent } from 'novel';
import { toast } from 'sonner';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSession } from '@/lib/auth-client';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { RichEditor } from '@/shared/components/editor';
import { cn } from '@/lib/utils';
import { useFeedbackModalStore } from '../store';
import { useCreateFeedback } from '../hooks/useCreateFeedback';
import { useOrgBoards } from '../hooks/useOrgBoards';

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

// ─── BoardSelector ────────────────────────────────────────────────────────────

interface BoardSelectorProps {
  value:    string;
  onChange: (id: string) => void;
}

function BoardSelector({ value, onChange }: BoardSelectorProps) {
  const { data: boards = [], isLoading } = useOrgBoards();
  const selected = boards.find((b) => b.id === value);

  const label = isLoading
    ? 'Loading…'
    : selected?.name ?? 'Select board';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <LayoutGrid className="h-3.5 w-3.5 text-primary" />
          {label}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="bottom"
        align="start"
        sideOffset={6}
        className="z-9999 min-w-40 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md"
      >
        {boards.length === 0 && (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">No boards found</p>
        )}
        {boards.map((board) => (
          <DropdownMenu.Item
            key={board.id}
            onSelect={() => onChange(board.id)}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none transition-colors',
              'text-muted-foreground hover:bg-accent hover:text-foreground',
              board.id === value && 'bg-accent text-foreground',
            )}
          >
            {board.icon?.type === 'emoji' ? (
              <span className="text-sm">{board.icon.value}</span>
            ) : (
              <LayoutGrid className="h-3.5 w-3.5" />
            )}
            {board.name}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

// ─── CreateFeedbackModal ──────────────────────────────────────────────────────

export function CreateFeedbackModal() {
  const { isOpen, close } = useFeedbackModalStore();
  const { data: session } = useSession();
  const { data: boards = [] } = useOrgBoards();

  const [description, setDescription] = useState<JSONContent | undefined>(undefined);

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

  useEffect(() => {
    if (!isOpen) {
      reset();
      setDescription(undefined);
    }
  }, [isOpen, reset]);

  const userName = session?.user?.name ?? 'User';

  const onSubmit = (data: FormValues) => {
    createPost(
      {
        boardId:     data.boardId,
        title:       data.title,
        description: description ? JSON.stringify(description) : '',
      },
      {
        onSuccess: () => {
          toast.success('Post created successfully.');
          if (data.createMore) {
            reset();
            // Re-select first board after reset
            if (boards.length > 0) setValue('boardId', boards[0].id);
            setDescription(undefined);
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
      <DialogContent className="gap-0 max-w-xl rounded-2xl p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Create feedback post</DialogTitle>
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserAvatar name={userName} />
            <ChevronRight className="h-3.5 w-3.5" />
            <BoardSelector
              value={boardId}
              onChange={(id) => setValue('boardId', id)}
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
              <button
                type="button"
                title="Set status"
                className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Radio className="h-3.5 w-3.5 text-yellow-400" />
                In Review
              </button>
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
