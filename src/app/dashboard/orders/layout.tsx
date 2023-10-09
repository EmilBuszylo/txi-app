'use client';

import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

import { UseUser } from '@/lib/hooks/useUser';
import { cn } from '@/lib/utils';

import DashboardContent from '@/components/layout/DashboardLayout/DashboardContent/DashboardContent';
import { PageTitle } from '@/components/layout/DashboardLayout/PageTitle';
import TopBar from '@/components/layout/DashboardLayout/TopBar';
import { ButtonLink } from '@/components/ui/button-link';
import { Card } from '@/components/ui/card';

import { Routes } from '@/constant/routes';

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = UseUser();

  const canAddOrder = user?.role !== 'OPERATOR';

  return (
    <>
      <TopBar
        mainContainer={<PageTitle hiddenOn='mobile' />}
        rightContainer={
          canAddOrder ? (
            <ButtonLink
              className={cn(
                'flex w-fit items-center gap-x-2',
                'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                'md:bg-primary md:text-primary-foreground md:hover:bg-primary/90'
              )}
              href={Routes.ORDERS + '/new'}
            >
              Dodaj <Plus />
            </ButtonLink>
          ) : undefined
        }
      />
      <DashboardContent>
        <PageTitle hiddenOn='desktop' />
        <Card className='rounded-none p-6 md:rounded-lg'>{children}</Card>
      </DashboardContent>
    </>
  );
}
