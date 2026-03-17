'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Plus } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Button } from '@/components/ui/button';

export function DashboardShell() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/onboarding');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, {session.user.name?.split(' ')[0]}.
            </p>
          </div>
          <Button onClick={() => router.push('/onboarding')}>
            <Plus className="h-4 w-4" />
            New workspace
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <LayoutDashboard className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Your workspace is ready
          </h3>
          <p className="mt-2 max-w-xs text-center text-sm text-muted-foreground">
            Start by exploring your modules — feedback, roadmap, changelog, and surveys.
          </p>
        </div>
      </main>
    </div>
  );
}
