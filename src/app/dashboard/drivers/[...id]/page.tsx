import { accessControl } from '@/lib/server/utils/access-control';

import DriverDetails from '@/components/features/driver/driver-details/DriverDetails';

import { UserRole } from '@/server/users/user';

export default async function DriverDetailsPage() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <DriverDetails />;
}
