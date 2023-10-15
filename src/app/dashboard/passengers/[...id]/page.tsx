import { accessControl } from '@/lib/server/utils/access-control';

import PassengerDetails from '@/components/features/passenger/passenger-details/PassengerDetails';

import { UserRole } from '@/server/users/user';

export default async function OperatorDetailsPage() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <PassengerDetails />;
}
