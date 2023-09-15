'use client';

import { ColumnDef } from '@tanstack/table-core';

import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { Operator } from '@/server/operators/operator';

export function getColumns(): ColumnDef<Operator>[] {
  return [
    {
      id: 'orderNumber',
      header: 'L.p.',
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Nazwa',
    },
    {
      accessorKey: 'createdAt',
      header: 'Dodano',
      cell: ({ row }) => <RelativeDate date={row.original.createdAt} />,
    },
  ];
}
