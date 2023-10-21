'use client';

import { ColumnDef } from '@tanstack/table-core';

import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { getRealizationDate } from '@/components/features/order/orders-table/utils/getRealizationDate';
import { ActionCell } from '@/components/features/order/table/cells/ActionCell';
import { LocationsCell } from '@/components/features/order/table/cells/LocationsCell';
import { PassengersListCell } from '@/components/features/order/table/cells/PassengersListCell';
import { statusOnBadgeStyle } from '@/components/features/order/table/cells/StatusCell';
import { clientStatusLabelPerStatus } from '@/components/features/order/utils';
import { Badge } from '@/components/ui/badge';
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
export const getClientColumns = ({
  params,
  sortParameters,
  updateSort,
}: GetColumnsProps): ColumnDef<Order>[] => {
  return [
    {
      id: 'orderNumber',
      header: 'L.p.',
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <Badge className={statusOnBadgeStyle[row.original.status]}>
            {clientStatusLabelPerStatus[row.original.status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'externalId',
      header: 'Nr zlecenia',
    },
    {
      accessorKey: 'locationFrom',
      header: 'Przebieg trasy',
      cell: ({ row }) => <LocationsCell row={row} />,
    },
    {
      accessorKey: 'locationFrom.date',
      header: 'Data realizacji',
      cell: ({ row }) => {
        const realizationDate = getRealizationDate(row.original);

        return (
          <ColumnWithTooltip
            trigger={
              <span className='min-w-[150px] text-ellipsis text-left line-clamp-1'>
                {realizationDate}
              </span>
            }
            content={<div>{realizationDate}</div>}
          />
        );
      },
    },
    {
      accessorKey: 'collectionPoint',
      header: 'Pasażerowie',
      cell: ({ row }) => <PassengersListCell row={row} />,
    },
    {
      accessorKey: 'clientInvoice',
      header: 'Nr faktury',
      cell: ({ row }) => {
        const invoice = row.original.clientInvoice;
        return <span>{invoice || 'Niewystawiona'}</span>;
      },
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
};
