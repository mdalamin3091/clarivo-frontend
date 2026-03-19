'use client';

import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useCheckOrgName } from '../hooks/useCheckOrgName';

interface Props {
  value: string;
  onChange: (name: string) => void;
  onAvailabilityChange: (available: boolean) => void;
}

export function StepOrgName({ value, onChange, onAvailabilityChange }: Props) {
  const { isChecking, isAvailable, isTaken } = useCheckOrgName(value, onAvailabilityChange);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Name your workspace
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This is how your organization will appear to your team and users.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="org-name" className="text-sm font-medium text-foreground">
          Workspace name
        </Label>
        <div className="relative">
          <Input
            id="org-name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Acme Corp"
            autoFocus
            autoComplete="off"
            className={cn(
              'h-12 rounded-xl border-border/60 bg-background px-4 pr-12 text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
              isTaken && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
              isAvailable && 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20',
            )}
          />
          {value.trim().length >= 2 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : isAvailable ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : isTaken ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : null}
            </span>
          )}
        </div>

        <div className="min-h-5">
          {value.trim().length >= 2 && !isChecking && (
            <p
              className={cn(
                'animate-fade-in text-xs',
                isAvailable && 'text-green-600',
                isTaken && 'text-destructive',
                !isAvailable && !isTaken && 'text-muted-foreground',
              )}
            >
              {isAvailable && `"${value.trim()}" is available`}
              {isTaken && `"${value.trim()}" is already taken`}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-xs text-muted-foreground">
          A URL-friendly slug will be generated automatically from your workspace name.
        </p>
        {value.trim().length >= 2 && (
          <p className="mt-1.5 font-mono text-xs text-foreground">
            clarivo.app/
            <span className="font-semibold text-primary">
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
