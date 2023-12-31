import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { useCancelOrderByClient } from '@/lib/hooks/data/useCancelOrderByClient';
import { useResendOrderEmail } from '@/lib/hooks/data/useResendOrderEmail';
import { useUpdateManyOrders } from '@/lib/hooks/data/useUpdateManyOrders';
import { UseUser } from '@/lib/hooks/useUser';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { Order, OrderStatus } from '@/server/orders/order';
import { UserRole } from '@/server/users/user';

export const ActionCell = ({ row, params }: { row: Row<Order>; params: GetOrdersParams }) => {
  return (
    <ActionsColumn>
      <ActionCellOptions id={row.original.id} params={params} order={row.original} />
    </ActionsColumn>
  );
};

export const ActionCellOptions = ({
  id,
  params,
  order,
}: {
  id: string;
  params: GetOrdersParams;
  order: Order;
}) => {
  const { user } = UseUser();

  const { mutateAsync: updateOrder } = useUpdateManyOrders([id], params);
  const { mutateAsync: resendEmail } = useResendOrderEmail();
  const router = useRouter();

  const { mutateAsync: cancelByClient } = useCancelOrderByClient(id, params);

  const allowDetailsView = user?.role && [UserRole.DISPATCHER, UserRole.ADMIN].includes(user.role);
  const allowKmDifference = user?.role && [UserRole.ADMIN].includes(user.role);
  const isClient = user?.role === 'CLIENT';

  return (
    <>
      {allowDetailsView && (
        <DropdownMenuItem onClick={() => router.push(`${Routes.ORDERS}/${id}?page=${params.page}`)}>
          Szczegóły/edycja
        </DropdownMenuItem>
      )}

      {allowKmDifference && (
        <DropdownMenuItem onClick={() => updateOrder({ isKmDifferenceAccepted: true })}>
          Zaakceptuj różnice w km
        </DropdownMenuItem>
      )}
      {allowDetailsView && (
        <DropdownMenuItem
          onClick={() =>
            resendEmail({ subject: `Zlecenie ${order.internalId} ${order.clientName}`, order })
          }
        >
          Wygeneruj email
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={async () => {
          if (isClient) {
            return await cancelByClient({ isClient });
          }
          return await updateOrder({ status: OrderStatus.CANCELLED });
        }}
        className='text-destructive'
      >
        Anuluj zlecenie
      </DropdownMenuItem>
    </>
  );
};
