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
import { useCustomFieldsStore }  from '../store';
import { useDeleteCustomField }  from '../hooks/useDeleteCustomField';
import { TYPE_META }             from '../constants';
import type { CustomField } from '../types';

interface Props {
  field:            CustomField;
  dragHandleRef?:   (el: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export function CustomFieldRow({ field, dragHandleRef, dragHandleProps }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const openEditDialog = useCustomFieldsStore((s) => s.openEditDialog);
  const { mutate: del, isPending: deleting } = useDeleteCustomField();

  const { label, Icon } = TYPE_META[field.type];

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

        {/* Type badge */}
        <span className="flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          <Icon className="h-3 w-3" />
          {label}
        </span>

        {/* Name */}
        <span className="flex-1 truncate text-sm font-medium text-foreground">{field.name}</span>

        {/* Badges */}
        <div className="flex shrink-0 items-center gap-1.5">
          {field.isRequired && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Required
            </span>
          )}
          {field.isPrivate && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Private
            </span>
          )}
          {field.showAnswerToEveryone && (
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
              Public answer
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => openEditDialog(field)}
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
              : <Trash2  className="h-3.5 w-3.5" />}
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{field.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this custom field. Any values saved against this field
              on existing posts will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { del(field.id); setConfirmOpen(false); }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
