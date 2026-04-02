'use client';

import { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Tag,
  User,
  Trash2,
  Globe,
  Lock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  SlidersHorizontal,
  Pin,
  Link2,
} from 'lucide-react';
import type { JSONContent } from 'novel';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
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
import { Switch } from '@/components/ui/switch';
import { RichEditor } from '@/shared/components/editor';
import { SearchableSelect } from '@/shared/components/ui/SearchableSelect';
import { MultiSearchableSelect } from '@/shared/components/ui/MultiSearchableSelect';
import { DatePicker } from '@/shared/components/ui/DatePicker';
import { SectionAccordion } from '@/shared/components/ui/SectionAccordion';
import { cn } from '@/lib/utils';
import { useFeedbackModalStore } from '../store';
import { useUpdateFeedback } from '../hooks/useUpdateFeedback';
import { useDeleteFeedback } from '../hooks/useDeleteFeedback';
import { useOrgBoards } from '../hooks/useOrgBoards';
import { useOrgStatuses } from '../hooks/useOrgStatuses';
import { useOrgTags } from '../hooks/useOrgTags';
import { useOrgMembers } from '../hooks/useOrgMembers';
import { useFeedbackPosts } from '../hooks/useFeedbackPosts';
import { useGetFeedback } from '../hooks/useGetFeedback';
import { useAddComment } from '../hooks/useAddComment';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useToggleCommentVote } from '../hooks/useToggleCommentVote';
import { useActiveOrganization, useSession } from '@/lib/auth-client';
import { CommentThread } from '@/shared/components/comments';
import type { CommentData } from '@/shared/components/comments';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500',   'bg-emerald-500', 'bg-orange-500',
  'bg-pink-500',   'bg-indigo-500', 'bg-teal-500',    'bg-rose-500',
];

function getAvatarColor(name: string) {
  const idx = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub,
}: {
  icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-muted-foreground/50">{icon}</span>
      </div>
      <div className="text-lg font-semibold text-foreground leading-none">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────
// items-start + pt-2 on label so multi-line values (wrapping pills) look right

function FieldRow({
  icon, label, children,
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="flex w-32 shrink-0 items-center gap-2 pt-2 text-sm text-muted-foreground">
        <span className="shrink-0">{icon}</span>
        {label}
      </div>
      <div className="flex flex-1 min-w-0 justify-end">{children}</div>
    </div>
  );
}

// ─── ActionButton ─────────────────────────────────────────────────────────────

function ActionButton({
  icon, label, onClick, active,
}: {
  icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors',
        active
          ? 'bg-primary/10 border-primary/30 text-primary'
          : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
    >
      {icon}
    </button>
  );
}

// ─── FeedbackEditDrawer ───────────────────────────────────────────────────────

interface FeedbackEditDrawerProps {
  showOverlay?: boolean;
}

export function FeedbackEditDrawer({ showOverlay = false }: FeedbackEditDrawerProps) {
  const { drawerOpen, drawerPostId, closeDrawer, openDrawer } = useFeedbackModalStore();
  const { data: org }        = useActiveOrganization();
  const { data: session }    = useSession();
  const { data: posts = [] } = useFeedbackPosts(org?.id);

  const currentIndex = posts.findIndex((p) => p.id === drawerPostId);
  const post         = currentIndex >= 0 ? posts[currentIndex] : null;
  const prevPost     = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost     = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // Fetch full detail (includes comments) when drawer is open
  const { data: detail } = useGetFeedback(drawerOpen ? drawerPostId : null);

  const { data: boards = [] }   = useOrgBoards();
  const { data: statuses = [] } = useOrgStatuses();
  const { data: tags = [] }     = useOrgTags();
  const { data: members = [] }  = useOrgMembers();

  // Resolve current user's member record for permission checks
  const currentUserId    = session?.user?.id ?? null;
  const currentUserName  = session?.user?.name ?? 'Unknown';
  const currentMember    = members.find((m) => m.userId === currentUserId) ?? null;
  const currentMemberId  = currentMember?.id ?? null;
  const isAdmin          = currentMember?.role === 'admin' || currentMember?.role === 'owner';

  const authorInfo = currentMember && currentUserId
    ? { memberId: currentMember.id, role: currentMember.role, userId: currentUserId, name: currentUserName }
    : null;

  const { mutate: updatePost,   isPending: isSaving }          = useUpdateFeedback();
  const { mutate: deletePost,   isPending: isDeleting }         = useDeleteFeedback();
  const { mutate: addComment,   isPending: isAddingComment }    = useAddComment(drawerPostId ?? '', authorInfo);
  const { mutate: editComment }                                  = useUpdateComment(drawerPostId ?? '');
  const { mutate: removeComment }                                = useDeleteComment(drawerPostId ?? '');
  const { mutate: voteComment }                                  = useToggleCommentVote(drawerPostId ?? '');

  // ── Form state ──────────────────────────────────────────────────────────────
  const [title, setTitle]                   = useState('');
  const [description, setDescription]       = useState<JSONContent | undefined>(undefined);
  const [boardId, setBoardId]               = useState('');
  const [statusId, setStatusId]             = useState<string | null>(null);
  const [tagIds, setTagIds]                 = useState<string[]>([]);
  const [assigneeIds, setAssigneeIds]       = useState<string[]>([]);
  const [eta, setEta]                       = useState<Date | undefined>(undefined);
  const [visibility, setVisibility]         = useState<'public' | 'private'>('public');
  const [enableComment, setEnableComment]   = useState(true);
  const [pinned, setPinned]                 = useState(false);

  // Populate fields when post changes
  useEffect(() => {
    if (!post) return;
    setTitle(post.title);
    setBoardId(post.boardId);
    setStatusId(post.statusId);
    setTagIds(post.tags.map((t) => t.id));
    setAssigneeIds(post.assignees.map((a) => a.id));
    setVisibility(post.postVisibility);
    setEnableComment(post.enableComment);
    setPinned(!!post.pinnedAt);
    setEta(undefined);
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

  const currentBoard  = boards.find((b) => b.id === boardId);
  const currentStatus = statuses.find((s) => s.id === statusId);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!post) return;
    if (!title.trim()) { toast.error('Title is required.'); return; }
    updatePost(
      {
        id: post.id,
        data: {
          title:          title.trim(),
          description:    description ? JSON.stringify(description) : '',
          boardId,
          statusId,
          tagIds,
          assigneeIds,
          eta:            eta ? eta.toISOString() : null,
          postVisibility: visibility,
          enableComment,
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

  const handleCopyLink = () => {
    if (!post) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/feedback/${post.id}`)
      .then(() => toast.success('Link copied.'));
  };

  const handleAddComment = (content: JSONContent, parentId?: string) => {
    if (!drawerPostId) return;
    addComment(
      { content, parentId },
      { onError: () => toast.error('Failed to add comment.') },
    );
  };

  const handleEditComment = (commentId: string, content: JSONContent) => {
    editComment(
      { commentId, content },
      { onError: () => toast.error('Failed to update comment.') },
    );
  };

  const handleDeleteComment = (commentId: string) => {
    removeComment(commentId, { onError: () => toast.error('Failed to delete comment.') });
  };

  const handleVoteComment = (commentId: string, type: 'upvote' | 'downvote') => {
    voteComment(
      { commentId, type },
      { onError: () => toast.error('Failed to update vote.') },
    );
  };

  const authorName  = post?.author?.user?.name ?? 'Unknown';
  const avatarColor = getAvatarColor(authorName);
  const initials    = getInitials(authorName);

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="right"
        showOverlay={showOverlay}
        className="w-full sm:max-w-2xl flex flex-col p-0 gap-0"
      >
        {/* ── Navigation bar ── */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 pr-12">
          <button
            type="button"
            title="Previous post"
            disabled={!prevPost}
            onClick={() => prevPost && openDrawer(prevPost.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Next post"
            disabled={!nextPost}
            onClick={() => nextPost && openDrawer(nextPost.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {posts.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} of {posts.length} posts
            </span>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          {post ? (
            <>
              {/* ── Profile header ── */}
              <div className="flex flex-col items-center px-6 pt-6 pb-5 text-center">
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm',
                  avatarColor,
                )}>
                  {initials}
                </div>

                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  rows={2}
                  placeholder="Post title"
                  className="mt-3 w-full resize-none bg-transparent text-center text-lg font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-snug"
                />

                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                  {currentBoard && (
                    <span className="flex items-center gap-1">
                      <LayoutGrid className="h-3 w-3" />
                      {currentBoard.name}
                    </span>
                  )}
                  {currentBoard && <span>·</span>}
                  <span className="flex items-center gap-1">
                    {visibility === 'public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {visibility === 'public' ? 'Public' : 'Private'}
                  </span>
                  <span>·</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <ActionButton
                    icon={<Pin className="h-4 w-4" />}
                    label={pinned ? 'Unpin post' : 'Pin post'}
                    active={pinned}
                    onClick={() => setPinned((p) => !p)}
                  />
                  <ActionButton
                    icon={<Link2 className="h-4 w-4" />}
                    label="Copy link"
                    onClick={handleCopyLink}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        title="Delete post"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? 'Deleting…' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* ── Stats grid ── */}
              <div className="grid grid-cols-4 gap-3 px-5 pb-5">
                <StatCard
                  icon={<ChevronLeft className="h-3.5 w-3.5 -rotate-90" />}
                  label="Upvotes"
                  value={post.votes?.upvotes ?? 0}
                  sub="total"
                />
                <StatCard
                  icon={<ChevronLeft className="h-3.5 w-3.5 rotate-90" />}
                  label="Downvotes"
                  value={post.votes?.downvotes ?? 0}
                  sub="total"
                />
                <StatCard
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                  label="Comments"
                  value={post.commentCount}
                  sub={post.enableComment ? 'enabled' : 'disabled'}
                />
                <StatCard
                  icon={<Calendar className="h-3.5 w-3.5" />}
                  label="Created"
                  value={format(new Date(post.createdAt), 'MMM d')}
                  sub={format(new Date(post.createdAt), 'yyyy')}
                />
              </div>

              <div className="px-5 space-y-4 pb-6">

                {/* ── Description — always visible, not collapsible ── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Description
                  </div>
                  <RichEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Add a description…"
                    className="min-h-32 rounded-xl border border-border bg-muted/20 [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:min-h-24"
                  />
                </div>

                {/* ── Fields — collapsible, expanded by default ── */}
                <SectionAccordion
                  title={
                    <span className="flex items-center gap-2 text-sm">
                      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                      Fields
                    </span>
                  }
                  badge="7"
                  defaultOpen={true}
                  contentClassName="px-4 pt-1 pb-3"
                >
                  {/* Status */}
                  <FieldRow
                    icon={
                      currentStatus
                        ? <span className="h-3 w-3 rounded-full block shrink-0" style={{ backgroundColor: currentStatus.color }} />
                        : <span className="h-3 w-3 rounded-full block shrink-0 bg-muted-foreground/30" />
                    }
                    label="Status"
                  >
                    <SearchableSelect
                      options={statusOptions}
                      value={statusId}
                      onChange={setStatusId}
                      placeholder="Set status"
                      clearable
                      triggerClassName="h-7 border-0 bg-transparent px-2 text-sm hover:bg-accent"
                    />
                  </FieldRow>

                  {/* Board */}
                  <FieldRow icon={<LayoutGrid className="h-3.5 w-3.5" />} label="Board">
                    <SearchableSelect
                      options={boardOptions}
                      value={boardId}
                      onChange={(v) => v && setBoardId(v)}
                      placeholder="Select board"
                      clearable={false}
                      triggerClassName="h-7 border-0 bg-transparent px-2 text-sm hover:bg-accent"
                    />
                  </FieldRow>

                  {/* Tags — let MultiSearchableSelect handle its own trigger entirely */}
                  <FieldRow icon={<Tag className="h-3.5 w-3.5" />} label="Tags">
                    <MultiSearchableSelect
                      options={tagOptions}
                      value={tagIds}
                      onChange={setTagIds}
                      placeholder="Add tags"
                      searchPlaceholder="Search tags…"
                      maxDisplay={10}
                      align="end"
                    />
                  </FieldRow>

                  {/* Assignees — same pattern */}
                  <FieldRow icon={<User className="h-3.5 w-3.5" />} label="Assignees">
                    <MultiSearchableSelect
                      options={memberOptions}
                      value={assigneeIds}
                      onChange={setAssigneeIds}
                      placeholder="Assign members"
                      searchPlaceholder="Search members…"
                      maxDisplay={10}
                      align="end"
                    />
                  </FieldRow>

                  {/* ETA */}
                  <FieldRow icon={<Calendar className="h-3.5 w-3.5" />} label="ETA">
                    <DatePicker
                      value={eta}
                      onChange={setEta}
                      placeholder="Not set"
                      side="left"
                      align="end"
                    />
                  </FieldRow>

                  {/* Visibility */}
                  <FieldRow
                    icon={visibility === 'public' ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                    label="Visibility"
                  >
                    <button
                      type="button"
                      onClick={() => setVisibility((v) => v === 'public' ? 'private' : 'public')}
                      className="h-7 rounded-md px-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      {visibility === 'public' ? 'Public' : 'Private'}
                    </button>
                  </FieldRow>

                  {/* Enable Comments */}
                  <FieldRow icon={<MessageSquare className="h-3.5 w-3.5" />} label="Comments">
                    <div className="flex items-center gap-2 pt-1">
                      <span className={cn('text-xs', enableComment ? 'text-foreground' : 'text-muted-foreground')}>
                        {enableComment ? 'Enabled' : 'Disabled'}
                      </span>
                      <Switch
                        checked={enableComment}
                        onCheckedChange={setEnableComment}
                        className="scale-75 origin-right"
                      />
                    </div>
                  </FieldRow>
                </SectionAccordion>

                {/* ── Comments — only when enableComment is true ── */}
                {enableComment && (
                  <SectionAccordion
                    title={
                      <span className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        Comments
                      </span>
                    }
                    badge={
                      (detail?.comments?.length ?? post.commentCount) > 0
                        ? String(detail?.comments?.length ?? post.commentCount)
                        : undefined
                    }
                    defaultOpen={false}
                    contentClassName="px-4 pt-2 pb-4"
                  >
                    <CommentThread
                      comments={(detail?.comments ?? []) as CommentData[]}
                      currentMemberId={currentMemberId}
                      isAdmin={isAdmin}
                      onAdd={handleAddComment}
                      onEdit={handleEditComment}
                      onDelete={handleDeleteComment}
                      onVote={handleVoteComment}
                      isPendingAdd={isAddingComment}
                    />
                  </SectionAccordion>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <SheetFooter className="border-t px-5 py-3.5">
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
