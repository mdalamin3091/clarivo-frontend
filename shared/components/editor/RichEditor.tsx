'use client';

import { useRef } from 'react';
import { EditorRoot, EditorContent, handleCommandNavigation } from 'novel';
import type { EditorInstance } from 'novel';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { buildExtensions } from './editor.config';
import { SlashCommandMenu } from './extensions/slash-command';
import { SelectionBubble } from './components/bubble/SelectionBubble';
import { BottomToolbar } from './components/BottomToolbar';
import type { RichEditorProps } from './editor.types';
import { uploadEditorImage } from './utils/uploadAsset';

export function RichEditor({
  value,
  onChange,
  placeholder = "Write something, or type '/' for commands…",
  className,
  editable = true,
  onAttach,
  onImageInsert,
}: RichEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extensions = buildExtensions(placeholder) as any[];
  const editorRef = useRef<EditorInstance | null>(null);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card',
        className,
      )}
    >
      <EditorRoot>
        <EditorContent
          initialContent={value}
          extensions={extensions}
          editable={editable}
          className="flex-1"
          onCreate={({ editor }) => {
            editorRef.current = editor;
          }}
          editorProps={{
            handleKeyDown: (_view: unknown, event: KeyboardEvent) =>
              handleCommandNavigation(event) ?? false,
            handlePaste: (_view: unknown, event: ClipboardEvent) => {
              const items = Array.from(event.clipboardData?.items ?? []);
              const imageItem = items.find((item) => item.type.startsWith('image/'));
              if (!imageItem) return false;

              const file = imageItem.getAsFile();
              if (!file) return false;

              // Prevent Tiptap's default paste (which embeds base64)
              uploadEditorImage(file)
                .then((src) => {
                  editorRef.current?.chain().focus().setImage({ src }).run();
                  onImageInsert?.(file);
                })
                .catch(() => {
                  toast.error('Failed to upload pasted image. Please try again.');
                });

              return true;
            },
            attributes: {
              class: [
                'prose prose-sm dark:prose-invert max-w-none',
                'min-h-[120px] px-4 py-3 focus:outline-none',
                '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2',
                '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2',
                '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-1',
                '[&_ul]:pl-5 [&_ul]:my-2 [&_ol]:pl-5 [&_ol]:my-2',
                '[&_li]:my-0.5',
                '[&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-3 [&_pre]:my-3',
                '[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
                '[&_hr]:border-border [&_hr]:my-4',
                '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
                '[&_img]:rounded-md [&_img]:max-w-full',
              ].join(' '),
            },
          }}
          onUpdate={({ editor }) => {
            editorRef.current = editor;
            onChange?.(editor.getJSON());
          }}
        >
          <SlashCommandMenu />
          <SelectionBubble />
          {editable && (
            <BottomToolbar onAttach={onAttach} onImageInsert={onImageInsert} />
          )}
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
