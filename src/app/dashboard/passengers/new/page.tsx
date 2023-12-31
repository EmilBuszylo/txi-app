import { accessControl } from '@/lib/server/utils/access-control';

import { NewPassengerForm } from '@/components/features/passenger/new-passenger/NewPassengerForm';

import { UserRole } from '@/server/users/user';

export default async function CreateNewPassenger() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <NewPassengerForm />;
}
