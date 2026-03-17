'use client';

import { Globe, Lock } from 'lucide-react';

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
    color: 'text-zinc-500',
    bg: 'bg-zinc-100 dark:bg-zinc-800',
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
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Who can access your workspace?
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
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
              className={`flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600'
              }`}
            >
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>
                  <span
                    className={`h-4 w-4 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}
                  />
                </div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
