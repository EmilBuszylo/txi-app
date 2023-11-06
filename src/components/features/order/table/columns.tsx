'use client';

import { ColumnDef } from '@tanstack/table-core';
import { Phone } from 'lucide-react';

import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { getRealizationDate } from '@/components/features/order/orders-table/utils/getRealizationDate';
import { ActionCell } from '@/components/features/order/table/cells/ActionCell';
import { ActualKmCell } from '@/components/features/order/table/cells/ActualKmCell';
import { HighwayCostInputCell } from '@/components/features/order/table/cells/HighwayCostInputCell';
import { InternalIdCell } from '@/components/features/order/table/cells/InternallIdCell';
import { KmDriverCell } from '@/components/features/order/table/cells/KmDriverCell';
import { LocationsCell } from '@/components/features/order/table/cells/LocationsCell';
import { PassengersListCell } from '@/components/features/order/table/cells/PassengersListCell';
import { StatusCell } from '@/components/features/order/table/cells/StatusCell';
import { StopTimeInputCell } from '@/components/features/order/table/cells/StopTimeInputCell';
import { Checkbox } from '@/components/ui/checkbox';
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
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      accessorKey: 'internalId',
      header: 'Nr TXI',
      cell: ({ row }) => <InternalIdCell row={row} params={params} />,
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
      header: 'Pasażerowie',
      cell: ({ row }) => <PassengersListCell row={row} />,
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
      accessorKey: 'estimatedKm',
      header: 'Km szacowane',
    },
    {
      accessorKey: 'kmForDriver',
      header: 'Km dla kierowcy',
      cell: ({ row }) => (
        <KmDriverCell id={row.original.id} kmForDriver={row.original.kmForDriver} />
      ),
    },
    {
      accessorKey: 'actualKm',
      header: 'Km rzeczywiste',
      cell: ({ row }) => <ActualKmCell id={row.original.id} actualKm={row.original.actualKm} />,
    },
    {
      accessorKey: 'stopTime',
      header: 'Czas oczekiwania',
      cell: ({ row }) => (
        <StopTimeInputCell
          id={row.original.id}
          stopTime={row.original.stopTime}
          disableValidation={true}
        />
      ),
    },
    {
      accessorKey: 'highwaysCost',
      header: 'Koszt autostrad',
      cell: ({ row }) => (
        <HighwayCostInputCell
          id={row.original.id}
          highwaysCost={row.original.highwaysCost}
          disableValidation={true}
        />
      ),
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
