'use client';

import { useEditor } from 'novel';
import { Bold, Italic, Underline, Strikethrough, Code, Code2, Link } from 'lucide-react';
import { BubbleBtn, BubbleDivider } from './BubbleBtn';
import { NodeTypeDropdown } from './NodeTypeDropdown';

// Keyboard shortcut label — shows ⌘ on Mac-like display
const MOD = '⌘';

const MARK_BUTTONS = [
  { key: 'bold',      icon: <Bold className="h-3.5 w-3.5" />,          label: 'Bold',        shortcut: `${MOD}+B`,  toggle: 'toggleBold' },
  { key: 'italic',    icon: <Italic className="h-3.5 w-3.5" />,        label: 'Italic',      shortcut: `${MOD}+I`,  toggle: 'toggleItalic' },
  { key: 'underline', icon: <Underline className="h-3.5 w-3.5" />,     label: 'Underline',   shortcut: `${MOD}+U`,  toggle: 'toggleUnderline' },
  { key: 'strike',    icon: <Strikethrough className="h-3.5 w-3.5" />, label: 'Strikethrough', shortcut: `${MOD}+⇧+X`, toggle: 'toggleStrike' },
  { key: 'code',      icon: <Code className="h-3.5 w-3.5" />,          label: 'Inline code', shortcut: `${MOD}+E`,  toggle: 'toggleCode' },
  { key: 'codeBlock', icon: <Code2 className="h-3.5 w-3.5" />,         label: 'Code block',  shortcut: `${MOD}+⌥+C`, toggle: 'toggleCodeBlock' },
] as const;

export function FormattingRow() {
  const { editor } = useEditor();
  if (!editor) return null;

  return (
    <>
      <NodeTypeDropdown />
      <BubbleDivider />

      {MARK_BUTTONS.map(({ key, icon, label, shortcut, toggle }) => (
        <BubbleBtn
          key={key}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelect={() => (editor.chain().focus() as any)[toggle]().run()}
          active={editor.isActive(key)}
          label={label}
          shortcut={shortcut}
        >
          {icon}
        </BubbleBtn>
      ))}

      <BubbleDivider />

      <BubbleBtn
        onSelect={() => {
          const url = window.prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive('link')}
        label="Link"
        shortcut={`${MOD}+K`}
      >
        <Link className="h-3.5 w-3.5" />
      </BubbleBtn>
    </>
  );
}
