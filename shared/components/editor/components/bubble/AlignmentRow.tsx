'use client';

import { useEditor } from 'novel';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { BubbleBtn } from './BubbleBtn';

const ALIGN_ITEMS = [
  { value: 'left',    icon: <AlignLeft className="h-3.5 w-3.5" />,    label: 'Align left',   shortcut: '⌘+⇧+L' },
  { value: 'center',  icon: <AlignCenter className="h-3.5 w-3.5" />,  label: 'Align center', shortcut: '⌘+⇧+E' },
  { value: 'right',   icon: <AlignRight className="h-3.5 w-3.5" />,   label: 'Align right',  shortcut: '⌘+⇧+R' },
] as const;

export function AlignmentRow() {
  const { editor } = useEditor();
  if (!editor) return null;

  return (
    <>
      {ALIGN_ITEMS.map(({ value, icon, label, shortcut }) => (
        <BubbleBtn
          key={value}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelect={() => (editor.chain().focus() as any).setTextAlign(value).run()}
          active={editor.isActive({ textAlign: value })}
          label={label}
          shortcut={shortcut}
        >
          {icon}
        </BubbleBtn>
      ))}
    </>
  );
}
