import { accessControl } from '@/lib/server/utils/access-control';

import { NewDriverForm } from '@/components/features/driver/new-driver/NewDriverForm';

import { UserRole } from '@/server/users/user';

export default async function CreateNewOrder() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <NewDriverForm />;
}
