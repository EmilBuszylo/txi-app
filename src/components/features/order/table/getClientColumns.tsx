'use client';

import { ColumnDef } from '@tanstack/table-core';

import { formatDate } from '@/lib/helpers/date';

import { StatusCell } from '@/components/features/order/table/cells/StatusCell';
import { ColumnWithTooltip } from '@/components/ui/data-table/columns/ColumnWithTooltip';
import { DataTableColumnSortHeader } from '@/components/ui/data-table/DataTableColumnHeader/DataTableColumnSortHeader';
import { SortStateProps } from '@/components/ui/data-table/hooks/useSorts';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { dateFormats } from '@/constant/date-formats';
import { Order } from '@/server/orders/order';

interface GetColumnsProps {
  updateSort?: (name: string, sort: 'asc' | 'desc') => void;
  sortParameters?: SortStateProps;
}
export const getClientColumns = ({
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
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      accessorKey: 'externalId',
      header: 'Nr zlecenia',
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
      accessorKey: 'locationFrom.date',
      header: 'Data realizacji',
      cell: ({ row }) => (
        <ColumnWithTooltip
          trigger={
            <span className='min-w-[150px] text-ellipsis text-left line-clamp-1'>
              {formatDate(row.original.locationFrom?.date, dateFormats.dateWithTimeFull)}
            </span>
          }
          content={
            <div>{formatDate(row.original.locationFrom?.date, dateFormats.dateWithTimeFull)}</div>
          }
        />
      ),
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
  ];
};
