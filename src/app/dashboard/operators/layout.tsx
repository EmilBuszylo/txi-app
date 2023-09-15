'use client';

import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

import DashboardContent from '@/components/layout/DashboardLayout/DashboardContent/DashboardContent';
import { PageTitle } from '@/components/layout/DashboardLayout/PageTitle';
import TopBar from '@/components/layout/DashboardLayout/TopBar';
import { ButtonLink } from '@/components/ui/button-link';
import { Card } from '@/components/ui/card';

import { Routes } from '@/constant/routes';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar
        rightContainer={
          <ButtonLink className='flex w-fit items-center gap-x-2' href={`${Routes.OPERATORS}/new`}>
            Dodaj <Plus />
          </ButtonLink>
        }
        mainContainer={<PageTitle hiddenOn='mobile' />}
      />
      <DashboardContent>
        <PageTitle hiddenOn='desktop' />
        <Card className='p-6'>{children}</Card>
      </DashboardContent>
    </>
  );
}
