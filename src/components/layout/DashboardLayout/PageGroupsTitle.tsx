'use client';

import { useParams, usePathname } from 'next/navigation';

import Heading from '@/components/ui/typography/Heading';

import { pageGroupTitleByPath } from '@/constant/pageGroupTitleByPath';

export const PageGroupsTitle = () => {
  const pathname = usePathname();
  const params = useParams();

  return (
    <Heading level={6} as='h2'>
      {
        pageGroupTitleByPath[
          pathname.replace(`/${params?.id}`, '') as keyof typeof pageGroupTitleByPath
        ]
      }
    </Heading>
  );
};
