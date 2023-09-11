'use client';

import { ColumnDef } from '@tanstack/table-core';

import { GetDriversParams } from '@/lib/server/api/endpoints';

import { ActionCell } from '@/components/features/driver/table/cells/ActionCell';
import { CarDetailsCell } from '@/components/features/driver/table/cells/CarDetailsCell';
import { PhoneCell } from '@/components/features/driver/table/cells/PhoneCell';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { Driver } from '@/server/drivers/driver';

export function getColumns(params: GetDriversParams): ColumnDef<Driver>[] {
  return [
    {
      id: 'orderNumber',
      header: 'L.p.',
      cell: ({ row }) => <span>{row.index + 1}</span>,
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
