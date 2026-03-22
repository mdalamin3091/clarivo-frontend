'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableList } from '@/shared/components/ui/SortableList';
import { useBoards }        from '../hooks/useBoards';
import { useReorderBoards } from '../hooks/useReorderBoards';
import { useBoardsStore }   from '../store';
import { SortableBoardItem } from './SortableBoardItem';
import { BoardDialog }       from './BoardDialog';
import type { Board } from '../types';

export function BoardList() {
  const { isLoading } = useBoards(); // fetches + syncs into store
  const { boards, openCreateDialog } = useBoardsStore();
  const { reorder } = useReorderBoards();

  // Local state for optimistic reordering
  const [localBoards, setLocalBoards] = useState<Board[]>([]);

  useEffect(() => {
    setLocalBoards(boards);
  }, [boards]);

  const handleReorder = (reordered: Board[]) => {
    setLocalBoards(reordered);
    void reorder(reordered);
  };

  return (
    <>
      {/* Board rows */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : localBoards.length > 0 ? (
        <div>
          <SortableList
            items={localBoards}
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
          <Button variant="ghost" size="sm" className="mt-2" onClick={openCreateDialog}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create your first board
          </Button>
        </div>
      )}

      {/* Dialog lives here — reads all state from store */}
      <BoardDialog />
    </>
  );
}
