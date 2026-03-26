/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import * as chrono from 'chrono-node';
import type { Matcher } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  /** date-fns format string shown on the trigger (default: "MMM d, yyyy") */
  displayFormat?: string;
  /** react-day-picker Matcher — e.g. { before: new Date() } */
  disabled?: Matcher | Matcher[];
  clearable?: boolean;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  triggerClassName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if `date` is blocked by the disabled matcher(s). */
function isDisabledDate(date: Date, disabled?: Matcher | Matcher[]): boolean {
  if (!disabled) return false;
  const matchers = Array.isArray(disabled) ? disabled : [disabled];
  return matchers.some((m) => {
    if (typeof m === 'function') return m(date);
    if (m instanceof Date) return date.toDateString() === m.toDateString();
    if (typeof m === 'object' && 'before' in m && m.before) return date < (m.before as Date);
    if (typeof m === 'object' && 'after' in m && m.after)  return date > (m.after  as Date);
    return false;
  });
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  displayFormat = 'MMM d, yyyy',
  disabled,
  clearable = true,
  align = 'start',
  side = 'bottom',
  triggerClassName,
}: DatePickerProps) {
  const [open, setOpen]           = useState(false);
  const [inputText, setInputText] = useState('');
  const [month, setMonth]         = useState<Date>(value ?? new Date());
  const [pending, setPending]     = useState<Date | undefined>(undefined);
  const inputRef                  = useRef<HTMLInputElement>(null);

  // Sync input text when popover opens (pre-fill with formatted value)
  useEffect(() => {
    if (open) {
      setInputText(value ? format(value, displayFormat) : '');
      setMonth(value ?? new Date());
      setPending(undefined);
      // auto-focus input on next tick
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Parse natural language on every keystroke
  useEffect(() => {
    if (!inputText.trim()) {
      setPending(undefined);
      return;
    }
    const parsed = chrono.parseDate(inputText, new Date(), { forwardDate: true });
    if (parsed && !isDisabledDate(parsed, disabled)) {
      setPending(parsed);
      setMonth(parsed);
    } else {
      setPending(undefined);
    }
  }, [inputText, disabled]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const commit = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    setInputText(format(date, displayFormat));
    commit(date);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (pending) commit(pending);
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setInputText('');
    setPending(undefined);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const hasValue = !!value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5',
            'text-xs font-medium transition-colors hover:bg-accent',
            hasValue ? 'text-foreground border-primary/40' : 'text-muted-foreground',
            triggerClassName,
          )}
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>{hasValue ? format(value, displayFormat) : placeholder}</span>
          {hasValue && clearable && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear date"
              onClick={handleClear}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClear(e as unknown as React.MouseEvent); }}
              className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
            >
              <X className="h-2.5 w-2.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      {/* ── Popover panel ── */}
      <PopoverContent
        side={side}
        align={align}
        sideOffset={6}
        className="w-auto p-0 overflow-hidden rounded-xl border border-border shadow-xl"
        onOpenAutoFocus={(e) => e.preventDefault()} // we handle focus ourselves
      >
        {/* Natural language input */}
        <div className="px-3 pt-3 pb-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder='e.g. "next friday", "in 2 weeks"'
            className={cn(
              'w-full rounded-lg border border-border bg-muted/60 px-3 py-2',
              'text-sm placeholder:text-muted-foreground/60 outline-none',
              'focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all',
              pending && 'border-primary/50 text-foreground',
            )}
          />
          {/* Live parse preview */}
          {pending && (
            <p className="mt-1.5 px-1 text-xs text-primary font-medium">
              → {format(pending, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>

        <div className="border-t border-border/50" />

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={pending ?? value}
          onSelect={handleCalendarSelect}
          month={month}
          onMonthChange={setMonth}
          disabled={disabled}
        />

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-border px-3 py-2">
          <button
            type="button"
            onClick={() => { setInputText(format(new Date(), displayFormat)); setPending(new Date()); setMonth(new Date()); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Today
          </button>
          {(value || pending) && clearable && (
            <button
              type="button"
              onClick={() => commit(undefined)}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear date
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
