'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ONBOARDING_MODULES } from '../constants/modules';

interface Props {
  selected: string[];
  onChange: (modules: string[]) => void;
}

export function StepModules({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((m) => m !== id) : [...selected, id]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What do you need?
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Select the modules you want to enable. You can change this later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ONBOARDING_MODULES.map(({ id, label, description, icon: Icon, color, bg }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={cn(
                'relative flex flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-border/80',
              )}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                </span>
              )}
              <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg', bg)}>
                <Icon className={cn('h-5 w-5', color)} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Select at least one module to continue
        </p>
      )}
    </div>
  );
}
