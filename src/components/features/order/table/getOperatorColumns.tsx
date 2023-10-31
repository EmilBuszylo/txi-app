'use client';

import { ColumnDef } from '@tanstack/table-core';
import { Phone } from 'lucide-react';

import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { HighwayCostInputCell } from '@/components/features/order/table/cells/HighwayCostInputCell';
import { KmDriverCell } from '@/components/features/order/table/cells/KmDriverCell';
import { LocationsCell } from '@/components/features/order/table/cells/LocationsCell';
import { OperatorNoteCell } from '@/components/features/order/table/cells/OperatorNoteCell';
import { StopTimeInputCell } from '@/components/features/order/table/cells/StopTimeInputCell';
import { ColumnWithTooltip } from '@/components/ui/data-table/columns/ColumnWithTooltip';
import { DataTableColumnSortHeader } from '@/components/ui/data-table/DataTableColumnHeader/DataTableColumnSortHeader';
import { SortStateProps } from '@/components/ui/data-table/hooks/useSorts';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { Order } from '@/server/orders/order';

interface GetColumnsProps {
  params: GetOrdersParams;
  updateSort?: (name: string, sort: 'asc' | 'desc') => void;
  sortParameters?: SortStateProps;
}
export const getOperatorColumns = ({
  sortParameters,
  updateSort,
  params,
}: GetColumnsProps): ColumnDef<Order>[] => {
  return [
    {
      id: 'orderNumber',
      header: 'L.p.',
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: 'internalId',
      header: 'Nr TXI',
      cell: ({ row }) => <span>{row.original.internalId}</span>,
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
      accessorKey: 'kmForDriver',
      header: 'Przejechane km',
      cell: ({ row }) => (
        <KmDriverCell id={row.original.id} kmForDriver={row.original.kmForDriver} />
      ),
    },
    {
      accessorKey: 'stopTime',
      header: 'Czas oczekiwania',
      cell: ({ row }) => (
        <StopTimeInputCell id={row.original.id} stopTime={row.original.stopTime} />
      ),
    },
    {
      accessorKey: 'highwaysCost',
      header: 'Koszt autostrad',
      cell: ({ row }) => (
        <HighwayCostInputCell id={row.original.id} highwaysCost={row.original.highwaysCost} />
      ),
    },
    {
      accessorKey: 'locationFrom',
      header: 'Przebieg trasy',
      cell: ({ row }) => <LocationsCell row={row} />,
    },
    {
      accessorKey: 'driver',
      header: 'Kierowca',
      cell: ({ row }) => (
        <ColumnWithTooltip
          trigger={
            <span className='text-ellipsis text-left line-clamp-1'>
              {row.original?.driver?.firstName} {row.original.driver?.lastName}
            </span>
          }
          content={
            <div className='flex flex-col'>
              <span className='flex gap-x-1'>
                {row.original?.driver?.firstName}
                {row.original.driver?.lastName}
              </span>
              <span className='flex gap-x-1'>
                <Phone /> {row.original.driver?.phone}
              </span>
            </div>
          }
        />
      ),
    },
    {
      accessorKey: 'operatorNote',
      header: 'Notatka',
      cell: ({ row }) => <OperatorNoteCell order={row.original} params={params} />,
    },
  ];
};
