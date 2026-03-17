'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { checkOrgName } from '../api';
import { queryKeys } from '@/lib/query-keys';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface Props {
  value: string;
  onChange: (name: string) => void;
  onAvailabilityChange: (available: boolean) => void;
}

export function StepOrgName({ value, onChange, onAvailabilityChange }: Props) {
  const debouncedName = useDebounce(value.trim(), 600);

  const { data, isFetching, isError } = useQuery({
    queryKey: queryKeys.organizations.checkName(debouncedName),
    queryFn: () => checkOrgName(debouncedName),
    enabled: debouncedName.length >= 2,
    staleTime: 10_000,
  });

  const isChecking = isFetching || (debouncedName !== value.trim() && value.trim().length >= 2);
  const isAvailable = !isChecking && data?.available === true && !isError;
  const isTaken = !isChecking && data?.available === false;

  useEffect(() => {
    onAvailabilityChange(isAvailable);
  }, [isAvailable, onAvailabilityChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Name your workspace
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          This is how your organization will appear to your team and users.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="org-name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Workspace name
        </label>
        <div className="relative">
          <input
            id="org-name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Acme Corp"
            autoFocus
            autoComplete="off"
            className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 ${
              isTaken
                ? 'border-red-400 pr-10 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/40'
                : isAvailable
                  ? 'border-emerald-400 pr-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900/40'
                  : 'border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-600 dark:focus:ring-indigo-900/40'
            }`}
          />
          {value.trim().length >= 2 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              ) : isAvailable ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : isTaken ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : null}
            </span>
          )}
        </div>

        <div className="min-h-5">
          {value.trim().length >= 2 && !isChecking && (
            <p
              className={`animate-fade-in text-xs ${
                isAvailable
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isTaken
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-zinc-400'
              }`}
            >
              {isAvailable && `"${value.trim()}" is available`}
              {isTaken && `"${value.trim()}" is already taken`}
              {isError && 'Could not check availability'}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/60">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          A URL-friendly slug will be generated automatically from your workspace name.
        </p>
        {value.trim().length >= 2 && (
          <p className="mt-1.5 font-mono text-xs text-zinc-600 dark:text-zinc-300">
            clarivo.app/
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {value
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
