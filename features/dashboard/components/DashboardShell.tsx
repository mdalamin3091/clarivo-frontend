'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Plus } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Spinner } from '@/shared/components/ui/Spinner';

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Welcome back, {session.user.name?.split(' ')[0]}.
            </p>
          </div>
          <button
            onClick={() => router.push('/onboarding')}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New workspace
          </button>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <LayoutDashboard className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Your workspace is ready
          </h3>
          <p className="mt-2 max-w-xs text-center text-sm text-zinc-500 dark:text-zinc-400">
            Start by exploring your modules — feedback, roadmap, changelog, and surveys.
          </p>
        </div>
      </main>
    </div>
  );
}
