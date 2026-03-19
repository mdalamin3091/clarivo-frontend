import { Loader2 } from 'lucide-react';

/**
 * Shared full-area loading spinner.
 * Used by route loading.tsx segments and Suspense fallbacks.
 */
export function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}
