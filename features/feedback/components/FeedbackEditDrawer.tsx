'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Tag, User, Trash2, Globe, Lock } from 'lucide-react';
import type { JSONContent } from 'novel';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RichEditor } from '@/shared/components/editor';
import { SearchableSelect } from '@/shared/components/ui/SearchableSelect';
import { MultiSearchableSelect } from '@/shared/components/ui/MultiSearchableSelect';
import { DatePicker } from '@/shared/components/ui/DatePicker';
import { cn } from '@/lib/utils';
import { useFeedbackModalStore } from '../store';
import { useUpdateFeedback } from '../hooks/useUpdateFeedback';
import { useDeleteFeedback } from '../hooks/useDeleteFeedback';
import { useOrgBoards } from '../hooks/useOrgBoards';
import { useOrgStatuses } from '../hooks/useOrgStatuses';
import { useOrgTags } from '../hooks/useOrgTags';
import { useOrgMembers } from '../hooks/useOrgMembers';
import { useFeedbackPosts } from '../hooks/useFeedbackPosts';
import { useActiveOrganization } from '@/lib/auth-client';
import type { FeedbackPost } from '../types';

// ─── MetaRow ──────────────────────────────────────────────────────────────────

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground pt-1">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── FeedbackEditDrawer ───────────────────────────────────────────────────────

export function FeedbackEditDrawer() {
  const { drawerOpen, drawerPostId, closeDrawer } = useFeedbackModalStore();
  const { data: org } = useActiveOrganization();
  const { data: posts = [] } = useFeedbackPosts(org?.id);

  const post = posts.find((p) => p.id === drawerPostId) ?? null;

  const { data: boards = [] }  = useOrgBoards();
  const { data: statuses = [] } = useOrgStatuses();
  const { data: tags = [] }    = useOrgTags();
  const { data: members = [] } = useOrgMembers();

  const { mutate: updatePost, isPending: isSaving } = useUpdateFeedback();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteFeedback();

  // ── Local form state ────────────────────────────────────────────────────────
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState<JSONContent | undefined>(undefined);
  const [boardId, setBoardId]         = useState('');
  const [statusId, setStatusId]       = useState<string | null>(null);
  const [tagIds, setTagIds]           = useState<string[]>([]);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [eta, setEta]                 = useState<Date | undefined>(undefined);
  const [visibility, setVisibility]   = useState<'public' | 'private'>('public');

  // Populate from post when drawer opens
  useEffect(() => {
    if (!post) return;
    setTitle(post.title);
    setBoardId(post.boardId);
    setStatusId(post.statusId);
    setTagIds(post.tags.map((t) => t.id));
    setAssigneeIds(post.assignees.map((a) => a.id));
    setVisibility(post.postVisibility);
    setEta(undefined); // ETA not in list response — could be added later
    try {
      if (post.description && typeof post.description === 'string') {
        setDescription(JSON.parse(post.description) as JSONContent);
      } else if (post.description && typeof post.description === 'object') {
        setDescription(post.description as JSONContent);
      } else {
        setDescription(undefined);
      }
    } catch {
      setDescription(undefined);
    }
  }, [post]);

  // ── Option maps ─────────────────────────────────────────────────────────────

  const boardOptions = boards.map((b) => ({
    value: b.id,
    label: b.name,
    icon: b.icon?.type === 'emoji'
      ? <span className="text-sm">{b.icon.value}</span>
      : <LayoutGrid className="h-3.5 w-3.5 text-primary" />,
  }));

  const statusOptions = statuses.map((s) => ({ value: s.id, label: s.name, color: s.color }));
  const tagOptions    = tags.map((t) => ({ value: t.id, label: t.name, color: t.color }));
  const memberOptions = members.map((m) => ({
    value: m.id,
    label: m.user?.name ?? m.user?.email ?? 'Unknown',
    icon: (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
        {(m.user?.name ?? '?')[0].toUpperCase()}
      </span>
    ),
  }));

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (!post) return;
    if (!title.trim()) { toast.error('Title is required.'); return; }

    updatePost(
      {
        id: post.id,
        data: {
          title: title.trim(),
          description: description ? JSON.stringify(description) : '',
          boardId,
          statusId,
          tagIds,
          assigneeIds,
          eta: eta ? eta.toISOString() : null,
          postVisibility: visibility,
        },
      },
      {
        onSuccess: () => { toast.success('Post updated.'); closeDrawer(); },
        onError:   () => toast.error('Failed to update post.'),
      },
    );
  };

  const handleDelete = () => {
    if (!post) return;
    deletePost(post.id, {
      onSuccess: () => { toast.success('Post deleted.'); closeDrawer(); },
      onError:   () => toast.error('Failed to delete post.'),
    });
  };

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="border-b px-6 py-4 space-y-0">
          <SheetTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Edit Post
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {post ? (
            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                  rows={2}
                  className="w-full resize-none bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-snug"
                />
              </div>

              {/* Description */}
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Description</p>
                <RichEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Add a description…"
                  className="min-h-32 rounded-lg border border-border bg-muted/30 [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:min-h-28"
                />
              </div>

              {/* Metadata */}
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-1">
                <MetaRow label="Board">
                  <SearchableSelect
                    options={boardOptions}
                    value={boardId}
                    onChange={(v) => v && setBoardId(v)}
                    placeholder="Select board"
                    clearable={false}
                    triggerClassName="h-7 rounded-md border-0 bg-transparent px-2 text-sm hover:bg-accent"
                  />
                </MetaRow>

                <MetaRow label="Status">
                  <SearchableSelect
                    options={statusOptions}
                    value={statusId}
                    onChange={setStatusId}
                    placeholder="Set status"
                    clearable
                    triggerClassName="h-7 rounded-md border-0 bg-transparent px-2 text-sm hover:bg-accent"
                  />
                </MetaRow>

                <MetaRow label="Tags">
                  <MultiSearchableSelect
                    options={tagOptions}
                    value={tagIds}
                    onChange={setTagIds}
                    placeholder="Add tags"
                    searchPlaceholder="Search tags…"
                    maxDisplay={5}
                    trigger={
                      <button
                        type="button"
                        className="flex h-7 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        {tagIds.length === 0 ? 'Add tags' : `${tagIds.length} tag${tagIds.length > 1 ? 's' : ''}`}
                      </button>
                    }
                  />
                </MetaRow>

                <MetaRow label="Assignees">
                  <MultiSearchableSelect
                    options={memberOptions}
                    value={assigneeIds}
                    onChange={setAssigneeIds}
                    placeholder="Assign members"
                    searchPlaceholder="Search members…"
                    maxDisplay={5}
                    trigger={
                      <button
                        type="button"
                        className="flex h-7 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <User className="h-3.5 w-3.5" />
                        {assigneeIds.length === 0 ? 'Assign members' : `${assigneeIds.length} member${assigneeIds.length > 1 ? 's' : ''}`}
                      </button>
                    }
                  />
                </MetaRow>

                <MetaRow label="ETA">
                  <DatePicker
                    value={eta}
                    onChange={setEta}
                    placeholder="Set ETA"
                    side="top"
                    align="start"
                  />
                </MetaRow>

                <MetaRow label="Visibility">
                  <button
                    type="button"
                    onClick={() => setVisibility((v) => v === 'public' ? 'private' : 'public')}
                    className="flex h-7 items-center gap-1.5 rounded-md px-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    {visibility === 'public'
                      ? <><Globe className="h-3.5 w-3.5 text-muted-foreground" /> Public</>
                      : <><Lock className="h-3.5 w-3.5 text-muted-foreground" /> Private</>
                    }
                  </button>
                </MetaRow>
              </div>

              {/* Stats — read-only */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
                <span>
                  <span className="font-medium text-foreground">{post.votes?.upvotes ?? 0}</span> upvotes
                </span>
                <span>
                  <span className="font-medium text-foreground">{post.votes?.downvotes ?? 0}</span> downvotes
                </span>
                <span>
                  <span className="font-medium text-foreground">{post.commentCount}</span> comments
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="border-t px-6 py-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={isDeleting}
                className="mr-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete post?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The post and all its comments will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !post}
            className={cn(
              'rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity',
              'hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
