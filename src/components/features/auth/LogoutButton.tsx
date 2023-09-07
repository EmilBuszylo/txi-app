'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className={cn(
        'relative block w-full text-white transition-colors focus:outline-none',
        // 'before:absolute before:inset-y-0 before:m-auto before:h-4 before:w-2 before:-translate-x-2 before:rounded-full before:bg-white before:transition-all',
        'after:absolute after:inset-0 after:m-auto after:h-0 after:w-0 after:rounded after:bg-gray-950 after:transition-all',
        'hover:before:-translate-x-1',
        'hover:after:h-12 hover:after:w-12 xl:hover:after:w-5/6',
        'focus-visible:before:-translate-x-1',
        'focus-visible:after:h-12 focus-visible:after:w-12  xl:focus-visible:after:w-5/6',
        'focus-visible:after:bg-dark focus-visible:outline-none',
        'active:after:bg-dark'
      )}
    >
      <div
        className={cn(
          'relative z-10 flex h-12 w-20 items-center justify-center gap-x-2 rounded xl:w-40 xl:px-2'
        )}
      >
        <span className='sr-only'>sign out</span>
        <LogOut className='h-8 w-8' />
      </div>
    </button>
  );
};
