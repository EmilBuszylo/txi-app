'use client';

import { ColumnDef } from '@tanstack/table-core';

import { Checkbox } from '@/components/ui/checkbox';
import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { RelativeDate } from '@/components/ui/date/RelativeDate';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

export const columns: ColumnDef<CollectionPoint>[] = [
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
    accessorKey: 'name',
    header: 'Nazwa',
  },
  {
    accessorKey: 'city',
    header: 'Miasto',
  },
  {
    accessorKey: 'fullAddress',
    header: 'Adres',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Ostatnia zmiana',
    cell: ({ row }) => <RelativeDate date={row.original.updatedAt} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <ActionsColumn>
          <DropdownMenuItem>Szczegóły</DropdownMenuItem>
          <DropdownMenuItem>Edycja</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(payment.id)}
            className='text-destructive'
          >
            Usuń lokalizacje
          </DropdownMenuItem>
        </ActionsColumn>
      );
    },
  },
];
