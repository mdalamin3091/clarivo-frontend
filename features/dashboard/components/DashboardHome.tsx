'use client';

import { Zap } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { DashboardStats } from './DashboardStats';
import { DashboardQuickActions } from './DashboardQuickActions';

export function DashboardHome() {
  const { data: session } = useSession();
  const firstName = session?.user.name?.split(' ')[0] ?? 'there';

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">

      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Welcome back, {firstName} 👋
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your workspace activity.
        </p>
      </div>

      <DashboardStats />

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Get started</h3>
        </div>
        <DashboardQuickActions />
      </div>

    </div>
  );
}
