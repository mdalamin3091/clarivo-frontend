'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ColorDot, type SelectOption } from './SearchableSelect';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSearchableSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Icon-only trigger shown when nothing is selected */
  trigger?: React.ReactNode;
  /** Tooltip label shown on the icon trigger (only when trigger is provided) */
  tooltip?: string;
  /** Max badges to show before collapsing to +N (default: 2) */
  maxDisplay?: number;
  /** Extra classes on the default badge trigger button */
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Min-width of the dropdown panel in px (default: 200) */
  minWidth?: number;
}

// ─── MultiSearchableSelect ────────────────────────────────────────────────────

export function MultiSearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  trigger,
  tooltip,
  maxDisplay = 0,
  triggerClassName,
  align = 'start',
  side = 'bottom',
  minWidth = 200,
}: MultiSearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOptions = options.filter((o) => value.includes(o.value));

  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
    // keep open for multi-select
  };

  const remove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  // ── Badge trigger (shown when items are selected) ──────────────────────────

  const visibleBadges = selectedOptions.slice(0, maxDisplay);
  const overflow = selectedOptions.length - maxDisplay;

  const badgeTrigger = (
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="listbox"
      className={cn(
        'flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2 py-1.5',
        'text-xs font-medium text-foreground transition-colors hover:bg-accent border-primary/40',
        triggerClassName,
      )}
    >
      <span className="flex items-center gap-1 flex-wrap">
        {visibleBadges.map((opt) => (
          <span
            key={opt.value}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {opt.icon ? (
              <span className="flex h-3 w-3 shrink-0 items-center justify-center">
                {opt.icon}
              </span>
            ) : opt.color ? (
              <ColorDot color={opt.color} />
            ) : null}
            {opt.label}
            <span
              role="button"
              tabIndex={0}
              aria-label={`Remove ${opt.label}`}
              onClick={(e) => remove(opt.value, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(value.filter((v) => v !== opt.value));
                }
              }}
              className="ml-0.5 cursor-pointer rounded-full p-0.5 hover:bg-primary/20"
            >
              <X className="h-2.5 w-2.5" />
            </span>
          </span>
        ))}
        {overflow > 0 && (
          <span className="rounded-full px-1 text-xs font-medium text-muted-foreground">
            +{overflow}
          </span>
        )}
      </span>
    </button>
  );

  // ── Default pill trigger (no custom icon trigger provided) ─────────────────

  const pillTrigger = (
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="listbox"
      className={cn(
        'flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5',
        'text-xs font-medium text-foreground transition-colors hover:bg-accent',
        triggerClassName,
      )}
    >
      <span className="text-muted-foreground">{placeholder}</span>
    </button>
  );

  // ── Dropdown content ───────────────────────────────────────────────────────

  const dropdownContent = (
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
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => toggle(option.value)}
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
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  // Items selected → always show badge trigger (no tooltip needed)
  if (selectedOptions.length > 0) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{badgeTrigger}</PopoverTrigger>
        {dropdownContent}
      </Popover>
    );
  }

  // Custom icon trigger with tooltip
  if (trigger && tooltip) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {dropdownContent}
      </Popover>
    );
  }

  // Custom icon trigger without tooltip
  if (trigger) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        {dropdownContent}
      </Popover>
    );
  }

  // Default pill trigger
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{pillTrigger}</PopoverTrigger>
      {dropdownContent}
    </Popover>
  );
}
