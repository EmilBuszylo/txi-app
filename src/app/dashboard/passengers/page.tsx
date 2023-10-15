import { accessControl } from '@/lib/server/utils/access-control';

import { PassengersTable } from '@/components/features/passenger/passengers-table/PassengersTable';

import { UserRole } from '@/server/users/user';

export default async function Page() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <PassengersTable />;
}
