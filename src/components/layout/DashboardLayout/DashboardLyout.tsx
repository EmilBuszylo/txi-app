'use client';

import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import Header from '@/components/layout/DashboardLayout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();

  if (!data?.user) {
    return (
      <div className='relative flex h-full w-full items-center justify-center'>
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white'
          )}
        >
          <Loader2 className='animate-spin' />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='hidden lg:block'>
        <Header user={data.user} />
      </div>

      <div className='lg:pl-20 xl:pl-40'>
        <main className='relative flex h-screen w-full flex-1 flex-col items-stretch bg-gray-50'>
          {children}
        </main>
      </div>
    </div>
  );
}
