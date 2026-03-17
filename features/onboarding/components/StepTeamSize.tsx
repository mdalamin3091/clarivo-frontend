'use client';

import { User, Users } from 'lucide-react';

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
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          How big is your team?
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
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
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isSelected ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-zinc-100 dark:bg-zinc-700'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}
                />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>
              </div>
              <span
                className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                  isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-zinc-300 dark:border-zinc-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
