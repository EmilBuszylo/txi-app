import Link, { LinkProps } from 'next/link';
import * as React from 'react';
import { AnchorHTMLAttributes } from 'react';

import { ensureLocalLink } from '@/lib/link/ensure-local-link';
import { isLocalLink } from '@/lib/link/is-local-link';
import { cn } from '@/lib/utils';

const focusClasses =
  'focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none';

export type UnstyledLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>;

const UnstyledLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ children, href, target, className, ...rest }, ref) => {
    const isLocal = isLocalLink(href);
    const link = ensureLocalLink(href);

    const isNewTab =
      !isLocal || (typeof link === 'string' && !link.startsWith('/') && !link.startsWith('#'));

    if (!isNewTab) {
      return (
        <Link
          href={link}
          target={target}
          ref={ref}
          className={cn(focusClasses, className)}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        target='_blank'
        rel='noopener noreferrer'
        href={typeof link === 'string' ? link : link.href || ''}
        className={cn(focusClasses, className)}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

export default UnstyledLink;
