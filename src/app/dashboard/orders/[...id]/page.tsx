import { accessControl } from '@/lib/server/utils/access-control';

import { OrderDetails } from '@/components/features/order/order-details/OrderDetails';

import { UserRole } from '@/server/users/user';

export default async function OrderDetailsPage() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <OrderDetails />;
}
