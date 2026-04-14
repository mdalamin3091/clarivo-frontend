'use client';

import { LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import type { JSONContent } from 'novel';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useActiveOrganization, useSession } from '@/lib/auth-client';
import { useFeedbackModalStore } from '../store';
import { useDrawerForm } from '../hooks/useDrawerForm';
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
import { DrawerNavBar } from './drawer/DrawerNavBar';
import { DrawerAuthorHeader } from './drawer/DrawerAuthorHeader';
import { DrawerStatsGrid } from './drawer/DrawerStatsGrid';
import { DrawerFieldsSection } from './drawer/DrawerFieldsSection';
import { DrawerCommentsSection } from './drawer/DrawerCommentsSection';

interface FeedbackEditDrawerProps {
  showOverlay?: boolean;
}

export function FeedbackEditDrawer({ showOverlay = false }: FeedbackEditDrawerProps) {
  const { drawerOpen, drawerPostId, closeDrawer } = useFeedbackModalStore();
  const { data: org }        = useActiveOrganization();
  const { data: session }    = useSession();
  const { data: posts = [] } = useFeedbackPosts(org?.id);

  const post   = posts.find((p) => p.id === drawerPostId) ?? null;
  const { data: detail } = useGetFeedback(drawerOpen ? drawerPostId : null);

  // ── Data hooks ───────────────────────────────────────────────────────────────
  const { data: boards = [] }   = useOrgBoards();
  const { data: statuses = [] } = useOrgStatuses();
  const { data: tags = [] }     = useOrgTags();
  const { data: members = [] }  = useOrgMembers();

  // ── Form ─────────────────────────────────────────────────────────────────────
  const form = useDrawerForm(post);
  const { control, watch, handleSubmit } = form;

  // ── Current user ─────────────────────────────────────────────────────────────
  const currentUserId   = session?.user?.id ?? null;
  const currentUserName = session?.user?.name ?? 'Unknown';
  const currentMember   = members.find((m) => m.userId === currentUserId) ?? null;
  const currentMemberId = currentMember?.id ?? null;
  const isAdmin         = currentMember?.role === 'admin' || currentMember?.role === 'owner';

  // ── Select options ───────────────────────────────────────────────────────────
  const boardOptions  = boards.map((b) => ({
    value: b.id,
    label: b.name,
    icon:  b.icon?.type === 'emoji'
      ? <span className="text-sm">{b.icon.value}</span>
      : <LayoutGrid className="h-3.5 w-3.5 text-primary" />,
  }));
  const statusOptions  = statuses.map((s) => ({ value: s.id, label: s.name, color: s.color }));
  const tagOptions     = tags.map((t) => ({ value: t.id, label: t.name, color: t.color }));
  const memberOptions  = members.map((m) => ({
    value: m.id,
    label: m.user?.name ?? m.user?.email ?? 'Unknown',
    icon: (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
        {(m.user?.name ?? '?')[0].toUpperCase()}
      </span>
    ),
  }));

  const watchedBoardId   = watch('boardId');
  const watchedStatusId  = watch('statusId');
  const currentBoard     = boards.find((b) => b.id === watchedBoardId);
  const currentStatus    = statuses.find((s) => s.id === watchedStatusId);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const { mutate: updatePost,  isPending: isSaving }       = useUpdateFeedback();
  const { mutate: deletePost,  isPending: isDeleting }      = useDeleteFeedback();
  const authorInfo = currentMember && currentUserId
    ? { memberId: currentMember.id, role: currentMember.role, userId: currentUserId, name: currentUserName }
    : null;
  const { mutate: addComment,    isPending: isAddingComment } = useAddComment(drawerPostId ?? '', authorInfo);
  const { mutate: editComment }                                = useUpdateComment(drawerPostId ?? '');
  const { mutate: removeComment }                              = useDeleteComment(drawerPostId ?? '');
  const { mutate: voteComment }                                = useToggleCommentVote(drawerPostId ?? '');

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const onSave = handleSubmit((values) => {
    if (!post) return;
    updatePost(
      {
        id: post.id,
        data: {
          title:          values.title,
          description:    values.description ? JSON.stringify(values.description) : '',
          boardId:        values.boardId,
          statusId:       values.statusId,
          tagIds:         values.tagIds,
          assigneeIds:    values.assigneeIds,
          eta:            values.eta ? values.eta.toISOString() : null,
          postVisibility: values.visibility,
          enableComment:  values.enableComment,
        },
      },
      {
        onSuccess: () => { toast.success('Post updated.'); closeDrawer(); },
        onError:   () => toast.error('Failed to update post.'),
      },
    );
  });

  const onDelete = () => {
    if (!post) return;
    deletePost(post.id, {
      onSuccess: () => { toast.success('Post deleted.'); closeDrawer(); },
      onError:   () => toast.error('Failed to delete post.'),
    });
  };

  const onCopyLink = () => {
    if (!post) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/feedback/${post.id}`)
      .then(() => toast.success('Link copied.'));
  };

  const onAddComment    = (content: JSONContent, parentId?: string) => {
    if (!drawerPostId) return;
    addComment({ content, parentId }, { onError: () => toast.error('Failed to add comment.') });
  };
  const onEditComment   = (commentId: string, content: JSONContent) =>
    editComment({ commentId, content }, { onError: () => toast.error('Failed to update comment.') });
  const onDeleteComment = (commentId: string) =>
    removeComment(commentId, { onError: () => toast.error('Failed to delete comment.') });
  const onVoteComment   = (commentId: string, type: 'upvote' | 'downvote') =>
    voteComment({ commentId, type }, { onError: () => toast.error('Failed to update vote.') });

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" showOverlay={showOverlay} className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">

        <DrawerNavBar />

        <div className="flex-1 overflow-y-auto">
          {post ? (
            <>
              <DrawerAuthorHeader
                post={post}
                control={control}
                currentBoardName={currentBoard?.name}
                isDeleting={isDeleting}
                onCopyLink={onCopyLink}
                onDelete={onDelete}
              />
              <DrawerStatsGrid post={post} />
              <DrawerFieldsSection
                control={control}
                watch={watch}
                boardOptions={boardOptions}
                statusOptions={statusOptions}
                tagOptions={tagOptions}
                memberOptions={memberOptions}
                currentStatus={currentStatus}
              />
              <DrawerCommentsSection
                post={post}
                detail={detail}
                currentMemberId={currentMemberId}
                isAdmin={isAdmin}
                isPendingAdd={isAddingComment}
                onAdd={onAddComment}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                onVote={onVoteComment}
              />
            </>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          )}
        </div>

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
            onClick={onSave}
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
