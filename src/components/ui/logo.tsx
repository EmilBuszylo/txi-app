import { Hexagon } from 'lucide-react';

import { cn } from '@/lib/utils';

import LogoIcon from '~/svg/logo2.svg';

export const Logo = () => {
  return (
    <div className='jusify-center relative flex items-center'>
      <Hexagon className={cn('h-20 w-20 fill-white')} />
      <LogoIcon className={cn('absolute h-20 w-20 text-gray-900')} />
    </div>
  );
};
