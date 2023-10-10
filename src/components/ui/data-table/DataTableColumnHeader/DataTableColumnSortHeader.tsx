import { Column } from '@tanstack/table-core';
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from 'lucide-react';
import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { SortStateProps } from '@/components/ui/data-table/hooks/useSorts';

interface DataTableColumnSortHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column?: Column<TData, TValue>;
  title: string;
  updateSort?: (sort: 'asc' | 'desc') => void;
  sortParameters?: SortStateProps;
}

export function DataTableColumnSortHeader<TData, TValue>({
  title,
  className,
  sortParameters,
  updateSort,
}: DataTableColumnSortHeaderProps<TData, TValue>) {
  if (!updateSort) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant='ghost'
        size='sm'
        className='-ml-3 h-8 data-[state=open]:bg-accent'
        onClick={() => {
          if (sortParameters?.sort === 'desc') {
            return updateSort('asc');
          }

          return updateSort('desc');
        }}
      >
        <span>{title}</span>
        {sortParameters?.sort === 'desc' ? (
          <ArrowDownIcon className='ml-2 h-4 w-4' />
        ) : sortParameters?.sort === 'asc' ? (
          <ArrowUpIcon className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    </div>
  );
}
