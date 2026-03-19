'use client';

import { Bell, CheckCheck } from 'lucide-react';

export function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Stay on top of activity across your workspace.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">All caught up</h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          You have no new notifications. We&apos;ll let you know when something needs your attention.
        </p>
      </div>

    </div>
  );
}
