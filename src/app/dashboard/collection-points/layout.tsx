'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import DashboardContent from '@/components/layout/DashboardLayout/DashboardContent/DashboardContent';
import { PageGroupsTitle } from '@/components/layout/DashboardLayout/PageGroupsTitle';
import { PageTitle } from '@/components/layout/DashboardLayout/PageTitle';
import TopBar from '@/components/layout/DashboardLayout/TopBar';
import { Card } from '@/components/ui/card';
import UnstyledLink from '@/components/ui/UstyledLink';

import { Routes } from '@/constant/routes';

const COLLECTION_POINTS_PAGES = [
  {
    label: 'Lista',
    href: Routes.COLLECTION_POINTS,
  },
  {
    label: 'Dodaj',
    href: `${Routes.COLLECTION_POINTS}/new`,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <TopBar leftContainer={<PageGroupsTitle />} mainContainer={<PageTitle />} />
      <DashboardContent
        sidebar={
          <ul className='space-y-0.5 py-1'>
            {COLLECTION_POINTS_PAGES.map((driver) => (
              <li key={driver.label}>
                <UnstyledLink
                  href={driver.href}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between px-1 focus:outline-none focus-visible:ring-0',
                    {
                      'text-blue-500': pathname === driver.href,
                    }
                  )}
                >
                  <span className='flex w-full items-center gap-x-2 rounded px-2 py-3 group-hover:bg-gray-900/5 group-focus-visible:bg-gray-900/10 group-active:bg-gray-900/10'>
                    {/*<DesktopIcon className='h-5 w-5' />*/}
                    <p>{driver.label}</p>
                  </span>
                </UnstyledLink>
              </li>
            ))}
          </ul>
        }
      >
        <Card className='p-6'>{children}</Card>
      </DashboardContent>
    </>
  );
}
