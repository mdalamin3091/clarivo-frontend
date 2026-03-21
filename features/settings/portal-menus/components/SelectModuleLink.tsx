'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { ModuleIcon } from './ModuleIcon';
import type { ModulePreset } from '../types';
import { MODULE_PRESETS } from '../constants';

interface SelectModuleLinkProps {
  selectedPreset: ModulePreset;
  onSelect: (preset: ModulePreset) => void;
}

const SelectModuleLink = ({
  selectedPreset,
  onSelect,
}: SelectModuleLinkProps) => {

  return (
    <div className="space-y-1.5 w-fit">
      <Label className="text-xs font-medium text-muted-foreground">Link</Label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-full items-center gap-2 rounded-lg border bg-muted/60 px-3 text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ModuleIcon
              name={selectedPreset.iconName}
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            />
            <span className="flex-1 text-left text-foreground">{selectedPreset.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width]"
        >
          {MODULE_PRESETS.map((preset: ModulePreset) => (
            <DropdownMenuItem
              key={preset.value}
              onClick={() => onSelect(preset)}
              className="gap-2.5"
            >
              <ModuleIcon
                name={preset.iconName}
                className="h-4 w-4 shrink-0 text-muted-foreground"
              />
              {preset.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectModuleLink;
