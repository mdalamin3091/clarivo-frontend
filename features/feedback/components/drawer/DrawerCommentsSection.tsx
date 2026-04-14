'use client';

import { MessageSquare } from 'lucide-react';
import type { JSONContent } from 'novel';
import { SectionAccordion } from '@/shared/components/ui/SectionAccordion';
import { CommentThread } from '@/shared/components/comments';
import type { CommentData } from '@/shared/components/comments';
import type { FeedbackDetail } from '../../types';

interface Props {
  post:             { commentCount: number; enableComment: boolean };
  detail:           FeedbackDetail | undefined;
  currentMemberId:  string | null;
  isAdmin:          boolean;
  isPendingAdd:     boolean;
  onAdd:            (content: JSONContent, parentId?: string) => void;
  onEdit:           (commentId: string, content: JSONContent) => void;
  onDelete:         (commentId: string) => void;
  onVote:           (commentId: string, type: 'upvote' | 'downvote') => void;
}

export function DrawerCommentsSection({
  post, detail, currentMemberId, isAdmin, isPendingAdd,
  onAdd, onEdit, onDelete, onVote,
}: Props) {
  if (!post.enableComment) return null;

  const commentCount = detail?.comments?.length ?? post.commentCount;

  return (
    <div className="px-5 pb-6">
      <SectionAccordion
        title={
          <span className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Comments
          </span>
        }
        badge={commentCount > 0 ? String(commentCount) : undefined}
        defaultOpen={false}
        contentClassName="px-4 pt-2 pb-4"
      >
        <CommentThread
          comments={(detail?.comments ?? []) as CommentData[]}
          currentMemberId={currentMemberId}
          isAdmin={isAdmin}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          onVote={onVote}
          isPendingAdd={isPendingAdd}
        />
      </SectionAccordion>
    </div>
  );
}
