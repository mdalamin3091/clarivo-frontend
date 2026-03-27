'use client';

import { useState } from 'react';
import { ThumbsUp, Reply, Pencil, Trash2 } from 'lucide-react';
import type { JSONContent } from 'novel';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { RichEditor } from '@/shared/components/editor';
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
import { cn } from '@/lib/utils';
import type { CommentResponse } from '../types';
import { CommentInput } from './CommentInput';
import { useAddComment } from '../hooks/useAddComment';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useToggleCommentVote } from '../hooks/useToggleCommentVote';

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

// ─── CommentItem ──────────────────────────────────────────────────────────────

interface CommentItemProps {
  comment:          CommentResponse;
  feedbackId:       string;
  currentMemberId:  string | null;
  isAdmin:          boolean;
  depth?:           number;
}

export function CommentItem({
  comment,
  feedbackId,
  currentMemberId,
  isAdmin,
  depth = 0,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing,  setIsEditing]  = useState(false);

  const { mutate: addReply,   isPending: isAddingReply   } = useAddComment(feedbackId);
  const { mutate: editComment, isPending: isEditingComment } = useUpdateComment(feedbackId);
  const { mutate: removeComment, isPending: isDeleting   } = useDeleteComment(feedbackId);
  const { mutate: voteComment }                             = useToggleCommentVote(feedbackId);

  const isOwn    = currentMemberId !== null && comment.authorId === currentMemberId;
  const canEdit  = isOwn;
  const canDelete = isOwn || isAdmin;
  const canReply  = depth < 2;

  const authorName  = comment.author?.user?.name ?? 'Unknown';
  const avatarColor = getAvatarColor(authorName);
  const initials    = getInitials(authorName);

  const handleVote = () => {
    voteComment(
      { commentId: comment.id, type: 'upvote' },
      { onError: () => toast.error('Failed to update vote') },
    );
  };

  const handleReply = (content: JSONContent) => {
    addReply(
      { content, parentId: comment.id },
      {
        onSuccess: () => setIsReplying(false),
        onError:   () => toast.error('Failed to add reply'),
      },
    );
  };

  const handleEdit = (content: JSONContent) => {
    editComment(
      { commentId: comment.id, content },
      {
        onSuccess: () => setIsEditing(false),
        onError:   () => toast.error('Failed to update comment'),
      },
    );
  };

  const handleDelete = () => {
    removeComment(comment.id, {
      onError: () => toast.error('Failed to delete comment'),
    });
  };

  return (
    <div className={cn('flex gap-2.5', depth > 0 && 'ml-8 mt-2')}>
      {/* Avatar */}
      <div className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5',
        avatarColor,
      )}>
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">{authorName}</span>
          {comment.author?.role && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
              {comment.author.role}
            </span>
          )}
          {comment.isEdited && (
            <span className="text-[10px] text-muted-foreground/60 italic">(edited)</span>
          )}
          <span className="text-[11px] text-muted-foreground ml-auto">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Content — edit mode or read-only */}
        {isEditing ? (
          <div className="mt-2">
            <CommentInput
              initialValue={comment.content as JSONContent}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              isLoading={isEditingComment}
              submitLabel="Save"
            />
          </div>
        ) : (
          <div className="mt-1">
            <RichEditor
              key={comment.id + comment.updatedAt}
              value={comment.content as JSONContent}
              onChange={() => {}}
              editable={false}
              className="border-0 bg-transparent shadow-none [&_.ProseMirror]:!min-h-0 [&_.ProseMirror]:!px-0 [&_.ProseMirror]:!py-0 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-foreground/90"
            />
          </div>
        )}

        {/* Action bar */}
        {!isEditing && (
          <div className="mt-1.5 flex items-center gap-1">
            {/* Upvote */}
            <button
              type="button"
              onClick={handleVote}
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] transition-colors',
                comment.myVote === 'upvote'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              <ThumbsUp className="h-3 w-3" />
              {comment.votes.upvotes > 0 && <span>{comment.votes.upvotes}</span>}
            </button>

            {/* Reply */}
            {canReply && (
              <button
                type="button"
                onClick={() => setIsReplying((v) => !v)}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            )}

            {/* Edit */}
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
            )}

            {/* Delete */}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the comment and all its replies.
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
            )}
          </div>
        )}

        {/* Inline reply input */}
        {isReplying && (
          <div className="mt-3">
            <CommentInput
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              isLoading={isAddingReply}
              placeholder={`Reply to ${authorName}…`}
              submitLabel="Reply"
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                feedbackId={feedbackId}
                currentMemberId={currentMemberId}
                isAdmin={isAdmin}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
