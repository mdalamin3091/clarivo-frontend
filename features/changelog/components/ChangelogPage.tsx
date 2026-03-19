'use client';

import { Newspaper, Plus } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { useChangelogs } from '../hooks/useChangelogs';

const STATUS_BADGE: Record<string, string> = {
  published: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  draft:     'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  scheduled: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
};

export function ChangelogPage() {
  const { data: org }     = useActiveOrganization();
  const { data: entries } = useChangelogs(org?.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Changelog</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Announce new features, fixes, and improvements to your users.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {entries && entries.length > 0 ? (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{entry.title}</p>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[entry.status] ?? STATUS_BADGE.draft}`}>
                  {entry.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950">
            <Newspaper className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No changelog posts yet</h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Write your first changelog entry to keep users informed about what&apos;s new.
          </p>
          <button className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            Write first entry
          </button>
        </div>
      )}
    </div>
  );
}
