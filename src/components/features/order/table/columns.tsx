'use client';

import { ColumnDef } from '@tanstack/table-core';

import { Order } from '@/server/orders/order';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'internalId',
    header: 'Wewnętrzny nr zlecenia',
  },
  {
    accessorKey: 'externalId',
    header: 'Zewnętrzny nr zlecenia',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Ostatnia edycja',
  },
];
