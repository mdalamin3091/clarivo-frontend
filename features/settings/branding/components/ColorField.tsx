'use client';

import { type ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidHex } from '../utils/branding';

interface ColorFieldProps {
  label:        string;
  description?: string;
  value:        string | null;
  onChange:     (val: string | null) => void;
}

/**
 * Composite color-picker field: colour swatch + hex text input in sync.
 *
 * SRP  — renders one colour field; owns only the draft-text intermediate state.
 * SoC  — validation logic delegated to isValidHex (utils/branding.ts).
 *
 * No useEffect for prop-sync. The parent must pass key={org?.id} so this
 * component remounts when the form resets, re-initialising useState from
 * the fresh prop value without causing cascading renders.
 */
export function ColorField({ label, description, value, onChange }: ColorFieldProps) {
  // Internal draft state: allows partial hex typing without corrupting the
  // committed RHF value. Initialised once from prop at mount.
  const [hex, setHex] = useState(value ?? '#000000');

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHex(raw);
    if (isValidHex(raw)) onChange(raw);
  };

  const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHex(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="flex items-center gap-2">
        {/* Native colour picker hidden behind a styled swatch */}
        <Label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full border">
          <span
            className="block h-full w-full rounded-full"
            style={{ background: isValidHex(hex) ? hex : '#000000' }}
          />
          <input
            type="color"
            value={isValidHex(hex) ? hex : '#000000'}
            onChange={handlePickerChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </Label>

        <Input
          type="text"
          value={hex}
          onChange={handleHexChange}
          maxLength={7}
          placeholder="#000000"
          className="font-mono"
        />
      </div>
    </div>
  );
}
