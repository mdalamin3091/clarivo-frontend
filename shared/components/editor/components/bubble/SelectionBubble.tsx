'use client';

import { EditorBubble } from 'novel';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BubbleDivider } from './BubbleBtn';
import { FormattingRow } from './FormattingRow';
import { AlignmentRow } from './AlignmentRow';

export function SelectionBubble() {
  return (
    <TooltipProvider delayDuration={400}>
      <EditorBubble
        tippyOptions={{ duration: 100, placement: 'top' }}
        className="flex items-center rounded-md border border-border bg-popover shadow-md"
      >
        <FormattingRow />
        <BubbleDivider />
        <AlignmentRow />
      </EditorBubble>
    </TooltipProvider>
  );
}
