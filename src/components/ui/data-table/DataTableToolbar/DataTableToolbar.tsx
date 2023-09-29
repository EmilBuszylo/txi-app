import { X } from 'lucide-react';
import { ComponentType, PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import { DataTableDateRangeFilter } from '@/components/ui/data-table/DataTableToolbar/DataTableDateRangeFilter';
import { DataTableFacetedFilter } from '@/components/ui/data-table/DataTableToolbar/DataTableFacetedFilter';
import { DataTableTextFilter } from '@/components/ui/data-table/DataTableToolbar/DataTableTextFilter';
import {
  UseFiltersColumnFilters,
  UseFiltersMethods,
} from '@/components/ui/data-table/hooks/useFilters';

interface DataTableToolbarProps extends UseFiltersMethods {
  columnFilters: UseFiltersColumnFilters;
  filters?: {
    title?: string;
    name: string;
    defaultValue?: string | number | boolean;
    options: {
      label: string;
      value: string | number | boolean;
      icon?: ComponentType<{ className?: string }>;
    }[];
  }[];
  textFilters?: {
    title: string;
    name: string;
  }[];
  dateRangeFilters?: {
    title: string;
    name: string;
  }[];
  clearBtnVisible?: boolean;
}

export function DataTableToolbar({
  columnFilters,
  updateFilter,
  deleteFilter,
  clearFilters,
  filters,
  textFilters,
  dateRangeFilters,
  children,
  clearBtnVisible = true,
}: PropsWithChildren<DataTableToolbarProps>) {
  const isFiltered = columnFilters.size > 0;

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-wrap items-center gap-y-4 space-x-2'>
        {/*<Input*/}
        {/*  placeholder='Filter tasks...'*/}
        {/*  // value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}*/}
        {/*  // onChange={(event) => table.getColumn('status')?.setFilterValue(event.target.value)}*/}
        {/*  className='h-8 w-[150px] lg:w-[250px]'*/}
        {/*/>*/}
        {dateRangeFilters?.map((filter) => (
          <DataTableDateRangeFilter
            key={filter.name}
            columnFilters={columnFilters}
            updateFilter={updateFilter}
            deleteFilter={deleteFilter}
            name={filter.name}
            title={filter.title}
          />
        ))}
        {textFilters?.map((filter) => (
          <DataTableTextFilter
            key={filter.name}
            columnFilters={columnFilters}
            updateFilter={updateFilter}
            deleteFilter={deleteFilter}
            name={filter.name}
            title={filter.title}
          />
        ))}
        {filters?.map((filter) => (
          <DataTableFacetedFilter
            key={filter.name}
            columnFilters={columnFilters}
            deleteFilter={deleteFilter}
            title={filter.title}
            name={filter.name}
            options={filter.options}
            updateFilter={updateFilter}
            defaultValue={filter.defaultValue}
          />
        ))}
        {children}
        {isFiltered && clearBtnVisible && (
          <Button variant='ghost' onClick={clearFilters} className='h-8 px-2 lg:px-3'>
            Wyczyść
            <X className='ml-1 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
