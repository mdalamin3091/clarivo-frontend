'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const STATUS_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#64748b', // slate
] as const;

interface ColorSwatchPickerProps {
  value:    string;
  onChange: (color: string) => void;
}

export function ColorSwatchPicker({ value, onChange }: ColorSwatchPickerProps) {
  return (
    <div className="flex flex-wrap justify-between">
      {STATUS_COLORS.map(color => {
        const isSelected = value === color;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-md transition-all hover:scale-105',
              isSelected && 'scale-105',
            )}
            style={{ backgroundColor: color, ...(isSelected ? { outlineColor: color } : {}) }}
            aria-label={color}
            aria-pressed={isSelected}
          >
            {isSelected && (
              <Check className="h-4 w-4 text-white drop-shadow-sm" strokeWidth={3} />
            )}
          </button>
        );
      })}
    </div>
  );
}
