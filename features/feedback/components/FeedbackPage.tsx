'use client';

import { MessageSquare, Plus, ThumbsUp, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useActiveOrganization } from '@/lib/auth-client';
import { useFeedbackPosts } from '../hooks/useFeedbackPosts';
import { useFeedbackModalStore } from '../store';
import { CreateFeedbackModal } from './CreateFeedbackModal';
import type { FeedbackPost } from '../types';
import { cn } from '@/lib/utils';

// ─── FeedbackCard ─────────────────────────────────────────────────────────────

function FeedbackCard({ post }: { post: FeedbackPost }) {
  const authorName = post.author?.user?.name ?? 'Unknown';
  const initials   = authorName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-accent/30">
      {/* Vote column */}
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <button
          type="button"
          className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="text-xs font-semibold">{post.votes?.upvotes ?? 0}</span>
        </button>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-snug">{post.title}</h3>

          {/* Status badge */}
          {post.status && (
            <span
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{ borderColor: `${post.status.color}40`, color: post.status.color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: post.status.color }}
              />
              {post.status.name}
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer: author · time · comments · assignees */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Author avatar + name */}
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {initials}
            </span>
            {authorName}
          </span>

          <span>·</span>
          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>

          {/* Comment count */}
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>

          {/* Assignees */}
          {post.assignees.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground/60">Assigned:</span>
              <span className="flex -space-x-1">
                {post.assignees.slice(0, 3).map((a) => {
                  const aName    = a.user?.name ?? '?';
                  const aInitial = aName[0].toUpperCase();
                  return (
                    <span
                      key={a.id}
                      title={aName}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground ring-2 ring-card"
                    >
                      {aInitial}
                    </span>
                  );
                })}
                {post.assignees.length > 3 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-medium text-muted-foreground ring-2 ring-card">
                    +{post.assignees.length - 3}
                  </span>
                )}
              </span>
            </span>
          )}

          {/* Downvotes (if any) */}
          {(post.votes?.downvotes ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-destructive/70">
              <ThumbsUp className="h-3.5 w-3.5 rotate-180" />
              {post.votes.downvotes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FeedbackPage ─────────────────────────────────────────────────────────────

export function FeedbackPage() {
  const { data: org }   = useActiveOrganization();
  const { data: posts, isLoading } = useFeedbackPosts(org?.id);
  const openModal = useFeedbackModalStore((s) => s.open);

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Feedback</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Collect and manage user feedback, feature requests, and bug reports.
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn('h-24 animate-pulse rounded-xl border bg-card')} />
            ))}
          </div>
        )}

        {/* Post list */}
        {!isLoading && posts && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post) => (
              <FeedbackCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!posts || posts.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No feedback posts yet</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Share your feedback board link with users and start collecting ideas, bugs, and requests.
            </p>
            <button
              onClick={openModal}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create first post
            </button>
          </div>
        )}
      </div>

      <CreateFeedbackModal />
    </>
  );
}
