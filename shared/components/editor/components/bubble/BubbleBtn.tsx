'use client';

import { EditorBubbleItem } from 'novel';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BubbleBtnProps {
  onSelect: () => void;
  active?: boolean;
  label: string;
  shortcut?: string;
  children: React.ReactNode;
}

export function BubbleBtn({ onSelect, active, label, shortcut, children }: BubbleBtnProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <EditorBubbleItem
          onSelect={onSelect}
          className={cn(
            'flex cursor-pointer items-center justify-center px-2 py-1.5 transition-colors',
            'text-muted-foreground hover:bg-accent hover:text-foreground',
            active && 'bg-accent text-foreground',
          )}
        >
          {children}
        </EditorBubbleItem>
      </TooltipTrigger>
      <TooltipContent side="top" className="flex items-center gap-1.5">
        <span>{label}</span>
        {shortcut && (
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export function BubbleDivider() {
  return <div className="mx-0.5 my-1 w-px self-stretch bg-border" />;
}
