import { useMemo, useState } from 'react';

export interface UseFiltersMethods {
  updateFilter: (key: string, value: string | number | boolean) => void;
  deleteFilter: (key: string) => void;
  clearFilters: () => void;
}

export type UseFiltersColumnFilters = Map<string, string | number | boolean>;

export const useFilters = () => {
  const [columnFilters, setColumnFilters] = useState<UseFiltersColumnFilters>(new Map());

  const updateFilter = (key: string, value: string | number | boolean) => {
    setColumnFilters((map) => new Map(map.set(key, value)));
  };

  const deleteFilter = (name: string) => {
    setColumnFilters((map) => {
      map.delete(name);

      return new Map(map);
    });
  };

  const clearFilters = () => setColumnFilters(() => new Map());

  const filterParameters = useMemo(() => {
    return Object.fromEntries(columnFilters);
  }, [columnFilters]);

  return { columnFilters, updateFilter, deleteFilter, clearFilters, filterParameters };
};
