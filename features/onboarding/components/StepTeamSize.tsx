'use client';

import { User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIZES = [
  { id: '1', label: 'Just me', sub: 'Solo founder', icon: User },
  { id: '2-10', label: '2 – 10', sub: 'Small team', icon: Users },
  { id: '11-50', label: '11 – 50', sub: 'Growing team', icon: Users },
  { id: '51-200', label: '51 – 200', sub: 'Mid-size', icon: Users },
  { id: '201+', label: '201+', sub: 'Enterprise', icon: Users },
];

interface Props {
  value: string;
  onChange: (size: string) => void;
}

export function StepTeamSize({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          How big is your team?
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Helps us tailor the experience for your organization.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {SIZES.map(({ id, label, sub, icon: Icon }) => {
          const isSelected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                'flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-border/80',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                  isSelected ? 'bg-primary/10' : 'bg-muted',
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4',
                    isSelected ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
              <span
                className={cn(
                  'h-4 w-4 shrink-0 rounded-full border-2 transition-all',
                  isSelected ? 'border-primary bg-primary' : 'border-border',
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
