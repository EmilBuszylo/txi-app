import { ReadonlyURLSearchParams } from 'next/dist/client/components/navigation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { queryParamsToObject } from '@/lib/queryParams';

export interface UseFiltersMethods {
  updateFilter: (key: string, value: string | number | boolean) => void;
  deleteFilter: (key: string) => void;
  clearFilters: () => void;
}

export type UseFiltersColumnFilters = Map<string, string | number | boolean>;

const paramsToFilters = (params: ReadonlyURLSearchParams, allowedParameters: string[]) => {
  const filters: UseFiltersColumnFilters = new Map();

  if (!params) {
    return filters;
  }

  params.forEach((value, key) => {
    if (allowedParameters.includes(key)) {
      filters.set(key, value);
    }
  });

  return filters;
};

const filtersToParams = (
  columnFilters: UseFiltersColumnFilters,
  queryParams: ReadonlyURLSearchParams,
  allowedParameters?: string[]
) => {
  const paramsToExclude = allowedParameters ? [...allowedParameters, 'page'] : [];

  const oldParams = queryParamsToObject(queryParams, paramsToExclude);

  const params: Record<string, string> = {};
  columnFilters.forEach((value, key) => {
    params[key as never] = value.toString();
  });

  return new URLSearchParams({ ...oldParams, ...params });
};

interface UseFiltersParams {
  withQueryParams?: boolean;
  allowedParameters?: string[];
  resetPage?: () => void;
}

export const useFilters = ({
  withQueryParams,
  allowedParameters = [],
  resetPage,
}: UseFiltersParams) => {
  const searchParams = useSearchParams();
  const [columnFilters, setColumnFilters] = useState<UseFiltersColumnFilters>(
    paramsToFilters(searchParams, allowedParameters)
  );
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = (key: string, value: string | number | boolean) => {
    const newParams = new Map(columnFilters.set(key, value));

    if (withQueryParams) {
      const queryParams = filtersToParams(newParams, searchParams, allowedParameters);
      resetPage?.();
      router.push(`${pathname}?${queryParams}`);
    }
    setColumnFilters(newParams);
  };

  const deleteFilter = (name: string) => {
    columnFilters.delete(name);
    const newFilters = new Map(columnFilters);

    if (withQueryParams) {
      const queryParams = filtersToParams(newFilters, searchParams, allowedParameters);
      resetPage?.();
      router.push(`${pathname}?${queryParams}`);
    }

    setColumnFilters(newFilters);
  };

  const clearFilters = () => {
    const newFilters = new Map();

    if (withQueryParams) {
      const queryParams = filtersToParams(newFilters, searchParams, allowedParameters);
      resetPage?.();
      router.push(`${pathname}?${queryParams}`);
    }

    setColumnFilters(() => newFilters);
  };

  const filterParameters = useMemo(() => {
    return Object.fromEntries(columnFilters);
  }, [columnFilters]);

  return { columnFilters, updateFilter, deleteFilter, clearFilters, filterParameters };
};
