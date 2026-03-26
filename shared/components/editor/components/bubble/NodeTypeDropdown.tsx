'use client';

import { useEditor } from 'novel';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Pilcrow, Heading1, Heading2, Heading3, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NODE_TYPES = [
  {
    label: 'Paragraph',
    icon: <Pilcrow className="h-3.5 w-3.5" />,
    isActive: (e: ReturnType<typeof useEditor>['editor']) => e?.isActive('paragraph') ?? false,
    action:   (e: ReturnType<typeof useEditor>['editor']) => e?.chain().focus().setParagraph().run(),
  },
  {
    label: 'Heading 1',
    icon: <Heading1 className="h-3.5 w-3.5" />,
    isActive: (e: ReturnType<typeof useEditor>['editor']) => e?.isActive('heading', { level: 1 }) ?? false,
    action:   (e: ReturnType<typeof useEditor>['editor']) => e?.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: 'Heading 2',
    icon: <Heading2 className="h-3.5 w-3.5" />,
    isActive: (e: ReturnType<typeof useEditor>['editor']) => e?.isActive('heading', { level: 2 }) ?? false,
    action:   (e: ReturnType<typeof useEditor>['editor']) => e?.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Heading 3',
    icon: <Heading3 className="h-3.5 w-3.5" />,
    isActive: (e: ReturnType<typeof useEditor>['editor']) => e?.isActive('heading', { level: 3 }) ?? false,
    action:   (e: ReturnType<typeof useEditor>['editor']) => e?.chain().focus().toggleHeading({ level: 3 }).run(),
  },
] as const;

export function NodeTypeDropdown() {
  const { editor } = useEditor();
  if (!editor) return null;

  const currentLabel =
    editor.isActive('heading', { level: 1 }) ? 'H1'
    : editor.isActive('heading', { level: 2 }) ? 'H2'
    : editor.isActive('heading', { level: 3 }) ? 'H3'
    : '¶';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          title="Text style"
          className="flex cursor-pointer items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {currentLabel}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="bottom"
        align="start"
        sideOffset={6}
        className="z-9999 min-w-35 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md"
      >
        {NODE_TYPES.map((type) => (
          <DropdownMenu.Item
            key={type.label}
            onSelect={() => type.action(editor)}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none transition-colors',
              'text-muted-foreground hover:bg-accent hover:text-foreground',
              type.isActive(editor) && 'bg-accent text-foreground',
            )}
          >
            {type.icon}
            {type.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
