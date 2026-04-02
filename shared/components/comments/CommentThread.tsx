'use client';

import { MessageSquare } from 'lucide-react';
import type { JSONContent } from 'novel';
import type { CommentThreadProps } from './types';
import { CommentCard } from './CommentCard';
import { CommentInput } from './CommentInput';

export function CommentThread({
  comments,
  currentMemberId,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
  onVote,
  isPendingAdd = false,
}: CommentThreadProps) {
  return (
    <div className="space-y-3">
      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-5 text-center">
          <MessageSquare className="h-7 w-7 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            currentMemberId={currentMemberId}
            isAdmin={isAdmin}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            onVote={onVote}
          />
        ))
      )}

      {/* New top-level comment input */}
      <div className="pt-1">
        <CommentInput
          onSubmit={(content: JSONContent) => onAdd(content)}
          isLoading={isPendingAdd}
          placeholder="Write a comment…"
        />
      </div>
    </div>
  );
}
