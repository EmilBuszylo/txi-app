import { accessControl } from '@/lib/server/utils/access-control';

import { DriversTable } from '@/components/features/driver/drivers-table/DriversTable';

import { UserRole } from '@/server/users/user';

export default async function Drivers() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <DriversTable />;
}
