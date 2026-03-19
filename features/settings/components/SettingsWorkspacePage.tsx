'use client';

import { WorkspaceForm } from './WorkspaceForm';
import { DangerZone } from './DangerZone';

export function SettingsWorkspacePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Workspace Settings</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your workspace name, slug, and preferences.
        </p>
      </div>

      <WorkspaceForm />
      <DangerZone />
    </div>
  );
}
