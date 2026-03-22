'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBoards } from '../hooks/useBoards';
import { BoardCard } from './BoardCard';
import { BoardDialog } from './BoardDialog';

export function BoardList() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: boards, isLoading } = useBoards();

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
      ) : boards && boards.length > 0 ? (
        <div className="mt-4 space-y-2">
          {boards.map(board => (
            <BoardCard key={board.id} board={board} />
          ))}
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
