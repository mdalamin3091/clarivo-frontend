'use client';

import { useRef } from 'react';
import { useEditor } from 'novel';
import { Bold, Italic, List, Link, ImageIcon, Video, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EmojiButton } from './EmojiButton';
import { toast } from 'sonner';
import { uploadEditorImage, uploadEditorFile } from '../utils/uploadAsset';

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  label: string;
  shortcut?: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, label, shortcut, children }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded transition-colors',
            'text-muted-foreground hover:bg-accent hover:text-foreground',
            active && 'bg-accent text-foreground',
          )}
        >
          {children}
        </button>
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

interface BottomToolbarProps {
  onAttach?: (file: File) => void;
  onImageInsert?: (file: File) => void;
}

export function BottomToolbar({ onAttach, onImageInsert }: BottomToolbarProps) {
  const { editor } = useEditor();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex items-center gap-0.5 py-1.5">
        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            e.target.value = '';
            try {
              const src = await uploadEditorImage(file);
              editor.chain().focus().setImage({ src }).run();
              onImageInsert?.(file);
            } catch {
              toast.error('Failed to upload image. Please try again.');
            }
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            e.target.value = '';
            try {
              await uploadEditorFile(file);
              onAttach?.(file);
            } catch {
              toast.error('Failed to upload file. Please try again.');
            }
          }}
        />

        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          label="Insert image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label="Bold"
          shortcut="⌘+B"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label="Italic"
          shortcut="⌘+I"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          label="Bullet list"
          shortcut="⌘+⇧+8"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive('link')}
          label="Insert link"
          shortcut="⌘+K"
        >
          <Link className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter YouTube URL');
            if (url) editor.commands.setYoutubeVideo({ src: url });
          }}
          label="Insert video"
        >
          <Video className="h-4 w-4" />
        </ToolbarButton>

        <EmojiButton
          onSelect={(emoji) => editor.chain().focus().insertContent(emoji).run()}
        />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
}
