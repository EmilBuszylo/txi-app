import { ReadonlyURLSearchParams } from 'next/dist/client/components/navigation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { getCurrentQueryParams } from '@/lib/queryParams';

export interface UseSortsMethods {
  updateSort: (column: string, sort: 'asc' | 'desc') => void;
  clearSort: () => void;
}

export interface SortStateProps {
  column?: string;
  sort?: 'asc' | 'desc';
}

const paramsToSorts = (params: ReadonlyURLSearchParams) => {
  if (!params) {
    return undefined;
  }

  return {
    column: params.get('column') || undefined,
    sort: (params.get('sort') as SortStateProps['sort']) || undefined,
  };
};

interface UseSorts {
  withQueryParams?: boolean;
  resetPage?: () => void;
}

export const useSorts = ({ withQueryParams, resetPage }: UseSorts) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [sortParameters, setSortParameters] = useState<SortStateProps | undefined>(
    paramsToSorts(searchParams)
  );

  const updateSort = (column: string, sort: 'asc' | 'desc') => {
    if (withQueryParams) {
      const params = getCurrentQueryParams(searchParams, ['column', 'sort'], { column, sort });
      resetPage?.();
      router.push(`${pathname}?${params}`);
    }
    setSortParameters({ column, sort });
  };
  const clearSort = () => setSortParameters(undefined);

  return { sortParameters, updateSort, clearSort };
};
