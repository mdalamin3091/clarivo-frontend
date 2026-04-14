'use client';

import { ChevronLeft, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { FeedbackPost } from '../../types';

function StatCard({
  icon, label, value, sub,
}: {
  icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-muted-foreground/50">{icon}</span>
      </div>
      <div className="text-lg font-semibold text-foreground leading-none">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

interface Props {
  post: FeedbackPost;
}

export function DrawerStatsGrid({ post }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 px-5 pb-5">
      <StatCard
        icon={<ChevronLeft className="h-3.5 w-3.5 -rotate-90" />}
        label="Upvotes"
        value={post.votes?.upvotes ?? 0}
        sub="total"
      />
      <StatCard
        icon={<ChevronLeft className="h-3.5 w-3.5 rotate-90" />}
        label="Downvotes"
        value={post.votes?.downvotes ?? 0}
        sub="total"
      />
      <StatCard
        icon={<MessageSquare className="h-3.5 w-3.5" />}
        label="Comments"
        value={post.commentCount}
        sub={post.enableComment ? 'enabled' : 'disabled'}
      />
      <StatCard
        icon={<Calendar className="h-3.5 w-3.5" />}
        label="Created"
        value={format(new Date(post.createdAt), 'MMM d')}
        sub={format(new Date(post.createdAt), 'yyyy')}
      />
    </div>
  );
}
