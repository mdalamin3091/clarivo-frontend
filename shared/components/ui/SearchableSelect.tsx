/* eslint-disable jsx-a11y/role-has-required-aria-props */
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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  /** CSS color string rendered as a dot indicator (e.g. '#22c55e') */
  color?: string;
  /** Icon element rendered instead of the color dot */
  icon?: React.ReactNode;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  /** Controlled selected value. null / undefined = nothing selected. */
  value?: string | null;
  onChange: (value: string | null) => void;
  /** Trigger button text when nothing is selected */
  placeholder?: string;
  /** Command input placeholder */
  searchPlaceholder?: string;
  /** Replace the default pill trigger entirely */
  trigger?: React.ReactNode;
  /** Clicking the already-selected item clears the selection (default true) */
  clearable?: boolean;
  /** Extra classes on the default trigger button */
  triggerClassName?: string;
  /** Popover alignment relative to trigger */
  align?: 'start' | 'center' | 'end';
  /** Popover side relative to trigger */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Min-width of the dropdown panel (default 200) */
  minWidth?: number;
}

// ─── ColorDot ─────────────────────────────────────────────────────────────────

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

// ─── SearchableSelect ─────────────────────────────────────────────────────────

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

  // ── Default trigger ──────────────────────────────────────────────────────────
  const defaultTrigger = (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      className={cn(
        'flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5',
        'text-xs font-medium text-foreground transition-colors hover:bg-accent',
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
      <PopoverTrigger asChild>
        {trigger ?? defaultTrigger}
      </PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        sideOffset={6}
        style={{ minWidth, width: 'auto', padding: 0 }}
        className="overflow-hidden rounded-xl border border-border p-0 shadow-xl"
      >
        <Command>
          {/* Search input — cmdk handles focus automatically */}
          <CommandInput placeholder={searchPlaceholder} autoFocus />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}   // cmdk filters on this string
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer gap-2.5 px-3 py-2 text-sm text-muted-foreground"
                  >
                    {/* Dot or icon */}
                    {option.icon ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        {option.icon}
                      </span>
                    ) : option.color ? (
                      <ColorDot color={option.color} />
                    ) : null}

                    <span className="flex-1">{option.label}</span>

                    {/* Checkmark */}
                    <Check
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 text-primary transition-opacity',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
