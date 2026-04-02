'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CornerUpLeft, MoreHorizontal, Check, Pencil, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { JSONContent } from 'novel';
import { formatDistanceToNow } from 'date-fns';
import { RichEditor } from '@/shared/components/editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import type { CommentData } from './types';
import { CommentInput } from './CommentInput';

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

// ─── CommentRow ───────────────────────────────────────────────────────────────

interface CommentRowProps {
  comment:         CommentData;
  currentMemberId: string | null;
  isAdmin:         boolean;
  onReply?:        () => void;
  onEdit:          (commentId: string, content: JSONContent) => void;
  onDelete:        (commentId: string) => void;
  onVote:          (commentId: string, type: 'upvote' | 'downvote') => void;
  size?:           'default' | 'sm';
  showReplyButton?: boolean;
}

export function CommentRow({
  comment,
  currentMemberId,
  isAdmin,
  onReply,
  onEdit,
  onDelete,
  onVote,
  size           = 'default',
  showReplyButton = true,
}: CommentRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  const isOwn    = currentMemberId !== null && comment.authorId === currentMemberId;
  const canEdit  = isOwn;
  const canDelete = isOwn || isAdmin;

  const authorName  = comment.author?.user?.name ?? 'Unknown';
  const avatarColor = getAvatarColor(authorName);
  const initials    = getInitials(authorName);
  const avatarSize  = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';
  const badgeSize   = size === 'sm' ? 'h-3 w-3 -top-0.5 -right-0.5' : 'h-3.5 w-3.5 -top-0.5 -right-0.5';

  const handleEdit = (content: JSONContent) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-2.5">
      {/* Avatar */}
      <div className="relative shrink-0 mt-0.5">
        <div className={cn(
          'flex items-center justify-center rounded-full font-bold text-white',
          avatarColor,
          avatarSize,
        )}>
          {initials}
        </div>
        {/* Verified badge */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(
                'absolute flex items-center justify-center rounded-full bg-blue-500 border-2 border-card cursor-default',
                badgeSize,
              )}>
                <Check className="h-1.5 w-1.5 text-white" strokeWidth={3} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">Verified member</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground leading-none">{authorName}</span>
          {comment.author?.role && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary capitalize leading-none">
              {comment.author.role}
            </span>
          )}
          <span className="text-muted-foreground/50 text-xs">·</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          {comment.isEdited && (
            <span className="text-[10px] text-muted-foreground/50 italic">(edited)</span>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mt-2">
            <CommentInput
              initialValue={comment.content as JSONContent}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
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
              className="border-0 bg-transparent shadow-none [&_.ProseMirror]:!min-h-0 [&_.ProseMirror]:!px-0 [&_.ProseMirror]:!py-0 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-foreground/90 [&_.ProseMirror]:leading-relaxed"
            />
          </div>
        )}

        {/* Action bar */}
        {!isEditing && (
          <div className="mt-2 flex items-center gap-0.5 text-xs text-muted-foreground">
            {/* Upvote */}
            <button
              type="button"
              onClick={() => onVote(comment.id, 'upvote')}
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors',
                comment.myVote === 'upvote'
                  ? 'text-blue-500'
                  : 'hover:text-foreground hover:bg-accent',
              )}
            >
              <ThumbsUp className={cn('h-3.5 w-3.5', comment.myVote === 'upvote' && 'fill-blue-500')} />
              {comment.votes.upvotes > 0 && (
                <span className="font-medium">{comment.votes.upvotes}</span>
              )}
            </button>

            {/* Downvote */}
            <button
              type="button"
              onClick={() => onVote(comment.id, 'downvote')}
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors',
                comment.myVote === 'downvote'
                  ? 'text-rose-500'
                  : 'hover:text-foreground hover:bg-accent',
              )}
            >
              <ThumbsDown className={cn('h-3.5 w-3.5', comment.myVote === 'downvote' && 'fill-rose-500')} />
            </button>

            <span className="mx-1 text-border">|</span>

            {/* Reply */}
            {showReplyButton && onReply && (
              <button
                type="button"
                onClick={onReply}
                className="flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:text-foreground hover:bg-accent"
              >
                <CornerUpLeft className="h-3.5 w-3.5" />
                Reply
              </button>
            )}

            {/* Three-dot menu */}
            {(canEdit || canDelete) && (
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center rounded-md px-1.5 py-1 transition-colors hover:text-foreground hover:bg-accent ml-0.5"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    {canEdit && (
                      <DropdownMenuItem
                        onClick={() => setIsEditing(true)}
                        className="gap-2 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="gap-2 text-xs text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

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
                      onClick={() => onDelete(comment.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
