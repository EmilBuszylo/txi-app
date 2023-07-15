'use client';

import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export function LeftSidebar({ children }: PropsWithChildren) {
  return (
    <div
      className={cn(
        'flex-0 absolute left-0 z-40 h-full w-60 w-auto flex-shrink-0 overflow-x-hidden border-r border-gray-100 transition-transform lg:static lg:w-60 lg:border-r-0'
      )}
    >
      <div className='flex-0 ml-14 h-full w-60 flex-shrink-0 overflow-auto bg-white lg:ml-0'>
        {children}
      </div>
    </div>
  );
}

export default LeftSidebar;
