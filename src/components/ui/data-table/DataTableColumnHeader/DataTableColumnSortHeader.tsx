import { Column } from '@tanstack/table-core';
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from 'lucide-react';
import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { SortStateProps } from '@/components/ui/data-table/hooks/useSorts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='-ml-3 h-8 data-[state=open]:bg-accent'>
            <span>{title}</span>
            {sortParameters?.sort === 'desc' ? (
              <ArrowDownIcon className='ml-2 h-4 w-4' />
            ) : sortParameters?.sort === 'asc' ? (
              <ArrowUpIcon className='ml-2 h-4 w-4' />
            ) : (
              <ArrowUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => updateSort('asc')}>
            <ArrowUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Rosnąco
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSort('desc')}>
            <ArrowDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Malejąco
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
