'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/onboarding');
  };

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo size="sm" />

        <div className="flex items-center gap-3">
          {session && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">
                {session.user.name}
              </span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
