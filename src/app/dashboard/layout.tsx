import { ReactNode } from 'react';

import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLyout';

export default async function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
