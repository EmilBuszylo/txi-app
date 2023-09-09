import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { useUpdateManyOrders } from '@/lib/hooks/data/useUpdateManyOrders';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { Order, OrderStatus } from '@/server/orders/order';

export const ActionCell = ({ row, params }: { row: Row<Order>; params: GetOrdersParams }) => {
  return (
    <ActionsColumn>
      <ActionCellOptions id={row.original.id} params={params} />
    </ActionsColumn>
  );
};

export const ActionCellOptions = ({ id, params }: { id: string; params: GetOrdersParams }) => {
  const { mutateAsync: updateOrder } = useUpdateManyOrders([id], params);
  const router = useRouter();

  const { mutateAsync: updateOrders } = useUpdateManyOrders([id], params);

  return (
    <>
      <DropdownMenuItem onClick={() => router.push(`${Routes.ORDERS}/${id}`)}>
        Szczegóły/edycja
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => updateOrders({ isKmDifferenceAccepted: true })}>
        Zaakceptuj różnice w km
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => updateOrder({ status: OrderStatus.CANCELLED })}
        className='text-destructive'
      >
        Anuluj zlecenie
      </DropdownMenuItem>
    </>
  );
};
