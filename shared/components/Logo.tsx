import { Sparkles } from 'lucide-react';

const sizes = {
  sm: { box: 'h-8 w-8 rounded-lg', icon: 'h-4 w-4', text: 'text-base' },
  md: { box: 'h-9 w-9 rounded-xl', icon: 'h-5 w-5', text: 'text-xl' },
};

interface Props {
  size?: 'sm' | 'md';
}

export function Logo({ size = 'md' }: Props) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex items-center justify-center bg-indigo-600 ${s.box}`}>
        <Sparkles className={`text-white ${s.icon}`} />
      </div>
      <span className={`font-bold tracking-tight text-zinc-900 dark:text-zinc-50 ${s.text}`}>
        Clarivo
      </span>
    </div>
  );
}
