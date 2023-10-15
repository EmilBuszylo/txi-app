'use client';

import { ColumnDef } from '@tanstack/table-core';

import { GetPassengersParams } from '@/lib/server/api/endpoints';

import { ActionCell } from '@/components/features/passenger/passengers-table/cells/ActionCell';
import { PhonesCell } from '@/components/features/passenger/passengers-table/cells/PhonesCell';
import { DataTableColumnSortHeader } from '@/components/ui/data-table/DataTableColumnHeader/DataTableColumnSortHeader';
import { SortStateProps } from '@/components/ui/data-table/hooks/useSorts';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { Passenger } from '@/server/passengers/passenger';

interface GetColumnsProps {
  updateSort?: (name: string, sort: 'asc' | 'desc') => void;
  sortParameters?: SortStateProps;
  params: GetPassengersParams;
}
export function getColumns({
  updateSort,
  sortParameters,
  params,
}: GetColumnsProps): ColumnDef<Passenger>[] {
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
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'phones',
      header: 'Numery kontaktowe',
      cell: ({ row }) => <PhonesCell row={row} />,
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
        return <ActionCell row={row} params={params} />;
      },
    },
  ];
}
