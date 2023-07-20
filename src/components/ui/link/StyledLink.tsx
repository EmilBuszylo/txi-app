import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import UnstyledLink, { UnstyledLinkProps } from '@/components/ui/link/UstyledLink';

const linkVariants = cva('', {
  variants: {
    variant: {
      default: 'font-semibold text-blue-700 transition-all hover:text-blue-600 hover:underline',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface StyledLinkProps extends UnstyledLinkProps, VariantProps<typeof linkVariants> {}

export const StyledLink = ({ variant, className, ...rest }: StyledLinkProps) => {
  return <UnstyledLink className={cn(linkVariants({ variant, className }))} {...rest} />;
};
