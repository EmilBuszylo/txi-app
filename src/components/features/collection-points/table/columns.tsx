'use client';

import { ColumnDef } from '@tanstack/table-core';

import { GetCollectionPointsParams } from '@/lib/server/api/endpoints';

import { ActionCell } from '@/components/features/collection-points/table/cells/ActionCell';
import { Checkbox } from '@/components/ui/checkbox';
import { RelativeDate } from '@/components/ui/date/RelativeDate';

import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

export function getColumns(params: GetCollectionPointsParams): ColumnDef<CollectionPoint>[] {
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
        return <ActionCell row={row} params={params} />;
      },
    },
  ];
}
