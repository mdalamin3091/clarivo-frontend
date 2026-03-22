/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableList } from '@/shared/components/ui/SortableList';
import { useBoards } from '../hooks/useBoards';
import { useReorderBoards } from '../hooks/useReorderBoards';
import { SortableBoardItem } from './SortableBoardItem';
import { BoardDialog } from './BoardDialog';
import type { Board } from '../types';

export function BoardList() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: serverBoards, isLoading } = useBoards();
  const { reorder } = useReorderBoards();

  // Local state for optimistic reordering
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (serverBoards) setBoards(serverBoards);
  }, [serverBoards]);

  const handleReorder = (reordered: Board[]) => {
    setBoards(reordered); // optimistic update
    void reorder(reordered);
  };

  return (
    <>
      {/* Section header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Feedback module</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Reorder, customize or remove links (modules) from being displayed from public portal or
            widgets.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="mr-1.5 h-4 w-4" />
          Add board
        </Button>
      </div>

      {/* Board rows */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : boards.length > 0 ? (
        <div className="mt-4">
          <SortableList
            items={boards}
            onReorder={handleReorder}
            className="space-y-2"
            renderItem={(board, dragHandleRef, dragHandleProps) => (
              <SortableBoardItem
                board={board}
                dragHandleRef={dragHandleRef}
                dragHandleProps={dragHandleProps}
              />
            )}
          />
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">No boards yet.</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create your first board
          </Button>
        </div>
      )}

      <BoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
