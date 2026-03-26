'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Smile } from 'lucide-react';
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from '@/components/ui/emoji-picker';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EmojiButtonProps {
  onSelect: (emoji: string) => void;
}

export function EmojiButton({ onSelect }: EmojiButtonProps) {
  return (
    <DropdownMenu.Root>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Smile className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
        </TooltipTrigger>
        <TooltipContent side="top">Insert emoji</TooltipContent>
      </Tooltip>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align="start"
          sideOffset={6}
          className="z-50 overflow-hidden rounded-lg border border-border shadow-lg"
        >
          <EmojiPicker
            className="h-85.5 w-79"
            onEmojiSelect={({ emoji }) => onSelect(emoji)}
          >
            <EmojiPickerSearch placeholder="Search emoji…" />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
