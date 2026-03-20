'use client';

import { Plus, Globe } from 'lucide-react';

export function SettingsWebhooksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Webhooks</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Receive real-time HTTP callbacks when events happen in your workspace.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add webhook
        </button>
      </div>

      {/* Events reference */}
      <div className="rounded-xl border bg-card p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Available events</p>
        <div className="flex flex-wrap gap-2">
          {[
            'feedback.created', 'feedback.voted', 'feedback.status_changed',
            'roadmap.item_created', 'roadmap.item_updated',
            'changelog.published', 'survey.response_submitted',
          ].map((event) => (
            <span key={event} className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
              {event}
            </span>
          ))}
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Globe className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">No webhooks configured</h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Add a webhook endpoint URL to start receiving event notifications.
        </p>
      </div>
    </div>
  );
}
