'use client';

import { ColumnDef } from '@tanstack/table-core';
import { Phone } from 'lucide-react';

import { formatDate } from '@/lib/helpers/date';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { ActionCell } from '@/components/features/order/table/cells/ActionCell';
import { InternalIdCell } from '@/components/features/order/table/cells/InternallIdCell';
import { StatusCell } from '@/components/features/order/table/cells/StatusCell';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnWithTooltip } from '@/components/ui/data-table/columns/ColumnWithTooltip';
import { DataTableColumnSortHeader } from '@/components/ui/data-table/DataTableColumnHeader/DataTableColumnSortHeader';
import { SortStateProps } from '@/components/ui/data-table/hooks/useSorts';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { dateFormats } from '@/constant/date-formats';
import { Order } from '@/server/orders/order';

interface GetColumnsProps {
  params: GetOrdersParams;
  updateSort?: (name: string, sort: 'asc' | 'desc') => void;
  sortParameters?: SortStateProps;
}
export const getColumns = ({
  params,
  sortParameters,
  updateSort,
}: GetColumnsProps): ColumnDef<Order>[] => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'orderNumber',
      header: 'L.p.',
      cell: ({ row }) => <span>{row.index}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      accessorKey: 'internalId',
      header: 'Nr TXI',
      cell: ({ row }) => <InternalIdCell row={row} />,
    },
    {
      accessorKey: 'clientName',
      header: 'Nazwa klienta',
      cell: ({ row }) => (
        <ColumnWithTooltip
          trigger={
            <span className='text-ellipsis text-left line-clamp-1'>{row.original.clientName}</span>
          }
          content={<div className='flex flex-wrap'>{row.original.clientName}</div>}
        />
      ),
    },
    {
      accessorKey: 'externalId',
      header: 'Nr zlecenia klienta',
    },
    {
      accessorKey: 'operatorName',
      header: 'Operator',
      cell: ({ row }) => (
        <ColumnWithTooltip
          trigger={
            <span className='min-w-[140px] text-ellipsis text-left line-clamp-1'>
              {row.original.driver?.operatorName}
            </span>
          }
          content={<div className='flex flex-col'>{row.original.driver?.operatorName}</div>}
        />
      ),
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
      accessorKey: 'collectionPoint',
      header: 'Punkt zborny',
      cell: ({ row }) => (
        <ColumnWithTooltip
          trigger={
            <span className='text-ellipsis text-left line-clamp-1'>
              {row.original?.collectionPoint?.name}
            </span>
          }
          content={
            <div className='flex flex-col'>
              <span className='flex flex-wrap gap-x-1'>{row.original?.collectionPoint?.name}</span>
              <span className='flex flex-wrap gap-x-1'>
                {row.original.collectionPoint?.fullAddress}
              </span>
            </div>
          }
        />
      ),
    },
    {
      accessorKey: 'locationFrom',
      header: 'Adres odbioru',
      cell: ({ row }) => (
        <ColumnWithTooltip
          trigger={
            <span className='text-ellipsis text-left line-clamp-1'>
              {row.original?.locationFrom?.address.fullAddress}
            </span>
          }
          content={
            <div className='flex flex-wrap'>{row.original?.locationFrom?.address.fullAddress}</div>
          }
        />
      ),
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
      header: 'Nr faktury klienta',
      cell: ({ row }) => {
        const invoice = row.original.clientInvoice;
        return <span>{invoice || 'Niewystawiona'}</span>;
      },
    },
    {
      accessorKey: 'driverInvoice',
      header: 'Nr faktury kierowcy',
    },
    {
      accessorKey: 'comment',
      header: 'Uwagi',
      cell: ({ row }) => (
        <ColumnWithTooltip
          trigger={
            <span className='max-w-[250px] text-ellipsis text-left line-clamp-1'>
              {row.original.comment}
            </span>
          }
          content={<div className='max-w-[350px]'>{row.original.comment}</div>}
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnSortHeader
          column={column}
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
