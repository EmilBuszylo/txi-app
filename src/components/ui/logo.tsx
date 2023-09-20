import { Hexagon } from 'lucide-react';

import { cn } from '@/lib/utils';

import LogoIcon from '~/svg/logo2.svg';

interface LogoProps {
  size?: 'basic' | 'lg';
}

export const Logo = ({ size = 'basic' }: LogoProps) => {
  return (
    <div className='relative flex items-center justify-center'>
      <Hexagon
        className={cn('h-20 w-20 fill-white', {
          'h-32 w-32': size === 'lg',
        })}
      />
      <LogoIcon
        className={cn('absolute h-20 w-20 text-gray-900', {
          'h-32 w-32': size === 'lg',
        })}
      />
    </div>
  );
};
