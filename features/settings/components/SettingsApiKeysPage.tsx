'use client';

import { Key, Plus, Copy, Trash2 } from 'lucide-react';

export function SettingsApiKeysPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Use API keys to authenticate requests from your own apps.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Generate key
        </button>
      </div>

      {/* Docs note */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs text-muted-foreground">
          Include your API key in the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Authorization: Bearer &lt;key&gt;</code> header for all API requests.
        </p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Key className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">No API keys yet</h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Generate an API key to start integrating Clarivo into your own applications.
        </p>
      </div>
    </div>
  );
}
