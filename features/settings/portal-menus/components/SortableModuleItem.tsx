'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ModuleItem } from './ModuleItem';

interface SortableModuleItemProps {
  id:        string;
  index:     number;
  fieldId:   string;
  onSave:    () => void;
  onDelete:  () => void;
  isPending: boolean;
}

export function SortableModuleItem({ id, ...props }: SortableModuleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.5 : 1,
    zIndex:     isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ModuleItem
        {...props}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
