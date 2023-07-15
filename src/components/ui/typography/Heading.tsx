import { forwardRef, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, as, level, className, ...rest }, ref) => {
    const H: keyof JSX.IntrinsicElements = as || `h${level}`;

    return (
      <H
        {...rest}
        ref={ref}
        className={cn(
          'font-bold',
          {
            'text-base leading-6': level === 1,
            'text-sm leading-5': level === 2,
            'text-xs leading-4': level === 3,
            'text-[10px] leading-3': level === 4,
          },
          className
        )}
      >
        {children}
      </H>
    );
  }
);

Heading.displayName = 'Heading';

export default Heading;
