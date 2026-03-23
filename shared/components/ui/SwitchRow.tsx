'use client';

import { Switch } from '@/components/ui/switch';

interface SwitchRowProps {
  checked:     boolean;
  onChange:    (checked: boolean) => void;
  label:       string;
  description: string;
}

export function SwitchRow({ checked, onChange, label, description }: SwitchRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 rounded-lg border border-border bg-muted/20 px-4 py-3.5">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </div>
  );
}
