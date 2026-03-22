'use client';

import { TagRow } from './TagRow';
import type { Tag } from '../types';

interface Props {
  tag:             Tag;
  dragHandleRef:   (el: HTMLElement | null) => void;
  dragHandleProps: React.HTMLAttributes<HTMLElement>;
}

export function SortableTagItem({ tag, dragHandleRef, dragHandleProps }: Props) {
  return (
    <TagRow
      tag={tag}
      dragHandleRef={dragHandleRef}
      dragHandleProps={dragHandleProps}
    />
  );
}
