'use client';

import { useState } from 'react';
import { Settings, X, Loader2, GripVertical } from 'lucide-react';
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
import { useDeleteBoard } from '../hooks/useDeleteBoard';
import { BoardIconDisplay } from './BoardIconDisplay';
import { BoardDialog } from './BoardDialog';
import type { Board } from '../types';

interface Props {
  board:            Board;
  dragHandleRef?:   (el: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export function BoardCard({ board, dragHandleRef, dragHandleProps }: Props) {
  const [editOpen,    setEditOpen]    = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: del, isPending } = useDeleteBoard();

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
        {/* Drag handle */}
        {dragHandleRef && (
          <span
            ref={dragHandleRef}
            {...dragHandleProps}
            className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing shrink-0"
          >
            <GripVertical className="h-4 w-4" />
          </span>
        )}

        {/* Icon + name */}
        <div className="flex flex-1 items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <BoardIconDisplay icon={board.icon} />
          </div>
          <span className="truncate text-sm font-medium text-foreground">{board.name}</span>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">

          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => setEditOpen(true)}
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </div>

      {/* Edit dialog */}
      <BoardDialog open={editOpen} onOpenChange={setEditOpen} board={board} />

      {/* Delete confirm */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{board.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this board and all its posts. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => del(board.id)}
            >
              Delete board
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
