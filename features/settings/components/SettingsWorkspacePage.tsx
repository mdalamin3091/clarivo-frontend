'use client';

import { useActiveOrganization } from '@/lib/auth-client';

export function SettingsWorkspacePage() {
  const { data: org } = useActiveOrganization();

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Workspace Settings</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your workspace name, slug, and preferences.
        </p>
      </div>

      <div className="space-y-6 rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">General</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Workspace name</label>
          <input
            type="text"
            defaultValue={org?.name ?? ''}
            placeholder="My Workspace"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Slug</label>
          <div className="flex items-center overflow-hidden rounded-lg border bg-background">
            <span className="border-r bg-muted px-3 py-2 text-xs text-muted-foreground">
              clarivo.app/
            </span>
            <input
              type="text"
              defaultValue={org?.slug ?? ''}
              placeholder="my-workspace"
              className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            Save changes
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="space-y-4 rounded-xl border border-destructive/30 bg-card p-6">
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete workspace</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete this workspace and all its data.
            </p>
          </div>
          <button className="rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
