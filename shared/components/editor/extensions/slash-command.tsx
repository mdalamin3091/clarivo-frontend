'use client';

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
} from 'novel';
import { SLASH_COMMAND_ITEMS } from '../editor.config';

export function SlashCommandMenu() {
  return (
    <EditorCommand
      className="z-50 h-auto max-h-96 w-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
    >
      <EditorCommandEmpty className="px-3 py-2 text-sm text-muted-foreground">
        No results
      </EditorCommandEmpty>

      <EditorCommandList>
        {SLASH_COMMAND_ITEMS.map((item) => (
          <EditorCommandItem
            key={item.title}
            value={item.title}
            onCommand={(val) => item.command?.(val)}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent aria-selected:bg-accent"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </div>
          </EditorCommandItem>
        ))}
      </EditorCommandList>
    </EditorCommand>
  );
}
