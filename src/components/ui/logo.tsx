import { Hexagon } from 'lucide-react';

import { cn } from '@/lib/utils';

import LogoIcon from '~/svg/logo2.svg';

interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 20 }: LogoProps) => {
  return (
    <div className='relative flex items-center justify-center'>
      <Hexagon className={cn(`h-${size} w-${size} fill-white`)} />
      <LogoIcon className={cn('absolute h-20 w-20 text-gray-900')} />
    </div>
  );
};
