'use client';

import { MessageSquare } from 'lucide-react';
import type { CommentResponse } from '../types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments:        CommentResponse[];
  feedbackId:      string;
  currentMemberId: string | null;
  isAdmin:         boolean;
}

export function CommentList({
  comments,
  feedbackId,
  currentMemberId,
  isAdmin,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          feedbackId={feedbackId}
          currentMemberId={currentMemberId}
          isAdmin={isAdmin}
          depth={0}
        />
      ))}
    </div>
  );
}
