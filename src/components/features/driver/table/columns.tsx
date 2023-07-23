'use client';

import { ColumnDef } from '@tanstack/table-core';

import { GetDriversParams } from '@/lib/server/api/endpoints';

import { ActionCell } from '@/components/features/driver/table/cells/ActionCell';
import { CarDetailsCell } from '@/components/features/driver/table/cells/CarDetailsCell';
import { PhoneCell } from '@/components/features/driver/table/cells/PhoneCell';
import { Checkbox } from '@/components/ui/checkbox';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { Driver } from '@/server/drivers/driver';

export function getColumns(params: GetDriversParams): ColumnDef<Driver>[] {
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
      accessorKey: 'login',
      header: 'Login',
    },
    {
      accessorKey: 'name',
      header: 'Imię',
      cell: ({ row }) => (
        <span>
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Nr kontaktowy',
      cell: ({ row }) => <PhoneCell row={row} />,
    },
    {
      accessorKey: 'car',
      header: 'Samochód',
      cell: ({ row }) => <CarDetailsCell row={row} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Ostatnia zmiana',
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
