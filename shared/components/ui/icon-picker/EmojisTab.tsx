'use client';

import type React from 'react';
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from '@/components/ui/emoji-picker';

interface EmojisTabProps {
  onSelect: (emoji: string) => void;
}

export function EmojisTab({ onSelect }: EmojisTabProps) {
  return (
    <EmojiPicker
      className="h-75 w-full rounded-none"
      onEmojiSelect={({ emoji }) => onSelect(emoji)}
    >
      <EmojiPickerSearch
        placeholder="Search emojis..."
        onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
      />
      <EmojiPickerContent />
      <EmojiPickerFooter />
    </EmojiPicker>
  );
}
