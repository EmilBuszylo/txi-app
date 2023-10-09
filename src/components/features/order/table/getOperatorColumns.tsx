'use client';

import { ColumnDef } from '@tanstack/table-core';
import { Phone } from 'lucide-react';

import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { KmDriverCell } from '@/components/features/order/table/cells/KmDriverCell';
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
      header: 'Km dla kierowcy',
      cell: ({ row }) => (
        <KmDriverCell id={row.original.id} kmForDriver={row.original.kmForDriver} params={params} />
      ),
    },
    {
      accessorKey: 'locationFrom',
      header: 'Przebieg trasy',
      cell: ({ row }) => {
        const locationsVia = row.original.locationVia
          ?.map((loc) => loc.address.fullAddress)
          .join(',');

        return (
          <ColumnWithTooltip
            trigger={
              <span className='text-ellipsis text-left line-clamp-1'>
                {row.original?.locationFrom?.address.fullAddress &&
                  `${row.original?.locationFrom?.address.fullAddress} -> `}
                {locationsVia && `${locationsVia} -> `}
                {row.original?.locationTo?.address.fullAddress}
              </span>
            }
            content={
              <div className='flex flex-wrap'>
                {row.original?.locationFrom?.address.fullAddress &&
                  `${row.original?.locationFrom?.address.fullAddress} -> `}
                {locationsVia && `${locationsVia} -> `}
                {row.original?.locationTo?.address.fullAddress}
              </div>
            }
          />
        );
      },
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
  ];
};
