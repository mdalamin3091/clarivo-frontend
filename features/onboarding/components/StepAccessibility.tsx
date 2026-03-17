'use client';

import { Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  {
    id: 'public' as const,
    label: 'Public',
    description: 'Anyone can view your roadmap and submit feedback without logging in.',
    icon: Globe,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    id: 'private' as const,
    label: 'Private',
    description: 'Only invited team members can access your workspace.',
    icon: Lock,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
];

interface Props {
  value: 'public' | 'private' | null;
  onChange: (value: 'public' | 'private') => void;
}

export function StepAccessibility({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Who can access your workspace?
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This controls the default visibility of your boards and content.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ id, label, description, icon: Icon, color, bg }) => {
          const isSelected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                'flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-border/80',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  bg,
                )}
              >
                <Icon className={cn('h-5 w-5', color)} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <span
                    className={cn(
                      'h-4 w-4 rounded-full border-2 transition-all',
                      isSelected ? 'border-primary bg-primary' : 'border-border',
                    )}
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
