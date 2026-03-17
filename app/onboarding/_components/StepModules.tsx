'use client';

import { MessageSquare, BarChart2, BookOpen, ClipboardList, Check } from 'lucide-react';

const MODULES = [
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Collect and prioritize feature requests from users',
    icon: MessageSquare,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    description: 'Plan and communicate your product direction',
    icon: BarChart2,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
  },
  {
    id: 'changelog',
    label: 'Changelog',
    description: 'Keep users informed about what\'s new',
    icon: BookOpen,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    id: 'survey',
    label: 'Surveys',
    description: 'Gather structured feedback with custom forms',
    icon: ClipboardList,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
  },
];

interface Props {
  selected: string[];
  onChange: (modules: string[]) => void;
}

export function StepModules({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((m) => m !== id) : [...selected, id],
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          What do you need?
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Select the modules you want to enable. You can change this later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MODULES.map(({ id, label, description, icon: Icon, color, bg }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`relative flex flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600'
              }`}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              )}
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          Select at least one module to continue
        </p>
      )}
    </div>
  );
}
