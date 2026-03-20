'use client';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PREDEFINED_ICONS } from '../constants';
import { ModuleIcon } from './ModuleIcon';

interface IconPickerProps {
  value:    string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ModuleIcon name={value} className="h-4 w-4 text-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="grid w-56 grid-cols-6 gap-1 p-2">
        {PREDEFINED_ICONS.map((icon) => (
          <button
            key={icon.name}
            type="button"
            title={icon.label}
            onClick={() => onChange(icon.name)}
            className={cn(
              'flex items-center justify-center rounded p-1.5 transition-colors hover:bg-muted',
              value === icon.name && 'bg-primary/10 text-primary',
            )}
          >
            <ModuleIcon name={icon.name} className="h-4 w-4" />
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
