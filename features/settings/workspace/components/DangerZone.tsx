'use client';

export function DangerZone() {
  return (
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
  );
}
