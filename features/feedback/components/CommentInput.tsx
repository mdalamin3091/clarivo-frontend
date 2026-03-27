'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import type { JSONContent } from 'novel';
import { RichEditor } from '@/shared/components/editor';
import { cn } from '@/lib/utils';

interface CommentInputProps {
  onSubmit:      (content: JSONContent) => void;
  onCancel?:     () => void;
  isLoading?:    boolean;
  placeholder?:  string;
  initialValue?: JSONContent;
  submitLabel?:  string;
}

export function CommentInput({
  onSubmit,
  onCancel,
  isLoading   = false,
  placeholder = 'Write a comment…',
  initialValue,
  submitLabel = 'Comment',
}: CommentInputProps) {
  const [content, setContent] = useState<JSONContent | undefined>(initialValue);

  const hasContent = !!content;

  const handleSubmit = () => {
    if (!content || isLoading) return;
    onSubmit(content);
    if (!initialValue) setContent(undefined);
  };

  return (
    <div className="space-y-2">
      <RichEditor
        key={initialValue ? JSON.stringify(initialValue).slice(0, 32) : 'new'}
        value={content}
        onChange={setContent}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-muted/20 [&_.ProseMirror]:!min-h-[52px] [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 text-sm"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasContent || isLoading}
          className={cn(
            'flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground',
            'transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          <Send className="h-3 w-3" />
          {isLoading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </div>
  );
}
