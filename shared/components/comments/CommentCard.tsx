'use client';

import { useState } from 'react';
import type { JSONContent } from 'novel';
import type { CommentData } from './types';
import { CommentRow } from './CommentRow';
import { CommentInput } from './CommentInput';

interface CommentCardProps {
  comment:         CommentData;
  currentMemberId: string | null;
  isAdmin:         boolean;
  onAdd:           (content: JSONContent, parentId?: string) => void;
  onEdit:          (commentId: string, content: JSONContent) => void;
  onDelete:        (commentId: string) => void;
  onVote:          (commentId: string, type: 'upvote' | 'downvote') => void;
  /** Internal — strips the card border when rendering nested replies */
  isNested?:       boolean;
}

export function CommentCard({
  comment,
  currentMemberId,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
  onVote,
  isNested = false,
}: CommentCardProps) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [repliesOpen,  setRepliesOpen]  = useState(true);

  const hasReplies = comment.replies.length > 0;

  /*
   * Align the thread line with the current comment's avatar centre:
   *   default (w-9 = 36px) → centre at 18px
   *   sm / isNested (w-7 = 28px) → centre at 14px
   */
  const avatarHalf = isNested ? 14 : 18;

  const handleReply = (content: JSONContent) => {
    onAdd(content, comment.id);
    setReplyingToId(null);
  };

  const inner = (
    <div className="space-y-2">
      {/* Comment row */}
      <CommentRow
        comment={comment}
        currentMemberId={currentMemberId}
        isAdmin={isAdmin}
        onReply={() => setReplyingToId(comment.id)}
        onEdit={onEdit}
        onDelete={onDelete}
        onVote={onVote}
        size={isNested ? 'sm' : 'default'}
        showReplyButton
      />

      {/* Inline reply input for this comment */}
      {replyingToId === comment.id && (
        <div className="ml-11">
          <CommentInput
            onSubmit={handleReply}
            onCancel={() => setReplyingToId(null)}
            placeholder={`Reply to ${comment.author?.user?.name ?? 'comment'}…`}
            submitLabel="Reply"
          />
        </div>
      )}

      {/* ── Thread replies ── */}
      {hasReplies && (
        /*
         * Offset the entire thread block so the left border (= thread line)
         * sits exactly at the current avatar's horizontal centre.
         *
         *   avatarHalf px → thread line x
         *   pl-[26px]     → reply content starts 26px right of the line
         *   total indent  → avatarHalf + 26px  (≈ ml-11 = 44px for the top level)
         */
        <div
          className="relative mt-0.5"
          style={{ marginLeft: `${avatarHalf}px` }}
        >
          {repliesOpen ? (
            <>
              {/*
               * Invisible narrow button that overlays the border-l line.
               * Using `peer` so we can highlight the line on hover via
               * the `peer-hover:` class on the sibling div below.
               * This button is 10px wide, 1px left of the border — clicking
               * anywhere on the line toggles collapse.  It is naturally
               * bounded by the parent div height so it never overflows.
               */}
              <button
                type="button"
                onClick={() => setRepliesOpen(false)}
                aria-label="Collapse replies"
                className="peer absolute inset-y-0 -left-px w-2.5 z-10 cursor-pointer"
              />

              {/*
               * The `border-l-2` IS the visual thread line.
               *   • height = content height (never overflows the card)
               *   • peer-hover: highlights when the narrow button above is hovered
               *   • pl-[26px] pushes reply content 26px right of the line
               *
               * L-connector geometry per reply:
               *   -left-[26px]  → left border aligns with thread line x
               *   w-[20px]      → right edge ends 6px before reply content start
               *                  (26px offset − 6px gap = 20px)
               *   h-[18px]      → reaches the sm-avatar vertical centre
               *                  (h-7 = 28px, mt-0.5 = 2px → centre ≈ 16px)
               *   border-l + border-b + rounded-bl → ∟ curve
               */}
              <div className="border-l-2 border-border/40 peer-hover:border-primary/60 transition-colors pl-6.5 space-y-3 pb-1">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="relative">
                    <div className="pointer-events-none absolute -left-6.5 top-0 h-4.5 w-5 rounded-bl-[6px] border-b-2 border-l-2 border-border/40" />

                    {/* Recursive — handles any nesting depth */}
                    <CommentCard
                      comment={reply}
                      currentMemberId={currentMemberId}
                      isAdmin={isAdmin}
                      onAdd={onAdd}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onVote={onVote}
                      isNested
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ── Collapsed state ── */
            <div className="pl-6.5 pb-1 pt-0.5">
              <button
                type="button"
                onClick={() => setRepliesOpen(true)}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {comment.replies.length}{' '}
                {comment.replies.length === 1 ? 'reply' : 'replies'} — click to expand
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isNested) return inner;

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3.5">
      {inner}
    </div>
  );
}
