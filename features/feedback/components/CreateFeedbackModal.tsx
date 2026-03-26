'use client';

import { useState } from 'react';
import { X, Lightbulb, ChevronRight, Radio, Tag, User, Calendar } from 'lucide-react';
import type { JSONContent } from 'novel';
import { toast } from 'sonner';
import { useSession, useActiveOrganization } from '@/lib/auth-client';
import { Switch } from '@/components/ui/switch';
import { RichEditor } from '@/shared/components/editor';
import { cn } from '@/lib/utils';
import { useFeedbackModalStore } from '../store';
import { useCreateFeedback } from '../hooks/useCreateFeedback';

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

// ─── CreateFeedbackModal ──────────────────────────────────────────────────────

export function CreateFeedbackModal() {
  const { isOpen, close } = useFeedbackModalStore();
  const { data: session } = useSession();
  const { data: org } = useActiveOrganization();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<JSONContent | undefined>(undefined);
  const [createMore, setCreateMore] = useState(false);

  const { mutate: createPost, isPending } = useCreateFeedback(org?.id ?? '');

  if (!isOpen) return null;

  const userName = session?.user?.name ?? 'User';

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your post.');
      return;
    }
    if (!org?.id) {
      toast.error('No active organization.');
      return;
    }

    createPost(
      {
        title: title.trim(),
        description: description ? JSON.stringify(description) : '',
      },
      {
        onSuccess: () => {
          toast.success('Post created successfully.');
          if (createMore) {
            setTitle('');
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative flex w-full max-w-xl flex-col rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserAvatar name={userName} />
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-yellow-400" />
              Feature Request
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Title input ── */}
        <div className="px-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of your post"
            className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            autoFocus
          />
        </div>

        {/* ── Rich editor ── */}
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
                onCheckedChange={setCreateMore}
                className="scale-90"
              />
              Create more
            </label>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !title.trim()}
              className={cn(
                'rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity',
                'hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {isPending ? 'Submitting…' : 'Submit Post'}
            </button>
          </div>
        </div>
      </div>
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
