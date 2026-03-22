'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBoardsStore }    from '../store';
import { FeedbackModuleCard } from './FeedbackModuleCard';
import { DefaultMessagingCard } from './DefaultMessagingCard';

export function BoardsTypographyPage() {
  const { openCreateDialog } = useBoardsStore();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-6 p-6 pb-12">
        {/* Section header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Feedback module</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Reorder, customize or remove links (modules) from being displayed from public portal or
              widgets.
            </p>
          </div>
          <Button size="sm" onClick={openCreateDialog} className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            Add board
          </Button>
        </div>
        <FeedbackModuleCard />
        <DefaultMessagingCard />
      </div>
    </div>
  );
}
