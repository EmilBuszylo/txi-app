import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export function RightSidebar({ children }: PropsWithChildren) {
  return (
    <div
      className={cn(
        'absolute right-0 z-30 h-full w-auto overflow-x-hidden transition-transform xl:static xl:w-[336px]'
      )}
    >
      <div className='flex-0 h-full w-screen flex-shrink-0 overflow-auto bg-white md:w-[336px]'>
        {children}
      </div>
    </div>
  );
}
