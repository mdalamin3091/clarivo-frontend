'use client';

import { MessageSquare, Plus } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { useFeedbackPosts } from '../hooks/useFeedbackPosts';
import { useFeedbackModalStore } from '../store';
import { CreateFeedbackModal } from './CreateFeedbackModal';

const STATUSES = [
  { label: 'In Review', color: 'bg-yellow-400', key: 'in-review' },
  { label: 'Active',    color: 'bg-green-400',  key: 'active' },
  { label: 'Closed',   color: 'bg-red-400',    key: 'closed' },
  { label: 'Done',     color: 'bg-blue-400',   key: 'done' },
] as const;

export function FeedbackPage() {
  const { data: org }   = useActiveOrganization();
  const { data: posts } = useFeedbackPosts(org?.id);
  const openModal       = useFeedbackModalStore((s) => s.open);

  const countByStatus = (key: string) =>
    posts?.filter((p) => p.status === key).length ?? 0;

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-6 p-6">
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATUSES.map(({ label, color, key }) => (
            <div key={key} className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
              <div>
                <p className="text-lg font-bold text-foreground">{countByStatus(key)}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {(!posts || posts.length === 0) && (
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
