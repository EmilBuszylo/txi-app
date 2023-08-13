import { useState } from 'react';

export interface UseSortsMethods {
  updateSort: (column: string, sort: 'asc' | 'desc') => void;
  clearSort: () => void;
}

export interface SortStateProps {
  column?: string;
  sort?: 'asc' | 'desc';
}

export const useSorts = () => {
  const [sortParameters, setSortParameters] = useState<SortStateProps | undefined>();

  const updateSort = (column: string, sort: 'asc' | 'desc') => setSortParameters({ column, sort });

  const clearSort = () => setSortParameters(undefined);

  return { sortParameters, updateSort, clearSort };
};
