'use client';

import { FeedbackModuleCard } from './FeedbackModuleCard';
import { DefaultMessagingCard } from './DefaultMessagingCard';

/**
 * Boards & Messaging settings page.
 *
 * SRP — page is a pure composition root; all logic lives in the two cards.
 * SOC — board list/controls (FeedbackModuleCard) and typography (DefaultMessagingCard)
 *        are fully independent features that each own their own form, hooks, and API calls.
 */
export function BoardsTypographyPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-6 p-6 pb-12">
        <FeedbackModuleCard />
        <DefaultMessagingCard />
      </div>
    </div>
  );
}
