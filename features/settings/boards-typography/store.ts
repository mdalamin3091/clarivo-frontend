'use client';

import { create } from 'zustand';
import type { Board } from './types';

interface BoardsStore {
  boards:       Board[];
  dialogOpen:   boolean;
  editingBoard: Board | null;

  setBoards:        (boards: Board[]) => void;
  openCreateDialog: () => void;
  openEditDialog:   (board: Board) => void;
  closeDialog:      () => void;

  addBoard:    (board: Board) => void;
  patchBoard:  (id: string, patch: Partial<Board>) => void;
  removeBoard: (id: string) => void;
}

export const useBoardsStore = create<BoardsStore>((set) => ({
  boards:       [],
  dialogOpen:   false,
  editingBoard: null,

  setBoards:        (boards) => set({ boards }),
  openCreateDialog: ()       => set({ dialogOpen: true, editingBoard: null }),
  openEditDialog:   (board)  => set({ dialogOpen: true, editingBoard: board }),
  closeDialog:      ()       => set({ dialogOpen: false, editingBoard: null }),

  addBoard:    (board)        => set((s) => ({ boards: [...s.boards, board] })),
  patchBoard:  (id, patch)    => set((s) => ({
    boards: s.boards.map((b) => (b.id === id ? { ...b, ...patch } : b)),
  })),
  removeBoard: (id)           => set((s) => ({ boards: s.boards.filter((b) => b.id !== id) })),
}));
