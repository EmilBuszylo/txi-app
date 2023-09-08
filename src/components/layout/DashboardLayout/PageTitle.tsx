'use client';

import { ChevronLeft } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

import Heading from '@/components/ui/typography/Heading';

import { pageTitleByPath } from '@/constant/pageTitleByPath';

export const PageTitle = ({ hiddenOn }: { hiddenOn?: 'mobile' | 'desktop' }) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const isWayback = useMemo(() => {
    if (pathname.includes('new')) return true;

    return Boolean(params);
  }, [params, pathname]);

  return (
    <div
      className={cn('items-center gap-x-4', {
        'hidden md:flex': hiddenOn === 'mobile',
        'flex px-4 md:hidden': hiddenOn === 'desktop',
      })}
    >
      {isWayback && (
        <button type='button' onClick={() => router.back()}>
          <ChevronLeft />
        </button>
      )}
      <Heading level={1} as='h1'>
        {pageTitleByPath[pathname.replace(`${params?.id}`, 'id') as keyof typeof pageTitleByPath]}
      </Heading>
    </div>
  );
};
