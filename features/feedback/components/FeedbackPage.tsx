'use client';

import { useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  ChevronUp,
  ChevronDown,
  Pencil,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useActiveOrganization } from '@/lib/auth-client';
import { useUIStore } from '@/store/ui';
import { useFeedbackPosts } from '../hooks/useFeedbackPosts';
import { useFeedbackModalStore } from '../store';
import { CreateFeedbackModal } from './CreateFeedbackModal';
import { FeedbackEditDrawer } from './FeedbackEditDrawer';
import type { FeedbackPost } from '../types';

// ─── NewPostButton (injected into Topbar) ─────────────────────────────────────

function NewPostButton() {
  const openModal = useFeedbackModalStore((s) => s.open);
  return (
    <button
      onClick={openModal}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >
      <Plus className="h-4 w-4" />
      New Post
    </button>
  );
}

// ─── VoteButton ───────────────────────────────────────────────────────────────

function VoteButton({ upvotes, downvotes }: { upvotes: number; downvotes: number }) {
  const net = upvotes - downvotes;
  return (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className="group flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-border bg-background px-2.5 py-2 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary min-w-11"
    >
      <ChevronUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
      <span className="text-xs font-semibold leading-none">{net}</span>
    </button>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium shrink-0"
      style={{ borderColor: `${color}40`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}

// ─── TagBadge ─────────────────────────────────────────────────────────────────

function TagBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}

// ─── AssigneeAvatars ──────────────────────────────────────────────────────────

function AssigneeAvatars({ assignees }: { assignees: FeedbackPost['assignees'] }) {
  if (assignees.length === 0) return null;
  return (
    <span className="flex -space-x-1.5">
      {assignees.slice(0, 3).map((a) => {
        const name    = a.user?.name ?? '?';
        const initial = name[0].toUpperCase();
        return (
          <span
            key={a.id}
            title={name}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground ring-2 ring-card"
          >
            {initial}
          </span>
        );
      })}
      {assignees.length > 3 && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-medium text-muted-foreground ring-2 ring-card">
          +{assignees.length - 3}
        </span>
      )}
    </span>
  );
}

// ─── FeedbackRow ──────────────────────────────────────────────────────────────

function FeedbackRow({ post, onEdit }: { post: FeedbackPost; onEdit: (id: string) => void }) {
  const authorName = post.author?.user?.name ?? 'Unknown';
  const initials   = authorName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(post.id)}
      onKeyDown={(e) => e.key === 'Enter' && onEdit(post.id)}
      className="group flex items-start gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-all hover:border-primary/30 hover:bg-accent/20 cursor-pointer"
    >
      {/* Vote */}
      <VoteButton upvotes={post.votes?.upvotes ?? 0} downvotes={post.votes?.downvotes ?? 0} />

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Title row */}
        <div className="flex flex-wrap items-start gap-2">
          <h3 className="flex-1 min-w-0 text-sm font-semibold text-foreground leading-snug">
            {post.title}
          </h3>

          {post.status && (
            <StatusBadge name={post.status.name} color={post.status.color} />
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} color={tag.color} />
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Author */}
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {initials}
            </span>
            {authorName}
          </span>

          <span className="text-border">·</span>
          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>

          {/* Comments */}
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>

          {/* Assignees */}
          <AssigneeAvatars assignees={post.assignees} />

          {/* Downvotes indicator */}
          {(post.votes?.downvotes ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-destructive/70">
              <ChevronDown className="h-3.5 w-3.5" />
              {post.votes.downvotes}
            </span>
          )}
        </div>
      </div>

      {/* Edit hint */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEdit(post.id); }}
        className="shrink-0 opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
        title="Edit post"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card px-4 py-4 animate-pulse">
      <div className="h-13 w-11 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="h-4 w-3/5 rounded bg-muted" />
        <div className="h-3 w-1/4 rounded bg-muted" />
        <div className="h-3 w-2/5 rounded bg-muted" />
      </div>
    </div>
  );
}

// ─── FeedbackPage ─────────────────────────────────────────────────────────────

export function FeedbackPage() {
  const { data: org }   = useActiveOrganization();
  const { data: posts, isLoading } = useFeedbackPosts(org?.id);
  const { openDrawer }  = useFeedbackModalStore();
  const setTopbarNode   = useUIStore((s) => s.setTopbarNode);

  // Inject "New Post" button into Topbar
  useEffect(() => {
    setTopbarNode(<NewPostButton />);
    return () => setTopbarNode(null);
  }, [setTopbarNode]);

  return (
    <>
      <div className="h-full p-6 space-y-5">
        {/* Page header */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">Feedback</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Collect and manage user feedback, feature requests, and bug reports.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* Post list */}
        {!isLoading && posts && posts.length > 0 && (
          <div className="space-y-2.5">
            {posts.map((post) => (
              <FeedbackRow key={post.id} post={post} onEdit={openDrawer} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!posts || posts.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No feedback posts yet</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Share your feedback board with users to start collecting ideas, bugs, and requests.
            </p>
          </div>
        )}
      </div>

      <CreateFeedbackModal />
      <FeedbackEditDrawer />
    </>
  );
}
