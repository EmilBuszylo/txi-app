'use client';

import { usePathname } from 'next/navigation';

import Heading from '@/components/ui/typography/Heading';

import { pageTitleByPath } from '@/constant/pageTitleByPath';

export const PageTitle = () => {
  const pathname = usePathname();

  return (
    <Heading level={6} as='h2'>
      {pageTitleByPath[pathname as keyof typeof pageTitleByPath]}
    </Heading>
  );
};
