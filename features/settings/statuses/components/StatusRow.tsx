'use client';

import { useState } from 'react';
import { GripVertical, Pencil, Trash2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useStatusesStore }    from '../store';
import { useDeleteStatus }     from '../hooks/useDeleteStatus';
import { useSetDefaultStatus } from '../hooks/useSetDefaultStatus';
import type { Status } from '../types';

interface Props {
  status:           Status;
  dragHandleRef?:   (el: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export function StatusRow({ status, dragHandleRef, dragHandleProps }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const openEditDialog = useStatusesStore((s) => s.openEditDialog);

  const { mutate: del,        isPending: deleting    } = useDeleteStatus();
  const { mutate: setDefault, isPending: settingDefault } = useSetDefaultStatus();

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        {/* Drag handle */}
        {dragHandleRef && (
          <span
            ref={dragHandleRef}
            {...dragHandleProps}
            className="cursor-grab text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </span>
        )}

        {/* Color dot */}
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: status.color }}
        />

        {/* Name */}
        <span className="flex-1 text-sm font-medium text-foreground">{status.name}</span>

        {/* Default badge */}
        {status.isDefault && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Default
          </span>
        )}

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Set default */}
          {!status.isDefault && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                    onClick={() => setDefault(status.id)}
                    disabled={settingDefault}
                  >
                    {settingDefault
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Star className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Set as default</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Edit */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => openEditDialog(status)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>

          {/* Delete */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-destructive disabled:opacity-40"
                    onClick={() => setConfirmOpen(true)}
                    disabled={status.isDefault || deleting}
                  >
                    {deleting
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />}
                    <span className="text-xs">Delete</span>
                  </Button>
                </span>
              </TooltipTrigger>
              {status.isDefault && (
                <TooltipContent side="top">
                  Set another status as default before deleting
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{status.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this status. Posts with this status will be unaffected
              but will no longer have a matching status label.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { del(status.id); setConfirmOpen(false); }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
