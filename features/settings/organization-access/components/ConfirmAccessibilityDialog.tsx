'use client';

import { AlertTriangle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { OrgAccessibility } from '../types';
import { CONTENT } from '../constant';

// ── Component ──────────────────────────────────────────────────────────────────

interface ConfirmAccessibilityDialogProps {
  open:      boolean;
  target:    OrgAccessibility;
  isPending: boolean;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function ConfirmAccessibilityDialog({
  open,
  target,
  isPending,
  onConfirm,
  onCancel,
}: ConfirmAccessibilityDialogProps) {
  const content = CONTENT[target];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {/* Warning icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base leading-snug">
                {content.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {content.description}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Bullet list ── */}
        <ul className="space-y-2.5 pl-1">
          {content.bullets.map(({ label, text }) => (
            <li key={label} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
              <span>
                <span className="font-semibold text-foreground">{label}</span>{' '}
                <span className="text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* ── Info box ── */}
        <div className="flex items-start gap-2.5 rounded-lg border bg-muted/40 p-3.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {content.info}
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Saving…' : content.confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
