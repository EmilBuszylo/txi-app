'use client';

import * as React from 'react';

import Header from '@/components/layout/DashboardLayout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='hidden lg:block'>
        <Header />
      </div>

      <div className='lg:pl-20 xl:pl-40'>
        <main className='relative flex h-screen w-full flex-1 flex-col items-stretch bg-gray-50'>
          {children}
        </main>
      </div>
    </div>
  );
}
