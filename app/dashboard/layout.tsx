import { DashboardClient } from './_components/DashboardClient';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClient>{children}</DashboardClient>;
}
