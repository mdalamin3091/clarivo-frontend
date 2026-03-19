'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

type ThemeOption = 'light' | 'dark' | 'system';

const OPTIONS: { value: ThemeOption; icon: React.ElementType; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-8 rounded-lg" />;
  }

  const isDark = resolvedTheme === 'dark';

  // Cycle: light → dark → system → light
  const cycle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];
  const Icon = current.icon;

  return (
    <button
      onClick={cycle}
      title={`Theme: ${current.label} — click to switch`}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-4 w-4" />
      ) : theme === 'system' ? (
        <Monitor className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
