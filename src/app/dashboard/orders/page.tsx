import { accessControl } from '@/lib/server/utils/access-control';
import { getUserFromSession } from '@/lib/server/utils/get-user-from-session';

import OrdersClientTable from '@/components/features/order/orders-table/client/OrdersClientTable';
import OrdersOperatorTable from '@/components/features/order/orders-table/operator/OrdersOperatorTable';
import OrdersTable from '@/components/features/order/orders-table/OrdersTable';

import { UserRole } from '@/server/users/user';

export default async function Orders() {
  const user = await getUserFromSession();
  await accessControl({
    allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER, UserRole.CLIENT, UserRole.OPERATOR],
  });

  if (user.role === UserRole.CLIENT && user.clientId) {
    return <OrdersClientTable clientId={user.clientId} />;
  }

  if (user.role === UserRole.OPERATOR && user.operatorId) {
    return <OrdersOperatorTable operatorId={user.operatorId} />;
  }

  return <OrdersTable />;
}
