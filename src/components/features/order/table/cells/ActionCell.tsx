import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { useUpdateManyOrders } from '@/lib/hooks/data/useUpdateManyOrders';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { Order, OrderStatus } from '@/server/orders/order';

export const ActionCell = ({ row, params }: { row: Row<Order>; params: GetOrdersParams }) => {
  const { mutateAsync: updateOrder } = useUpdateManyOrders([row.original.id], params);
  const router = useRouter();
  return (
    <ActionsColumn>
      <DropdownMenuItem onClick={() => router.push(`${Routes.ORDERS}/${row.original.id}`)}>
        Szczegóły/edycja
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => updateOrder({ status: OrderStatus.CANCELLED })}
        className='text-destructive'
      >
        Anuluj zlecenie
      </DropdownMenuItem>
    </ActionsColumn>
  );
};