import Link from 'next/link';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { UnstyledLinkProps } from '@/components/ui/UstyledLink';

interface SidebarIconLinkProps extends UnstyledLinkProps {
  active?: boolean;
}

const SidebarIconLink = forwardRef<HTMLAnchorElement, SidebarIconLinkProps>(
  ({ children, className, active, ...rest }, ref) => {
    return (
      <Link
        ref={ref}
        {...rest}
        className={cn(
          'relative block w-full text-white transition-colors focus:outline-none',
          'before:absolute before:inset-y-0 before:m-auto before:h-4 before:w-2 before:-translate-x-2 before:rounded-full before:bg-white before:transition-all',
          'after:absolute after:inset-0 after:m-auto after:h-0 after:w-0 after:rounded after:bg-gray-950 after:transition-all',
          'hover:before:-translate-x-1',
          'hover:after:h-12 hover:after:w-12 xl:hover:after:w-5/6',
          'focus-visible:before:-translate-x-1',
          'focus-visible:after:h-12 focus-visible:after:w-12  xl:focus-visible:after:w-5/6',
          'focus-visible:after:bg-dark focus-visible:outline-none',
          'active:after:bg-dark',
          {
            'active text-blue-500 before:h-8 before:-translate-x-1 before:bg-blue-500': active,
          },
          className
        )}
      >
        <div
          className={cn(
            'relative z-10 mx-auto flex h-12 w-20 items-center gap-x-2 rounded lg:justify-center xl:w-40 xl:justify-start xl:px-2'
          )}
        >
          {children}
        </div>
      </Link>
    );
  }
);

SidebarIconLink.displayName = 'SidebarIconLink';

export default SidebarIconLink;
