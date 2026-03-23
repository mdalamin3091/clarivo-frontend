'use client';

import { useState } from 'react';
import { GripVertical, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useTagsStore } from '../store';
import { useDeleteTag }  from '../hooks/useDeleteTag';
import type { Tag } from '../types';

interface Props {
  tag:             Tag;
  dragHandleRef?:  (el: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export function TagRow({ tag, dragHandleRef, dragHandleProps }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const openEditDialog = useTagsStore((s) => s.openEditDialog);
  const { mutate: del, isPending: deleting } = useDeleteTag();

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
          style={{ backgroundColor: tag.color }}
        />

        {/* Name */}
        <span className="flex-1 text-sm font-medium text-foreground">{tag.name}</span>

        {/* Private badge */}
        {tag.isPrivate && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Private
          </span>
        )}

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => openEditDialog(tag)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
          >
            {deleting
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Trash2 className="h-3.5 w-3.5" />}
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{tag.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this tag. Posts using this tag will be unaffected but
              will no longer have a matching tag label.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { del(tag.id); setConfirmOpen(false); }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
