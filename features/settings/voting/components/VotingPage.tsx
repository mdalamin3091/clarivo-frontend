'use client';

import { VotingSettingsCard } from './VotingSettingsCard';

export function VotingPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-6 p-6 pb-12">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Voting</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage voting behaviour across your public portal.
          </p>
        </div>
        <VotingSettingsCard />
      </div>
    </div>
  );
}
