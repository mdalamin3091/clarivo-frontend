'use client';

import { AccessibilityForm } from './AccessibilityForm';

export function AccessibilityPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-4 p-6 pb-12">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Organization Access</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Control who can access your public portal and feedback widgets.
          </p>
        </div>
        <AccessibilityForm />
      </div>
    </div>
  );
}
