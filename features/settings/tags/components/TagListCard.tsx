'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableList } from '@/shared/components/ui/SortableList';
import { useTags }        from '../hooks/useTags';
import { useReorderTags } from '../hooks/useReorderTags';
import { useTagsStore }   from '../store';
import { SortableTagItem } from './SortableTagItem';
import { TagDialog }       from './TagDialog';
import type { Tag } from '../types';

export function TagListCard() {
  const { isLoading } = useTags(); // fetches + syncs into store
  const { tags, openCreateDialog } = useTagsStore();
  const { reorder } = useReorderTags();

  // Local state for optimistic reordering
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const handleReorder = (reordered: Tag[]) => {
    setLocalTags(reordered);
    void reorder(reordered);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : localTags.length > 0 ? (
        <SortableList
          items={localTags}
          onReorder={handleReorder}
          className="space-y-2"
          renderItem={(tag, dragHandleRef, dragHandleProps) => (
            <SortableTagItem
              tag={tag}
              dragHandleRef={dragHandleRef}
              dragHandleProps={dragHandleProps}
            />
          )}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">No tags yet.</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={openCreateDialog}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add your first tag
          </Button>
        </div>
      )}

      {/* Dialog lives here — reads all state from store */}
      <TagDialog />
    </div>
  );
}
