'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

// ── Generic sortable item wrapper ─────────────────────────────────────────────

interface SortableItemProps<T extends { id: string }> {
  item:       T;
  renderItem: SortableListProps<T>['renderItem'];
}

function SortableItem<T extends { id: string }>({ item, renderItem }: SortableItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform:  CSS.Transform.toString(transform),
        transition,
        opacity:    isDragging ? 0.5 : 1,
        zIndex:     isDragging ? 10 : undefined,
      }}
    >
      {renderItem(
        item,
        setActivatorNodeRef,
        { ...attributes, ...listeners },
        isDragging,
      )}
    </div>
  );
}

// ── SortableList ──────────────────────────────────────────────────────────────

export interface SortableListProps<T extends { id: string }> {
  items:      T[];
  onReorder:  (items: T[]) => void;
  renderItem: (
    item:            T,
    dragHandleRef:   (el: HTMLElement | null) => void,
    dragHandleProps: React.HTMLAttributes<HTMLElement>,
    isDragging:      boolean,
  ) => React.ReactNode;
  className?: string;
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  className,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className={cn('flex flex-col', className)}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} renderItem={renderItem} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
