'use client';

import { StatusRow } from './StatusRow';
import type { Status } from '../types';

interface Props {
  status:          Status;
  dragHandleRef:   (el: HTMLElement | null) => void;
  dragHandleProps: React.HTMLAttributes<HTMLElement>;
}

export function SortableStatusItem({ status, dragHandleRef, dragHandleProps }: Props) {
  return (
    <StatusRow
      status={status}
      dragHandleRef={dragHandleRef}
      dragHandleProps={dragHandleProps}
    />
  );
}
