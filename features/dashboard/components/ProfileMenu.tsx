'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from '@/lib/auth-client';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ProfileMenu() {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    // Flag sign-out so the sign-in page skips its auto-redirect.
    // The better-auth session atom clears asynchronously (10ms setTimeout
    // after signOut resolves), so without this flag the sign-in page would
    // see the stale in-memory session and redirect back to /org-select.
    sessionStorage.setItem('just-signed-out', '1');
    router.replace('/signin');
  };

  const initial = session?.user.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <div ref={ref} className="relative mt-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
          >
            {initial}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{session?.user.name ?? 'Profile'}</p>
          <p className="text-muted-foreground">{session?.user.email}</p>
        </TooltipContent>
      </Tooltip>

      {open && (
        <div className="absolute bottom-0 left-full ml-3 w-56 rounded-xl border bg-popover shadow-xl">
          <div className="border-b px-3 py-3">
            <p className="text-sm font-semibold text-foreground">{session?.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session?.user.email}</p>
          </div>
          <div className="p-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
