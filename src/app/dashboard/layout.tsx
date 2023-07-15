import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLyout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
