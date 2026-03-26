'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  /** CSS color for the dot indicator (e.g. '#22c55e') */
  color?: string;
  /** Icon rendered instead of the color dot */
  icon?: React.ReactNode;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  /** Controlled selected value. null / undefined = nothing selected. */
  value?: string | null;
  onChange: (value: string | null) => void;
  /** Trigger button text when nothing is selected */
  placeholder?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Replaces the default pill trigger */
  trigger?: React.ReactNode;
  /** Re-clicking the selected item deselects it (default: true) */
  clearable?: boolean;
  /** Extra classes on the default trigger button */
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Min-width of the dropdown panel in px (default: 200) */
  minWidth?: number;
}

// ─── Shared Primitives ────────────────────────────────────────────────────────

export function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

// ─── SearchableSelect (single) ────────────────────────────────────────────────

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  trigger,
  clearable = true,
  triggerClassName,
  align = 'start',
  side = 'bottom',
  minWidth = 200,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value) ?? null;

  const handleSelect = (optionValue: string) => {
    if (clearable && optionValue === value) {
      onChange(null);
    } else {
      onChange(optionValue);
    }
    setOpen(false);
  };

  const defaultTrigger = (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls="searchable-select-list"
      className={cn(
        'flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5',
        'text-xs font-medium text-foreground transition-colors hover:bg-accent',
        selected && 'border-primary/40',
        triggerClassName,
      )}
    >
      {selected?.icon ? (
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
          {selected.icon}
        </span>
      ) : selected?.color ? (
        <ColorDot color={selected.color} />
      ) : null}
      <span>{selected?.label ?? placeholder}</span>
      <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
    </button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger ?? defaultTrigger}</PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        sideOffset={6}
        style={{ minWidth, width: 'auto', padding: 0 }}
        className="overflow-hidden rounded-xl border border-border p-0 shadow-xl"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} autoFocus />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer gap-2.5 px-3 py-2 text-sm text-muted-foreground"
                >
                  {option.icon ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {option.icon}
                    </span>
                  ) : option.color ? (
                    <ColorDot color={option.color} />
                  ) : null}
                  <span className="flex-1">{option.label}</span>
                  <Check
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 text-primary transition-opacity',
                      option.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
