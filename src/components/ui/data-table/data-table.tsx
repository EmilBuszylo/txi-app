'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FC, ReactElement, useState } from 'react';

import { PaginationMeta } from '@/lib/pagination';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { ColumnVisibilityDropdown } from '@/components/ui/data-table/ColumnVisibilityDropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface ActionsBarProps<TData> {
  clearSelection: () => void;
  selectedAmount: number;
  allItemsAmount: number;
  params: GetOrdersParams;
  selectedItems: TData;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: PaginationMeta;
  isLoading?: boolean;
  isFetching?: boolean;
  isSuccess: boolean;
  params: GetOrdersParams;
  pagination?: ReactElement;
  ActionsBar?: FC<ActionsBarProps<TData[]>>;
  toolbar?: ReactElement;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isSuccess,
  meta,
  isLoading,
  isFetching,
  pagination,
  params,
  ActionsBar,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: isSuccess ? meta.pageCount : -1,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  return (
    <div>
      {ActionsBar && toolbar ? (
        <ActionsBar
          clearSelection={() => setRowSelection({})}
          selectedItems={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          selectedAmount={table.getFilteredSelectedRowModel().rows.length}
          params={params}
          allItemsAmount={table.getFilteredRowModel().rows.length}
        />
      ) : null}
      <div className='flex w-full justify-between pb-4 pt-2'>
        {toolbar}
        {ActionsBar && !toolbar ? (
          <ActionsBar
            clearSelection={() => setRowSelection({})}
            selectedItems={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            selectedAmount={table.getFilteredSelectedRowModel().rows.length}
            params={params}
            allItemsAmount={table.getFilteredRowModel().rows.length}
          />
        ) : null}
        <ColumnVisibilityDropdown table={table} />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading || isFetching ? (
            <tbody>
              <TableRow>
                <TableCell>...Loading</TableCell>
              </TableRow>
            </tbody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Brak wyników
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className='flex w-full flex-col justify-center justify-between gap-y-4 pb-4 pt-4 md:flex-row'>
        <div className='flex-1 text-sm text-muted-foreground'>
          wybranych {table.getFilteredSelectedRowModel().rows.length} z{' '}
          {table.getFilteredRowModel().rows.length}
        </div>
        {pagination}
      </div>
    </div>
  );
}
