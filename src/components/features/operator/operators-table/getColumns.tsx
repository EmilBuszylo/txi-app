'use client';

import { ColumnDef } from '@tanstack/table-core';

import { ActionCell } from '@/components/features/operator/operators-table/cells/ActionCell';
import { DataTableColumnSortHeader } from '@/components/ui/data-table/DataTableColumnHeader/DataTableColumnSortHeader';
import { SortStateProps } from '@/components/ui/data-table/hooks/useSorts';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { Operator } from '@/server/operators/operator';

interface GetColumnsProps {
  updateSort?: (name: string, sort: 'asc' | 'desc') => void;
  sortParameters?: SortStateProps;
}
export function getColumns({ updateSort, sortParameters }: GetColumnsProps): ColumnDef<Operator>[] {
  return [
    {
      id: 'orderNumber',
      header: 'L.p.',
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: 'name',
      header: () => (
        <DataTableColumnSortHeader
          title='Nazwa'
          sortParameters={sortParameters}
          updateSort={(sort) => updateSort?.('name', sort)}
        />
      ),
      cell: ({ row }) => <span>{row.original.operator?.name}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <DataTableColumnSortHeader
          title='Dodano'
          sortParameters={sortParameters}
          updateSort={(sort) => updateSort?.('createdAt', sort)}
        />
      ),
      cell: ({ row }) => <RelativeDate date={row.original.createdAt} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return <ActionCell row={row} />;
      },
    },
  ];
}
