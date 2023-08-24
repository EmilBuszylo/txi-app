import { accessControl } from '@/lib/server/utils/access-control';

import { NewOrderForm } from '@/components/features/order/new-order/NewOrderForm';

import { UserRole } from '@/server/users/user';

export default async function CreateNewOrder() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER, UserRole.CLIENT] });

  return <NewOrderForm />;
}
