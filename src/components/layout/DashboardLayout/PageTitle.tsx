'use client';

import { useParams, usePathname } from 'next/navigation';

import Heading from '@/components/ui/typography/Heading';

import { pageTitleByPath } from '@/constant/pageTitleByPath';

export const PageTitle = () => {
  const pathname = usePathname();
  const params = useParams();

  return (
    <Heading level={6} as='h2'>
      {pageTitleByPath[pathname.replace(`${params?.id}`, 'id') as keyof typeof pageTitleByPath]}
    </Heading>
  );
};
