'use client';

import { GuestAccessCard } from './GuestAccessCard';
import { ModerationCard }  from './ModerationCard';
import { PrivacyCard }     from './PrivacyCard';

export function AccessPrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Access &amp; Privacy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control who can interact with your portal and how content is moderated.
        </p>
      </div>

      <GuestAccessCard />
      <ModerationCard />
      <PrivacyCard />
    </div>
  );
}
