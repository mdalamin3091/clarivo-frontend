'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDrawerNavigation } from '../../hooks/useDrawerNavigation';

export function DrawerNavBar() {
  const { currentIndex, total, prevPost, nextPost, goPrev, goNext } = useDrawerNavigation();

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3 pr-12">
      <button
        type="button"
        title="Previous post"
        disabled={!prevPost}
        onClick={goPrev}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Next post"
        disabled={!nextPost}
        onClick={goNext}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      {total > 0 && (
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} of {total} posts
        </span>
      )}
    </div>
  );
}
