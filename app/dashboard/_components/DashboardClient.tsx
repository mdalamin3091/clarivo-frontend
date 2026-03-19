'use client';

import { DashboardShell } from '@/features/dashboard';

export function DashboardClient({ children }: { children?: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
