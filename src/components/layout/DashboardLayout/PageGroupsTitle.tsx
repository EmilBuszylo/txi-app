'use client';

import { usePathname } from 'next/navigation';

import Heading from '@/components/ui/typography/Heading';

import { pageGroupTitleByPath } from '@/constant/pageGroupTitleByPath';

export const PageGroupsTitle = () => {
  const pathname = usePathname();

  return (
    <Heading level={6} as='h2'>
      {pageGroupTitleByPath[pathname as keyof typeof pageGroupTitleByPath]}
    </Heading>
  );
};
