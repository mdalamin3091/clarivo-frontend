'use client';

import { BoardCard } from './BoardCard';
import type { Board } from '../types';

// SortableBoardItem is rendered inside SortableList which handles useSortable.
// It receives drag handle refs from SortableList's renderItem and passes them
// down to BoardCard.

interface Props {
  board:           Board;
  dragHandleRef:   (el: HTMLElement | null) => void;
  dragHandleProps: React.HTMLAttributes<HTMLElement>;
}

export function SortableBoardItem({ board, dragHandleRef, dragHandleProps }: Props) {
  return (
    <BoardCard
      board={board}
      dragHandleRef={dragHandleRef}
      dragHandleProps={dragHandleProps}
    />
  );
}
