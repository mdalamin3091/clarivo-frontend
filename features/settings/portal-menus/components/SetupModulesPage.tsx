'use client';

import { SetupModulesForm } from './SetupModulesForm';

export function SetupModulesPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-4 p-6 pb-12">
        <SetupModulesForm />
      </div>
    </div>
  );
}
